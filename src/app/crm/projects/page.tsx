"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit2, Trash2, Globe, EyeOff, CheckCircle } from "lucide-react";
import { getProjects, saveProject, deleteProject } from "@/lib/dataService";
import { Project } from "@/data/projects";
import { Button } from "@/components/ui/button";

export default function CrmProjectsPage() {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [successMsg, setSuccessMsg] = useState("");

  const loadData = () => {
    getProjects().then((all) => {
      setProjectsList(all);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePublish = (project: Project) => {
    setSuccessMsg(`Listing status toggled for ${project.name}`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from inventory?`)) {
      try {
        await deleteProject(id);
        setSuccessMsg(`Successfully deleted ${name}`);
        loadData();
        setTimeout(() => setSuccessMsg(""), 3000);
      } catch (error) {
        alert("Failed to delete project");
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-heading">
            Projects Inventory Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish new developments, manage pricing, and edit off-plan mix details.
          </p>
        </div>
        <Link href="/crm/projects/new">
          <Button size="sm" className="bg-primary hover:bg-blue-800 text-white rounded-xl gap-2 font-semibold">
            <Plus className="h-4 w-4" />
            Add New Project
          </Button>
        </Link>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-semibold">
          <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Projects Inventory Table */}
      <div className="bg-white border rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b">
              <tr className="text-slate-500 font-semibold uppercase tracking-wider">
                <th className="p-4">Thumbnail</th>
                <th className="p-4">Project Name</th>
                <th className="p-4">Developer</th>
                <th className="p-4">Community</th>
                <th className="p-4">Starting Price</th>
                <th className="p-4">Handover</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projectsList.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition">
                  
                  {/* Image */}
                  <td className="p-4">
                    <div className="relative h-10 w-16 rounded-lg overflow-hidden border bg-slate-100 flex-shrink-0">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>

                  {/* Name */}
                  <td className="p-4 font-bold text-slate-900">
                    <Link href={`/projects/${p.slug}`} className="hover:text-primary transition">
                      {p.name}
                    </Link>
                    <p className="text-[0.65rem] text-slate-400 font-medium mt-0.5">{p.reraPermit}</p>
                  </td>

                  {/* Developer */}
                  <td className="p-4 font-semibold text-slate-700">{p.developer}</td>

                  {/* Community */}
                  <td className="p-4 font-semibold text-slate-700">{p.community}</td>

                  {/* Price */}
                  <td className="p-4 font-bold text-slate-800">{p.startingPrice}</td>

                  {/* Handover */}
                  <td className="p-4 font-semibold text-slate-500">{p.handover}</td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={() => handleTogglePublish(p)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition"
                        title="Toggle Publish Status"
                      >
                        <Globe className="h-4 w-4" />
                      </button>
                      <Link href={`/crm/projects/${p.id}/edit`}>
                        <button 
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition"
                          title="Edit Project"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition"
                        title="Delete Project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
