import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { deleteFile } from "@/lib/storage";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updateData: any = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      photoUrl: body.photoUrl,
      role: body.role,
    };

    if (body.systemRole) {
      updateData.systemRole = body.systemRole;
    }
    if (body.isBlocked !== undefined) {
      updateData.isBlocked = body.isBlocked;
    }
    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    const updated = await prisma.agent.update({
      where: { id: parseInt(id, 10) },
      data: updateData,
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
    const agentId = parseInt(id, 10);

    const agentToDelete = await prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agentToDelete) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Delete photo from local uploads or Supabase Storage
    await deleteFile(agentToDelete.photoUrl);

    await prisma.agent.delete({
      where: { id: agentId },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
