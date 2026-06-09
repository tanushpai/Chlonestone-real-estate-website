import { locations } from "@/data/locations";

export default function FeaturedLocations() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="text-4xl font-bold">
        Featured Locations
      </h2>

      <p className="mt-2 text-gray-500">
        Explore Dubai's top investment destinations
      </p>

      <div className="grid md:grid-cols-4 gap-6 mt-10">
        {locations.map((location) => (
          <div
            key={location.id}
            className="overflow-hidden rounded-2xl shadow hover:shadow-xl transition"
          >
            <div className="relative h-80">
             <img
                src={location.image}
                alt={location.name}
                className="h-full w-full object-cover"
             />
            </div>

            <div className="p-4">
              <h3 className="text-xl font-semibold">
                {location.name}
              </h3>

              <p className="text-gray-500">
                {location.properties}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}