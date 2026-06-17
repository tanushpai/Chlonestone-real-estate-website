"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Trash2, Search, Mail, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Subscriber {
  id: number;
  email: string;
  phone: string | null;
  createdAt: string;
}

export default function CrmSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const subsPerPage = 10;

  // Reset to page 1 on query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscribers");
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("chlonestone_user");
    if (stored) {
      const u = JSON.parse(stored);
      if (u.role !== "admin") {
        alert("Access denied: Administrators only.");
        window.location.href = "/crm";
        return;
      }
    } else {
      window.location.href = "/";
      return;
    }
    loadSubscribers();
  }, []);

  const handleDelete = async (id: number, email: string) => {
    if (!confirm(`Are you sure you want to remove subscriber "${email}"?`)) return;

    try {
      const res = await fetch(`/api/subscribers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccessMsg(`Successfully unsubscribed ${email}`);
        loadSubscribers();
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        throw new Error("Failed to delete subscriber");
      }
    } catch (error) {
      alert("Error removing subscriber.");
    }
  };

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 text-slate-800">
      
      {/* Page Header */}
      <div className="border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-heading">
            Newsletter Subscribers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your newsletter audience, see subscription dates, and remove subscribers.
          </p>
        </div>
        <div className="text-xs bg-slate-100 border text-slate-600 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
          Total Subscribers: {subscribers.length}
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-600 animate-bounce" />
          {successMsg}
        </div>
      )}

      {/* Filter / Search Strip */}
      <div className="bg-white border p-4 rounded-3xl shadow-sm flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search subscriber email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-2xl h-10 border-slate-200 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Subscribers Table Card */}
      <div className="bg-white border rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Loading subscribers...
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2">
            <Mail className="h-8 w-8 text-slate-350 mx-auto" />
            <p className="font-semibold text-slate-500">No subscribers found</p>
            <p className="text-[10px]">Either your subscriber base is empty or no emails matched your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-6">Email Address</th>
                  <th className="py-3.5 px-6">Phone Number</th>
                  <th className="py-3.5 px-6">Subscribed Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredSubscribers.slice((currentPage - 1) * subsPerPage, currentPage * subsPerPage).map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition duration-150">
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-slate-50 border flex items-center justify-center text-slate-400">
                          <Mail className="h-3.5 w-3.5" />
                        </div>
                        {sub.email}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-700 font-medium">
                      {sub.phone || <span className="text-slate-400 italic">N/A</span>}
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {new Date(sub.createdAt).toLocaleDateString()} at {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(sub.id, sub.email)}
                        className="h-8 w-8 inline-flex items-center justify-center border text-red-650 hover:bg-red-50 hover:border-red-200 rounded-xl transition"
                        title="Delete Subscriber"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && Math.ceil(filteredSubscribers.length / subsPerPage) > 1 && (
          <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
            <p className="text-[11px] text-slate-500 font-medium">
              Showing <span className="font-semibold text-slate-800">{Math.min((currentPage - 1) * subsPerPage + 1, filteredSubscribers.length)}</span> to{" "}
              <span className="font-semibold text-slate-800">{Math.min(currentPage * subsPerPage, filteredSubscribers.length)}</span> of{" "}
              <span className="font-semibold text-slate-800">{filteredSubscribers.length}</span> subscribers
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-7 w-7 p-0 rounded-lg bg-white"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              {Array.from({ length: Math.ceil(filteredSubscribers.length / subsPerPage) }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={`h-7 w-7 p-0 rounded-lg font-bold text-[11px] ${
                    currentPage === page ? "bg-slate-900 text-white" : "bg-white"
                  }`}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(Math.ceil(filteredSubscribers.length / subsPerPage), p + 1))}
                disabled={currentPage === Math.ceil(filteredSubscribers.length / subsPerPage)}
                className="h-7 w-7 p-0 rounded-lg bg-white"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
