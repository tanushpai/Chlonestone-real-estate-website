export default function Hero() {
  return (
    <section className="relative h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6">
        <h1 className="max-w-4xl text-5xl md:text-7xl font-bold">
          Discover Dubai's Best Off-Plan Projects
        </h1>

        <p className="mt-6 max-w-2xl text-lg md:text-xl">
          Explore premium investment opportunities from Dubai's leading developers.
        </p>
      </div>
    </section>
  );
}