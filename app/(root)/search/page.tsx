import db from "@/lib/db";
import { MarketNavbar } from "@/components/market-navbar";
import Image from "next/image";
import Link from "next/link";
import { Store as StoreIcon, Package, Search as SearchIcon, ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const query = searchParams.q || "";

  if (!query || query.length < 2) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <MarketNavbar />
            <div className="pt-40 flex flex-col items-center justify-center text-center px-4">
                <SearchIcon className="h-16 w-16 text-slate-200 dark:text-slate-800 mb-4" />
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Kata kunci terlalu pendek</h1>
                <p className="text-slate-500 mt-2">Silakan ketik minimal 2 karakter untuk mencari produk atau toko.</p>
                <Link href="/" className="mt-6">
                    <Button variant="default" className="rounded-full bg-sky-600">Kembali ke Beranda</Button>
                </Link>
            </div>
        </div>
    );
  }

  const [products, stores] = await Promise.all([
    db.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ],
        isArchived: false
      },
      include: {
        category: true,
        variants: {
          include: { images: true },
          take: 1
        }
      },
      orderBy: { clickCount: 'desc' },
      take: 24
    }),
    db.store.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' }
      },
      take: 6
    })
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <MarketNavbar />
      
      <div className="pt-32 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-12">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Hasil Pencarian: <span className="text-sky-600">"{query}"</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
                Ditemukan {products.length} produk dan {stores.length} toko yang sesuai.
            </p>
        </div>

        {/* Stores Section (if any) */}
        {stores.length > 0 && (
            <div className="mb-20 space-y-8">
                <div className="flex items-center gap-x-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-x-2">
                        <StoreIcon className="h-6 w-6 text-sky-600" />
                        Toko Coocok
                    </h2>
                    <div className="h-[2px] flex-1 bg-slate-200 dark:bg-slate-800 hidden md:block" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stores.map((store) => (
                        <Link key={store.id} href={`/store/${store.id}`}>
                            <Card className="group hover:shadow-xl transition-all duration-300 border-none bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:ring-1 hover:ring-sky-500/50">
                                <div className="p-6 flex items-center gap-4">
                                    <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center relative overflow-hidden">
                                        {store.logoUrl ? (
                                            <Image src={store.logoUrl} alt={store.name} fill className="object-cover" />
                                        ) : (
                                            <StoreIcon className="h-8 w-8 text-sky-600" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <CardTitle className="text-xl font-bold group-hover:text-sky-600 transition-colors">{store.name}</CardTitle>
                                        <span className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">{store.type}</span>
                                    </div>
                                    <Button size="icon" variant="ghost" className="ml-auto rounded-full group-hover:bg-sky-50">
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        )}

        {/* Products Section */}
        <div className="space-y-8">
            <div className="flex items-center gap-x-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-x-2">
                    <Package className="h-6 w-6 text-sky-600" />
                    Produk Ditemukan
                </h2>
                <div className="h-[2px] flex-1 bg-slate-200 dark:bg-slate-800 hidden md:block" />
            </div>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 text-center">
                    <Package className="h-16 w-16 text-slate-100 dark:text-slate-800 mb-4" />
                    <p className="text-slate-500 font-medium">Wah, produk yang Anda cari tidak ditemukan.</p>
                    <p className="text-slate-400 text-sm italic">Coba gunakan kata kunci lain yang lebih umum.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {products.map((product) => {
                        const displayVariant = product.variants[0];
                        const price = displayVariant?.price 
                            ? new Intl.NumberFormat("id-ID").format(Number(displayVariant.price))
                            : "Contact Us";

                        return (
                            <Link key={product.id} href={`/store/${product.storeId}/product/${product.id}`} className="group">
                                <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-2 md:p-4 space-y-4 md:space-y-6 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                                    <div className="aspect-square rounded-[1rem] md:rounded-[2rem] bg-slate-50 dark:bg-slate-800 relative overflow-hidden">
                                        {displayVariant?.images[0] ? (
                                            <Image 
                                                src={displayVariant.images[0].url} 
                                                fill 
                                                alt={product.name} 
                                                className="object-cover group-hover:scale-110 transition duration-700"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-slate-200">No Image</div>
                                        )}
                                        
                                        <div className="absolute inset-x-4 bottom-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500 z-10 hidden md:flex">
                                            <div className="flex gap-2 w-full">
                                                <Button className="flex-1 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white border-none shadow-xl hover:bg-white font-bold h-12">
                                                    Lihat Detail
                                                </Button>
                                                <Button size="icon" className="h-12 w-12 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white shadow-xl">
                                                    <ShoppingCart className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="px-3 pb-2 space-y-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600">
                                                {product.category.name}
                                            </span>
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
            )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
