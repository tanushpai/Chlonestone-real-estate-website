import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { communities } from "../src/data/communities";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Cleaning database...");
  await prisma.lead.deleteMany();
  await prisma.project.deleteMany();
  await prisma.community.deleteMany();
  await prisma.developer.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.subscriber.deleteMany();

  console.log("Seeding settings...");
  await prisma.setting.create({
    data: {
      id: 1,
      guideUrl: "/uploads/dubai-off-plan-investor-guide-2026.pdf",
      welcomeSubject: "Welcome to Chlonestone Newsletter!",
      welcomeBody: "Thank you for subscribing to the Chlonestone newsletter. You will receive immediate updates on premium off-plan launches, ROI projections, and waterfront inventory allocations in Dubai.",
      guideSubject: "Download: Dubai Off-Plan Investor Guide 2026",
      guideBody: "Thank you for requesting the Dubai Off-Plan Investor Guide 2026. You can download the booklet directly using this link: {{GUIDE_URL}}",
      inquirySubject: "Thank you for contacting Chlonestone Real Estate",
      inquiryBody: 'Hello {{CLIENT_NAME}},\n\nThank you for reaching out to Chlonestone. We have received your inquiry regarding "{{PROJECT_NAME}}" and one of our premier real estate advisors will connect with you shortly.',
    }
  });

  const adminEmail = (process.env.ADMIN_EMAIL || "info@chlonestone.com").toLowerCase();
  const adminName = process.env.ADMIN_NAME || "ADMIN";
  const adminPhone = process.env.ADMIN_PHONE || "+971526238780";
  const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  console.log(`Seeding admin agent: ${adminName} (${adminEmail})...`);
  const adminAgent = await prisma.agent.create({
    data: {
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
      role: "Sales Director",
      systemRole: "ADMIN",
      password: hashedPassword
    }
  });

  if (process.env.SEED_MOCK_DATA === "true") {
    console.log("SEED_MOCK_DATA is active. Seeding mock developers...");
    const developersToSeed = [
      {
        slug: "emaar",
        name: "Emaar Properties",
        description: "Emaar Properties is one of the world's most valuable and admired real estate development companies, famous for the Burj Khalifa and Dubai Mall.",
        completedProjects: 85000,
        onTimeRate: "97.4%",
        logoUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c05"
      },
      {
        slug: "sobha",
        name: "Sobha Realty",
        description: "Sobha Realty is an international luxury developer committed to redefining the art of living with sustainable, premium master-planned communities.",
        completedProjects: 22000,
        onTimeRate: "99.1%",
        logoUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c05"
      },
      {
        slug: "damac",
        name: "DAMAC Properties",
        description: "DAMAC Properties has been at the forefront of the Middle East's luxury real estate market since 2002, delivering award-winning developments.",
        completedProjects: 46000,
        onTimeRate: "92.8%",
        logoUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c05"
      },
      {
        slug: "nakheel",
        name: "Nakheel PJSC",
        description: "Nakheel is a world-leading master developer whose innovative landmark projects, like Palm Jumeirah, have redefined Dubai's coastal skyline.",
        completedProjects: 15000,
        onTimeRate: "94.5%",
        logoUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c05"
      },
      {
        slug: "omniyat",
        name: "Omniyat Group",
        description: "Omniyat is a privately held real estate developer in the Gulf Region, globally renowned for architectural masterpieces like The Opus.",
        completedProjects: 3200,
        onTimeRate: "98.2%",
        logoUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c05"
      }
    ];

    for (const d of developersToSeed) {
      await prisma.developer.create({ data: d });
    }

    console.log("Seeding mock agents...");
    const seededAgents = [
      {
        name: "Elena Rostova",
        email: "elena@chlonestone.com",
        phone: "+971507654321",
        photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
        role: "Senior Consultant",
        systemRole: "AGENT",
        password: hashedPassword
      },
      {
        name: "Sarah Connor",
        email: "sarah@chlonestone.com",
        phone: "+971509998888",
        photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
        role: "Palm Jumeirah Specialist",
        systemRole: "AGENT",
        password: hashedPassword
      },
      {
        name: "Marcus Vance",
        email: "marcus@chlonestone.com",
        phone: "+971505556677",
        photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
        role: "Investment Advisor",
        systemRole: "AGENT",
        password: hashedPassword
      },
      {
        name: "Chloe Zhang",
        email: "chloe@chlonestone.com",
        phone: "+971503334455",
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        role: "Luxury Villa Consultant",
        systemRole: "AGENT",
        password: hashedPassword
      }
    ];

    const agents = [adminAgent];
    for (const a of seededAgents) {
      const agent = await prisma.agent.create({ data: a });
      agents.push(agent);
    }

    console.log("Seeding mock communities...");
    for (const c of communities) {
      await prisma.community.create({
        data: {
          id: c.id,
          slug: c.slug,
          name: c.name,
          tagline: c.tagline,
          image: c.image,
          avgPrice: c.avgPrice,
          rentalYield: c.rentalYield,
          growth: c.growth,
          popularFor: c.popularFor,
          description: c.description,
          highlights: c.highlights,
          driveTimes: c.driveTimes,
        },
      });
    }

    console.log("Seeding mock 11 projects...");
    const projectsData = [
      {
        id: 1,
        slug: "address-grand-downtown",
        name: "Address Grand Downtown",
        developer: "Emaar Properties",
        communityName: "Downtown Dubai",
        location: "Downtown Dubai, Dubai",
        address: "Sheikh Mohammed bin Rashid Blvd, Downtown Dubai",
        propertyType: "Apartment",
        startingPrice: "AED 2,500,000",
        handover: "Q4 2028",
        paymentPlan: "80/20",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c05",
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c05",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
        ],
        description: "Address Grand Downtown stands as a testament to ultra-luxury urban living. Developed by the master builder Emaar, this icon offers direct views of the Burj Khalifa, premium finishes, and direct access to Dubai Mall. Residents enjoy 5-star hotel amenities, signature spa facilities, infinity pools, and a dedicated concierge service, all set within the prestigious heart of Downtown Dubai.",
        reraPermit: "RERA-194857201",
        escrowNumber: "ESCROW-9948-2849",
        totalUnits: "420 Units",
        coordinates: { lat: 25.1972, lng: 55.2744 },
        paymentPlanDetails: [
          { milestone: "On Booking", percentage: 10 },
          { milestone: "During Construction", percentage: 70 },
          { milestone: "On Handover", percentage: 20 },
        ],
        unitMix: [
          { beds: "1 Bedroom", sqftRange: "750 - 900 SqFt", priceRange: "AED 2.5M - 3.1M", availability: 14 },
          { beds: "2 Bedrooms", sqftRange: "1200 - 1450 SqFt", priceRange: "AED 4.2M - 5.0M", availability: 8 },
        ],
        amenities: ["Infinity Pool", "Burj Khalifa View Deck", "Spa", "Concierge Service"],
        locationHighlights: [{ landmark: "Burj Khalifa", driveTime: "3 mins" }],
        developerProfile: { name: "Emaar Properties", description: "Master builder", completedProjects: 85000, onTimeRate: "97.4%" }
      },
      {
        id: 2,
        slug: "sobha-one",
        name: "Sobha One",
        developer: "Sobha Realty",
        communityName: "Ras Al Khor",
        location: "Ras Al Khor, Dubai",
        address: "Sobha Hartland II, Ras Al Khor Road, Dubai",
        propertyType: "Apartment",
        startingPrice: "AED 1,300,000",
        handover: "Q2 2027",
        paymentPlan: "70/30",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c05",
        ],
        description: "Sobha One is a masterpiece of modern architecture spanning five interconnected towers. Located in Sobha Hartland II, Ras Al Khor, the project features a world-class 18-hole pitch and putt golf course, sky gardens, and scenic waterfront views. Meticulously designed with Sobha's signature quality standards, every detail is engineered to perfection.",
        reraPermit: "RERA-204958172",
        escrowNumber: "ESCROW-8472-1049",
        totalUnits: "1200 Units",
        coordinates: { lat: 25.1844, lng: 55.3522 },
        paymentPlanDetails: [
          { milestone: "On Booking", percentage: 10 },
          { milestone: "During Construction", percentage: 60 },
          { milestone: "On Handover", percentage: 30 },
        ],
        unitMix: [
          { beds: "1 Bedroom", sqftRange: "680 - 820 SqFt", priceRange: "AED 1.3M - 1.6M", availability: 22 },
        ],
        amenities: ["18-Hole Pitch & Putt Golf Course", "Waterfront Promenade", "Sky Gardens"],
        locationHighlights: [{ landmark: "Downtown Dubai", driveTime: "10 mins" }],
        developerProfile: { name: "Sobha Realty", description: "Premium developer", completedProjects: 22000, onTimeRate: "99.1%" }
      },
      {
        id: 3,
        slug: "damac-lagoons",
        name: "DAMAC Lagoons",
        developer: "DAMAC Properties",
        communityName: "Dubailand",
        location: "Hessa St, Dubailand, Dubai",
        address: "DAMAC Lagoons Community, Hessa Street, Dubai",
        propertyType: "Villa",
        startingPrice: "AED 2,900,000",
        handover: "Q3 2028",
        paymentPlan: "80/20",
        image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
        images: [
          "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c05",
        ],
        description: "DAMAC Lagoons is a stunning water-inspired villa community located close to the charm of DAMAC Hills yet secluded in its own tropical paradise. Inspired by Mediterranean towns, the community is split into distinct clusters representing destinations like Santorini, Venice, and Nice. Enjoy crystal lagoons, sandy beaches, zip-lining, and premium clubhouses.",
        reraPermit: "RERA-293848123",
        escrowNumber: "ESCROW-7362-9284",
        totalUnits: "850 Villas",
        coordinates: { lat: 25.0204, lng: 55.2447 },
        paymentPlanDetails: [
          { milestone: "On Booking", percentage: 20 },
          { milestone: "During Construction", percentage: 60 },
          { milestone: "On Handover", percentage: 20 },
        ],
        unitMix: [
          { beds: "4 Bedroom Townhouse", sqftRange: "2200 - 2500 SqFt", priceRange: "AED 2.9M - 3.4M", availability: 18 },
        ],
        amenities: ["Crystal Swimming Lagoons", "Wave Pools", "Yacht Club"],
        locationHighlights: [{ landmark: "Dubai Marina", driveTime: "25 mins" }],
        developerProfile: { name: "DAMAC Properties", description: "Luxury developer", completedProjects: 46000, onTimeRate: "92.8%" }
      },
      {
        id: 4,
        slug: "palm-beach-towers",
        name: "Palm Beach Towers",
        developer: "Nakheel PJSC",
        communityName: "Palm Jumeirah",
        location: "Gateway, Palm Jumeirah, Dubai",
        address: "Palm Gateway, Entrance of Palm Jumeirah, Dubai",
        propertyType: "Apartment",
        startingPrice: "AED 3,700,000",
        handover: "Q1 2026",
        paymentPlan: "60/40",
        image: "https://images.unsplash.com/photo-1540518614846-7eded433c457",
        images: [
          "https://images.unsplash.com/photo-1540518614846-7eded433c457",
        ],
        description: "Palm Beach Towers by Nakheel is a new luxury high-rise development at the gateway to Palm Jumeirah. Offering stunning views of the Dubai Marina skyline and the Arabian Gulf, this project combines high-end beachfront living with outstanding fitness, leisure, and lifestyle spaces.",
        reraPermit: "RERA-994828103",
        escrowNumber: "ESCROW-1094-8827",
        totalUnits: "600 Units",
        coordinates: { lat: 25.0995, lng: 55.1502 },
        paymentPlanDetails: [
          { milestone: "Down Payment", percentage: 15 },
          { milestone: "During Construction", percentage: 45 },
          { milestone: "Upon Completion", percentage: 40 },
        ],
        unitMix: [
          { beds: "2 Bedrooms", sqftRange: "1350 - 1600 SqFt", priceRange: "AED 3.7M - 4.5M", availability: 11 },
        ],
        amenities: ["Private Beach Access", "Sky Lounge", "Infinity Edge Pool"],
        locationHighlights: [{ landmark: "Nakheel Mall", driveTime: "5 mins" }],
        developerProfile: { name: "Nakheel PJSC", description: "Master developer", completedProjects: 15000, onTimeRate: "94.5%" }
      },
      {
        id: 5,
        slug: "the-opus-residences",
        name: "The Opus Residences",
        developer: "Omniyat Group",
        communityName: "Downtown Dubai",
        location: "Business Bay / Downtown, Dubai",
        address: "Al A'amal St, Business Bay, Dubai",
        propertyType: "Apartment",
        startingPrice: "AED 4,800,000",
        handover: "Completed",
        paymentPlan: "100",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        ],
        description: "Designed by the late Dame Zaha Hadid, The Opus is a signature architectural masterpiece that houses ME Hotel and ultra-luxury serviced apartments. This iconic cube with a free-form void offers bespoke furniture, premium smart systems, and unmatched design prestige in the Downtown/Business Bay corridor.",
        reraPermit: "RERA-883710294",
        escrowNumber: null,
        totalUnits: "96 Units",
        coordinates: { lat: 25.1878, lng: 55.2678 },
        paymentPlanDetails: [
          { milestone: "On Booking", percentage: 100 },
        ],
        unitMix: [
          { beds: "2 Bedrooms", sqftRange: "1600 - 1900 SqFt", priceRange: "AED 4.8M - 6.2M", availability: 3 },
        ],
        amenities: ["Zaha Hadid Signature Design", "24/7 Valet & Butler Service", "ME Hotel Spa & Pool"],
        locationHighlights: [{ landmark: "Burj Khalifa / Downtown Dubai", driveTime: "5 mins" }],
        developerProfile: { name: "Omniyat Group", description: "Architectural masterpiece designer", completedProjects: 3200, onTimeRate: "98.2%" }
      },
      {
        id: 6,
        slug: "emaar-beachfront-palace",
        name: "Palace Residences Beachfront",
        developer: "Emaar Properties",
        communityName: "Dubai Marina",
        location: "Emaar Beachfront, Dubai Marina, Dubai",
        address: "Palace Residences Tower, Emaar Beachfront, Dubai Marina",
        propertyType: "Apartment",
        startingPrice: "AED 3,100,000",
        handover: "Q1 2027",
        paymentPlan: "80/20",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
        ],
        description: "Palace Residences at Emaar Beachfront offers hotel-branded apartments with direct private beach access, premium finishings, and breathtaking panoramic views of the Dubai Marina skyline and the open sea.",
        reraPermit: "RERA-229402948",
        escrowNumber: "ESCROW-2938-1123",
        totalUnits: "350 Units",
        coordinates: { lat: 25.0922, lng: 55.1388 },
        paymentPlanDetails: [
          { milestone: "On Booking", percentage: 10 },
          { milestone: "During Construction", percentage: 70 },
          { milestone: "On Handover", percentage: 20 },
        ],
        unitMix: [
          { beds: "1 Bedroom", sqftRange: "800 - 950 SqFt", priceRange: "AED 3.1M - 3.7M", availability: 6 },
          { beds: "2 Bedrooms", sqftRange: "1250 - 1500 SqFt", priceRange: "AED 4.9M - 5.8M", availability: 4 },
        ],
        amenities: ["Private Beach Access", "Branded Hotel Service", "Marina Horizon Infinity Pool"],
        locationHighlights: [{ landmark: "JBR Beach", driveTime: "5 mins" }],
        developerProfile: { name: "Emaar Properties", description: "Master builder", completedProjects: 85000, onTimeRate: "97.4%" }
      },
      {
        id: 7,
        slug: "sobha-hartland-greens",
        name: "Hartland Greens",
        developer: "Sobha Realty",
        communityName: "Ras Al Khor",
        location: "Sobha Hartland, Ras Al Khor, Dubai",
        address: "Hartland Greens Building 3, Sobha Hartland, Dubai",
        propertyType: "Apartment",
        startingPrice: "AED 1,100,000",
        handover: "Completed",
        paymentPlan: "100",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
        images: [
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
        ],
        description: "Hartland Greens is a stunning collection of luxury apartments overlooking the Dubai Canal and lush green parklands in Sobha Hartland. Perfect for professionals and families looking for clean luxury craftsmanship.",
        reraPermit: "RERA-883710293",
        escrowNumber: null,
        totalUnits: "180 Units",
        coordinates: { lat: 25.1852, lng: 55.3378 },
        paymentPlanDetails: [
          { milestone: "100% upfront payment", percentage: 100 },
        ],
        unitMix: [
          { beds: "Studio", sqftRange: "520 - 600 SqFt", priceRange: "AED 1.1M - 1.3M", availability: 4 },
          { beds: "1 Bedroom", sqftRange: "850 - 980 SqFt", priceRange: "AED 1.6M - 1.9M", availability: 2 },
        ],
        amenities: ["Hartland Boulevard Retail", "International Schools", "Central Park Access"],
        locationHighlights: [{ landmark: "Hartland International School", driveTime: "1 min" }],
        developerProfile: { name: "Sobha Realty", description: "Premium developer", completedProjects: 22000, onTimeRate: "99.1%" }
      },
      {
        id: 8,
        slug: "damac-hills-2-villas",
        name: "DAMAC Hills 2 - Camelia",
        developer: "DAMAC Properties",
        communityName: "Dubailand",
        location: "Al Qudra Road, Dubailand, Dubai",
        address: "Camelia Cluster, DAMAC Hills 2, Dubai",
        propertyType: "Villa",
        startingPrice: "AED 1,500,000",
        handover: "Q3 2026",
        paymentPlan: "60/40",
        image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
        images: [
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
        ],
        description: "Camelia at DAMAC Hills 2 offers modern townhouses and villas built with community-oriented sports amenities, fishing lakes, go-karting tracks, and massive central parks in a peaceful desert oasis.",
        reraPermit: "RERA-293849182",
        escrowNumber: "ESCROW-9847-1930",
        totalUnits: "480 Villas",
        coordinates: { lat: 24.9450, lng: 55.3400 },
        paymentPlanDetails: [
          { milestone: "Down Payment", percentage: 10 },
          { milestone: "During Construction", percentage: 50 },
          { milestone: "Upon Completion", percentage: 40 },
        ],
        unitMix: [
          { beds: "3 Bedroom Townhouse", sqftRange: "1900 - 2200 SqFt", priceRange: "AED 1.5M - 1.8M", availability: 19 },
        ],
        amenities: ["Water Town Waterpark", "Go-Karting Track", "Community Paintball Field"],
        locationHighlights: [{ landmark: "Outlet Mall", driveTime: "15 mins" }],
        developerProfile: { name: "DAMAC Properties", description: "Luxury developer", completedProjects: 46000, onTimeRate: "92.8%" }
      },
      {
        id: 9,
        slug: "palm-flower-residences",
        name: "Palm Flower Residences",
        developer: "Nakheel PJSC",
        communityName: "Palm Jumeirah",
        location: "West Crescent, Palm Jumeirah, Dubai",
        address: "West Crescent plot, Palm Jumeirah, Dubai",
        propertyType: "Villa",
        startingPrice: "AED 12,000,000",
        handover: "Q4 2027",
        paymentPlan: "50/50",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
        ],
        description: "Palm Flower Residences is an ultra-exclusive collection of signature villas and luxury penthouses located on the private beachfront of the Palm Jumeirah's crescent, featuring custom interiors, high ceilings, and private pools.",
        reraPermit: "RERA-994828109",
        escrowNumber: "ESCROW-1928-3384",
        totalUnits: "12 Villas",
        coordinates: { lat: 25.1322, lng: 55.1095 },
        paymentPlanDetails: [
          { milestone: "On Booking", percentage: 20 },
          { milestone: "During Construction", percentage: 30 },
          { milestone: "On Handover", percentage: 50 },
        ],
        unitMix: [
          { beds: "5 Bedroom Villa", sqftRange: "6500 - 8200 SqFt", priceRange: "AED 12.0M - 15.5M", availability: 2 },
        ],
        amenities: ["Private Sandy Beach Frontage", "Custom Cinema Room", "Elevator & Smart Home Control"],
        locationHighlights: [{ landmark: "Atlantis The Royal", driveTime: "5 mins" }],
        developerProfile: { name: "Nakheel PJSC", description: "Master developer", completedProjects: 15000, onTimeRate: "94.5%" }
      },
      {
        id: 10,
        slug: "marina-sands-emaar",
        name: "Marina Sands",
        developer: "Emaar Properties",
        communityName: "Dubai Marina",
        location: "Dubai Marina Promenade, Dubai",
        address: "Marina Promenade Tower A, Dubai Marina, Dubai",
        propertyType: "Apartment",
        startingPrice: "AED 2,100,000",
        handover: "Q4 2026",
        paymentPlan: "80/20",
        image: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b",
        images: [
          "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b",
        ],
        description: "Marina Sands by Emaar features stylish waterfront apartments along the Marina Boardwalk. Enjoy quick strolls to fine-dining outlets, upscale retail boutiques, and JBR beach access, backed by Emaar's quality promise.",
        reraPermit: "RERA-229402949",
        escrowNumber: "ESCROW-2938-1124",
        totalUnits: "280 Units",
        coordinates: { lat: 25.0768, lng: 55.1312 },
        paymentPlanDetails: [
          { milestone: "On Booking", percentage: 10 },
          { milestone: "During Construction", percentage: 70 },
          { milestone: "On Handover", percentage: 20 },
        ],
        unitMix: [
          { beds: "1 Bedroom", sqftRange: "720 - 850 SqFt", priceRange: "AED 2.1M - 2.5M", availability: 12 },
        ],
        amenities: ["Marina Walk Direct Entrance", "Children Playrooms", "Bouldering wall"],
        locationHighlights: [{ landmark: "Marina Mall", driveTime: "2 mins" }],
        developerProfile: { name: "Emaar Properties", description: "Master builder", completedProjects: 85000, onTimeRate: "97.4%" }
      },
      {
        id: 11,
        slug: "vela-by-omniyat",
        name: "Vela Dorchester Collection",
        developer: "Omniyat Group",
        communityName: "Downtown Dubai",
        location: "Marasi Bay, Downtown Dubai, Dubai",
        address: "Marasi Marina Drive, Business Bay, Dubai",
        propertyType: "Apartment",
        startingPrice: "AED 8,500,000",
        handover: "Q4 2026",
        paymentPlan: "60/40",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
        images: [
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
        ],
        description: "Vela is an exclusive waterfront luxury tower managed by the Dorchester Collection. Nestled in Marasi Bay, Vela stands out with L-shaped private lap pools, absolute floor-to-ceiling windows, and direct access to luxury yacht berths.",
        reraPermit: "RERA-883710295",
        escrowNumber: "ESCROW-8837-1294",
        totalUnits: "38 Penthouses",
        coordinates: { lat: 25.1812, lng: 55.2825 },
        paymentPlanDetails: [
          { milestone: "Booking Fee", percentage: 10 },
          { milestone: "Construction milestones", percentage: 50 },
          { milestone: "On Handover", percentage: 40 },
        ],
        unitMix: [
          { beds: "3 Bedrooms", sqftRange: "4200 - 4800 SqFt", priceRange: "AED 8.5M - 10.2M", availability: 3 },
        ],
        amenities: ["Private L-shaped Pools", "Dorchester Collection Concierge", "Beach Club Access at One at Palm"],
        locationHighlights: [{ landmark: "Dubai Opera", driveTime: "7 mins" }],
        developerProfile: { name: "Omniyat Group", description: "Architectural masterpiece designer", completedProjects: 3200, onTimeRate: "98.2%" }
      }
    ];

    for (const p of projectsData) {
      const matchComm = await prisma.community.findFirst({
        where: {
          name: {
            equals: p.communityName,
            mode: "insensitive"
          }
        }
      });

      const agentIndex = p.id % agents.length;
      const assignedAgent = agents[agentIndex];

      await prisma.project.create({
        data: {
          id: p.id,
          slug: p.slug,
          name: p.name,
          developer: p.developer,
          communityName: p.communityName,
          communityId: matchComm ? matchComm.id : null,
          location: p.location,
          address: p.address,
          propertyType: p.propertyType,
          startingPrice: p.startingPrice,
          handover: p.handover,
          paymentPlan: p.paymentPlan,
          image: p.image,
          images: p.images,
          description: p.description,
          reraPermit: p.reraPermit,
          escrowNumber: p.escrowNumber,
          totalUnits: p.totalUnits,
          coordinates: p.coordinates as any,
          paymentPlanDetails: p.paymentPlanDetails as any,
          unitMix: p.unitMix as any,
          amenities: p.amenities as any,
          locationHighlights: p.locationHighlights as any,
          developerProfile: p.developerProfile as any,
          agentId: assignedAgent ? assignedAgent.id : null,
        },
      });
    }

    console.log("Seeding mock leads/users...");
    const leadsData = [
      { name: "John Smith", email: "john.smith@gmail.com", phone: "+14159988223", interestType: "guide", status: "New", projectName: "Address Grand Downtown", message: "Looking to invest in Downtown Dubai." },
      { name: "Aisha Al-Hashimi", email: "aisha.al@outlook.com", phone: "+971529948293", interestType: "contact", status: "Contacted", projectName: "Palm Flower Residences", message: "Interested in the 5 bedroom waterfront villa." },
      { name: "David Miller", email: "miller.d@yahoo.com", phone: "+447911123456", interestType: "wishlist", status: "New", projectName: "Sobha One", message: "Saved this project for investment review." },
      { name: "Michael Chang", email: "mchang@techinvest.sg", phone: "+6591234567", interestType: "viewing", status: "Viewing Scheduled", projectName: "The Opus Residences", message: "Requesting a physical/virtual viewing of ME residences." },
      { name: "Sarah Jenkins", email: "sjenkins@luxuryhomes.co", phone: "+12128892233", interestType: "brochure", status: "Follow-up Required", projectName: "Vela Dorchester Collection", message: "Send full structural layouts and floorplans." },
      { name: "Emma Watson", email: "emma.watson@gmail.com", phone: "+447922233445", interestType: "guide", status: "Closed Won", projectName: "Address Grand Downtown", message: "Closed on the 2 Bedroom unit. Great onboarding." },
      { name: "Faisal Qureshi", email: "faisal.q@gulfcap.ae", phone: "+971508827364", interestType: "contact", status: "Lost", projectName: "DAMAC Hills 2 - Camelia", message: "Budget did not align with expectations." },
      { name: "Carlos Santana", email: "carlos.s@musician.org", phone: "+55119998877", interestType: "wishlist", status: "New", projectName: "Emaar Beachfront Palace", message: "Interested in branded properties." },
      { name: "Yuki Tanaka", email: "yuki@tokyofinance.jp", phone: "+819011223344", interestType: "guide", status: "Contacted", projectName: "Sobha One", message: "Is the golf course pitch and putt accessible for tenants?" },
      { name: "Dmitry Volkov", email: "dmitry.volkov@moscow.ru", phone: "+79102293847", interestType: "viewing", status: "Viewing Scheduled", projectName: "Palm Beach Towers", message: "Interested in Q1 2026 completion timeline." },
      { name: "Sofia Loren", email: "sofia.l@roma.it", phone: "+3906123456", interestType: "contact", status: "New", projectName: "The Opus Residences", message: "Inquiry on Zaha Hadid architecture details." },
      { name: "Fatima Al-Marzooqi", email: "fatima.m@dubaimedia.ae", phone: "+971504492813", interestType: "brochure", status: "New", projectName: "Hartland Greens", message: "Requesting brochure for studios." },
      { name: "Amir Khan", email: "amir.khan@bollywood.in", phone: "+919822334455", interestType: "guide", status: "Follow-up Required", projectName: "Vela Dorchester Collection", message: "High budget luxury penthouse buyer." },
      { name: "Robert De Niro", email: "robert.deniro@tribeca.com", phone: "+12129938827", interestType: "viewing", status: "Closed Won", projectName: "Palm Flower Residences", message: "Signed contract for the beachfront villa." },
      { name: "Sophie Germain", email: "sophie.g@polytechnique.fr", phone: "+33612345678", interestType: "wishlist", status: "New", projectName: "Sobha One", message: "Tracking yield calculations." },
      { name: "Li Na", email: "lina@beijingholdings.cn", phone: "+861088776655", interestType: "contact", status: "Contacted", projectName: "Address Grand Downtown", message: "Wants to secure multiple units in Downtown Dubai." },
      { name: "Hans Zimmer", email: "hans@zimmer.de", phone: "+491728877665", interestType: "brochure", status: "New", projectName: "The Opus Residences", message: "Needs soundproof structural overview." },
      { name: "Zlatan Ibrahimovic", email: "zlatan@acmilan.it", phone: "+46811223344", interestType: "viewing", status: "Viewing Scheduled", projectName: "Palm Flower Residences", message: "Show me the absolute best ocean view villa." },
      { name: "Marie Curie", email: "marie.curie@radium.org", phone: "+33698765432", interestType: "guide", status: "New", projectName: "Hartland Greens", message: "Researching proximity to green spaces." },
      { name: "Albert Einstein", email: "albert.e@princeton.edu", phone: "+16095551212", interestType: "contact", status: "New", projectName: "Sobha One", message: "Looking for space, light, and golf course view." },
      { name: "Leonardo Da Vinci", email: "leo@florence.it", phone: "+39055998877", interestType: "brochure", status: "Contacted", projectName: "Vela Dorchester Collection", message: "Appreciates Dorchester design elegance." }
    ];

    for (let i = 0; i < leadsData.length; i++) {
      const l = leadsData[i];
      const assignedAgent = agents[i % agents.length];
      await prisma.lead.create({
        data: {
          name: l.name,
          email: l.email,
          phone: l.phone,
          interestType: l.interestType,
          status: l.status,
          projectName: l.projectName,
          message: l.message,
          assignedAgentId: assignedAgent.id
        }
      });
    }

    console.log("Seeding mock newsletter subscribers...");
    const subscribersData = [
      { email: "subscriber1@gmail.com", phone: "+971501111111" },
      { email: "subscriber2@yahoo.com", phone: "+971502222222" },
      { email: "subscriber3@outlook.com", phone: "+971503333333" },
      { email: "subscriber4@hotmail.com", phone: "+971504444444" },
      { email: "subscriber5@icloud.com", phone: "+971505555555" },
      { email: "subscriber6@protonmail.com", phone: "+971506666666" }
    ];

    for (const sub of subscribersData) {
      await prisma.subscriber.create({
        data: {
          email: sub.email,
          phone: sub.phone
        }
      });
    }
  }

  console.log("Synchronizing PostgreSQL auto-increment sequences...");
  await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Project"', 'id'), coalesce(max(id), 1)) FROM "Project";`);
  await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Community"', 'id'), coalesce(max(id), 1)) FROM "Community";`);
  await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Lead"', 'id'), coalesce(max(id), 1)) FROM "Lead";`);
  await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Developer"', 'id'), coalesce(max(id), 1)) FROM "Developer";`);
  await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Agent"', 'id'), coalesce(max(id), 1)) FROM "Agent";`);

  console.log("Seeding completed successfully.");
}


main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
