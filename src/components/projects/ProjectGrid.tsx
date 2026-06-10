import ProjectCard from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";

export default function ProjectGrid() {
  const hasProjects = projects.length > 0;

  if (!hasProjects) {
    return (
      <div className="rounded-lg border bg-white py-12 px-4 sm:py-16 sm:px-6 flex flex-col items-center justify-center min-h-96">
        <h3 className="text-xl font-semibold text-gray-900 sm:text-2xl mb-2">
          No matches
        </h3>
        <p className="text-sm text-gray-500 sm:text-base mb-6">
          Try widening your filters.
        </p>
        <Button variant="outline">
          Reset filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
        />
      ))}
    </div>
  );
}