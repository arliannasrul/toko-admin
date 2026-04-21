import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db"

export default async function setupLayout ({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const userId = session?.user?.id;


    return (
        <>
        {children}
        </>
    )
}