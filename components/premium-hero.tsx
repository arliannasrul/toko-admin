"use client";

import { Banner } from "@/app/generated/prisma";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface PremiumHeroProps {
  data: Banner[];
}

export const PremiumHero = ({ data }: PremiumHeroProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (data.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [data.length]);

  if (!data || data.length === 0) return null;

  const currentBanner = data[currentIndex];

  return (
    <div className="relative overflow-hidden bg-slate-950 px-6 py-16 sm:px-12 sm:py-24 lg:px-16 lg:py-32 rounded-3xl mx-4 sm:mx-6 lg:mx-8">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.div
            key={currentBanner.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={currentBanner.imageUrl}
              alt={currentBanner.label}
              fill
              priority
              className="object-cover opacity-40 transition-transform duration-1000 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-sky-400 uppercase bg-sky-400/10 rounded-full border border-sky-400/20 backdrop-blur-md">
              Special Curator
            </span>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1]">
              {currentBanner.label.split(" ").map((word, i) => (
                  <motion.span 
                      key={i} 
                      className="inline-block mr-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                  >
                      {word}
                  </motion.span>
              ))}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300 md:text-xl max-w-lg">
              Temukan koleksi produk pilihan terbaik yang dirancang khusus untuk memenuhi gaya hidup modern Anda.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button size="lg" className="rounded-full px-8 bg-sky-600 hover:bg-sky-500 text-white font-bold group border-none shadow-[0_0_20px_rgba(2,132,199,0.3)]">
                Belanja Sekarang
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                  </div>
                ))}
                <div className="h-10 w-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                  +1k
                </div>
                <span className="ml-4 flex items-center text-sm font-medium text-slate-400">
                  Puas Berbelanja
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators */}
      {data.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {data.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-sky-500" : "w-2 bg-slate-500/50 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-sky-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
    </div>
  );
};
