"use client"

import Image from "next/image";
import { useState, useEffect } from "react";
import { Image as ImageType } from "@/app/generated/prisma";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryProps {
  images: ImageType[];    // Images for the active variant
  allImages: ImageType[]; // All images from all variants
}

export const Gallery: React.FC<GalleryProps> = ({
  images = [],
  allImages = []
}) => {
  const [mainImage, setMainImage] = useState(images[0]?.url || "/images/placeholder.png");

  useEffect(() => {
    if (images.length > 0) {
        setMainImage(images[0].url);
    }
  }, [images]);

  return (
    <div className="flex flex-col-reverse gap-y-8">
      {/* Horizontal Scrollable Thumbnails with WAH Styling */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full mt-2"
      >
        <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                Koleksi Galeri ({allImages.length})
            </h3>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-200 dark:from-slate-800 to-transparent ml-4" />
        </div>
        
        <div className="flex items-center gap-x-5 overflow-x-auto pb-6 scrollbar-hide snap-x pointer-events-auto">
          {allImages.map((image, index) => (
            <motion.div 
              key={image.id}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMainImage(image.url)}
              className={cn(
                "relative flex-shrink-0 w-28 aspect-square cursor-pointer items-center justify-center rounded-[2rem] bg-white dark:bg-slate-900 transition-all duration-500 snap-start overflow-hidden border-2 shadow-sm",
                mainImage === image.url 
                    ? "border-sky-500 shadow-sky-100 dark:shadow-none shadow-xl scale-105 z-10" 
                    : "border-slate-100 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-800 opacity-70 hover:opacity-100"
              )}
            >
                <Image
                  fill
                  src={image.url}
                  alt="Product preview"
                  className="object-cover object-center"
                />
                {mainImage === image.url && (
                    <motion.div 
                        layoutId="active-thumb"
                        className="absolute inset-0 bg-sky-500/10 border-2 border-sky-500 rounded-[2rem]"
                    />
                )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Image Display with Framer Motion Animation */}
      <div className="group aspect-square w-full relative rounded-[3rem] overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
        <AnimatePresence mode="wait">
            <motion.div
                key={mainImage}
                initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full relative"
            >
                <Image
                  fill
                  src={mainImage}
                  alt="Product image"
                  className="object-cover object-center"
                  priority
                />
            </motion.div>
        </AnimatePresence>
        
        {/* Decorative Badge */}
        <div className="absolute top-8 left-8">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 dark:border-slate-800/50 shadow-lg"
            >
                <span className="text-[10px] font-black uppercase tracking-widest text-sky-600">Premium Quality</span>
            </motion.div>
        </div>
      </div>
      
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
