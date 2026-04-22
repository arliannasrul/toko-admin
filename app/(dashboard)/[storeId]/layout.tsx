import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { Sidebar } from "@/components/sidebar";
import Navbar from "@/components/navbar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const stores = await db.store.findMany({
    where: {
      userId,
    },
  });

  const store = stores.find((s) => s.id === params.storeId);

  if (!store) {
    redirect(`/`);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar stores={stores} />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar currentStoreId={params.storeId} />
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
