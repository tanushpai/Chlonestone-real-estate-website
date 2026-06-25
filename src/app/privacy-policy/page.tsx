import Link from "next/link";
import { ArrowLeft, ShieldAlert, Lock, Database, UserCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Chlonestone Real Estate Dubai",
  description: "Read the Privacy Policy for Chlonestone Real Estate. Learn how we collect, protect, and process investor and homebuyer data in accordance with UAE data protection laws.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-16 px-6 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-white border border-slate-200/80 p-8 sm:p-12 shadow-sm rounded-none">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline uppercase tracking-wider">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>

        {/* Header */}
        <div className="space-y-3 border-b pb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Last Updated: June 22, 2026
          </p>
        </div>

        {/* Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="border p-5 space-y-2 flex flex-col justify-between rounded-none bg-slate-50/50">
            <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-primary">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 uppercase">Data Protection</h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Compliance with UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection.</p>
            </div>
          </div>

          <div className="border p-5 space-y-2 flex flex-col justify-between rounded-none bg-slate-50/50">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 uppercase">Information Use</h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Processing client data solely for qualified off-plan property inquiries and advisory.</p>
            </div>
          </div>

          <div className="border p-5 space-y-2 flex flex-col justify-between rounded-none bg-slate-50/50">
            <div className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 uppercase">Your Control</h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Right to access, modify, or completely delete your personal records from our CRM system.</p>
            </div>
          </div>
        </div>

        {/* Legal Text */}
        <div className="space-y-6 text-sm text-slate-650 leading-relaxed font-sans">
          
          <section className="space-y-2.5">
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
              1. Introduction
            </h2>
            <p>
              Chlonestone Real Estate ("we", "us", or "our"), registered under RERA Broker License No. 91442, is committed to safeguarding the privacy of our clients, website users, and property investors. This Privacy Policy details how we collect, store, and process your personal data when you interact with our website, request investor guides, or submit listing inquiries.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
              2. Information We Collect
            </h2>
            <p>
              We collect personal information that you voluntarily provide to us when you inquire about off-plan developments, register for newsletters, download investor booklets, or request advice from our sales consultants. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-1 text-slate-600">
              <li><strong>Contact Details:</strong> Your full name, email address, phone number (and country code).</li>
              <li><strong>Investment Preferences:</strong> Target properties of interest, interested communities, timeframe to buy, and funding profiles (cash, mortgage, or installments).</li>
              <li><strong>Client Interaction Logs:</strong> Record of WhatsApp conversations, viewing feedback, status history, and customized notes logged inside our CRM by your assigned Property Consultant.</li>
            </ul>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
              3. Processing and Data Usage
            </h2>
            <p>
              We use your data in accordance with industry-standard real estate workflows to provide investment advisory and qualify leads. Specific uses include:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-1 text-slate-600">
              <li>Matching and assigning your profile to a qualified Property Consultant specializing in your community of choice.</li>
              <li>Sending requested investor guides, brochures, and dynamic off-plan factsheets via email or WhatsApp.</li>
              <li>Updating your pipeline status (e.g., qualifying viewing appointments or executing transaction contracts).</li>
              <li>Automated email updates regarding premium projects, waterfront launches, and exclusive allocation campaigns.</li>
            </ul>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
              4. Data Sharing & Developers
            </h2>
            <p>
              To complete purchase transactions and secure unit allocations, we may share relevant client data with master developers (including, but not limited to, Emaar Properties, Sobha Realty, DAMAC, Nakheel, and Omniyat). We **never** sell your database credentials to third-party advertising companies. Your data is shared strictly on a need-to-know basis to process off-plan bookings.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
              5. Storage and Security
            </h2>
            <p>
              All personal records are encrypted and stored in secure cloud systems. Our internal CRM is access-controlled, allowing only authorized consultants and administrators to view client details. We retain data as long as required by the Dubai Land Department (DLD) and RERA regulations for auditing sales transactions.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
              6. Your Legal Rights
            </h2>
            <p>
              Under UAE Data Protection Law, you hold the right to access, rectify, or demand the deletion of your personal records from our database. If you wish to opt-out of communications, you may click the "Unsubscribe" link in any automated email or contact us at <a href="mailto:info@chlonestone.com" className="text-primary hover:underline">info@chlonestone.com</a>.
            </p>
          </section>

          <section className="border-t pt-5 mt-6 flex items-start gap-3 bg-blue-50/40 p-4 border-blue-150/70">
            <ShieldAlert className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase">Legal Disclaimer</p>
              <p className="text-[10px] text-slate-500 leading-normal mt-1">
                While we employ state-of-the-art security measures to protect client profiles, no digital transmission is 100% secure. By submitting your inquiry, you acknowledge these conditions. For further concerns, please contact our Compliance Officer at <a href="mailto:compliance@chlonestone.com" className="text-primary hover:underline">compliance@chlonestone.com</a>.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
