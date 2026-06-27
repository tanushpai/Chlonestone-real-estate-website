import Image from "next/image";
import Link from "next/link";
import { Award, ShieldCheck, HeartHandshake, Compass, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us | Chlonestone Real Estate",
  description: "Learn about Chlonestone, a premier boutique real estate brokerage in Dubai specializing in luxury off-plan properties.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-16 lg:pt-32 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12 sm:space-y-16">
          
          {/* Hero Strip Section */}
          <section className="relative h-64 sm:h-80 w-full rounded-none overflow-hidden bg-slate-950 flex items-center p-6 sm:p-12 border border-slate-800">
            <div className="absolute inset-y-0 right-0 w-full sm:w-1/2 h-full z-0">
              <Image
                src="/Chlonestone_logo.png"
                alt="Chlonestone logo background"
                fill
                className="object-contain object-right p-6 sm:p-12"
              />
            </div>
            <div className="relative z-10 max-w-xl text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Corporate Profile
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white mt-2">
                About Chlonestone
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
                A premier boutique brokerage specializing in premium, high-yield off-plan developments and luxury residences across Dubai's most prestigious locations.
              </p>
            </div>
          </section>

          {/* Story & Mission Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-heading text-slate-900 sm:text-3xl">
                Redefining Luxury Brokerage
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Founded with a mission to bring institutional-grade investment logic to individual buyers, Chlonestone guides global investors and homeowners through Dubai's dynamic property landscape. We specialize in vetting pre-construction projects, comparing cash flows, and negotiating flexible payment plans.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Unlike volume-driven firms, we act as specialized advisors. We curate off-plan properties from top developers like Emaar, Sobha, and DAMAC, selecting only those with verified escrow compliance, solid developer reserves, and strong capital appreciation potential.
              </p>
            </div>
            
            {/* Story Picture */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-3xl border">
              <Image 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
                alt="Advisors discussing plans"
                fill
                className="object-cover"
              />
            </div>
          </section>

          {/* Core Values Section */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold font-heading text-slate-900 sm:text-3xl">Our Core Values</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">The principles guiding every client relationship.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 border rounded-3xl bg-white shadow-sm space-y-3">
                <div className="h-10 w-10 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-slate-900">Uncompromising Integrity</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We show the full picture. From construction risks to RERA validation checks, transparency comes first.
                </p>
              </div>

              <div className="p-6 border rounded-3xl bg-white shadow-sm space-y-3">
                <div className="h-10 w-10 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-slate-900">Advisory Partnership</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We don't sell; we consult. We help evaluate cash plans, exit margins, and payment milestones.
                </p>
              </div>

              <div className="p-6 border rounded-3xl bg-white shadow-sm space-y-3">
                <div className="h-10 w-10 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                  <Award className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-slate-900">Execution Excellence</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We secure priority developer inventory allocations and navigate local regulations seamlessly.
                </p>
              </div>
            </div>
          </section>

          {/* Credentials Credentials */}
          <section className="flex flex-col sm:flex-row justify-between gap-6 p-6 sm:p-8 bg-slate-50 border rounded-3xl text-slate-500 text-xs">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Licensed Brokerage</p>
                <p className="mt-0.5">RERA registration certificate number 91442</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Dubai Land Department</p>
                <p className="mt-0.5">Licensed permit registrar & escrow operator</p>
              </div>
            </div>
          </section>

          {/* CTA Band */}
          <section className="text-center py-12 border-t space-y-4">
            <h3 className="text-2xl font-bold font-heading text-slate-900">Want to join or work with us?</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Our specialists are ready to help you plan your portfolio allocations or discuss joining our advisory team.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link href="/projects">
                <Button className="rounded-xl px-5 bg-[#111827] text-white">Explore Projects</Button>
              </Link>
              <a 
                href="https://wa.me/971503483366?text=Hello!%20I%20would%20like%20to%20contact%20you%20about%20real%20estate%20services." 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="rounded-xl px-5 bg-white">Talk to Specialist</Button>
              </a>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
