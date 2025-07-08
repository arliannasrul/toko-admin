// arliannasrul/toko-admin/toko-admin-58ba32a6833f7446551d61ddc8c126baad028b60/app/(dashboard)/[storeId]/(routes)/products/page.tsx
import db from "@/lib/db"; //
import { ProductClient } from "./components/client"; ///(routes)/products/components/client.tsx]
import { ProductColumn } from "./components/column"; ///(routes)/products/components/column.ts]
import { format } from "date-fns" //
import { formatter } from "@/lib/utils"; //

// Modifikasi di sini: Tambahkan searchParams ke props
const ProductsPage = async ({params, searchParams}:{params: {storeId: string}, searchParams: { isArchived?: string, isFeatured?: string }}) => {
    // Ambil nilai filter dari URL searchParams
    const isArchived = searchParams.isArchived === "true" ? true : searchParams.isArchived === "false" ? false : undefined;
    const isFeatured = searchParams.isFeatured === "true" ? true : searchParams.isFeatured === "false" ? false : undefined;

    const products = await db.product.findMany({ //
        where: {
            storeId: params.storeId,
            isArchived, // Modifikasi di sini: Terapkan filter isArchived
            isFeatured, // Modifikasi di sini: Terapkan filter isFeatured
        },
        include: {
            category: true,
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formattedProducts:ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price.toNumber()),
        category: item.category.name,
        createdAt: format(item.createdAt, "MM dd, yyyy"), // Perbaiki format tanggal
}))
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts}/>
            </div>
        </div>
    );
}

export default ProductsPage;