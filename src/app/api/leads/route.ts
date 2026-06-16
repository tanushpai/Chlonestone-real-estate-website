import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: { assignedAgent: true },
    });
    return NextResponse.json(leads);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user is registering (supplying a password) and already exists
    if (body.password) {
      const existingUser = await prisma.lead.findFirst({
        where: {
          email: {
            equals: body.email.toLowerCase(),
            mode: "insensitive",
          },
        },
      });

      if (existingUser && existingUser.password) {
        return NextResponse.json({ error: "Email already registered. Please sign in instead." }, { status: 400 });
      }
    }

    let hashedPassword = null;
    if (body.password) {
      hashedPassword = await bcrypt.hash(body.password, 10);
    }

    const lead = await prisma.lead.create({
      data: {
        name: body.name,
        email: body.email.toLowerCase(),
        phone: body.phone || null,
        password: hashedPassword,
        interestType: body.interestType || "contact",
        role: body.role || null,
        funding: body.funding || null,
        timeframe: body.timeframe || null,
        message: body.message || null,
        projectName: body.projectName || null,
      },
    });
    return NextResponse.json(lead);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
