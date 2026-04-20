"use client"


import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { BannerColumn, columns } from "./column"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"
import { EmptyState } from "@/components/ui/empty-state"
import { Image } from "lucide-react"

interface BannerClientProps {
    data: BannerColumn[]
}

export const BannerClient: React.FC<BannerClientProps> = ({data}) => {
    const router = useRouter()
    const params = useParams()
    return(
        <>
            <div className="flex items-center justify-between ">
                <Heading title={`Banners (${data.length})`} description="Atur Banner Untuk Toko"/>
                <Button onClick={() => router.push(`/${params.storeId}/banners/new`) }>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <div className="p-12">
                {data.length === 0 ? (
                    <EmptyState 
                        title="Belum ada Banner" 
                        description="Mulai tambahkan banner untuk mempercantik tampilan toko Anda." 
                        icon={Image}
                        actionLabel="Tambah Banner"
                        actionPath={`/${params.storeId}/banners/new`}
                    />
                ) : (
                    <DataTable data={data} columns={columns } searchKey="label" />
                )}
            </div>
            <Heading title="API" description="API untuk Banners"/>
            <Separator />
            <ApiList namaIndikator="banners" idIndikator="bannerId"/>
        </>
    )
}