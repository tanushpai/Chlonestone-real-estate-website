import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const communities = await prisma.community.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(communities);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const community = await prisma.community.create({
      data: {
        slug: body.slug,
        name: body.name,
        tagline: body.tagline,
        image: body.image,
        avgPrice: body.avgPrice,
        rentalYield: body.rentalYield,
        growth: body.growth,
        popularFor: body.popularFor,
        description: body.description,
        highlights: body.highlights || [],
        driveTimes: body.driveTimes || [],
      },
    });
    return NextResponse.json(community);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
