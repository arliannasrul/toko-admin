import  db  from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = await auth();
        const  body = await req.json();
        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
        if (!label) {
            return new NextResponse("Banners name is required", { status: 400 });
        }
         if (!imageUrl) {
            return new NextResponse("Image Banners  is required", { status: 400 });
        }
        if (!params.storeId) {
            return new NextResponse("store id URL dibutuhkan")
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403})
        }

    
        const banner = await db.banner.create({
            data: { label, imageUrl, storeId: params.storeId},
        });

        return  NextResponse.json(banner, { status: 200 });
    } catch (error) {
        console.error("[BANNERS_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse("store id URL dibutuhkan")
        }


    
        const banner = await db.banner.findMany({
            where: {storeId: params.storeId}
        });

        return  NextResponse.json(banner, { status: 200 });
    } catch (error) {
        console.error("[BANNERS_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


