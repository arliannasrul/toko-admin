"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Expand } from "lucide-react";
import { Product, Category, ProductVariant, Image as ProductImage } from "@/app/generated/prisma";

interface ProductCardPremiumProps {
  item: Product & {
    category: Category;
    variants: (ProductVariant & {
      images: ProductImage[];
    })[];
  };
  storeId: string;
}

export const ProductCardPremium = ({ item, storeId }: ProductCardPremiumProps) => {
  const displayVariant = item.variants?.[0];
  const displayImage = displayVariant?.images?.[0]?.url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative"
    >
      <Link href={`/store/${storeId}/product/${item.id}`}>
        <div className="bg-white rounded-[2.5rem] p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-sky-100 relative mb-4">
          {/* Image Container */}
          <div className="aspect-square rounded-[2rem] bg-slate-50 relative overflow-hidden">
            {displayImage ? (
              <Image
                src={displayImage}
                fill
                alt={item.name}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-300 italic text-sm">
                No Image
              </div>
            )}
            
            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-x-3">
                <button className="h-10 w-10 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Expand className="h-4 w-4" />
                </button>
                <button className="h-10 w-10 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <ShoppingBag className="h-4 w-4" />
                </button>
            </div>

            {/* Category Tag */}
            <div className="absolute top-4 left-4">
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-white/70 backdrop-blur-md rounded-full border border-white/20 text-slate-900">
                    {item.category?.name}
                </span>
            </div>
          </div>

          <div className="mt-6 px-2 space-y-2">
            <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-sky-600 transition-colors">
              {item.name}
            </h3>
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Mulai dari</span>
                <span className="text-xl font-black text-slate-950">
                  {displayVariant ? (
                    `Rp ${new Intl.NumberFormat("id-ID").format(Number(displayVariant.price))}`
                  ) : (
                    "N/A"
                  )}
                </span>
              </div>
              <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 group-hover:bg-sky-50 transition-colors">
                <ArrowRightAlt className="h-5 w-5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ArrowRightAlt = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
)
