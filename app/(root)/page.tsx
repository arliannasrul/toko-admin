import db from "@/lib/db";
import { MarketNavbar } from "@/components/market-navbar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { 
    Store as StoreIcon, 
    ArrowRight 
} from "lucide-react";
import { CategoryFilter } from "@/components/category-filter";
import { AIRecommendations } from "@/components/ai-recommendations";

const MarketplacePage = async ({
    searchParams
}: {
    searchParams: { type?: string }
}) => {
  const filterType = searchParams.type;

  const stores = await db.store.findMany({
    where: filterType ? { type: filterType } : undefined,
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <MarketNavbar />
      
      {/* Spacer for Navbar */}
      <div className="pt-24" />

      {/* AI Recommendations Section */}
      <AIRecommendations />

      {/* Filter Navigation - Premium Version */}
      <div id="categories">
        <CategoryFilter />
      </div>

      {/* Stores Grid */}
      <section id="stores" className="px-4 md:px-12 pb-24 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-x-2">
                <StoreIcon className="h-6 w-6 text-sky-600" />
                Daftar Toko Pilihan
            </h2>
            <div className="h-1 flex-1 bg-slate-200 dark:bg-slate-800 mx-6 hidden md:block" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">{stores.length} Toko Tersedia</span>
        </div>

        {stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <StoreIcon className="h-16 w-16 text-slate-200 dark:text-slate-700 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">Belum ada toko yang terdaftar.</p>
            <Link href="/admin/setup">
                <Button variant="link" className="text-sky-600 font-bold mt-2">Buka Toko Anda Sekarang</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {stores.map((store) => (
              <Link key={store.id} href={`/store/${store.id}`}>
                <Card className="group hover:shadow-2xl transition-all duration-500 border-none bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:ring-2 hover:ring-sky-500/20 relative">
                  <div className="p-4 md:p-6 flex items-center gap-x-5 md:gap-x-6">
                    {/* Logo Section */}
                    <div className="relative h-20 w-20 md:h-24 md:w-24 shrink-0 bg-slate-50 dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 group-hover:scale-105 transition-transform duration-500">
                      {store.logoUrl ? (
                        <Image 
                          src={store.logoUrl} 
                          alt={store.name} 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-sky-50 dark:bg-sky-500/10 text-sky-500">
                          <StoreIcon className="h-10 w-10 opacity-20" />
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col flex-1 min-w-0 py-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 truncate">
                          {store.type}
                        </span>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white truncate group-hover:text-sky-600 transition-colors">
                        {store.name}
                      </h3>
                      
                      <div className="mt-3 flex items-center gap-x-3">
                        <div className="flex -space-x-2">
                           {[1,2,3].map(i => (
                             <div key={i} className="h-6 w-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                <div className="h-full w-full rounded-full bg-sky-100 dark:bg-sky-900/30" />
                             </div>
                           ))}
                        </div>
                        <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold">Verified Partner</span>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                         <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Buka Sejak {new Date(store.createdAt).getFullYear()}</span>
                         <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-slate-50 dark:bg-slate-800 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all scale-75 group-hover:scale-100">
                            <ArrowRight className="h-4 w-4" />
                         </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Premium CTA Section */}
      <section className="relative overflow-hidden py-16 lg:py-20 px-4 bg-slate-950 mt-10">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] bg-sky-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/20 blur-[90px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 md:p-10 lg:p-12 backdrop-blur-xl text-center">
            <span className="inline-block px-3 py-1 mb-4 text-[10px] sm:text-xs font-semibold tracking-wider text-sky-400 uppercase bg-sky-400/10 rounded-full border border-sky-400/20">
              Peluang Bisnis
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
              Mulai Langkah Sukses<br/>Bersama <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">MitraSpace.</span>
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Bergabung dengan ribuan UMKM sukses lainnya. Buat toko online Anda secara gratis, kelola produk dengan mudah, dan jangkau jutaan pelanggan potensial.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/admin/setup">
                <Button size="lg" className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-8 h-12 rounded-full text-sm sm:text-base shadow-[0_0_30px_-10px_rgba(14,165,233,0.5)] transition-all hover:scale-105 border-none">
                  Buka Toko Gratis Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-x-8 gap-y-4 text-slate-400 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                Gratis Selamanya
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                Dukungan 24/7
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                Transaksi Aman
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Actual Global Footer */}
      <footer id="about" className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-x-2">
                <div className="h-8 w-8 bg-slate-950 dark:bg-slate-100 rounded-xl flex items-center justify-center">
                    <span className="text-white dark:text-slate-950 text-lg font-black italic">M</span>
                </div>
                <span className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
                    MitraSpace<span className="text-sky-600">.</span>
                </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                &copy; {new Date().getFullYear()} MitraSpace. Member of Premium Group. All rights reserved.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default MarketplacePage;