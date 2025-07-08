// arliannasrul/toko-admin/toko-admin-58ba32a6833f7446551d61ddc8c126baad028b60/app/(dashboard)/[storeId]/(routes)/products/components/client.tsx
"use client"

import { Button } from "@/components/ui/button" //
import { Heading } from "@/components/ui/heading" //
import { Separator } from "@/components/ui/separator" //
import { Plus } from "lucide-react"
import { useParams, useRouter, useSearchParams } from "next/navigation" // Modifikasi di sini: Tambah useSearchParams
import { ProductColumn, columns } from "./column" ///(routes)/products/components/column.ts]
import { DataTable } from "@/components/ui/data-table" //
import { ApiList } from "@/components/ui/api-list" //
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Modifikasi di sini: Tambah import Select components

interface ProductClientProps {
    data: ProductColumn[]
}

export const ProductClient: React.FC<ProductClientProps> = ({data}) => {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams() // Modifikasi di sini: Dapatkan searchParams

    // Dapatkan nilai filter saat ini dari URL
    const currentIsArchived = searchParams.get("isArchived") || "all"
    const currentIsFeatured = searchParams.get("isFeatured") || "all"


    // Fungsi untuk menangani perubahan filter
    const handleFilterChange = (filterName: string, value: string) => {
        const newSearchParams = new URLSearchParams(searchParams.toString())
        if (value === "all") {
            newSearchParams.delete(filterName)
        } else {
            newSearchParams.set(filterName, value)
        }
        router.replace(`/${params.storeId}/products?${newSearchParams.toString()}`)
    }

    return(
        <>
            <div className="flex items-center justify-between ">
                <Heading title={`Product (${data.length})`} description="Atur Product Untuk Toko"/>
                <Button onClick={() => router.push(`/${params.storeId}/products/new`) }>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <div className="p-12">
                <div className="flex items-center py-4 space-x-4"> {/* Tambah space-x-4 untuk jarak antar filter */}
                    <Select
                        onValueChange={(value) => handleFilterChange("isArchived", value)}
                        value={currentIsArchived}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter Archived" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Produk</SelectItem>
                            <SelectItem value="false">Produk Aktif</SelectItem>
                            <SelectItem value="true">Produk Diarsipkan</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        onValueChange={(value) => handleFilterChange("isFeatured", value)}
                        value={currentIsFeatured}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter Featured" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Produk</SelectItem>
                            <SelectItem value="false">Bukan Unggulan</SelectItem>
                            <SelectItem value="true">Produk Unggulan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DataTable  data={data} columns={columns} searchKey="name" /> {/* */}
            </div>
            <Heading
            title= "API"
            description="API untuk Products"
            />
            <Separator />
            <ApiList namaIndikator="products" idIndikator="productId" /> {/* */}
        </>
    )
}