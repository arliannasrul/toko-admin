import { NextResponse } from "next/server";
import db from "@/lib/db";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { variantIds } = await req.json();

    if (!variantIds || variantIds.length === 0) {
      return new NextResponse("Variant ids are required", { status: 400 });
    }

    const variants = await db.productVariant.findMany({
      where: {
        id: {
          in: variantIds
        }
      }
    });

    const order = await db.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false, 
        orderItems: {
          create: variantIds.map((variantId: string) => ({
            variant: {
              connect: {
                id: variantId
              }
            }
          }))
        }
      }
    });

    // In a real Stripe implementation, you would return a session URL here.
    // For this simulation, we'll return the created order.

    return NextResponse.json({ orderId: order.id }, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log('[CHECKOUT_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
