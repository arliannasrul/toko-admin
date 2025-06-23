import  db  from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: {  productId: string } }) {
    try {

      
        if (!params.productId) {
            return new NextResponse("Product Id is required", { status: 400 });
        }


        const product = await db.product.findMany({
            where: { id: params.productId },
            include: {images: true, category:true}
        });


        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("[PRODUCT_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, productId: string} }) {
    try {
        const { userId } = await auth();
        const  body = await req.json();
        const { name, price, categoryId, images, isFeatured, isArchived } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
       if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }
         if (!images || !images.length) {
            return new NextResponse("Images is required", { status: 400 });
        }
        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }
        if (!categoryId) {
            return new NextResponse("Category is required", { status: 400 });
        }
        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 });
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
        await db.product.update({
            where: { id: params.productId  },
            data: { name, price, isFeatured, isArchived,categoryId, images: {deleteMany: {}},},
        });

        const product = await db.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("[    PRODUCT_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, productId: string } }) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
      
        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 });
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
        const product = await db.product.deleteMany({
            where: { id: params.productId },
           
        });


        return  NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("[PRODUCT_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}