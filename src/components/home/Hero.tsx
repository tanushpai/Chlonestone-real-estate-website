export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c')",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/10 to-slate-950/80" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6">
        <p className="mb-4 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/90">
          Invest in Dubai's Most Promising Off-Plan Properties
        </p>

        <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-white md:text-7xl font-heading">
          Your Gateway to Dubai's Next Investment Opportunity
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 md:text-xl">
          Explore premium investment opportunities from Dubai's leading developers.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/80">
            Explore Projects
          </span>
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/80">
            Get Expert Advice
          </span>
        </div>
      </div>
    </section>
  );
}