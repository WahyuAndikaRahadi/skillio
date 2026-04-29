import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { groupId } = await params;

    const group = await prisma.communityGroup.findUnique({
      where: { id: groupId },
      include: {
        category: { select: { name: true } },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                role: true
              }
            }
          },
          orderBy: { role: "asc" }
        },
        _count: {
          select: { members: { where: { status: "approved" } } }
        }
      }
    });

    if (!group) return NextResponse.json({ message: "Group not found" }, { status: 404 });

    return NextResponse.json(group);
  } catch (error) {
    console.error("Fetch group detail error:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { groupId } = resolvedParams;

    if (!groupId) {
       return NextResponse.json({ message: "Group ID is missing" }, { status: 400 });
    }

    const group = await prisma.communityGroup.findUnique({
      where: { id: groupId }
    });

    if (!group) {
      return NextResponse.json({ message: "Grup tidak ditemukan" }, { status: 404 });
    }

    if (group.created_by !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ message: "Hanya pembuat grup atau admin yang bisa menghapus grup ini" }, { status: 403 });
    }

    await prisma.communityGroup.delete({
      where: { id: groupId }
    });

    console.log(`Group ${groupId} deleted by user ${session.user.id}`);

    return NextResponse.json({ message: "Grup berhasil dihapus" });
  } catch (error) {
    console.error("CRITICAL ERROR DELETE GROUP:", error);
    return NextResponse.json({ message: "Gagal menghapus grup", error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { groupId } = await params;
    const body = await req.json();
    const { name, description, privacy, password, imageUrl } = body;

    const group = await prisma.communityGroup.findUnique({
      where: { id: groupId }
    });

    if (!group) return NextResponse.json({ message: "Group not found" }, { status: 404 });

    if (group.created_by !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const updatedGroup = await prisma.communityGroup.update({
      where: { id: groupId },
      data: {
        name: name || undefined,
        description: description || undefined,
        privacy: privacy || undefined,
        image_url: imageUrl || undefined,
        password: password ? await bcrypt.hash(password, 10) : undefined,
      }
    });

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error("Update group error:", error);
    return NextResponse.json({ message: "Gagal update grup" }, { status: 500 });
  }
}

