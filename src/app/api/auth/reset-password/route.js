import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: otp,
      }
    });

    if (!verificationToken) {
      return NextResponse.json({ message: "Kode OTP salah" }, { status: 400 });
    }

    if (new Date() > new Date(verificationToken.expires)) {
      await prisma.verificationToken.delete({ where: { token: otp } });
      return NextResponse.json({ message: "Kode OTP kedaluwarsa" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        emailVerified: new Date()
      }
    });

    await prisma.verificationToken.deleteMany({
      where: { identifier: email }
    });

    return NextResponse.json({ message: "Password berhasil diubah" }, { status: 200 });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ message: "Gagal mereset password" }, { status: 500 });
  }
}
