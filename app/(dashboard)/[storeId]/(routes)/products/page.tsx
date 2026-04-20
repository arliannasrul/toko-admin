// arliannasrul/toko-admin/toko-admin-58ba32a6833f7446551d61ddc8c126baad028b60/app/(dashboard)/[storeId]/(routes)/products/page.tsx
import db from "@/lib/db";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/column";
import { format } from "date-fns"
import { formatter } from "@/lib/utils";

const ProductsPage = async ({params, searchParams}:{params: {storeId: string}, searchParams: { isArchived?: string, isFeatured?: string }}) => {
    const isArchived = searchParams.isArchived === "true" ? true : searchParams.isArchived === "false" ? false : undefined;
    const isFeatured = searchParams.isFeatured === "true" ? true : searchParams.isFeatured === "false" ? false : undefined;

    const products = await db.product.findMany({
        where: {
            storeId: params.storeId,
            isArchived,
            isFeatured,
        },
        include: {
            category: true,
            variants: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formattedProducts: ProductColumn[] = products.map((item) => {
        const prices = item.variants.map((v) => Number(v.price));
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const totalStock = item.variants.reduce((acc, v) => acc + v.stock, 0);

        const priceRange = prices.length === 0 
            ? "-" 
            : minPrice === maxPrice 
                ? formatter.format(minPrice)
                : `${formatter.format(minPrice)} - ${formatter.format(maxPrice)}`;

        return {
            id: item.id,
            name: item.name,
            isFeatured: item.isFeatured,
            isArchived: item.isArchived,
            priceRange: priceRange,
            variantCount: item.variants.length,
            totalStock: totalStock,
            category: item.category.name,
            createdAt: format(item.createdAt, "MMMM do, yyyy"),
        }
    })
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts}/>
            </div>
        </div>
    );
}

export default ProductsPage;