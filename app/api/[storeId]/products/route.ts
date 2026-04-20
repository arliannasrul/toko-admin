import db from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
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
            return new NextResponse("Unauthenticated", { status: 401 });
        }
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }
        if (!categoryId) {
            return new NextResponse("Category is required", { status: 400 });
        }
        if (!variants || !variants.length) {
            return new NextResponse("At least one variant is required", { status: 400 });
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

        const product = await db.product.create({
            data: {
                name,
                description,
                categoryId,
                isFeatured,
                isArchived,
                storeId: params.storeId,
                variants: {
                    create: variants.map((variant: any) => ({
                        price: variant.price,
                        stock: variant.stock,
                        images: {
                            createMany: {
                                data: variant.images.map((image: { url: string }) => ({
                                    url: image.url
                                }))
                            }
                        },
                        attributeValues: {
                            connect: Object.values(variant.selectedValues).map((id: any) => ({ id }))
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
        console.error("[PRODUCTS_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const isFeatured = searchParams.get("isFeatured");

        if (!params.storeId) {
            return new NextResponse("store id URL dibutuhkan");
        }

        const products = await db.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
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
            },
            orderBy: {
                createdAt: 'desc'
            },
        });

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("[PRODUCTS_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
