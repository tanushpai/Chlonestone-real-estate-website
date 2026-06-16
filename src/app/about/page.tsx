import Image from "next/image";
import Link from "next/link";
import { Award, ShieldCheck, HeartHandshake, Compass, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us | Chlonestone Real Estate",
  description: "Learn about Chlonestone, a premier boutique real estate brokerage in Dubai specializing in luxury off-plan properties.",
};

const leaders = [
  {
    name: "Tanus M. Chlones",
    role: "Founder & Chief Executive Officer",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
    linkedin: "#"
  },
  {
    name: "Sarah Jenkins",
    role: "Managing Director - Off-Plan Portfolio",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    linkedin: "#"
  },
  {
    name: "Omar Al-Fayed",
    role: "Head of Investment Advisory",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
    linkedin: "#"
  }
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-16 lg:pt-32 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12 sm:space-y-16">
          
          {/* Hero Strip Section */}
          <section className="relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden bg-slate-900 flex items-center p-6 sm:p-12">
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"
              alt="Chlonestone office tower"
              fill
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
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

          {/* By the Numbers Stats Strip */}
          <section className="bg-slate-50 border rounded-3xl p-6 sm:p-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center mb-8">
              Key Milestones & Numbers
            </h3>
            <dl className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <dt className="text-2xl sm:text-4xl font-extrabold text-slate-900">8+ Years</dt>
                <dd className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">In Dubai Market</dd>
              </div>
              <div className="text-center border-l border-slate-200">
                <dt className="text-2xl sm:text-4xl font-extrabold text-primary">AED 12B+</dt>
                <dd className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Transaction Volume</dd>
              </div>
              <div className="text-center border-l border-slate-200">
                <dt className="text-2xl sm:text-4xl font-extrabold text-slate-900">15k+</dt>
                <dd className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Clients Served</dd>
              </div>
              <div className="text-center border-l border-slate-200">
                <dt className="text-2xl sm:text-4xl font-extrabold text-emerald-600">97.8%</dt>
                <dd className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">On-Time ROI Delivery</dd>
              </div>
            </dl>
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

          {/* Leadership Section */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold font-heading text-slate-900 sm:text-3xl">Executive Leadership</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Meet our directors and senior advisors.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {leaders.map((leader, idx) => (
                <div key={idx} className="group overflow-hidden rounded-3xl border bg-white shadow-sm flex flex-col">
                  <div className="relative h-64 w-full bg-slate-100">
                    <Image
                      src={leader.image}
                      alt={`${leader.name}, ${leader.role}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{leader.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{leader.role}</p>
                    </div>
                    <Link href={leader.linkedin} className="inline-flex items-center gap-1.5 text-xs text-primary font-bold">
                      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9H7.12v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7h-3.56V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/>
                      </svg>
                      LinkedIn
                    </Link>
                  </div>
                </div>
              ))}
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
                <p className="mt-0.5">RERA registration certificate number 194857</p>
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
              <Link href="tel:+971526238780">
                <Button variant="outline" className="rounded-xl px-5 bg-white">Talk to Specialist</Button>
              </Link>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
