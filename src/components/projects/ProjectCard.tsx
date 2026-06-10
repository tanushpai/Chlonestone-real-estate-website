import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Home } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: number;
  slug: string;
  name: string;
  developer: string;
  community: string;
  location: string;
  propertyType: string;
  startingPrice: string;
  handover: string;
  paymentPlan: string;
  image: string;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <Card className="overflow-hidden border-0 shadow-sm transition hover:shadow-lg cursor-pointer h-full">
        {/* Image Container */}
        <div className="relative h-44 sm:h-52 lg:h-56 bg-gray-200">
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover"
          />
          
          {/* Wishlist Icon */}
          <button 
            onClick={(e) => e.preventDefault()}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
          >
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          </button>
        </div>

        <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          {/* Price and Type */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {project.startingPrice}
              </p>
            </div>
            <Badge variant="secondary" className="text-xs font-semibold flex-shrink-0">
              {project.propertyType.toUpperCase()}
            </Badge>
          </div>

          {/* Project Name */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-1">
              {project.name}
            </h3>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{project.community}</span>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-xs text-gray-600 pt-2 border-t">
            <div className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Studio</span>
            </div>
            <div>0</div>
            <div>0 sqft</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}