import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

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

    // 1. Get Group 
    const group = await prisma.communityGroup.findUnique({
      where: { id: groupId }
    });

    if (!group) {
      return NextResponse.json({ message: "Grup tidak ditemukan" }, { status: 404 });
    }

    // 2. Verify Ownership
    if (group.created_by !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ message: "Hanya pembuat grup atau admin yang bisa menghapus grup ini" }, { status: 403 });
    }

    // 3. Delete Group
    // Prisma will cascade delete GroupMember and GroupMessage if configured correctly
    // In our schema: onDelete: Cascade is present on GroupMember.group and GroupMessage.group
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
