"use client"

import { useState } from "react";
import { Menu, Store as StoreIcon } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
    Sheet, 
    SheetContent, 
    SheetTrigger,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import Image from "next/image";

interface MobileAdminNavProps {
    stores: any[];
}

export const MobileAdminNav = ({ stores }: MobileAdminNavProps) => {
    const [open, setOpen] = useState(false);
    const params = useParams();
    
    const currentStore = stores.find(s => s.id === params.storeId);

    return (
        <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0 flex flex-col bg-white dark:bg-slate-950">
                    <SheetHeader className="p-6 pb-2">
                        <SheetTitle className="flex items-center gap-x-2">
                            {currentStore?.logoUrl ? (
                                <div className="flex items-center gap-x-3">
                                    <div className="relative h-12 w-12 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <Image fill src={currentStore.logoUrl} alt="Logo" className="object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-base leading-tight">{currentStore?.name}</span>
                                        <span className="text-[10px] text-slate-500 font-medium uppercase">MitraSpace.</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-x-3">
                                    <div className="h-12 w-12 bg-slate-900 dark:bg-slate-100 rounded-full flex items-center justify-center shadow-lg">
                                        <StoreIcon className="h-6 w-6 text-white dark:text-slate-900" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-xl tracking-tight">MitraSpace.</span>
                                        <span className="text-[10px] text-slate-500 font-medium uppercase">{currentStore?.name || "Panel Admin"}</span>
                                    </div>
                                </div>
                            )}
                        </SheetTitle>
                    </SheetHeader>
                    
                    <div className="flex flex-col gap-y-6 flex-1 overflow-y-auto p-6 pt-2 scrollbar-hide">
                        <div className="flex flex-col gap-y-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">Store Management</span>
                            <StoreSwitcher items={stores} className="w-full" />
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">Navigation</span>
                            <MainNav 
                                className="flex-col items-start space-x-0 space-y-3 px-2" 
                                onClick={() => setOpen(false)}
                            />
                        </div>
                    </div>

                    <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">Theme</span>
                        <ThemeToggle />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};
