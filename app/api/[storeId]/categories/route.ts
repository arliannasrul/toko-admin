import  db  from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = await auth();
        const  body = await req.json();
        const { name, bannerId } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
        if (!name) {
            return new NextResponse("Category name is required", { status: 400 });
        }
         if (!bannerId) {
            return new NextResponse("Banners Id is required", { status: 400 });
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

    
        const category = await db.category.create({
            data: { name, bannerId, storeId: params.storeId},
        });

        return  NextResponse.json(category, { status: 200 });
    } catch (error) {
        console.error("[CATEGORIES_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse("store id URL dibutuhkan")
        }


    
        const categories = await db.category.findMany({
            where: {storeId: params.storeId}
        });

        return  NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error("[CATEGORIES_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


