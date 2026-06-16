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
    const lead = await prisma.lead.update({
      where: { id: parseInt(id, 10) },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        password: body.password,
        interestType: body.interestType,
        role: body.role,
        funding: body.funding,
        timeframe: body.timeframe,
        message: body.message,
        projectName: body.projectName,
        status: body.status,
        notes: body.notes,
        assignedAgentId: body.assignedAgentId !== undefined ? (body.assignedAgentId ? parseInt(body.assignedAgentId, 10) : null) : undefined,
      },
      include: { assignedAgent: true },
    });
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
