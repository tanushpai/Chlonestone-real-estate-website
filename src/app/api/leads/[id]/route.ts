import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = await prisma.lead.findUnique({
      where: { id: parseInt(id, 10) },
      include: { assignedAgent: true },
    });
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json(lead);
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
    const body = await request.json();
    // Build sparse update: only set fields that are explicitly present in request body
    const updateData: Record<string, any> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.password !== undefined) updateData.password = body.password;
    if (body.interestType !== undefined) updateData.interestType = body.interestType;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.funding !== undefined) updateData.funding = body.funding;
    if (body.timeframe !== undefined) updateData.timeframe = body.timeframe;
    if (body.message !== undefined) updateData.message = body.message;
    if (body.projectName !== undefined) updateData.projectName = body.projectName;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.assignedAgentId !== undefined) {
      updateData.assignedAgentId = body.assignedAgentId ? parseInt(body.assignedAgentId, 10) : null;
    }

    const lead = await prisma.lead.update({
      where: { id: parseInt(id, 10) },
      data: updateData,
      include: { assignedAgent: true },
    });

    if (body.assignedAgentId !== undefined && lead.email) {
      const targetAgentId = body.assignedAgentId ? parseInt(body.assignedAgentId, 10) : null;
      await prisma.lead.updateMany({
        where: {
          email: {
            equals: lead.email.toLowerCase(),
            mode: "insensitive",
          },
        },
        data: {
          assignedAgentId: targetAgentId,
        },
      });
    }
    return NextResponse.json(lead);
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
    await prisma.lead.delete({
      where: { id: parseInt(id, 10) },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
