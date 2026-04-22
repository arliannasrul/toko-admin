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

interface SidebarProps {
  stores: any[];
}

export const Sidebar = ({ stores }: SidebarProps) => {
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
        <div className={cn(
          "flex items-center gap-x-3 mb-10 transition-all overflow-hidden",
          isCollapsed ? "justify-center" : "justify-start"
        )}>
           <div className="h-10 w-10 min-w-[40px] bg-slate-950 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold italic">M</span>
           </div>
           {!isCollapsed && (
             <span className="text-xl font-bold tracking-tight whitespace-nowrap">
               MitraSpace<span className="text-sky-600">.</span>
             </span>
           )}
        </div>

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
             className="flex-col space-x-0 space-y-1 items-start px-0" 
           />
        </div>

        {/* Support/Footer - optional */}
        <div className={cn(
          "mt-auto pt-6 border-t border-slate-100 dark:border-slate-900 transition-all",
          isCollapsed ? "items-center" : ""
        )}>
           {!isCollapsed && (
             <div className="p-4 bg-sky-50 dark:bg-sky-500/10 rounded-2xl mb-4">
                <p className="text-xs font-bold text-sky-600 dark:text-sky-400 mb-1">Butuh Bantuan?</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Hubungi tim support kami jika ada kendala.</p>
             </div>
           )}
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
