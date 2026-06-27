import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email, phone } = await request.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }
    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({ message: "You are already subscribed to our newsletter!" }, { status: 200 });
    }

    const subscriber = await prisma.subscriber.create({
      data: { 
        email: normalizedEmail,
        phone: phone.trim(),
      },
    });

    // Welcome email disabled to optimize transactional email usage.

    return NextResponse.json({ message: "Successfully subscribed to our newsletter!", subscriber }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
