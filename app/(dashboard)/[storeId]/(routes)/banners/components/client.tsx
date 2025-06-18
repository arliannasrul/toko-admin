"use client"

import { Banner } from "@/app/generated/prisma"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

interface BannerClientProps {
    data: Banner[]
}

export const BannerClient: React.FC<BannerClientProps> = ({data}) => {
    const router = useRouter()
    const params = useParams()
    return(
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Banners (${data.length})`} description="Atur Banner Untuk Toko"/>
                <Button onClick={() => router.push(`/${params.storeId}/banners/new`) }>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />

        </>
    )
}