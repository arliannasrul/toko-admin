import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { Sidebar } from "@/components/sidebar";
import { MobileAdminNav } from "@/components/mobile-admin-nav";

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
      <Sidebar stores={stores} currentStoreId={params.storeId} />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="md:hidden p-4 flex items-center justify-between border-b bg-white dark:bg-slate-950">
           <MobileAdminNav stores={stores} />
           <span className="font-bold text-sm">MitraSpace</span>
           <div className="w-8" /> {/* Spacer to center the title */}
        </div>
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
