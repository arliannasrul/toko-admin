import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { SetupClient } from "./components/setup-client";

const SetupPage = async () => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    // Mengecek apakah user sudah punya toko
    const store = await db.store.findFirst({
        where: {
            userId
        }
    });

    // Jika sudah ada, langsung lempar ke dashboard toko tersebut
    if (store) {
        redirect(`/${store.id}`);
    }

    // Jika belum ada, tampilkan client component untuk buka modal
    return <SetupClient />;
};

export default SetupPage;
