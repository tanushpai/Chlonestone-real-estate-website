"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, Heart, LogOut, ChevronDown, LayoutDashboard, Calculator } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const checkUser = () => {
    const stored = localStorage.getItem("chlonestone_user");
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener("auth-state-change", checkUser);
    return () => {
      window.removeEventListener("auth-state-change", checkUser);
    };
  }, []);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem("chlonestone_user");
    if (!stored) {
      window.dispatchEvent(
        new CustomEvent("open-auth-lead-capture", {
          detail: {
            interestType: "wishlist-nav",
            projectName: "Navbar Wishlist",
            onSuccess: () => {
              router.push("/wishlist");
            }
          },
        })
      );
    } else {
      router.push("/wishlist");
    }
  };

  const handleToolsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem("chlonestone_user");
    if (!stored) {
      window.dispatchEvent(
        new CustomEvent("open-auth-lead-capture", {
          detail: {
            interestType: "investment-tools",
            projectName: "Navbar Investment Tools",
            onSuccess: () => {
              window.dispatchEvent(new Event("open-tools-sidebar"));
            }
          },
        })
      );
    } else {
      window.dispatchEvent(new Event("open-tools-sidebar"));
    }
  };

  const handleSignInClick = () => {
    window.dispatchEvent(
      new CustomEvent("open-auth-lead-capture", {
        detail: {
          interestType: "navbar-signin",
          projectName: "Navbar Sign In",
        },
      })
    );
  };

  const handleSignOut = () => {
    localStorage.removeItem("chlonestone_user");
    setUser(null);
    window.dispatchEvent(new Event("auth-state-change"));
  };

  const whatsappUrl = "https://wa.me/971503483366?text=Hello!%20I%20would%20like%20to%20contact%20you%20about%20real%20estate%20services.";

  const links = [
    { name: "Projects", href: "/projects" },
    { name: "Communities", href: "/communities" },
    { name: "Developers", href: "/developers" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Chlonestone"
            width={160}
            height={45}
            priority
            className="h-auto w-auto max-h-14"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleWishlistClick} aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={handleToolsClick} aria-label="Investment Calculators" title="Investment Calculators">
            <Calculator className="h-5 w-5" />
          </Button>

          {user ? (
            <div className="relative">
              {/* User Email Pill matching Mockup */}
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-full bg-white hover:bg-slate-50 transition shadow-sm cursor-pointer select-none"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-slate-700 font-semibold max-w-[120px] truncate">
                  {user.name || user.email}
                </span>
                <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-100 bg-white p-2 shadow-xl z-40 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                    <div className="px-3 py-2 border-b border-slate-50">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                      <span className={`inline-block mt-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        user.role === "admin" ? "bg-red-55 text-red-600 border border-red-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}>
                        {user.role || "client"}
                      </span>
                    </div>

                    <div className="py-1">
                      {(user.role === "admin" || user.role === "agent") && (
                        <Link 
                          href="/crm" 
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          <LayoutDashboard className="h-3.5 w-3.5 text-slate-500" />
                          {user.role === "admin" ? "CRM Dashboard" : "Agent Portal"}
                        </Link>
                      )}
                      
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          handleSignOut();
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition text-left"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={handleSignInClick}>
              Sign In
            </Button>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm">Contact Us</Button>
          </a>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={handleWishlistClick} aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={handleToolsClick} aria-label="Investment Calculators">
            <Calculator className="h-5 w-5" />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <div className="mt-10 flex flex-col gap-6">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium"
                  >
                    {link.name}
                  </Link>
                ))}

                <button
                  onClick={handleToolsClick}
                  className="text-lg font-medium text-left focus:outline-none"
                >
                  Investment Tools
                </button>

                {user ? (
                  <div className="flex flex-col gap-3 mt-4 border-t pt-4">
                    {(user.role === "admin" || user.role === "agent") && (
                      <Link href="/crm" className="w-full">
                        <Button className="w-full bg-[#111322] text-white">
                          {user.role === "admin" ? "Admin Portal" : "Agent Portal"}
                        </Button>
                      </Link>
                    )}

                    <div className="flex items-center gap-2 px-3 py-2 border rounded-xl bg-slate-50">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                        {user.email.charAt(0).toLowerCase()}
                      </div>
                      <span className="text-xs text-slate-700 font-medium truncate max-w-[180px]">{user.email}</span>
                    </div>

                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="mt-4" onClick={handleSignInClick}>
                    Sign In
                  </Button>
                )}

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full">Contact Us</Button>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}