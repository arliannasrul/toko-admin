import db from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        const body = await req.json()

        const {name} = body

        if (!userId) {
            return new NextResponse("unauthorized", { status: 401 })
        }

        // Pastikan user ada di database (mencegah error fkey setelah reset db)
        const userExists = await db.user.findUnique({
            where: { id: userId }
        });

        if (!userExists) {
            return new NextResponse("User not found. Please logout and login again.", { status: 401 })
        }

        if (!name) {
            return new NextResponse("Nama toko perlu diisi", { status: 400 })
        }

        const store = await db.store.create({
            data: {
                name,
                userId
            }
        })

        return NextResponse.json(store, { status: 201 })

    } catch (error) {
        console.log("[STORE_POST]", error)
        return new NextResponse("internal error", { status: 500 })
    }
}