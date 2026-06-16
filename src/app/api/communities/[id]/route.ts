import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isNumeric = /^\d+$/.test(id);

    const community = isNumeric
      ? await prisma.community.findUnique({ where: { id: parseInt(id, 10) } })
      : await prisma.community.findUnique({ where: { slug: id } });

    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    return NextResponse.json(community);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isNumeric = /^\d+$/.test(id);
    const body = await request.json();

    const communityId = isNumeric ? parseInt(id, 10) : null;
    let existingCommunity = null;

    if (communityId) {
      existingCommunity = await prisma.community.findUnique({ where: { id: communityId } });
    } else {
      existingCommunity = await prisma.community.findUnique({ where: { slug: id } });
    }

    if (!existingCommunity) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    const updated = await prisma.community.update({
      where: { id: existingCommunity.id },
      data: {
        slug: body.slug ?? existingCommunity.slug,
        name: body.name ?? existingCommunity.name,
        tagline: body.tagline ?? existingCommunity.tagline,
        image: body.image ?? existingCommunity.image,
        avgPrice: body.avgPrice ?? existingCommunity.avgPrice,
        rentalYield: body.rentalYield ?? existingCommunity.rentalYield,
        growth: body.growth ?? existingCommunity.growth,
        popularFor: body.popularFor ?? existingCommunity.popularFor,
        description: body.description ?? existingCommunity.description,
        highlights: body.highlights ?? existingCommunity.highlights,
        driveTimes: body.driveTimes ?? existingCommunity.driveTimes,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isNumeric = /^\d+$/.test(id);

    let communityToDelete = null;
    if (isNumeric) {
      communityToDelete = await prisma.community.findUnique({ where: { id: parseInt(id, 10) } });
    } else {
      communityToDelete = await prisma.community.findUnique({ where: { slug: id } });
    }

    if (!communityToDelete) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    await prisma.community.delete({
      where: { id: communityToDelete.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
