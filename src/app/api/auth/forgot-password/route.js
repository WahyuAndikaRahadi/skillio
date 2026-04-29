import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email diperlukan" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {

      return NextResponse.json({ message: "Email tidak terdaftar" }, { status: 404 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.verificationToken.deleteMany({
      where: { identifier: email }
    });

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: otp,
        expires,
      }
    });

    try {
      await sendPasswordResetEmail(email, otp);
      console.log(`✅ Password reset OTP sent to ${email}: ${otp}`);
    } catch (mailError) {
      console.error("❌ Failed to send reset email:", mailError);

    }

    return NextResponse.json({ message: "Kode reset telah dikirim ke email Anda" }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Gagal memproses permintaan" }, { status: 500 });
  }
}
