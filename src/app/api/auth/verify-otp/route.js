import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Email dan kode OTP diperlukan" }, { status: 400 });
    }

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: otp,
      }
    });

    if (!verificationToken) {
      return NextResponse.json({ message: "Kode OTP salah atau tidak sesuai dengan email ini" }, { status: 400 });
    }

    if (new Date() > new Date(verificationToken.expires)) {
      await prisma.verificationToken.delete({
        where: { token: otp }
      });
      return NextResponse.json({ message: "Kode OTP sudah kedaluwarsa" }, { status: 400 });
    }

    return NextResponse.json({ message: "Kode OTP valid" }, { status: 200 });
  } catch (error) {
    console.error("OTP Verification error:", error);
    return NextResponse.json({ message: "Gagal verifikasi kode OTP" }, { status: 500 });
  }
}
