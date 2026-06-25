import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = await prisma.lead.findUnique({
      where: { id: parseInt(id, 10) },
      include: { 
        assignedAgent: true,
        activities: {
          orderBy: { createdAt: "desc" }
        }
      },
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

    // Query current status for activity log tracking
    const currentLead = await prisma.lead.findUnique({
      where: { id: parseInt(id, 10) }
    });

    if (body.status !== undefined && currentLead && currentLead.status !== body.status) {
      await prisma.leadActivity.create({
        data: {
          leadId: parseInt(id, 10),
          type: "STATUS_CHANGE",
          content: `Status updated from "${currentLead.status}" to "${body.status}"`,
          agentName: body.agentName || "Agent"
        }
      });
    }

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
    if (body.status !== undefined) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.dealValue !== undefined) {
      updateData.dealValue = body.dealValue !== null ? parseFloat(body.dealValue) : null;
    }
    if (body.commissionRate !== undefined) {
      updateData.commissionRate = body.commissionRate !== null ? parseFloat(body.commissionRate) : null;
    }
    if (body.assignedAgentId !== undefined) {
      updateData.assignedAgentId = body.assignedAgentId ? parseInt(body.assignedAgentId, 10) : null;
    }

    const lead = await prisma.lead.update({
      where: { id: parseInt(id, 10) },
      data: updateData,
      include: { 
        assignedAgent: true,
        activities: {
          orderBy: { createdAt: "desc" }
        }
      },
    });

    if (body.assignedAgentId !== undefined && lead.email) {
      const targetAgentId = body.assignedAgentId ? parseInt(body.assignedAgentId, 10) : null;
      
      // If the assigned agent is changing and is not null, email the new agent
      if (currentLead && currentLead.assignedAgentId !== targetAgentId && targetAgentId !== null) {
        const newAgent = await prisma.agent.findUnique({
          where: { id: targetAgentId }
        });
        if (newAgent && newAgent.email) {
          try {
            await sendEmail({
              to: newAgent.email,
              subject: `[CRM Alert] Lead Assigned: ${lead.name}`,
              text: `Hello ${newAgent.name},\n\nYou have been assigned a new lead on Chlonestone CRM.\n\nLead Details:\n- Name: ${lead.name}\n- Email: ${lead.email}\n- Project Interest: ${lead.projectName || "General Inquiry"}\n\nPlease log in to the CRM to view details and contact the client.\n\nBest regards,\nChlonestone CRM`,
              html: `<div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #3b82f6;">Lead Assigned</h2>
                <p>Hello <strong>${newAgent.name}</strong>,</p>
                <p>You have been assigned a new lead on the Chlonestone CRM portal.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <h3>Lead Details:</h3>
                <ul style="list-style: none; padding: 0;">
                  <li style="margin-bottom: 10px;"><strong>Client Name:</strong> ${lead.name}</li>
                  <li style="margin-bottom: 10px;"><strong>Email:</strong> ${lead.email}</li>
                  <li style="margin-bottom: 10px;"><strong>Project Interest:</strong> ${lead.projectName || "General Inquiry"}</li>
                </ul>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/crm" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Log in to CRM</a></p>
              </div>`
            });
          } catch (emailErr) {
            console.error("Failed to send assignment email notification:", emailErr);
          }
        }
      }

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
