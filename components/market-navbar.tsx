"use client"

import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const MarketNavbar = () => {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-12 flex items-center justify-between",
        isScrolled 
            ? "h-16 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm" 
            : "h-24 bg-transparent border-transparent"
    )}>
      {/* Brand */}
      <div className="flex items-center gap-x-8">
        <Link href="/" className="flex items-center gap-x-2 group">
           <div className="h-10 w-10 bg-slate-950 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 group-hover:scale-110">
              <span className="text-white text-2xl font-black italic">T</span>
           </div>
           <span className="text-2xl font-black tracking-tight text-slate-900 hidden md:block">
            TOKOMU<span className="text-sky-600">.</span>
           </span>
        </Link>

        {/* Desktop Nav Links (Simplified) */}
        <div className="hidden lg:flex items-center gap-x-6 text-sm font-semibold text-slate-500">
            <Link href="/" className="hover:text-slate-950 transition-colors">Semua Produk</Link>
            <Link href="/" className="hover:text-slate-950 transition-colors">Kategori</Link>
            <Link href="/" className="hover:text-slate-950 transition-colors">Tentang Kami</Link>
        </div>
      </div>

      {/* Global Search */}
      <div className="hidden md:flex flex-1 max-w-sm mx-12 relative group">
        <Input 
            placeholder="Cari produk gaya hidup..." 
            className="w-full pl-10 h-11 bg-slate-100/50 border-none focus-visible:ring-sky-500 rounded-2xl group-hover:bg-slate-100 transition-colors"
        />
        <Search className="absolute left-3.5 top-3 h-5 w-5 text-slate-400 group-hover:text-sky-600 transition-colors" />
        <div className="absolute right-3 top-2.5 h-6 px-1.5 flex items-center justify-center rounded-md border border-slate-200 bg-white text-[10px] font-bold text-slate-400">
            ⌘K
        </div>
      </div>

      {/* Buttons & Profile */}
      <div className="flex items-center gap-x-2">
        <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-2xl hover:bg-sky-50 hover:text-sky-600 transition-colors">
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute top-2 right-2 bg-sky-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-md">
            0
          </span>
        </Button>
        <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />
        <div className="hidden sm:block">
            <UserNav />
        </div>
        <Button variant="ghost" size="icon" className="md:hidden rounded-2xl">
            <Menu className="h-6 w-6" />
        </Button>
      </div>
    </nav>
  );
};
