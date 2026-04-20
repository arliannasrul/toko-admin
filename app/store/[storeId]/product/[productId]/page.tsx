import db from "@/lib/db";
import Container from "@/components/ui/Container";
import { MarketNavbar } from "@/components/market-navbar";
import { Gallery } from "./components/gallery";
import { Info } from "./components/info";
import Link from "next/link";
import Image from "next/image";

interface ProductPageProps {
  params: {
    productId: string;
    storeId: string;
  };
  searchParams: {
    variantId?: string;
  };
}

const ProductPage = async ({ 
  params,
  searchParams
}: ProductPageProps) => {
  // Fetch Product Master including all Variants
  const product = await db.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      category: true,
      variants: {
        include: {
          attributeValues: {
            include: {
              attribute: true
            }
          },
          images: true,
        },
        orderBy: {
          price: 'asc'
        }
      }
    }
  });

  if (!product || product.variants.length === 0) {
    return (
        <div className="h-screen flex items-center justify-center">
            <p className="text-slate-500">Produk tidak ditemukan atau belum memiliki varian.</p>
        </div>
    )
  }

  // Determine active variant based on URL query or default to the first one
  const activeVariant = searchParams.variantId 
    ? product.variants.find(v => v.id === searchParams.variantId) || product.variants[0]
    : product.variants[0];

  const suggestedProducts = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      storeId: params.storeId,
      NOT: {
        id: params.productId
      }
    },
    include: {
      variants: {
        include: {
          images: true
        },
        take: 1
      },
      category: true
    },
    take: 4
  });

    // Collect all images from all variants for the global thumbnail gallery
    const allImages = product.variants.flatMap((v) => v.images);

    return (
        <div className="bg-[#fafafa] min-h-screen">
          <MarketNavbar />
          <div className="pt-28 pb-20">
            <Container>
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-16 xl:gap-x-24">
                  <Gallery 
                    images={activeVariant.images} 
                    allImages={allImages}
                  />
                  <div className="mt-12 px-2 sm:mt-16 sm:px-0 lg:mt-0">
                    <Info 
                      product={product as any} 
                      activeVariant={activeVariant as any} 
                      variants={product.variants as any} 
                    />
                  </div>
                </div>
                
                <div className="mt-24 space-y-12">
                   <div className="flex items-center justify-between">
                     <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-x-4">
                        <span className="h-10 w-2 bg-slate-900 rounded-full" />
                        Produk Terkait
                     </h2>
                     <div className="h-[2px] flex-1 bg-slate-100 ml-8 hidden md:block" />
                   </div>
                   
                   {suggestedProducts.length === 0 ? (
                     <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium italic">Belum ada produk terkait lainnya.</p>
                     </div>
                   ) : (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                       {suggestedProducts.map((item) => {
                          const displayVariant = item.variants[0];
                          return (
                            <Link key={item.id} href={`/store/${params.storeId}/product/${item.id}`}>
                              <div className="bg-white group cursor-pointer rounded-[2.5rem] border border-slate-100 p-4 space-y-6 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2">
                                <div className="aspect-square rounded-[2rem] bg-slate-50 relative overflow-hidden">
                                  {displayVariant?.images?.[0] ? (
                                    <Image 
                                      src={displayVariant.images[0].url} 
                                      fill 
                                      alt={item.name} 
                                      className="object-cover group-hover:scale-110 transition duration-700"
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center text-slate-200 font-bold">No High-Res Image</div>
                                  )}
                                  
                                  {/* Hover overlay badge */}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                                </div>
                                
                                <div className="px-3 pb-2 space-y-3">
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600">
                                        {item.category?.name}
                                    </p>
                                    <p className="font-black text-lg text-slate-900 line-clamp-1">
                                        {item.name}
                                    </p>
                                  </div>
                                  
                                  {displayVariant && (
                                    <div className="flex items-center justify-between">
                                        <p className="font-bold text-slate-400 text-sm">IDR</p>
                                        <p className="font-black text-slate-900 text-xl tracking-tighter">
                                            {new Intl.NumberFormat("id-ID").format(Number(displayVariant.price))}
                                        </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                     </div>
                   )}
                </div>
              </div>
            </Container>
          </div>
        </div>
    );
}

export default ProductPage;
