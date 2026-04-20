import { NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { attributeId: string } }
) {
  try {
    if (!params.attributeId) {
      return new NextResponse("Attribute id is required", { status: 400 });
    }

    const attribute = await db.attribute.findUnique({
      where: {
        id: params.attributeId
      },
      include: {
        values: true
      }
    });

    return NextResponse.json(attribute);
  } catch (error) {
    console.log('[ATTRIBUTE_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, attributeId: string } }
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

    if (!params.attributeId) {
      return new NextResponse("Attribute id is required", { status: 400 });
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

    // Surgical update: We update the attribute and use a transaction-like approach for values
    await db.attribute.update({
      where: {
        id: params.attributeId,
      },
      data: {
        name,
        // We clear existing values and recreate them for simplicity in this dynamic form
        // Alternatively, we could do a smart diff, but this is safer for fieldArray updates
        values: {
            deleteMany: {},
            createMany: {
                data: values ? values.map((val: { name: string, value?: string }) => ({
                    name: val.name,
                    value: val.value
                })) : []
            }
        }
      }
    });

    const attribute = await db.attribute.findUnique({
        where: {
            id: params.attributeId
        },
        include: {
            values: true
        }
    });

    return NextResponse.json(attribute);
  } catch (error) {
    console.log('[ATTRIBUTE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string, attributeId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.attributeId) {
      return new NextResponse("Attribute id is required", { status: 400 });
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

    const attribute = await db.attribute.delete({
      where: {
        id: params.attributeId,
      }
    });

    return NextResponse.json(attribute);
  } catch (error) {
    console.log('[ATTRIBUTE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
