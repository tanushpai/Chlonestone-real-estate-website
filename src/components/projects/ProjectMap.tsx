import { MapPin } from "lucide-react";

export default function ProjectMap() {
  return (
    <div className="h-96 rounded-lg border bg-slate-100 flex flex-col items-center justify-center overflow-hidden sm:h-[500px] lg:h-screen">
      <div className="text-center px-4">
        <div className="mb-4 flex justify-center">
          <MapPin className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700">
          Interactive map preview
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Map integration coming soon
        </p>
      </div>
    </div>
  );
}