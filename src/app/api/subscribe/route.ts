import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email, phone } = await request.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }
    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({ message: "You are already subscribed to our newsletter!" }, { status: 200 });
    }

    const subscriber = await prisma.subscriber.create({
      data: { 
        email: normalizedEmail,
        phone: phone.trim(),
      },
    });

    // Send Welcome Email
    try {
      const settings = await prisma.setting.findUnique({ where: { id: 1 } });
      const welcomeSubject = settings?.welcomeSubject || "Welcome to Chlonestone Newsletter!";
      const welcomeBody = settings?.welcomeBody || "Thank you for subscribing to the Chlonestone newsletter. You will receive immediate updates on premium off-plan launches, ROI projections, and waterfront inventory allocations in Dubai.";

      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px;">
            <h2 style="color: #0f172a; margin: 0; font-family: serif; font-size: 24px;">Chlonestone</h2>
            <p style="color: #64748b; font-size: 10px; text-transform: uppercase; tracking: 0.1em; margin: 4px 0 0 0;">Premier Real Estate Advisory</p>
          </div>
          <div style="color: #334155; font-size: 14px; line-height: 1.7; white-space: pre-line;">
            ${welcomeBody}
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
          <p style="color: #64748b; font-size: 12px; line-height: 1.6; text-align: center;">
            Best regards,<br/><strong>Chlonestone Real Estate</strong>
          </p>
        </div>
      `;
      await sendEmail({ to: normalizedEmail, subject: welcomeSubject, text: welcomeBody, html });
    } catch (emailErr) {
      console.error("Failed to send subscription confirmation email:", emailErr);
    }

    return NextResponse.json({ message: "Successfully subscribed to our newsletter!", subscriber }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
