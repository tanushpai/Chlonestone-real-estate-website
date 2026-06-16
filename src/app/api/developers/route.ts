import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const developers = await prisma.developer.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(developers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const developer = await prisma.developer.create({
      data: {
        slug: body.slug,
        name: body.name,
        description: body.description,
        completedProjects: Number(body.completedProjects) || 0,
        onTimeRate: body.onTimeRate,
        logoUrl: body.logoUrl,
      },
    });
    return NextResponse.json(developer);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
