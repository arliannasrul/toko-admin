import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [], stores: [] });
    }

    const [products, stores] = await Promise.all([
      db.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ],
          isArchived: false
        },
        include: {
          category: true,
          variants: {
            take: 1,
            include: { images: true }
          }
        },
        take: 5
      }),
      db.store.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' }
        },
        take: 3
      })
    ]);

    return NextResponse.json({ products, stores });
  } catch (error) {
    console.error("[SEARCH_API_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
