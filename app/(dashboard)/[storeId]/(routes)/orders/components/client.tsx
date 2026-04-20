"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { OrderColumn, columns } from "./columns";
import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingBag } from "lucide-react";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({
  data
}) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />
      <Separator />
      <div className="py-4">
        {data.length === 0 ? (
          <EmptyState 
            title="Belum ada Pesanan" 
            description="Pesanan dari pelanggan akan muncul secara otomatis di sini." 
            icon={ShoppingBag}
          />
        ) : (
          <DataTable 
            searchKey="products" 
            columns={columns} 
            data={data} 
          />
        )}
      </div>
    </>
  );
};
