import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { oldPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ message: "Password baru minimal 6 karakter" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    // Check if user has a password (not an OAuth user)
    if (!user.password) {
      return NextResponse.json({ 
        message: "Akun Google tidak menggunakan password lokal. Silakan hubungi dukungan jika ingin mengatur password." 
      }, { status: 400 });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Password lama tidak sesuai" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ message: "Password berhasil diperbarui" });
  } catch (error) {
    console.error("Update password error:", error);
    return NextResponse.json({ message: "Gagal memperbarui password" }, { status: 500 });
  }
}
