import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
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

  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect(`/`);
  }

  return (
    <>
      <div className="">
        <Navbar currentStoreId={params.storeId} />
        {children}
      </div>
    </>
  );
}
