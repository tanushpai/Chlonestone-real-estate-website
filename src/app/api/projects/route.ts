import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

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
        address: body.address || null,
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

    // Notify subscribers
    try {
      const subscribers = await prisma.subscriber.findMany({
        select: { email: true }
      });
      
      if (subscribers.length > 0) {
        const subject = `New Premium Property Listing: ${project.name} in ${project.communityName}`;
        const projectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/projects/${project.slug}`;
        const text = `A new property listing has been published on Chlonestone:\n\n${project.name}\nDeveloper: ${project.developer}\nLocation: ${project.location}\nStarting Price: ${project.startingPrice}\nHandover: ${project.handover}\n\nView listing details here: ${projectUrl}`;
        const html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            ${project.image ? `<img src="${project.image}" alt="${project.name}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;" />` : ''}
            <h2 style="color: #0f172a; margin-bottom: 10px;">${project.name}</h2>
            <p style="color: #64748b; font-size: 14px; margin-top: 0;">New off-plan development by <strong>${project.developer}</strong> in <strong>${project.communityName}</strong></p>
            
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #475569; font-size: 14px;">Location</td>
                  <td style="padding: 5px 0; color: #0f172a; font-size: 14px; text-align: right;">${project.location}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #475569; font-size: 14px;">Starting Price</td>
                  <td style="padding: 5px 0; color: #2563eb; font-weight: bold; font-size: 14px; text-align: right;">${project.startingPrice}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #475569; font-size: 14px;">Handover Date</td>
                  <td style="padding: 5px 0; color: #0f172a; font-size: 14px; text-align: right;">${project.handover}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #475569; font-size: 14px;">Payment Plan</td>
                  <td style="padding: 5px 0; color: #0f172a; font-size: 14px; text-align: right;">${project.paymentPlan}</td>
                </tr>
              </table>
            </div>

            <p style="color: #334155; font-size: 14px; line-height: 1.6;">${project.description}</p>

            <div style="margin-top: 30px; text-align: center;">
              <a href="${projectUrl}" style="background-color: #0f172a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">View Full Details</a>
            </div>
          </div>
        `;

        for (const sub of subscribers) {
          await sendEmail({
            to: sub.email,
            subject,
            text,
            html
          });
        }
      }
    } catch (subErr) {
      console.error("Failed to notify subscribers:", subErr);
    }

    return NextResponse.json(project);
  } catch (error: any) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

