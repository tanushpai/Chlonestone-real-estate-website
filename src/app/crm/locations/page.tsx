"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CrmLocationsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/crm");
  }, [router]);

  return (
    <div className="h-96 flex items-center justify-center text-slate-400 text-xs font-semibold uppercase tracking-wider">
      Redirecting...
    </div>
  );
}
