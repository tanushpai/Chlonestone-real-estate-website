import { Project } from "@/data/projects";
import { Community } from "@/data/communities";

export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch("/api/projects");
    if (!res.ok) throw new Error("Failed to fetch projects");
    return await res.json();
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getProjectBySlugOrId(idOrSlug: string | number): Promise<Project | null> {
  try {
    const res = await fetch(`/api/projects/${idOrSlug}`);
    if (!res.ok) throw new Error("Failed to fetch project");
    return await res.json();
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

export async function saveProject(project: Project): Promise<void> {
  try {
    // If it has an ID or is an existing project (not 0 or temporary), update it
    const isNew = !project.id;
    const url = isNew ? "/api/projects" : `/api/projects/${project.id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });

    if (!res.ok) throw new Error(`Failed to ${isNew ? "create" : "update"} project`);
  } catch (error) {
    console.error("Error saving project:", error);
    throw error;
  }
}

export async function deleteProject(id: number): Promise<void> {
  try {
    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete project");
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}

export async function getCommunities(): Promise<Community[]> {
  try {
    const res = await fetch("/api/communities");
    if (!res.ok) throw new Error("Failed to fetch communities");
    return await res.json();
  } catch (error) {
    console.error("Error fetching communities:", error);
    return [];
  }
}

export async function saveCommunity(community: Community): Promise<void> {
  try {
    const isNew = !community.id;
    const url = isNew ? "/api/communities" : `/api/communities/${community.id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(community),
    });

    if (!res.ok) throw new Error(`Failed to ${isNew ? "create" : "update"} community`);
  } catch (error) {
    console.error("Error saving community:", error);
    throw error;
  }
}

export interface DbDeveloper {
  id?: number;
  slug: string;
  name: string;
  description: string;
  completedProjects: number;
  onTimeRate: string;
  logoUrl?: string | null;
}

export async function getDbDevelopers(): Promise<DbDeveloper[]> {
  try {
    const res = await fetch("/api/developers");
    if (!res.ok) throw new Error("Failed to fetch developers");
    return await res.json();
  } catch (error) {
    console.error("Error fetching developers:", error);
    return [];
  }
}

export async function saveDbDeveloper(dev: DbDeveloper): Promise<void> {
  try {
    const isNew = !dev.id;
    const url = isNew ? "/api/developers" : `/api/developers/${dev.id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dev),
    });

    if (!res.ok) throw new Error(`Failed to ${isNew ? "create" : "update"} developer`);
  } catch (error) {
    console.error("Error saving developer:", error);
    throw error;
  }
}

export async function deleteDbDeveloper(id: number): Promise<void> {
  try {
    const res = await fetch(`/api/developers/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete developer");
  } catch (error) {
    console.error("Error deleting developer:", error);
    throw error;
  }
}

export async function deleteCommunity(id: number): Promise<void> {
  try {
    const res = await fetch(`/api/communities/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete community");
  } catch (error) {
    console.error("Error deleting community:", error);
    throw error;
  }
}

export async function resetData(): Promise<void> {
  console.log("resetData is a no-op when database is active");
}

export interface DbLocation {
  id: number;
  name: string;
  image: string;
  properties: string;
}

export async function getDbLocations(): Promise<DbLocation[]> {
  try {
    const res = await fetch("/api/locations");
    if (!res.ok) throw new Error("Failed to fetch locations");
    return await res.json();
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}
