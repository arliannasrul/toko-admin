import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { SettingsForm } from "./components/settings-form";

interface SettingsPageProps {
    params: {storeId: string};  

}
const SettingsPage: React.FC<SettingsPageProps> = async ({
    params
}) =>  {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect('/login');
    }

    const store = await db.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    })
      // 🔴 Tambahkan pengecekan jika store tidak ditemukan
  if (!store) {
    redirect("/"); // atau tampilkan pesan error
  }
    return (
        <>
            <div className="flex flex-col   h-full">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <SettingsForm initialData={store} />
                </div>
            </div>
        </>
    );
}

export default SettingsPage;