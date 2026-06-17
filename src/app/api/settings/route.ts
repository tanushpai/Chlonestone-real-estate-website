import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    let setting = await prisma.setting.findUnique({
      where: { id: 1 },
    });
    
    if (!setting) {
      // Return a default fallback if not seeded
      setting = {
        id: 1,
        guideUrl: "/uploads/dubai-off-plan-investor-guide-2026.pdf",
        welcomeSubject: "Welcome to Chlonestone Newsletter!",
        welcomeBody: "Thank you for subscribing to the Chlonestone newsletter. You will receive immediate updates on premium off-plan launches, ROI projections, and waterfront inventory allocations in Dubai.",
        guideSubject: "Download: Dubai Off-Plan Investor Guide 2026",
        guideBody: "Thank you for requesting the Dubai Off-Plan Investor Guide 2026. You can download the booklet directly using this link: {{GUIDE_URL}}",
        inquirySubject: "Thank you for contacting Chlonestone Real Estate",
        inquiryBody: 'Hello {{CLIENT_NAME}},\n\nThank you for reaching out to Chlonestone. We have received your inquiry regarding "{{PROJECT_NAME}}" and one of our premier real estate advisors will connect with you shortly.',
      };
    }
    
    return NextResponse.json(setting);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updateData: any = {};
    if (body.guideUrl !== undefined) updateData.guideUrl = body.guideUrl;
    if (body.welcomeSubject !== undefined) updateData.welcomeSubject = body.welcomeSubject;
    if (body.welcomeBody !== undefined) updateData.welcomeBody = body.welcomeBody;
    if (body.guideSubject !== undefined) updateData.guideSubject = body.guideSubject;
    if (body.guideBody !== undefined) updateData.guideBody = body.guideBody;
    if (body.inquirySubject !== undefined) updateData.inquirySubject = body.inquirySubject;
    if (body.inquiryBody !== undefined) updateData.inquiryBody = body.inquiryBody;

    const setting = await prisma.setting.upsert({
      where: { id: 1 },
      update: updateData,
      create: {
        id: 1,
        guideUrl: body.guideUrl || "/uploads/dubai-off-plan-investor-guide-2026.pdf",
        welcomeSubject: body.welcomeSubject || "Welcome to Chlonestone Newsletter!",
        welcomeBody: body.welcomeBody || "Thank you for subscribing to the Chlonestone newsletter. You will receive immediate updates on premium off-plan launches, ROI projections, and waterfront inventory allocations in Dubai.",
        guideSubject: body.guideSubject || "Download: Dubai Off-Plan Investor Guide 2026",
        guideBody: body.guideBody || "Thank you for requesting the Dubai Off-Plan Investor Guide 2026. You can download the booklet directly using this link: {{GUIDE_URL}}",
        inquirySubject: body.inquirySubject || "Thank you for contacting Chlonestone Real Estate",
        inquiryBody: body.inquiryBody || 'Hello {{CLIENT_NAME}},\n\nThank you for reaching out to Chlonestone. We have received your inquiry regarding "{{PROJECT_NAME}}" and one of our premier real estate advisors will connect with you shortly.',
      },
    });

    return NextResponse.json(setting);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
