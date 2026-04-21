import db from "@/lib/db";
import { auth } from "@/auth";
import { getAIRecommendations } from "@/lib/gemini";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AIRecommendations = async () => {
    const session = await auth();
    const userId = session?.user?.id;

    let recommendedProducts = [];
    let title = "Produk Terpopuler";
    let subtitle = "Kamu Pasti Suka";

    // 1. Fetch historical unique views for context
    const userHistory = userId ? (await db.userView.findMany({
        where: { userId },
        take: 15,
        orderBy: { createdAt: "desc" },
        include: { product: true }
    })).map(v => v.product.name) : [];

    // 2. Fetch a pool of candidates (trending products)
    const productPool = await db.product.findMany({
        where: { isArchived: false },
        take: 40,
        orderBy: { clickCount: "desc" },
        include: { 
            category: true,
            variants: {
                include: { images: true },
                take: 1
            }
        }
    });

    if (userId && userHistory.length > 0) {
        // 3. Get AI IDs from Gemini
        const aiIds = await getAIRecommendations(
            Array.from(new Set(userHistory)), 
            productPool.map(p => ({ id: p.id, name: p.name, category: p.category.name }))
        );

        // 4. Map back to full product objects
        recommendedProducts = productPool
            .filter(p => aiIds.includes(p.id))
            .slice(0, 4);
        
        if (recommendedProducts.length > 0) {
            title = "Spesial Untuk Kamu";
            subtitle = "AI kami memilihkan produk ini berdasarkan minat belanja Anda.";
        } else {
            // Fallback if AI fails
            recommendedProducts = productPool.slice(0, 4);
        }
    } else {
        // Guest or No History: Just Top Trending
        recommendedProducts = productPool.slice(0, 4);
    }

    if (recommendedProducts.length === 0) return null;

    return (
        <section className="px-4 md:px-12 py-12 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-x-2 text-sky-600 dark:text-sky-400 font-bold text-sm uppercase tracking-widest">
                        <Sparkles className="h-4 w-4" />
                        <span>Rekomendasi</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        {title}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        {subtitle}
                    </p>
                </div>
                <div className="h-1 flex-1 bg-slate-200 dark:bg-slate-800 mx-8 hidden lg:block mb-3" />
                <Link href="/#stores">
                    <Button variant="outline" className="rounded-full border-slate-200 dark:border-slate-800 font-bold group hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-all">
                        Lihat Semua
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {recommendedProducts.map((product) => {
                    const price = product.variants[0]?.price 
                        ? new Intl.NumberFormat("id-ID").format(Number(product.variants[0].price))
                        : "Contact Us";
                    const image = product.variants[0]?.images[0]?.url;

                    return (
                        <Link key={product.id} href={`/store/${product.storeId}/product/${product.id}`} className="group">
                            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-2 md:p-4 space-y-4 md:space-y-6 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_40px_80px_-15px_rgba(255,255,255,0.05)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                                {/* Product Image Container */}
                                <div className="aspect-square rounded-[1rem] md:rounded-[2rem] bg-slate-50 dark:bg-slate-800 relative overflow-hidden">
                                    {image ? (
                                        <Image 
                                            src={image} 
                                            fill 
                                            alt={product.name} 
                                            className="object-cover group-hover:scale-110 transition duration-700"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-slate-300">No Image</div>
                                    )}
                                    
                                    {/* Action Buttons Overlay */}
                                    <div className="absolute inset-x-4 bottom-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500 z-10">
                                        <div className="flex gap-2">
                                            <Button className="flex-1 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white border-none shadow-xl hover:bg-white font-bold h-12">
                                                Cek Detail
                                            </Button>
                                            <Button size="icon" className="h-12 w-12 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white shadow-xl">
                                                <ShoppingCart className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Glass Overlay on Hover */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                                </div>

                                <div className="px-3 pb-2 space-y-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                                                {product.category.name}
                                            </span>
                                            {product.clickCount > 50 && (
                                                <span className="bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Hot</span>
                                            )}
                                        </div>
                                        <h3 className="font-black text-sm md:text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-sky-600 transition-colors">
                                            {product.name}
                                        </h3>
                                    </div>
                                    
                                    <div className="flex items-end justify-between pt-1 md:pt-2 border-t border-slate-50 dark:border-slate-800">
                                        <p className="font-black text-slate-900 dark:text-white text-base md:text-xl tracking-tighter">
                                            <span className="text-[10px] font-bold text-slate-400 mr-1">IDR</span>
                                            {price}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};
