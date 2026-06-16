import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const communities = await prisma.community.findMany({
      include: {
        projects: true
      }
    });

    const locations = communities.map(c => ({
      id: c.id,
      name: c.name,
      image: c.image,
      properties: `${c.projects.length} ${c.projects.length === 1 ? "Property" : "Properties"}`
    }));

    return NextResponse.json(locations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
