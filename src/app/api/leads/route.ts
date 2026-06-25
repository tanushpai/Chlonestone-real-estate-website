import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get("agentId");

    const whereClause: any = {};
    if (agentId) {
      whereClause.assignedAgentId = parseInt(agentId, 10);
    }

    const leads = await prisma.lead.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: { assignedAgent: true },
    });
    return NextResponse.json(leads);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user is registering (supplying a password) and already exists
    if (body.password) {
      const existingUser = await prisma.lead.findFirst({
        where: {
          email: {
            equals: body.email.toLowerCase(),
            mode: "insensitive",
          },
        },
      });

      if (existingUser && existingUser.password) {
        return NextResponse.json({ error: "Email already registered. Please sign in instead." }, { status: 400 });
      }
    }

    let hashedPassword = null;
    if (body.password) {
      hashedPassword = await bcrypt.hash(body.password, 10);
    }

    let assignedAgentId = body.assignedAgentId ? parseInt(body.assignedAgentId, 10) : null;
    if (!assignedAgentId && body.projectName) {
      const projectWithAgent = await prisma.project.findFirst({
        where: {
          name: {
            equals: body.projectName,
            mode: "insensitive",
          },
        },
        select: {
          agentId: true,
        },
      });
      if (projectWithAgent && projectWithAgent.agentId) {
        assignedAgentId = projectWithAgent.agentId;
      }
    }

    if (!assignedAgentId) {
      const existingLeadWithAgent = await prisma.lead.findFirst({
        where: {
          email: {
            equals: body.email.toLowerCase(),
            mode: "insensitive",
          },
          assignedAgentId: {
            not: null,
          },
        },
        select: {
          assignedAgentId: true,
        },
      });
      if (existingLeadWithAgent) {
        assignedAgentId = existingLeadWithAgent.assignedAgentId;
      }
    }

    const existingLead = await prisma.lead.findFirst({
      where: {
        email: {
          equals: body.email.toLowerCase(),
          mode: "insensitive",
        },
      },
    });

    let lead;
    if (existingLead) {
      const updatedData: any = {};
      if (body.name) updatedData.name = body.name;
      if (body.phone) updatedData.phone = body.phone;
      if (hashedPassword) updatedData.password = hashedPassword;
      if (body.interestType) updatedData.interestType = body.interestType;
      if (body.role) updatedData.role = body.role;
      if (body.funding) updatedData.funding = body.funding;
      if (body.timeframe) updatedData.timeframe = body.timeframe;
      if (body.message) updatedData.message = body.message;
      if (body.projectName) updatedData.projectName = body.projectName;

      if (existingLead.status === "Lost") {
        updatedData.status = "New";
      }

      if (!existingLead.assignedAgentId && assignedAgentId) {
        updatedData.assignedAgentId = assignedAgentId;
      }

      lead = await prisma.lead.update({
        where: { id: existingLead.id },
        data: updatedData,
      });

      await prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          type: "FORM_SUBMISSION",
          content: `Re-engaged: Submitted form for ${body.interestType || "contact"} regarding ${body.projectName || "general inquiry"}. Message: ${body.message || "N/A"}`,
        },
      });
    } else {
      lead = await prisma.lead.create({
        data: {
          name: body.name,
          email: body.email.toLowerCase(),
          phone: body.phone || null,
          password: hashedPassword,
          interestType: body.interestType || "contact",
          role: body.role || null,
          funding: body.funding || null,
          timeframe: body.timeframe || null,
          message: body.message || null,
          projectName: body.projectName || null,
          assignedAgentId: assignedAgentId,
        },
      });

      await prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          type: "CREATION",
          content: `Created: Submitted form for ${body.interestType || "contact"} regarding ${body.projectName || "general advisory"}.`,
        },
      });
    }

    // Send notifications
    try {
      const dbAdmins = await prisma.agent.findMany({
        where: { systemRole: "ADMIN" },
        select: { email: true }
      });
      const adminEmails = new Set(dbAdmins.map(a => a.email.toLowerCase()));
      if (adminEmails.size === 0) {
        adminEmails.add("admin@chlonestone.com"); // standard fallback if no database admins exist
      }

      // Fetch assigned agent if any
      let agentEmail = null;
      if (lead.assignedAgentId) {
        const agent = await prisma.agent.findUnique({
          where: { id: lead.assignedAgentId }
        });
        if (agent) {
          agentEmail = agent.email;
        }
      }

      // Build Notification Email Content
      const subject = `New Lead Captured: ${lead.name} (${lead.interestType.toUpperCase()})`;
      const text = `A new lead has been captured on Chlonestone:\n\nName: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone || 'N/A'}\nInterest Type: ${lead.interestType}\nProject: ${lead.projectName || 'N/A'}\nMessage: ${lead.message || 'N/A'}\n\nManage this lead in the CRM dashboard.`;
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0f172a; margin-bottom: 20px;">New Lead Received</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Name</td>
              <td style="padding: 10px 0; color: #0f172a;">${lead.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Email</td>
              <td style="padding: 10px 0; color: #0f172a;"><a href="mailto:${lead.email}">${lead.email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Phone</td>
              <td style="padding: 10px 0; color: #0f172a;">${lead.phone || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Interest Type</td>
              <td style="padding: 10px 0; color: #0f172a; text-transform: capitalize;">${lead.interestType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Project Interest</td>
              <td style="padding: 10px 0; color: #0f172a;">${lead.projectName || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #475569; vertical-align: top;">Message</td>
              <td style="padding: 10px 0; color: #0f172a;">${lead.message || 'N/A'}</td>
            </tr>
          </table>
          <div style="margin-top: 30px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/crm/leads" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">View Leads in CRM</a>
          </div>
        </div>
      `;

      // Email Admins
      for (const email of adminEmails) {
        await sendEmail({ to: email, subject, text, html });
      }

      // Email assigned agent if not already in adminEmails list
      if (agentEmail && !adminEmails.has(agentEmail.toLowerCase())) {
        await sendEmail({ to: agentEmail, subject, text, html });
      }

      // Email customer copy (Confirmation or Guide delivery)
      try {
        const settings = await prisma.setting.findUnique({ where: { id: 1 } });
        const liveGuideUrl = settings?.guideUrl || "/uploads/dubai-off-plan-investor-guide-2026.pdf";
        const targetGuideLink = liveGuideUrl.startsWith("http")
          ? liveGuideUrl
          : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${liveGuideUrl}`;

        let clientSubject = "";
        let clientText = "";
        
        if (lead.interestType === "guide") {
          const rawSubject = settings?.guideSubject || "Download: Dubai Off-Plan Investor Guide 2026";
          const rawBody = settings?.guideBody || "Thank you for requesting the Dubai Off-Plan Investor Guide 2026. You can download the booklet directly using this link: {{GUIDE_URL}}";
          
          clientSubject = rawSubject
            .replace(/{{CLIENT_NAME}}/g, lead.name)
            .replace(/{{PROJECT_NAME}}/g, lead.projectName || "Dubai Off-Plan Investor Guide 2026")
            .replace(/{{GUIDE_URL}}/g, targetGuideLink);

          clientText = rawBody
            .replace(/{{CLIENT_NAME}}/g, lead.name)
            .replace(/{{PROJECT_NAME}}/g, lead.projectName || "Dubai Off-Plan Investor Guide 2026")
            .replace(/{{GUIDE_URL}}/g, targetGuideLink);
        } else {
          const rawSubject = settings?.inquirySubject || "Thank you for contacting Chlonestone Real Estate";
          const rawBody = settings?.inquiryBody || 'Hello {{CLIENT_NAME}},\n\nThank you for reaching out to Chlonestone. We have received your inquiry regarding "{{PROJECT_NAME}}" and one of our premier real estate advisors will connect with you shortly.';

          clientSubject = rawSubject
            .replace(/{{CLIENT_NAME}}/g, lead.name)
            .replace(/{{PROJECT_NAME}}/g, lead.projectName || "general advisory")
            .replace(/{{GUIDE_URL}}/g, targetGuideLink);

          clientText = rawBody
            .replace(/{{CLIENT_NAME}}/g, lead.name)
            .replace(/{{PROJECT_NAME}}/g, lead.projectName || "general advisory")
            .replace(/{{GUIDE_URL}}/g, targetGuideLink);
        }

        const clientHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px;">
              <h2 style="color: #0f172a; margin: 0; font-family: serif; font-size: 24px;">Chlonestone</h2>
              <p style="color: #64748b; font-size: 10px; text-transform: uppercase; tracking: 0.1em; margin: 4px 0 0 0;">Premier Real Estate Advisory</p>
            </div>
            <div style="color: #334155; font-size: 14px; line-height: 1.7; white-space: pre-line;">
              ${clientText}
            </div>
            ${lead.interestType === "guide" ? `
              <div style="margin: 30px 0; text-align: center;">
                <a href="${targetGuideLink}" style="background-color: #0f172a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Download Booklet PDF</a>
              </div>
            ` : ""}
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="color: #64748b; font-size: 12px; line-height: 1.6; text-align: center;">
              This is an automated verification receipt.<br/>
              <strong>Chlonestone Real Estate</strong> | Dubai, United Arab Emirates
            </p>
          </div>
        `;

        await sendEmail({ to: lead.email, subject: clientSubject, text: clientText, html: clientHtml });
      } catch (clientEmailErr) {
        console.error("Failed to send customer confirmation email:", clientEmailErr);
      }
    } catch (emailErr) {
      console.error("Failed to send lead notification emails:", emailErr);
    }

    return NextResponse.json(lead);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

