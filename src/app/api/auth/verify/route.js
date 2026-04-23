import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Email dan kode OTP diperlukan" }, { status: 400 });
    }

    // 1. Find the token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: otp,
      }
    });

    if (!verificationToken) {
      return NextResponse.json({ message: "Kode OTP salah" }, { status: 400 });
    }

    // 2. Check expiration
    if (new Date() > new Date(verificationToken.expires)) {
      // Cleanup expired token
      await prisma.verificationToken.delete({
        where: { token: otp }
      });
      return NextResponse.json({ message: "Kode OTP sudah kedaluwarsa" }, { status: 400 });
    }

    // 3. Verify user
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() }
    });

    // 4. Cleanup token
    await prisma.verificationToken.delete({
      where: { token: otp }
    });

    return NextResponse.json({ message: "Email berhasil diverifikasi" }, { status: 200 });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ message: "Gagal verifikasi email" }, { status: 500 });
  }
}
