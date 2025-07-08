// app/(dashboard)/[storeId]/(routes)/page.tsx
import db from "@/lib/db"; ///(routes)/page.tsx]
import { Heading } from "@/components/ui/heading"; //
import { Separator } from "@/components/ui/separator"; //
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Anda mungkin perlu membuat komponen Card jika belum ada
import { DollarSign, Package, Blocks, Image } from "lucide-react"; // Contoh ikon

interface DashboardPageProps {
    params: {storeId: string}; ///(routes)/page.tsx]
}

const DashboardPage = async ({params} : DashboardPageProps) => {
    const store = await db.store.findFirst({ ///(routes)/page.tsx]
        where: {
            id: params.storeId
        }
    })

    // Ambil data untuk dashboard
    const productCount = await db.product.count({ //
        where: {
            storeId: params.storeId,
            isArchived: false // Hanya produk yang tidak diarsipkan
        }
    });

    const categoryCount = await db.category.count({ //
        where: {
            storeId: params.storeId
        }
    });

    const bannerCount = await db.banner.count({ //
        where: {
            storeId: params.storeId
        }
    });

    // Anda bisa tambahkan lebih banyak kueri, misal untuk total revenue jika ada tabel orders

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading 
                    title="Dashboard"
                    description={`Selamat datang di dasbor toko ${store?.name || "Anda"}`}
                />
                <Separator />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Contoh Card untuk Total Produk */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Produk
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{productCount}</div>
                            <p className="text-xs text-muted-foreground">
                                Produk aktif di toko Anda
                            </p>
                        </CardContent>
                    </Card>

                    {/* Contoh Card untuk Total Kategori */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Kategori
                            </CardTitle>
                            <Blocks className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{categoryCount}</div>
                            <p className="text-xs text-muted-foreground">
                                Kategori yang tersedia
                            </p>
                        </CardContent>
                    </Card>

                    {/* Contoh Card untuk Total Banner */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Banner
                            </CardTitle>
                            <Image className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{bannerCount}</div>
                            <p className="text-xs text-muted-foreground">
                                Banner yang aktif
                            </p>
                        </CardContent>
                    </Card>

                    {/* Anda bisa menambahkan card lain di sini, misalnya untuk Pendapatan, Pesanan Baru, dll. */}
                </div>
            </div>
        </div>
    );
}
export default DashboardPage;