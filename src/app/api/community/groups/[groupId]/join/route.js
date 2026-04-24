import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req, { params }) {
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

    const body = await req.json().catch(() => ({}));
    const { password } = body;

    console.log(`User ${session.user.id} attempting to join group ${groupId}`);

    // 1. Get Group Privacy
    const group = await prisma.communityGroup.findUnique({
      where: { id: groupId }
    });

    if (!group) {
      console.error("Join error: Group not found", groupId);
      return NextResponse.json({ message: "Grup tidak ditemukan" }, { status: 404 });
    }

    // 2. Check if already a member
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        group_id_user_id: {
          group_id: groupId,
          user_id: session.user.id
        }
      }
    });

    if (existingMember) {
      return NextResponse.json({ 
        message: existingMember.status === "approved" ? "Sudah menjadi anggota" : "Permintaan masih pending", 
        status: existingMember.status 
      });
    }

    // 3. Join Logic (Password check for private)
    if (group.privacy === "private") {
      if (!password) {
        return NextResponse.json({ message: "Password dibutuhkan", requirePassword: true }, { status: 401 });
      }
      
      const isMatch = await bcrypt.compare(password, group.password);
      if (!isMatch) {
        return NextResponse.json({ message: "Password salah" }, { status: 401 });
      }
    }

    const status = "approved";

    const membership = await prisma.groupMember.create({
      data: {
        group_id: groupId,
        user_id: session.user.id,
        role: "member",
        status: status
      }
    });

    console.log(`Join successful for user ${session.user.id} in group ${groupId} with status ${status}`);

    return NextResponse.json({ 
      message: "Berhasil bergabung!",
      status 
    });
  } catch (error) {
    console.error("CRITICAL ERROR JOIN GROUP:", error);
    return NextResponse.json({ message: "Gagal join grup", error: error.message }, { status: 500 });
  }
}
