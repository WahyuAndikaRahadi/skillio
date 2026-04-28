import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name } = await req.json();
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ message: "Nama harus minimal 2 karakter" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name.trim() }
    });

    return NextResponse.json({ message: "Nama berhasil diperbarui" });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ message: "Gagal memperbarui profil" }, { status: 500 });
  }
}
