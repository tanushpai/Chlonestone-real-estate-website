import Link from "next/link";
import { ArrowLeft, Scale, RefreshCw, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | Chlonestone Real Estate Dubai",
  description: "Read the Terms & Conditions for Chlonestone Real Estate Dubai. Learn about our brokerage guidelines, property listing price disclaimers, and off-plan investment policies.",
};

export default function TermsAndConditionsPage() {
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
            Terms & Conditions
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Last Updated: June 22, 2026
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="border p-5 space-y-2 flex flex-col justify-between rounded-none bg-slate-50/50">
            <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-primary">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 uppercase">Regulatory Rules</h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Fully governed by the laws of the Emirate of Dubai and UAE Real Estate Regulatory Agency (RERA).</p>
            </div>
          </div>

          <div className="border p-5 space-y-2 flex flex-col justify-between rounded-none bg-slate-50/50">
            <div className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <RefreshCw className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 uppercase">Price & Details</h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Property starting prices, payment plans, and handover schedules are subject to change by developers.</p>
            </div>
          </div>

          <div className="border p-5 space-y-2 flex flex-col justify-between rounded-none bg-slate-50/50">
            <div className="h-8 w-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 uppercase">Investment Risk</h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">All information represents general marketing information and is not formal financial or purchase advice.</p>
            </div>
          </div>
        </div>

        {/* Legal Text */}
        <div className="space-y-6 text-sm text-slate-650 leading-relaxed font-sans">
          
          <section className="space-y-2.5">
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
              1. Website Usage Terms
            </h2>
            <p>
              By accessing, browsing, or using this website, you confirm your agreement to be bound by these Terms & Conditions. If you do not agree to these terms, please refrain from using the Chlonestone website or submitting inquiries.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
              2. Listing Accuracy and Starting Prices
            </h2>
            <p>
              The property prices (e.g. "Starting Price: AED 1,300,000"), layouts, amenities, unit availability, and handover estimations displayed on this portal represent marketing projections provided by developers. 
            </p>
            <p className="text-slate-600">
              *   Chlonestone does not guarantee that listing rates reflect real-time live unit status.
              *   Developers reserve the right to alter payment plans, specifications, layouts, and rates without notice.
              *   Formal unit bookings are finalized only upon executing an official Sale and Purchase Agreement (SPA) directly with the developer.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
              3. No Financial or Investment Advice
            </h2>
            <p>
              The contents, ROI figures, rental yield estimates (e.g. "8.5% yield"), and guidebooks downloadable on this site are compiled for informational and general marketing purposes. 
            </p>
            <p className="font-semibold text-slate-700 bg-slate-50 border-l-2 border-primary p-3">
              Buying off-plan real estate carries inherent project completion and market valuation risks. All investors should perform independent due diligence or consult an independent financial advisor before executing financial commitments.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
              4. Brokerage Agreements & Commissions
            </h2>
            <p>
              Except where explicitly agreed otherwise in a written Broker Agency Agreement, Chlonestone typically earns commission commissions paid directly by the property developers upon successful client bookings. Any additional administration fees, land department registration fees (e.g. DLD 4% tax), or agency charges will be disclosed transparently in official transaction documentation.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
              5. Intellectual Property
            </h2>
            <p>
              The logos, interface layouts, graphics, custom calculators, and written copy on this website are the intellectual property of Chlonestone. Developer logos, project renders, and blueprints are copyrighted by their respective master developers (Emaar, Sobha, DAMAC, Nakheel, Omniyat) and are displayed for marketing purposes.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
              6. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms & Conditions are governed by and construed in accordance with the laws of the Emirate of Dubai and the federal laws of the United Arab Emirates. Any disputes arising out of the use of this portal or brokerage activities fall under the exclusive jurisdiction of the competent courts of Dubai.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
