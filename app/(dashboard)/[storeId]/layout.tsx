import { redirect } from "next/dist/server/api-utils";

export default async funtion DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {storeId: string};
}) {
    const { userId } =auth(); 
    if (!userId) {
        redirect ("sign-in")
    }
    const store = await db.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    })

    if (!store) {
        redirect('/')
    }

    return (
        <>
        <div>This is Navbar</div>
        {children}
        
        </>
    )
}