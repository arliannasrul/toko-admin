import db from "@/lib/db";
import { AttributeClient } from "./components/client";
import { AttributeColumn } from "./components/column";
import { format } from "date-fns";

const AttributesPage = async ({ params }: { params: { storeId: string } }) => {
    const attributes = await db.attribute.findMany({
        where: { storeId: params.storeId },
        include: {
            values: true
        },
        orderBy: { createdAt: "desc" }
    });

    const formattedAttributes: AttributeColumn[] = attributes.map((item) => ({
        id: item.id,
        name: item.name,
        valueCount: item.values.length,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <AttributeClient data={formattedAttributes} />
            </div>
        </div>
    );
};

export default AttributesPage;
