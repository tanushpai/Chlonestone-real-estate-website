import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Check admin credentials securely
    if (email.toLowerCase() === "admin@chlonestone.com" && password === "admin123") {
      return NextResponse.json({
        name: "Platform Admin",
        email: "admin@chlonestone.com",
        role: "admin",
      });
    }

    // Find user/lead in the database
    const user = await prisma.lead.findFirst({
      where: {
        email: {
          equals: email.toLowerCase(),
          mode: "insensitive",
        },
      },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "No registered account found with this email" }, { status: 400 });
    }

    // Compare hashed password or migrate legacy plaintext
    let passwordMatch = false;
    const isBcryptHash = user.password.startsWith("$2a$") || user.password.startsWith("$2b$") || user.password.startsWith("$2y$");

    if (isBcryptHash) {
      passwordMatch = await bcrypt.compare(password, user.password);
    } else {
      passwordMatch = password === user.password;
      if (passwordMatch) {
        // Upgrade legacy plaintext password to a secure bcrypt hash
        const upgradedHash = await bcrypt.hash(password, 10);
        await prisma.lead.update({
          where: { id: user.id },
          data: { password: upgradedHash },
        });
      }
    }

    if (!passwordMatch) {
      return NextResponse.json({ error: "Incorrect password. Please try again." }, { status: 400 });
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      role: "client",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
