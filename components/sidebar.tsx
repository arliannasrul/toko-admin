"use client"

import { useState } from "react";
import { ChevronLeft, ChevronRight, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "./user-nav";

interface SidebarProps {
  stores: any[];
  currentStoreId?: string;
}

export const Sidebar = ({ stores, currentStoreId }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className={cn(
        "hidden md:flex flex-col h-full bg-white dark:bg-slate-950 border-r relative transition-all duration-300 ease-in-out z-40",
      )}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Brand/Logo */}
        <Link href="/" className={cn(
          "flex items-center gap-x-3 mb-10 transition-all overflow-hidden hover:opacity-80",
          isCollapsed ? "justify-center" : "justify-start"
        )}>
           {stores.find(s => s.id === currentStoreId)?.logoUrl ? (
             <div className="flex items-center gap-x-3 overflow-hidden">
               <div className="relative h-12 w-12 min-w-[48px] rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                  <Image 
                    fill 
                    src={stores.find(s => s.id === currentStoreId)?.logoUrl!} 
                    alt="Logo" 
                    className="object-cover" 
                  />
               </div>
               {!isCollapsed && (
                 <div className="flex flex-col overflow-hidden">
                   <span className="font-bold text-base truncate leading-tight">
                     {stores.find(s => s.id === currentStoreId)?.name}
                   </span>
                   <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">MitraSpace.</span>
                 </div>
               )}
             </div>
           ) : (
             <div className="flex items-center gap-x-3 overflow-hidden">
               <div className="h-12 w-12 min-w-[48px] bg-slate-950 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-black italic">M</span>
               </div>
               {!isCollapsed && (
                 <div className="flex flex-col overflow-hidden">
                   <span className="text-xl font-bold tracking-tight whitespace-nowrap">
                     MitraSpace<span className="text-sky-600">.</span>
                   </span>
                   <span className="text-[10px] text-slate-500 font-medium uppercase truncate">
                     {stores.find(s => s.id === currentStoreId)?.name || "Panel Admin"}
                   </span>
                 </div>
               )}
             </div>
           )}
        </Link>

        {/* Store Switcher */}
        <div className={cn(
          "mb-6 transition-all",
          isCollapsed ? "flex justify-center" : ""
        )}>
          {isCollapsed ? (
             <div className="h-10 w-10 rounded-md border flex items-center justify-center bg-slate-50 dark:bg-slate-900 cursor-default shadow-sm text-slate-500">
                <LayoutDashboard className="h-4 w-4" />
             </div>
          ) : (
            <StoreSwitcher items={stores} className="w-full" />
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto scrollbar-hide py-4">
           <div className={cn(
             "px-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest transition-opacity duration-300",
             isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
           )}>
             Menu Utama
           </div>
           <MainNav 
             isCollapsed={isCollapsed} 
             className="flex-col space-x-0 space-y-3 items-start px-0" 
           />
        </div>

        {/* Support/Footer - optional */}
        <div className={cn(
          "mt-auto pt-6 border-t border-slate-100 dark:border-slate-900 transition-all flex flex-col gap-y-4",
          isCollapsed ? "items-center" : ""
        )}>
           {!isCollapsed && (
             <div className="p-4 bg-sky-50 dark:bg-sky-500/10 rounded-2xl mb-2">
                <p className="text-xs font-bold text-sky-600 dark:text-sky-400 mb-1">Butuh Bantuan?</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Hubungi tim support kami jika ada kendala.</p>
             </div>
           )}
           
           <div className={cn(
             "flex items-center w-full px-2",
             isCollapsed ? "flex-col gap-y-4" : "justify-between"
           )}>
             <UserNav />
             <ThemeToggle />
           </div>
        </div>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-white dark:bg-slate-900 border rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm z-50"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </motion.aside>
  );
};
