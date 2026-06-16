import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isNumeric = /^\d+$/.test(id);

    const developer = isNumeric
      ? await prisma.developer.findUnique({ where: { id: parseInt(id, 10) } })
      : await prisma.developer.findUnique({ where: { slug: id } });

    if (!developer) {
      return NextResponse.json({ error: "Developer not found" }, { status: 404 });
    }

    return NextResponse.json(developer);
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

    const devId = isNumeric ? parseInt(id, 10) : null;
    let existingDev = null;

    if (devId) {
      existingDev = await prisma.developer.findUnique({ where: { id: devId } });
    } else {
      existingDev = await prisma.developer.findUnique({ where: { slug: id } });
    }

    if (!existingDev) {
      return NextResponse.json({ error: "Developer not found" }, { status: 404 });
    }

    const updated = await prisma.developer.update({
      where: { id: existingDev.id },
      data: {
        slug: body.slug ?? existingDev.slug,
        name: body.name ?? existingDev.name,
        description: body.description ?? existingDev.description,
        completedProjects: body.completedProjects !== undefined ? Number(body.completedProjects) : existingDev.completedProjects,
        onTimeRate: body.onTimeRate ?? existingDev.onTimeRate,
        logoUrl: body.logoUrl ?? existingDev.logoUrl,
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

    let devToDelete = null;
    if (isNumeric) {
      devToDelete = await prisma.developer.findUnique({ where: { id: parseInt(id, 10) } });
    } else {
      devToDelete = await prisma.developer.findUnique({ where: { slug: id } });
    }

    if (!devToDelete) {
      return NextResponse.json({ error: "Developer not found" }, { status: 404 });
    }

    await prisma.developer.delete({
      where: { id: devToDelete.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
