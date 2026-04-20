import { NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const body = await req.json();

    const { name, values } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const attribute = await db.attribute.create({
      data: {
        name,
        storeId: params.storeId,
        values: {
          createMany: {
            data: values ? values.map((val: { name: string, value?: string }) => ({
               name: val.name,
               value: val.value
            })) : []
          }
        }
      }
    });

    return NextResponse.json(attribute);
  } catch (error) {
    console.log('[ATTRIBUTES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const attributes = await db.attribute.findMany({
      where: {
        storeId: params.storeId
      },
      include: {
        values: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(attributes);
  } catch (error) {
    console.log('[ATTRIBUTES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
