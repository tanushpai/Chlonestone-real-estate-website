import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const activities = await prisma.leadActivity.findMany({
      where: { leadId: parseInt(id, 10) },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(activities);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.content || !body.type) {
      return NextResponse.json({ error: "Type and content are required" }, { status: 400 });
    }

    const activity = await prisma.leadActivity.create({
      data: {
        leadId: parseInt(id, 10),
        type: body.type,
        content: body.content,
        agentName: body.agentName || "Agent"
      }
    });

    return NextResponse.json(activity);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
