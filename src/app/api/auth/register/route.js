import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Create user (but unverified)
    const defaultImage = `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name)}&backgroundColor=0a5a97,0d76c6,12a1ef`;
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null, // Ensure it is null
        image: defaultImage,
      },
    });

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // 3. Save OTP to VerificationToken
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: otp,
        expires,
      }
    });

    // 4. Send Real Email via SMTP
    try {
      const { sendVerificationEmail } = await import("@/lib/mail");
      await sendVerificationEmail(email, otp);
      console.log(`✅ Email sent successfully to ${email}`);
    } catch (mailError) {
      console.error("❌ Failed to send email:", mailError);
      // We still return success because the user and token were created
      // But in a real app, you might want to show a warning
    }

    return NextResponse.json(
      { message: "Registrasi berhasil. Silakan cek email untuk kode verifikasi.", email },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
