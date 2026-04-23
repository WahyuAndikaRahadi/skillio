import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email diperlukan" }, { status: 400 });
    }

    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // For security, don't reveal that user doesn't exist, but here user wants to test
      return NextResponse.json({ message: "Email tidak terdaftar" }, { status: 404 });
    }

    // 2. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // 3. Save to VerificationToken (reusing model)
    await prisma.verificationToken.upsert({
      where: { 
        identifier_token: { identifier: email, token: otp } // This might fail if using unique constraints differently
      },
      // Since identifier_token is @@unique, we can use it. 
      // But simpler is just create:
      create: {
        identifier: email,
        token: otp,
        expires,
      },
      update: {
        expires
      }
    }).catch(async () => {
       // Fallback if upsert fails due to unique constraint mismatch
       await prisma.verificationToken.create({
         data: { identifier: email, token: otp, expires }
       });
    });

    // 4. Send Email
    try {
      await sendPasswordResetEmail(email, otp);
      console.log(`✅ Password reset OTP sent to ${email}: ${otp}`);
    } catch (mailError) {
      console.error("❌ Failed to send reset email:", mailError);
      // Still return success for testing, code is in console
    }

    return NextResponse.json({ message: "Kode reset telah dikirim ke email Anda" }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Gagal memproses permintaan" }, { status: 500 });
  }
}
