"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useEffect } from "react";
import { 
    ShoppingBag, 
    Smartphone, 
    Utensils, 
    Sparkles, 
    Briefcase, 
    Palette, 
    LayoutGrid,
    LucideIcon,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

interface Category {
    name: string;
    icon: LucideIcon;
}

const storeTypes: Category[] = [
    { name: "Pakaian & Fashion", icon: ShoppingBag },
    { name: "Elektronik & Gadget", icon: Smartphone },
    { name: "Makanan & Minuman", icon: Utensils },
    { name: "Kesehatan & Kecantikan", icon: Sparkles },
    { name: "Jasa & Layanan", icon: Briefcase },
    { name: "Karya Seni & Kerajinan", icon: Palette },
    { name: "Lainnya", icon: LayoutGrid }
];

export const CategoryFilter = () => {
    const searchParams = useSearchParams();
    const filterType = searchParams.get("type");
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number | null>(null);

    const startScrolling = (direction: 'left' | 'right') => {
        const scroll = () => {
            if (scrollContainerRef.current) {
                const scrollAmount = direction === 'left' ? -8 : 8;
                scrollContainerRef.current.scrollBy({ left: scrollAmount });
                animationFrameId.current = requestAnimationFrame(scroll);
            }
        };
        animationFrameId.current = requestAnimationFrame(scroll);
    };

    const stopScrolling = () => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }
    };

    useEffect(() => {
        return () => stopScrolling();
    }, []);

    return (
        <div className="bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 mb-10 py-4 group/nav">
            <div className="max-w-7xl mx-auto px-4 md:px-8 relative overflow-hidden">
                {/* Left Hover Zone */}
                <div 
                    onMouseEnter={() => startScrolling('left')}
                    onMouseLeave={stopScrolling}
                    className="absolute left-0 top-0 bottom-0 w-16 z-50 cursor-pointer hidden md:flex items-center justify-start bg-gradient-to-r from-white dark:from-slate-950 to-transparent opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300"
                >
                    <div className="bg-white dark:bg-slate-900 p-1.5 rounded-full shadow-lg border border-slate-200 dark:border-slate-800 ml-2">
                        <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </div>
                </div>

                {/* Right Hover Zone */}
                <div 
                    onMouseEnter={() => startScrolling('right')}
                    onMouseLeave={stopScrolling}
                    className="absolute right-0 top-0 bottom-0 w-16 z-50 cursor-pointer hidden md:flex items-center justify-end bg-gradient-to-l from-white dark:from-slate-950 to-transparent opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300"
                >
                    <div className="bg-white dark:bg-slate-900 p-1.5 rounded-full shadow-lg border border-slate-200 dark:border-slate-800 mr-2">
                        <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </div>
                </div>

                <div 
                    ref={scrollContainerRef}
                    className="flex items-center gap-x-3 overflow-x-auto scrollbar-hide snap-x pointer-events-auto scroll-smooth py-1"
                >
                    {/* Invisible Spacer Left */}
                    <div className="w-12 shrink-0 md:hidden" />
                    
                    <Link href="/" className="relative h-11 flex-shrink-0 snap-start">
                    <div className={`
                        h-full px-6 flex items-center gap-x-2 rounded-2xl transition-all duration-300
                        ${!filterType 
                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-900/20 dark:shadow-white/10" 
                            : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"}
                    `}>
                        <LayoutGrid className="h-4 w-4" />
                        <span className="text-sm font-bold whitespace-nowrap">Semua Kategori</span>
                        {!filterType && (
                            <motion.div layoutId="active-pill" className="absolute inset-0 rounded-2xl ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-slate-950" />
                        )}
                    </div>
                </Link>

                {storeTypes.map((type) => {
                    const isActive = filterType === type.name;
                    const Icon = type.icon;
                    
                    return (
                        <Link key={type.name} href={`/?type=${encodeURIComponent(type.name)}`} className="relative h-12 flex-shrink-0 snap-start">
                            <div className={`
                                h-full px-6 flex items-center gap-x-3 rounded-2xl transition-all duration-300
                                ${isActive 
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-900/20 dark:shadow-white/10 scale-105" 
                                    : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"}
                            `}>
                                <Icon className={`h-4 w-4 ${isActive ? "text-sky-400 dark:text-sky-600" : ""}`} />
                                <span className="text-sm font-bold whitespace-nowrap">{type.name}</span>
                                {isActive && (
                                    <motion.div layoutId="active-pill" className="absolute inset-0 rounded-2xl ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-slate-950" />
                                )}
                            </div>
                        </Link>
                    )
                })}

                {/* Invisible Spacer Right */}
                <div className="w-12 shrink-0 md:hidden" />
            </div>
        </div>
    </div>
    );
};
