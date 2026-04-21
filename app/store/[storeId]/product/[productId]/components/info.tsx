"use client"

import { Product, Category, ProductVariant, Image, Attribute, AttributeValue } from "@/app/generated/prisma";
import { ShoppingCart, Package, AlertCircle, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VariantSelector } from "./variant-selector";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InfoProps {
  product: Product & {
    category: Category;
  };
  activeVariant: ProductVariant & {
      attributeValues: (AttributeValue & {
          attribute: Attribute;
      })[];
      images: Image[];
  };
  variants: (ProductVariant & {
    attributeValues: (AttributeValue & {
        attribute: Attribute;
    })[];
    images: Image[];
  })[];
}

export const Info: React.FC<InfoProps> = ({
  product,
  activeVariant,
  variants
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const isSelectedExplicitly = !!searchParams.get("variantId");

  return (
    <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-y-8"
    >
      <div className="space-y-4">
        {/* Category & Badge Row */}
        <div className="flex items-center gap-x-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-sky-600 bg-sky-50 px-4 py-1.5 rounded-full border border-sky-100 shadow-sm">
                {product.category.name}
            </span>
            <div className="flex items-center gap-x-1.5">
                <div className={cn(
                    "h-2 w-2 rounded-full",
                    activeVariant.stock > 0 ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                )} />
                <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    activeVariant.stock > 0 ? "text-emerald-600" : "text-rose-500"
                )}>
                    {activeVariant.stock > 0 ? `Ready Stock (${activeVariant.stock})` : "Out of Stock"}
                </span>
            </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
            {product.name}
        </h1>
      </div>
      
      <div className="flex flex-col gap-y-2">
        <div className="flex items-baseline gap-x-2">
            <span className="text-xl font-bold text-slate-400 italic">IDR</span>
            <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              {new Intl.NumberFormat("id-ID").format(Number(activeVariant.price))}
            </p>
        </div>
        
        {/* Selected Specs Badges */}
        {isSelectedExplicitly && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
              {activeVariant.attributeValues.map((av) => (
                  <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={av.id}
                      className="flex items-center gap-x-2 text-[10px] font-black px-4 py-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm uppercase tracking-wider"
                  >
                      {av.value && av.value.startsWith('#') && (
                          <div className="h-3 w-3 rounded-full border border-slate-200 dark:border-slate-600 shadow-inner" style={{ backgroundColor: av.value }} />
                      )}
                      {av.attribute.name}: <span className="text-slate-900 dark:text-white">{av.name}</span>
                  </motion.div>
              ))}
          </div>
        )}
      </div>

      <div className="bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm p-2 rounded-[2.5rem]">
        <VariantSelector 
            activeVariant={activeVariant} 
            variants={variants} 
        />
      </div>

      {/* Description Section with Modern Toggle style (expanded by default) */}
      <div className="space-y-3 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
         <div className="flex items-center gap-x-2 text-slate-400">
            <AlertCircle className="h-4 w-4" />
            <h3 className="text-xs font-black uppercase tracking-widest">Detail Produk</h3>
         </div>
         <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {product.description || "Hubungi kami untuk informasi detail mengenai produk premium ini."}
         </p>
      </div>

      {/* Trust Badges - The WAH factor info */}
      <div className="grid grid-cols-3 gap-4 py-4">
        <div className="flex flex-col items-center text-center gap-y-2">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-500">Original <br/> Guaranteed</span>
        </div>
        <div className="flex flex-col items-center text-center gap-y-2">
            <div className="h-10 w-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
                <Truck className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-500">Secure <br/> Shipping</span>
        </div>
        <div className="flex flex-col items-center text-center gap-y-2">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <RotateCcw className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-500">Easy <br/> Return</span>
        </div>
      </div>

      <div className="sticky bottom-6 mt-10 md:relative md:bottom-0">
        {!isSelectedExplicitly && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-x-2 text-rose-500 bg-white dark:bg-slate-900 p-4 rounded-3xl border-2 border-rose-100 dark:border-rose-900 shadow-xl mb-4"
            >
                <div className="h-2 w-2 rounded-full bg-rose-500 animate-bounce" />
                <p className="text-[10px] font-black uppercase tracking-[0.1em]">Pilih Spesifikasi Terlebih Dahulu</p>
            </motion.div>
        )}

        <Button 
            disabled={activeVariant.stock === 0 || !isSelectedExplicitly}
            onClick={() => {
                if (!session?.user) {
                    router.push("/login");
                }
            }}
            className={cn(
                "w-full h-20 rounded-[2.5rem] text-xl font-black transition-all duration-500 shadow-2xl flex items-center justify-center gap-x-3",
                isSelectedExplicitly 
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-black dark:hover:bg-slate-200 hover:scale-[1.02] active:scale-95 shadow-slate-300 dark:shadow-none" 
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none"
            )}
        >
          {activeVariant.stock === 0 
            ? "Stok Sedang Kosong" 
            : isSelectedExplicitly 
                ? "Tambah Ke Keranjang" 
                : "Pilih Spesifikasi"}
          <ShoppingCart className="h-6 w-6" />
        </Button>
      </div>
    </motion.div>
  );
};
