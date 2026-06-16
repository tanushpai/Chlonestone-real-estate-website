export interface Community {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  image: string;
  avgPrice: string;
  rentalYield: string;
  growth: string;
  popularFor: string;
  description: string;
  highlights: string[];
  driveTimes: { location: string; time: string }[];
}

export const communities: Community[] = [
  {
    id: 1,
    slug: "downtown-dubai",
    name: "Downtown Dubai",
    tagline: "The Centre of Now — Home to Burj Khalifa and Dubai Mall.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
    avgPrice: "AED 2,800,000",
    rentalYield: "6.8%",
    growth: "YoY +11.2%",
    popularFor: "Luxury Apartments & Penthouses",
    description: "Downtown Dubai is an upscale and bustling central district, home to Dubai's most celebrated landmarks including the iconic Burj Khalifa, the spectacular Dubai Fountain, and the mammoth Dubai Mall. Known for its sophisticated high-rise living, urban plazas, luxury hotels, and high-end dining spots, it represents the epitome of metropolitan luxury in the Middle East.",
    highlights: ["Burj Khalifa Views", "Direct Mall Access", "Opera District", "Fine Dining Boulevard"],
    driveTimes: [
      { location: "Dubai Mall", time: "Walking Distance" },
      { location: "Dubai Airport (DXB)", time: "15 mins" },
      { location: "Dubai Marina", time: "20 mins" }
    ]
  },
  {
    id: 2,
    slug: "dubai-marina",
    name: "Dubai Marina",
    tagline: "Vibrant waterfront promenade with spectacular skyscrapers.",
    image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745",
    avgPrice: "AED 2,200,000",
    rentalYield: "7.2%",
    growth: "YoY +8.5%",
    popularFor: "Waterfront Condos & Sky-Villas",
    description: "Dubai Marina is a premium residential community known for its high-rise architectural marvels and beautiful marine lifestyle. Centered around a 3km long artificial canal, residents enjoy premium yachts, a massive shopping mall, outdoor fitness areas, sand beaches, and a vibrant night scene with endless restaurants and cafes lining the waterfront boardwalk.",
    highlights: ["Waterfront Promenade", "Beach Access", "Yacht Club Marina", "Metro Connectivity"],
    driveTimes: [
      { location: "JBR Beach", time: "5 mins" },
      { location: "Palm Jumeirah", time: "10 mins" },
      { location: "Dubai Airport (DXB)", time: "25 mins" }
    ]
  },
  {
    id: 3,
    slug: "palm-jumeirah",
    name: "Palm Jumeirah",
    tagline: "The world-famous man-made island luxury retreat.",
    image: "https://images.unsplash.com/photo-1546412414-8035e1776c9a",
    avgPrice: "AED 6,500,000",
    rentalYield: "5.5%",
    growth: "YoY +15.4%",
    popularFor: "Ultra-Luxury Villas & Beachfront Condos",
    description: "Palm Jumeirah is a globally recognized engineering wonder, shaped like a stylized palm tree extending into the Arabian Gulf. It hosts some of the world's most luxurious resorts (including Atlantis), beachfront mansions, private yacht clubs, and elite dining destinations. It offers an exclusive resort-like lifestyle unmatched anywhere in the world.",
    highlights: ["Private Beaches", "Atlantis & The Pointe", "Marina Yacht Docks", "5-Star Resorts"],
    driveTimes: [
      { location: "Nakheel Mall", time: "2 mins" },
      { location: "Downtown Dubai", time: "20 mins" },
      { location: "Dubai Airport (DXB)", time: "25 mins" }
    ]
  },
  {
    id: 4,
    slug: "ras-al-khor",
    name: "Ras Al Khor",
    tagline: "Scenic waterfront community bordering the wildlife sanctuary.",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090",
    avgPrice: "AED 1,400,000",
    rentalYield: "7.8%",
    growth: "YoY +9.8%",
    popularFor: "Modern Apartments & Townhouses",
    description: "Ras Al Khor is a rapidly expanding modern residential district nestled alongside the tranquil Ras Al Khor Wildlife Sanctuary, famous for its pink flamingos. Featuring brand new developments like Sobha Hartland, this neighborhood combines green natural spaces with state-of-the-art residential complexes, retail parks, and immediate highways connectivity.",
    highlights: ["Wildlife Sanctuary Sanctuary", "Sobha Golf Course", "International Schools", "Central Location"],
    driveTimes: [
      { location: "Wildlife Sanctuary", time: "3 mins" },
      { location: "Downtown Dubai", time: "10 mins" },
      { location: "Dubai Airport (DXB)", time: "12 mins" }
    ]
  },
  {
    id: 5,
    slug: "dubailand",
    name: "Dubailand",
    tagline: "Massive family-friendly entertainment and villa hub.",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b",
    avgPrice: "AED 2,500,000",
    rentalYield: "7.5%",
    growth: "YoY +10.2%",
    popularFor: "Gated Townhouse & Villa Communities",
    description: "Dubailand is a vast residential, hospitality, and entertainment zone developed by Dubai Holding. Popular for its large-scale gated villa communities (such as DAMAC Lagoons and Mudon), it offers residents tranquil suburban living with lush parks, golf courses, community centers, schools, and extensive sports infrastructure, making it perfect for families.",
    highlights: ["Gated Communities", "Theme Parks & Sports", "Community Centers", "Spacious Gardens"],
    driveTimes: [
      { location: "Global Village", time: "10 mins" },
      { location: "Downtown Dubai", time: "25 mins" },
      { location: "Dubai Airport (DXB)", time: "25 mins" }
    ]
  }
];
