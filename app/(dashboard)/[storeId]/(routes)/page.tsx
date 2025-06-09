import db from "/lib/db";

interface DashboardPageProps {
    params: {storeID: string};
}

const DashboardPage = async ({params} : DashboardPageProps) => {
    const store = await db.store.findFirst({
        where: {
            id: params.storeID
        }
    })
    return ( 
        <div>
            Active Store = {store?.name || "No Store Found"}
        </div>
    );
}
export default DashboardPage;