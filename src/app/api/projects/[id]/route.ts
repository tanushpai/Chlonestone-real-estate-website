import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if id is numeric (integer ID) or a slug string
    const isNumeric = /^\d+$/.test(id);

    const project = isNumeric
      ? await prisma.project.findUnique({ where: { id: parseInt(id, 10) }, include: { agent: true } })
      : await prisma.project.findUnique({ where: { slug: id }, include: { agent: true } });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
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

    const projectId = isNumeric ? parseInt(id, 10) : null;
    let existingProject = null;

    if (projectId) {
      existingProject = await prisma.project.findUnique({ where: { id: projectId } });
    } else {
      existingProject = await prisma.project.findUnique({ where: { slug: id } });
    }

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Find matching community ID if communityName changes
    let communityId = body.communityId;
    if (!communityId && body.communityName && body.communityName !== existingProject.communityName) {
      const matchComm = await prisma.community.findFirst({
        where: {
          name: {
            equals: body.communityName,
            mode: "insensitive"
          }
        }
      });
      if (matchComm) {
        communityId = matchComm.id;
      }
    }

    const updated = await prisma.project.update({
      where: { id: existingProject.id },
      data: {
        slug: body.slug ?? existingProject.slug,
        name: body.name ?? existingProject.name,
        developer: body.developer ?? existingProject.developer,
        communityName: body.communityName ?? existingProject.communityName,
        communityId: communityId ?? existingProject.communityId,
        location: body.location ?? existingProject.location,
        address: body.address !== undefined ? body.address : existingProject.address,
        propertyType: body.propertyType ?? existingProject.propertyType,
        startingPrice: body.startingPrice ?? existingProject.startingPrice,
        handover: body.handover ?? existingProject.handover,
        paymentPlan: body.paymentPlan ?? existingProject.paymentPlan,
        image: body.image ?? existingProject.image,
        images: body.images ?? existingProject.images,
        description: body.description ?? existingProject.description,
        reraPermit: body.reraPermit ?? existingProject.reraPermit,
        escrowNumber: body.escrowNumber !== undefined ? body.escrowNumber : existingProject.escrowNumber,
        totalUnits: body.totalUnits ?? existingProject.totalUnits,
        coordinates: body.coordinates ?? existingProject.coordinates,
        paymentPlanDetails: body.paymentPlanDetails ?? existingProject.paymentPlanDetails,
        unitMix: body.unitMix ?? existingProject.unitMix,
        amenities: body.amenities ?? existingProject.amenities,
        locationHighlights: body.locationHighlights ?? existingProject.locationHighlights,
        developerProfile: body.developerProfile ?? existingProject.developerProfile,
        agentId: body.agentId !== undefined ? (body.agentId ? parseInt(body.agentId, 10) : null) : existingProject.agentId,
        brochureUrl: body.brochureUrl !== undefined ? body.brochureUrl : existingProject.brochureUrl,
        floorPlanUrl: body.floorPlanUrl !== undefined ? body.floorPlanUrl : existingProject.floorPlanUrl,
        qrCodeUrl: body.qrCodeUrl !== undefined ? body.qrCodeUrl : existingProject.qrCodeUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Update project error:", error);
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

    let projectToDelete = null;
    if (isNumeric) {
      projectToDelete = await prisma.project.findUnique({ where: { id: parseInt(id, 10) } });
    } else {
      projectToDelete = await prisma.project.findUnique({ where: { slug: id } });
    }

    if (!projectToDelete) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await prisma.project.delete({
      where: { id: projectToDelete.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
