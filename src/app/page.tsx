import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import SearchBar from "@/components/home/SearchBar";
import FeaturedLocations from "@/components/home/FeaturedLocations";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <div className="relative">
          <Hero />
          <SearchBar />
        </div>

        <FeaturedLocations />
      </main>
    </>
  );
}