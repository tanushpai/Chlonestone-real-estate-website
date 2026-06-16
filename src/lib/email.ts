import nodemailer from "nodemailer";

const getTransporter = () => {
  const host = process.env.SMTP_HOST || "";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASSWORD || "";

  // If credentials are not set, return a mock/simulated transporter that prints to console
  if (!host || !user) {
    console.warn("SMTP configuration is missing in .env. Emails will be logged to the server console instead.");
    return {
      sendMail: async (options: { to: string; subject: string; text: string; html: string }) => {
        console.log("----------------[ SIMULATED EMAIL ]----------------");
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Body:\n${options.text}`);
        console.log("---------------------------------------------------");
        return { messageId: "simulated-id" };
      }
    };
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || `"Chlonestone Support" <support@chlonestone.com>`;
  
  return transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
}
