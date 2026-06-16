import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { id: "asc" },
      include: { agent: true },
    });
    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Find matching community ID if communityName is provided
    let communityId = body.communityId;
    if (!communityId && body.communityName) {
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

    const project = await prisma.project.create({
      data: {
        slug: body.slug,
        name: body.name,
        developer: body.developer,
        communityName: body.communityName,
        communityId: communityId || null,
        location: body.location,
        propertyType: body.propertyType,
        startingPrice: body.startingPrice,
        handover: body.handover,
        paymentPlan: body.paymentPlan,
        image: body.image,
        images: body.images || [],
        description: body.description,
        reraPermit: body.reraPermit || "",
        escrowNumber: body.escrowNumber || null,
        totalUnits: body.totalUnits || "",
        coordinates: body.coordinates || { lat: 25.2048, lng: 55.2708 },
        paymentPlanDetails: body.paymentPlanDetails || [],
        unitMix: body.unitMix || [],
        amenities: body.amenities || [],
        locationHighlights: body.locationHighlights || [],
        developerProfile: body.developerProfile || { projects: 0, yearFounded: 0, tagline: "" },
        agentId: body.agentId ? parseInt(body.agentId, 10) : null,
        brochureUrl: body.brochureUrl || null,
        floorPlanUrl: body.floorPlanUrl || null,
        qrCodeUrl: body.qrCodeUrl || null,
      },
    });
    return NextResponse.json(project);
  } catch (error: any) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
