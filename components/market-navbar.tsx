"use client"

import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

import { SearchModal } from "@/components/modals/search-modal";

export const MarketNavbar = () => {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onOpenSearch = () => {
    window.dispatchEvent(new CustomEvent("open-search"));
    setIsMobileMenuOpen(false);
  };

  return (
    <>
    <SearchModal />
    <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-12 flex items-center justify-between",
        isScrolled 
            ? "h-16 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm" 
            : "h-24 bg-transparent border-transparent"
    )}>
      {/* Brand */}
      <div className="flex items-center gap-x-8">
        <Link href="/" className="flex items-center gap-x-2 group">
           <div className="h-10 w-10 bg-slate-950 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 group-hover:scale-110">
              <span className="text-white text-2xl font-black italic">M</span>
           </div>
           <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white hidden md:block">
            MitraSpace<span className="text-sky-600">.</span>
           </span>
        </Link>

        {/* Desktop Nav Links (Simplified) */}
        <div className="hidden lg:flex items-center gap-x-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <Link href="/#stores" className="hover:text-slate-950 dark:hover:text-white transition-colors">Semua Produk</Link>
            <Link href="/#categories" className="hover:text-slate-950 dark:hover:text-white transition-colors">Kategori</Link>
            <Link href="/#about" className="hover:text-slate-950 dark:hover:text-white transition-colors">Tentang Kami</Link>
        </div>
      </div>

      {/* Global Search */}
      <div 
        onClick={onOpenSearch}
        className="hidden md:flex flex-1 max-w-sm mx-12 relative group cursor-pointer"
      >
        <div className="w-full pl-10 pr-16 h-11 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors flex items-center text-sm text-slate-500 dark:text-slate-400">
            Cari produk atau toko...
        </div>
        <Search className="absolute left-3.5 top-3 h-5 w-5 text-slate-400 group-hover:text-sky-600 transition-colors" />
        <div className="absolute right-3 top-2.5 h-6 px-1.5 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-400 dark:text-slate-500">
            ⌘K
        </div>
      </div>

      {/* Buttons & Profile */}
      <div className="flex items-center gap-x-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-2xl hover:bg-sky-50 dark:hover:bg-sky-500/10 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute top-2 right-2 bg-sky-600 dark:bg-sky-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-md">
            0
          </span>
        </Button>
        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />
        <div className="hidden sm:block">
            {session?.user ? (
                <UserNav />
            ) : (
                <Link href="/login">
                  <Button variant="default" className="bg-sky-600 hover:bg-sky-700 text-white rounded-full px-6 font-semibold shadow-sm">
                    Masuk
                  </Button>
                </Link>
            )}
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden rounded-2xl h-11 w-11"
            >
                <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] p-0 flex flex-col bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800">
            <SheetHeader className="p-6 pb-2 text-left border-b border-slate-50 dark:border-slate-900">
               <SheetTitle className="text-xl font-bold tracking-tight">Menu Utama</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-y-6 flex-1 overflow-y-auto p-6 scrollbar-hide">
               {/* Mobile Search Trigger */}
               <button 
                 onClick={onOpenSearch}
                 className="flex items-center gap-x-3 p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 w-full group"
               >
                  <Search className="h-5 w-5 group-hover:text-sky-600 transition-colors" />
                  <span>Cari produk atau toko...</span>
               </button>

               <div className="flex flex-col gap-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Navigasi</span>
                  <Link 
                    href="/#stores" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-x-3 px-3 py-3 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    Semua Produk
                  </Link>
                  <Link 
                    href="/#categories" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-x-3 px-3 py-3 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    Kategori
                  </Link>
                  <Link 
                    href="/#about" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-x-3 px-3 py-3 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    Tentang Kami
                  </Link>
               </div>

               <div className="flex flex-col gap-y-1 mt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Akun</span>
                  {session?.user ? (
                      <div className="flex items-center gap-x-3 px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                         <UserNav />
                         <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold truncate">{session.user.name}</span>
                            <span className="text-[10px] text-slate-500 truncate">{session.user.email}</span>
                         </div>
                      </div>
                  ) : (
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-3">
                        <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-xl h-12">
                          Masuk
                        </Button>
                      </Link>
                  )}
               </div>
            </div>

            <div className="mt-auto p-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-xs font-semibold text-slate-500 uppercase">Tema Tampilan</span>
                <ThemeToggle />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
    </>
  );
};
