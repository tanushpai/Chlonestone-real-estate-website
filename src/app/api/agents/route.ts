import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(agents);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 });
    }

    let hashedPassword = null;
    if (body.password) {
      hashedPassword = await bcrypt.hash(body.password, 10);
    }

    const agent = await prisma.agent.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        photoUrl: body.photoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
        role: body.role || "Property Consultant",
        password: hashedPassword,
        systemRole: body.systemRole || "AGENT",
        isBlocked: body.isBlocked !== undefined ? body.isBlocked : false,
      },
    });
    return NextResponse.json(agent);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
