"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDbLocations, DbLocation } from "@/lib/dataService";

export default function FeaturedLocations() {
  const router = useRouter();
  const [locations, setLocations] = useState<DbLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDbLocations().then((data) => {
      setLocations(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-semibold font-heading tracking-tight text-slate-200 animate-pulse">
              Loading Locations...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  if (locations.length === 0) return null;

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-semibold font-heading tracking-tight text-foreground">
            Featured Locations
          </h2>

          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Explore Dubai's top investment destinations.
          </p>
        </div>

        <div className="grid gap-6 mt-10 md:grid-cols-2 xl:grid-cols-4">
          {locations.map((location) => (
            <div
              key={location.id}
              onClick={() => router.push(`/projects?query=${encodeURIComponent(location.name)}`)}
              className="overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl cursor-pointer"
            >
              <div className="relative h-72">
                <img
                  src={location.image}
                  alt={location.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-5">
                <h3 className="text-xl font-semibold font-heading text-foreground">
                  {location.name}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {location.properties}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}