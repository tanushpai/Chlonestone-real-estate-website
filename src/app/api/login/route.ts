import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // 1. Check if the login belongs to an Agent (Admin or Agent role)
    const agent = await prisma.agent.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (agent) {
      if (agent.isBlocked) {
        return NextResponse.json({ error: "Your account has been suspended. Please contact the administrator." }, { status: 403 });
      }

      if (!agent.password) {
        return NextResponse.json({ error: "No password set for this agent account" }, { status: 400 });
      }

      // Check password (supports bcrypt and fallback plaintext for initial seeds)
      const isBcryptHash = agent.password.startsWith("$2a$") || agent.password.startsWith("$2b$") || agent.password.startsWith("$2y$");
      let passwordMatch = false;

      if (isBcryptHash) {
        passwordMatch = await bcrypt.compare(password, agent.password);
      } else {
        passwordMatch = password === agent.password;
        if (passwordMatch) {
          // Upgrade to secure bcrypt hash
          const upgradedHash = await bcrypt.hash(password, 10);
          await prisma.agent.update({
            where: { id: agent.id },
            data: { password: upgradedHash },
          });
        }
      }

      if (!passwordMatch) {
        return NextResponse.json({ error: "Incorrect password. Please try again." }, { status: 400 });
      }

      return NextResponse.json({
        id: agent.id,
        name: agent.name,
        email: agent.email,
        role: agent.systemRole.toLowerCase(), // "admin" or "agent"
      });
    }

    // 2. Check if the login belongs to a Lead (Client/Investor)
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
      id: user.id,
      name: user.name,
      email: user.email,
      role: "client",
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
