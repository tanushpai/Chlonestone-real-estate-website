"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Search, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const links = [
    { name: "Projects", href: "/projects" },
    { name: "Developers", href: "/developers" },
    { name: "Communities", href: "/communities" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur">
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
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>

          <Button variant="outline">
            Sign In
          </Button>

          <Button>
            Contact Us
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
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

                <Button variant="outline" className="mt-4">
                  Sign In
                </Button>

                <Button>
                  Contact Us
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}