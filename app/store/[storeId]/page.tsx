import db from "@/lib/db";
import Image from "next/image";
import { MarketNavbar } from "@/components/market-navbar";
import Container from "@/components/ui/Container";
import { PremiumHero } from "@/components/premium-hero";
import { ProductCardPremium } from "@/components/product-card-premium";
import { ChevronRight, Sparkles, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

interface StorePageProps {
  params: {
    storeId: string;
  }
}

const StorePage = async ({ params }: StorePageProps) => {
  const store = await db.store.findUnique({
    where: {
      id: params.storeId
    },
    include: {
      banners: {
        where: {}
      },
      categories: {
        take: 6
      },
      product: {
        where: {
          isArchived: false
        },
        include: {
          category: true,
          variants: {
            include: {
              images: true
            },
            take: 1
          }
        }
      }
    }
  });

  if (!store) {
    return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center space-y-4">
                <div className="h-16 w-16 bg-slate-200 rounded-full mx-auto" />
                <p className="text-slate-500 font-medium">Toko tidak ditemukan.</p>
            </div>
        </div>
    )
  }

  const featuredBanners = store.banners;
  const featuredProducts = store.product.filter(p => p.isFeatured).slice(0, 4);
  const allProducts = store.product;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900">
      <MarketNavbar />
      
      <main className="pt-24 pb-20 space-y-24">
        
        {/* Top Group: Store Identity & Hero */}
        <div className="space-y-6 sm:space-y-8">
          {/* Store Identity */}
          <Container>
              <div className="mx-4 sm:mx-6 lg:mx-8 flex items-center gap-x-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                  {store.logoUrl ? (
                      <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0 bg-white">
                          <Image src={store.logoUrl} alt={store.name} fill className="object-contain p-2" />
                      </div>
                  ) : (
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-sky-50 flex items-center justify-center border border-sky-100 flex-shrink-0">
                          <span className="text-2xl sm:text-3xl font-black text-sky-600">
                              {store.name.charAt(0).toUpperCase()}
                          </span>
                      </div>
                  )}
                  <div>
                      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">{store.name}</h1>
                      <div className="flex items-center gap-x-2 mt-1">
                          <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-600">
                              Official Store
                          </span>
                      </div>
                  </div>
              </div>
          </Container>

          {/* Hero Section */}
          <section>
              {featuredBanners.length > 0 ? (
                  <PremiumHero data={featuredBanners} />
              ) : (
                  <Container>
                      <div className="h-[400px] bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white mx-4">
                          <h1 className="text-4xl font-bold">{store.name}</h1>
                      </div>
                  </Container>
              )}
          </section>
        </div>

        <Container>
            <div className="px-4 sm:px-6 lg:px-8 space-y-24">
                
                {/* Categories Browse */}
                {store.categories.length > 0 && (
                    <section className="space-y-10">
                        <div className="flex items-end justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center gap-x-2 text-sky-600 font-bold text-xs uppercase tracking-[0.2em]">
                                    <Zap className="h-4 w-4 fill-sky-600" />
                                    Koleksi Kami
                                </div>
                                <h2 className="text-4xl font-black tracking-tight">Cari Berdasarkan Kategori</h2>
                            </div>
                            <Link href="#" className="group flex items-center gap-x-2 text-sm font-bold text-slate-500 hover:text-slate-950 transition-colors">
                                Lihat Semua
                                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {store.categories.map((cat) => (
                                <Link 
                                    key={cat.id} 
                                    href={`/store/${params.storeId}?categoryId=${cat.id}`}
                                    className="group relative h-40 rounded-3xl bg-white border border-slate-100 p-6 flex flex-col justify-between hover:border-sky-200 hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-500 overflow-hidden"
                                >
                                    <div className="h-12 w-12 rounded-2xl bg-slate-50 group-hover:bg-sky-50 flex items-center justify-center transition-colors">
                                        <Sparkles className="h-6 w-6 text-slate-400 group-hover:text-sky-600 transition-colors" />
                                    </div>
                                    <span className="font-bold text-slate-900 leading-tight">{cat.name}</span>
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <TrendingUp className="h-4 w-4 text-sky-600" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Featured Products */}
                {featuredProducts.length > 0 && (
                    <section className="space-y-10">
                        <div className="flex items-center gap-x-3">
                            <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight">Produk Unggulan</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.map((item) => (
                                <ProductCardPremium key={item.id} item={item} storeId={params.storeId} />
                            ))}
                        </div>
                    </section>
                )}

                {/* All Products */}
                <section className="space-y-10">
                    <div className="flex flex-col gap-y-2">
                        <h2 className="text-3xl font-black tracking-tight">Semua Produk</h2>
                        <p className="text-slate-500 font-medium">Jelajahi koleksi lengkap kami untuk gaya hidup Anda.</p>
                    </div>

                    {allProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <ShoppingBag className="h-10 w-10 text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-medium whitespace-pre-wrap text-center">
                                Belum ada produk tersedia.{"\n"}Silakan cek kembali nanti.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {allProducts.map((item) => (
                                <ProductCardPremium key={item.id} item={item} storeId={params.storeId} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Newsletter / CTA */}
                <section className="relative overflow-hidden bg-slate-900 rounded-[3rem] px-8 py-16 text-center">
                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                            Dapatkan Update Produk Terbaru
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Berlangganan buletin kami dan jadilah yang pertama tahu tentang koleksi baru dan penawaran eksklusif.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
                            <input 
                                type="email" 
                                placeholder="Email anda..." 
                                className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all font-medium"
                            />
                            <button className="px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl shadow-lg shadow-sky-600/20 transition-all active:scale-95">
                                Langganan
                            </button>
                        </div>
                    </div>
                </section>

            </div>
        </Container>
      </main>

      <footer className="border-t border-slate-200 py-12">
        <Container>
            <div className="px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-x-2">
                    <div className="h-8 w-8 bg-slate-950 rounded-xl flex items-center justify-center">
                        <span className="text-white text-lg font-black italic">T</span>
                    </div>
                    <span className="text-xl font-black tracking-tight text-slate-950">
                        TOKOMU<span className="text-sky-600">.</span>
                    </span>
                </div>
                <p className="text-sm text-slate-500 font-medium">
                    &copy; 2026 Tokomu Online. Member of Premium Group.
                </p>
            </div>
        </Container>
      </footer>
    </div>
  );
};

const ShoppingBag = ({ className }: { className?: string }) => (
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
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
)

export default StorePage;
