import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { projects } from "../src/data/projects";
import { communities } from "../src/data/communities";

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

  console.log("Seeding developers...");
  const developersToSeed = [
    {
      slug: "emaar",
      name: "Emaar",
      description: "Emaar Properties is one of the world's most valuable and admired real estate development companies. Shaper of Dubai's skyline, Emaar is renowned for building the iconic Burj Khalifa and Dubai Mall.",
      completedProjects: 85000,
      onTimeRate: "97.4%",
      logoUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c05"
    },
    {
      slug: "sobha",
      name: "Sobha",
      description: "Sobha Realty is an international luxury developer committed to redefining the art of living with sustainable communities. Renowned for strict execution standards.",
      completedProjects: 22000,
      onTimeRate: "99.1%",
      logoUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c05"
    },
    {
      slug: "damac",
      name: "DAMAC",
      description: "DAMAC Properties has been at the forefront of the Middle East's luxury real estate market since 2002, delivering award-winning residential, commercial and leisure properties.",
      completedProjects: 46000,
      onTimeRate: "92.8%",
      logoUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c05"
    }
  ];

  for (const d of developersToSeed) {
    await prisma.developer.create({ data: d });
  }

  console.log("Seeding agents...");
  const seededAgents = [
    {
      name: "Ali Al-Mansoori",
      email: "ali@chlonestone.com",
      phone: "+971501234567",
      photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
      role: "Sales Director"
    },
    {
      name: "Elena Rostova",
      email: "elena@chlonestone.com",
      phone: "+971507654321",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      role: "Senior Consultant"
    },
    {
      name: "Sarah Connor",
      email: "sarah@chlonestone.com",
      phone: "+971509998888",
      photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
      role: "Palm Jumeirah Specialist"
    }
  ];

  const agents = [];
  for (const a of seededAgents) {
    const agent = await prisma.agent.create({ data: a });
    agents.push(agent);
  }

  console.log("Seeding communities...");
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

  console.log("Seeding projects...");
  for (const p of projects) {
    // Find matching community ID
    const matchComm = await prisma.community.findFirst({
      where: {
        name: {
          equals: p.community,
          mode: "insensitive"
        }
      }
    });

    const agentIndex = (p.id || 0) % agents.length;
    const assignedAgent = agents[agentIndex];

    await prisma.project.create({
      data: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        developer: p.developer,
        communityName: p.community,
        communityId: matchComm ? matchComm.id : null,
        location: p.location,
        propertyType: p.propertyType,
        startingPrice: p.startingPrice,
        handover: p.handover,
        paymentPlan: p.paymentPlan,
        image: p.image,
        images: p.images,
        description: p.description,
        reraPermit: p.reraPermit,
        escrowNumber: p.escrowNumber || null,
        totalUnits: p.totalUnits,
        coordinates: p.coordinates as any,
        paymentPlanDetails: p.paymentPlanDetails as any,
        unitMix: p.unitMix as any,
        amenities: p.amenities as any,
        locationHighlights: p.locationHighlights as any,
        developerProfile: p.developerProfile as any,
        agentId: assignedAgent ? assignedAgent.id : null,
        qrCodeUrl: p.qrCodeUrl || null,
      },
    });
  }

  console.log("Seeding settings...");
  await prisma.setting.create({
    data: {
      id: 1,
      guideUrl: "/uploads/dubai-off-plan-investor-guide-2026.pdf"
    }
  });

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
