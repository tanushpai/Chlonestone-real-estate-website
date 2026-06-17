export interface PaymentPlanMilestone {
  milestone: string;
  percentage: number;
}

export interface UnitMixItem {
  beds: string;
  sqftRange: string;
  priceRange: string;
  availability: number;
}

export interface DeveloperProfile {
  name: string;
  description: string;
  completedProjects: number;
  onTimeRate: string;
  logoUrl?: string;
}

export interface LocationHighlight {
  landmark: string;
  driveTime: string;
}

export interface Project {
  id: number;
  slug: string;
  name: string;
  developer: string;
  community: string;
  communityName?: string;
  location: string;
  address?: string | null;
  propertyType: string;
  startingPrice: string;
  handover: string;
  paymentPlan: string;
  image: string;
  images: string[];
  description: string;
  reraPermit: string;
  escrowNumber?: string | null;
  totalUnits: string;
  paymentPlanDetails: PaymentPlanMilestone[];
  unitMix: UnitMixItem[];
  amenities: string[];
  locationHighlights: LocationHighlight[];
  developerProfile: DeveloperProfile;
  coordinates: { lat: number; lng: number };
  agentId?: number | null;
  brochureUrl?: string | null;
  floorPlanUrl?: string | null;
  qrCodeUrl?: string | null;
  agent?: {
    id: number;
    name: string;
    phone: string;
    photoUrl: string;
    role: string;
  } | null;
}

export const projects: Project[] = [
  {
    id: 1,
    slug: "address-grand-downtown",
    name: "Address Grand Downtown",
    developer: "Emaar",
    community: "Downtown Dubai",
    location: "Dubai",
    propertyType: "Apartment",
    startingPrice: "AED 2,500,000",
    handover: "Q4 2028",
    paymentPlan: "80/20",
    image: "/projects/project1.jpg",
    images: [
      "/projects/project1.jpg",
      "/projects/project2.jpg",
      "/projects/project3.jpg",
      "/projects/project4.jpg",
    ],
    description: "Address Grand Downtown stands as a testament to ultra-luxury urban living. Developed by the master builder Emaar, this icon offers direct views of the Burj Khalifa, premium finishes, and direct access to Dubai Mall. Residents enjoy 5-star hotel amenities, signature spa facilities, infinity pools, and a dedicated concierge service, all set within the prestigious heart of Downtown Dubai.",
    reraPermit: "RERA-194857201",
    escrowNumber: "ESCROW-9948-2849",
    totalUnits: "420 Units",
    coordinates: { lat: 25.1972, lng: 55.2744 },
    paymentPlanDetails: [
      { milestone: "On Booking", percentage: 10 },
      { milestone: "During Construction (Easy Installments)", percentage: 70 },
      { milestone: "On Handover (Q4 2028)", percentage: 20 },
    ],
    unitMix: [
      { beds: "1 Bedroom", sqftRange: "750 - 900 SqFt", priceRange: "AED 2.5M - 3.1M", availability: 14 },
      { beds: "2 Bedrooms", sqftRange: "1,200 - 1,450 SqFt", priceRange: "AED 4.2M - 5.0M", availability: 8 },
      { beds: "3 Bedrooms", sqftRange: "1,800 - 2,100 SqFt", priceRange: "AED 6.8M - 8.2M", availability: 4 },
      { beds: "Penthouse", sqftRange: "3,500 - 4,800 SqFt", priceRange: "AED 15.0M+", availability: 2 },
    ],
    amenities: [
      "Infinity Swimming Pool",
      "Burj Khalifa View Deck",
      "State-of-the-art Gym",
      "Luxury Wellness Spa",
      "24/7 Concierge Services",
      "Direct Dubai Mall Access",
      "Kids Play Area & Club",
      "Fine Dining Restaurants",
    ],
    locationHighlights: [
      { landmark: "Dubai Mall", driveTime: "Direct Access" },
      { landmark: "Burj Khalifa / Opera District", driveTime: "3 mins" },
      { landmark: "Dubai International Airport (DXB)", driveTime: "15 mins" },
      { landmark: "Dubai Marina", driveTime: "20 mins" },
    ],
    developerProfile: {
      name: "Emaar Properties",
      description: "Emaar Properties is one of the world's most valuable and admired real estate development companies. Shaper of Dubai's skyline, Emaar is renowned for building the iconic Burj Khalifa and Dubai Mall.",
      completedProjects: 85000,
      onTimeRate: "97.4%",
    },
  },
  {
    id: 2,
    slug: "sobha-one",
    name: "Sobha One",
    developer: "Sobha",
    community: "Ras Al Khor",
    location: "Dubai",
    propertyType: "Apartment",
    startingPrice: "AED 1,300,000",
    handover: "Q2 2027",
    paymentPlan: "70/30",
    image: "/projects/project2.jpg",
    images: [
      "/projects/project2.jpg",
      "/projects/project1.jpg",
      "/projects/project3.jpg",
      "/projects/project4.jpg",
    ],
    description: "Sobha One is a masterpiece of modern architecture spanning five interconnected towers. Located in Sobha Hartland II, Ras Al Khor, the project features a world-class 18-hole pitch and putt golf course, sky gardens, and scenic waterfront views. Meticulously designed with Sobha's signature quality standards, every detail is engineered to perfection.",
    reraPermit: "RERA-204958172",
    escrowNumber: "ESCROW-8472-1049",
    totalUnits: "1,200 Units",
    coordinates: { lat: 25.1844, lng: 55.3522 },
    paymentPlanDetails: [
      { milestone: "On Booking", percentage: 10 },
      { milestone: "Under Construction", percentage: 60 },
      { milestone: "Upon Handover (Q2 2027)", percentage: 30 },
    ],
    unitMix: [
      { beds: "1 Bedroom", sqftRange: "680 - 820 SqFt", priceRange: "AED 1.3M - 1.6M", availability: 22 },
      { beds: "2 Bedrooms", sqftRange: "1,050 - 1,280 SqFt", priceRange: "AED 2.1M - 2.6M", availability: 15 },
      { beds: "3 Bedrooms", sqftRange: "1,500 - 1,800 SqFt", priceRange: "AED 3.2M - 3.9M", availability: 7 },
      { beds: "4 Bedrooms", sqftRange: "2,200 - 2,500 SqFt", priceRange: "AED 4.8M+", availability: 3 },
    ],
    amenities: [
      "18-Hole Pitch & Putt Golf Course",
      "Panoramic Sky Gardens",
      "Waterfront Promenade",
      "Running & Cycling Tracks",
      "Yoga & Meditation Deck",
      "Outdoor Cinema",
      "Fitness Center & Gym",
      "Pet-Friendly Parks",
    ],
    locationHighlights: [
      { landmark: "Ras Al Khor Wildlife Sanctuary", driveTime: "5 mins" },
      { landmark: "Downtown Dubai", driveTime: "10 mins" },
      { landmark: "Dubai International Airport (DXB)", driveTime: "12 mins" },
      { landmark: "Meydan Racecourse", driveTime: "8 mins" },
    ],
    developerProfile: {
      name: "Sobha Realty",
      description: "Sobha Realty is an international luxury developer committed to redefining the art of living through sustainable, backward-integrated master planning and top-tier craftsmanship.",
      completedProjects: 22000,
      onTimeRate: "99.1%",
    },
  },
  {
    id: 3,
    slug: "damac-lagoons",
    name: "DAMAC Lagoons",
    developer: "DAMAC",
    community: "Dubailand",
    location: "Dubai",
    propertyType: "Villa",
    startingPrice: "AED 2,900,000",
    handover: "Q3 2028",
    paymentPlan: "80/20",
    image: "/projects/project3.jpg",
    images: [
      "/projects/project3.jpg",
      "/projects/project4.jpg",
      "/projects/project1.jpg",
      "/projects/project2.jpg",
    ],
    description: "DAMAC Lagoons is a stunning water-inspired villa community located close to the charm of DAMAC Hills yet secluded in its own tropical paradise. Inspired by Mediterranean towns, the community is split into distinct clusters representing destinations like Santorini, Venice, and Nice. Enjoy crystal lagoons, sandy beaches, zip-lining, and premium clubhouses.",
    reraPermit: "RERA-293848123",
    escrowNumber: "ESCROW-7362-9284",
    totalUnits: "850 Villas",
    coordinates: { lat: 25.0204, lng: 55.2447 },
    paymentPlanDetails: [
      { milestone: "Booking Fee", percentage: 20 },
      { milestone: "During Construction", percentage: 60 },
      { milestone: "On Handover (Q3 2028)", percentage: 20 },
    ],
    unitMix: [
      { beds: "4 Bedroom Townhouse", sqftRange: "2,200 - 2,500 SqFt", priceRange: "AED 2.9M - 3.4M", availability: 18 },
      { beds: "5 Bedroom Villa", sqftRange: "3,200 - 3,800 SqFt", priceRange: "AED 4.5M - 5.2M", availability: 9 },
      { beds: "6 Bedroom Mansion", sqftRange: "5,000 - 7,200 SqFt", priceRange: "AED 8.5M - 12.0M", availability: 4 },
    ],
    amenities: [
      "Crystal Swimming Lagoons",
      "Artificial Sandy Beaches",
      "Water Cinema & Amphitheater",
      "Ziplining & Water Sports",
      "Boutique Retail & Dining",
      "Exclusive Wave Pools",
      "Luxury Yacht Club",
      "World-class Spa Facilities",
    ],
    locationHighlights: [
      { landmark: "DAMAC Hills Mall", driveTime: "5 mins" },
      { landmark: "Al Maktoum International Airport", driveTime: "20 mins" },
      { landmark: "Dubai Marina", driveTime: "25 mins" },
      { landmark: "Downtown Dubai", driveTime: "30 mins" },
    ],
    developerProfile: {
      name: "DAMAC Properties",
      description: "DAMAC Properties has been at the forefront of the Middle East's luxury real estate market since 2002, delivering award-winning residential, commercial, and leisure properties.",
      completedProjects: 46000,
      onTimeRate: "92.8%",
    },
  },
];