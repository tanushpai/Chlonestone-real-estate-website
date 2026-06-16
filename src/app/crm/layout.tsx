"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  Map, 
  LogOut, 
  UserCircle,
  Users,
  UserCheck
} from "lucide-react";

export default function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("chlonestone_user");
    if (stored) {
      const u = JSON.parse(stored);
      if (u.role === "admin" && u.email === "admin@chlonestone.com") {
        setAuthorized(true);
        setAdminUser(u);
        return;
      }
    }
    router.push("/");
  }, [router]);

  if (!authorized) {
    return (
      <div className="h-screen w-screen bg-[#0F1123] flex flex-col items-center justify-center text-xs text-slate-400 gap-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <p className="font-semibold tracking-wider uppercase">Verifying Admin Access...</p>
      </div>
    );
  }

  const menuItems = [
    { name: "Dashboard", href: "/crm", icon: LayoutDashboard },
    { name: "Leads Manager", href: "/crm/leads", icon: Users },
    { name: "Projects Manager", href: "/crm/projects", icon: Building2 },
    { name: "Communities Manager", href: "/crm/communities", icon: Map },
    { name: "Developers Manager", href: "/crm/developers", icon: Building2 },
    { name: "Agents Manager", href: "/crm/agents", icon: UserCheck },
  ];

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-slate-800">
      
      {/* CRM Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0F1123] text-slate-300 border-r border-slate-900">
        
        {/* CRM Branding */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-900 bg-slate-950/20">
          <Link href="/">
            <div className="bg-white px-3 py-1.5 rounded-lg">
              <Image
                src="/logo.png"
                alt="Chlonestone"
                width={120}
                height={34}
                className="h-auto w-auto max-h-8"
              />
            </div>
          </Link>
          <span className="text-[0.65rem] font-bold bg-primary text-white px-2 py-0.5 rounded uppercase">
            CRM
          </span>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive 
                    ? "bg-primary text-white" 
                    : "hover:bg-slate-900/60 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/25">
          <Link 
            href="/"
            className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            Exit to Public Site
          </Link>
        </div>

      </aside>

      {/* Main CRM Workspace Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Workspace Top Header Header */}
        <header className="h-20 border-b bg-white flex items-center justify-between px-6 md:px-8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/" className="md:hidden">
              <Image
                src="/logo.png"
                alt="Chlonestone"
                width={100}
                height={28}
                className="max-h-7 object-contain"
              />
            </Link>
            <h2 className="hidden md:block text-lg font-bold text-slate-950 font-heading">
              Agent Portal
            </h2>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Quick Link Switcher */}
            <div className="flex items-center gap-2 rounded-full border bg-slate-50 px-3 py-1.5 text-xs text-slate-600 font-semibold shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="capitalize">Role: {adminUser?.role || "Admin"}</span>
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white uppercase select-none">
                {adminUser?.email.charAt(0) || "A"}
              </div>
              <span className="hidden sm:inline-block text-xs font-bold text-slate-700">{adminUser?.name || "Admin"}</span>
            </div>
          </div>
        </header>

        {/* Content Workspace scrollbar */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>

      </div>
    </div>
  );
}
