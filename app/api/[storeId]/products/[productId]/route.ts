import db from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { productId: string } }) {
    try {
        if (!params.productId) {
            return new NextResponse("Product Id is required", { status: 400 });
        }

        const product = await db.product.findUnique({
            where: { id: params.productId },
            include: {
                category: true,
                variants: {
                    include: {
                        images: true,
                        attributeValues: {
                            include: {
                                attribute: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("[PRODUCT_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, productId: string } }) {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        const body = await req.json();
        
        const { 
            name, 
            description, 
            categoryId, 
            isFeatured, 
            isArchived, 
            variants 
        } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }
        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 });
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // Update base product info
        await db.product.update({
            where: { id: params.productId },
            data: {
                name,
                description,
                categoryId,
                isFeatured,
                isArchived,
            }
        });

        // Simple sync strategy for variants: delete all and recreate
        // Warning: In production, you'd want to keep existing IDs to preserve order history
        await db.productVariant.deleteMany({
            where: { productId: params.productId }
        });

        const product = await db.product.update({
            where: { id: params.productId },
            data: {
                variants: {
                    create: variants.map((variant: any) => ({
                        price: variant.price,
                        stock: variant.stock,
                        attributeValues: {
                            connect: Object.values(variant.selectedValues).map((id: any) => ({ id }))
                        },
                        images: {
                            createMany: {
                                data: variant.images.map((image: { url: string }) => ({
                                    url: image.url
                                }))
                            }
                        }
                    }))
                }
            },
            include: {
                variants: {
                    include: {
                        images: true
                    }
                }
            }
        });

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("[PRODUCT_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, productId: string } }) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 });
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const product = await db.product.delete({
            where: { id: params.productId }
        });

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("[PRODUCT_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}