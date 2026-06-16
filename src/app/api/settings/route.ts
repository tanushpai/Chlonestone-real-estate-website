import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    let setting = await prisma.setting.findUnique({
      where: { id: 1 },
    });
    
    if (!setting) {
      // Return a default fallback if not seeded
      setting = {
        id: 1,
        guideUrl: "/uploads/dubai-off-plan-investor-guide-2026.pdf",
      };
    }
    
    return NextResponse.json(setting);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.guideUrl) {
      return NextResponse.json({ error: "guideUrl is required" }, { status: 400 });
    }

    const setting = await prisma.setting.upsert({
      where: { id: 1 },
      update: {
        guideUrl: body.guideUrl,
      },
      create: {
        id: 1,
        guideUrl: body.guideUrl,
      },
    });

    return NextResponse.json(setting);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
