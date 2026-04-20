import  db  from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: {  bannerId: string } }) {
    try {

      
        if (!params.bannerId) {
            return new NextResponse("Banner ID is required", { status: 400 });
        }


        const banner = await db.banner.findMany({
            where: { id: params.bannerId },
           
        });


        return NextResponse.json(banner, { status: 200 });
    } catch (error) {
        console.error("[BANNER_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, bannerId: string} }) {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        const  body = await req.json();
        const { label, imageUrl} = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 })
        }
        if (!label) {
            return new NextResponse("Banner label is required", { status: 400 });
        }
        if (!imageUrl) {
        return new NextResponse("Image url is required", { status: 400 });
        }
        if (!params.bannerId) {
            return new NextResponse("Banner ID is required", { status: 400 });
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
        const banner = await db.banner.updateMany({
            where: { id: params.bannerId  },
            data: { label, imageUrl },
        });

        return NextResponse.json(banner, { status: 200 });
    } catch (error) {
        console.error("[BANNER_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, bannerId: string } }) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
      
        if (!params.bannerId) {
            return new NextResponse("Banner ID is required", { status: 400 });
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
        const banner = await db.banner.deleteMany({
            where: { id: params.bannerId },
           
        });


        return  NextResponse.json(banner, { status: 200 });
    } catch (error) {
        console.error("[BANNER_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}