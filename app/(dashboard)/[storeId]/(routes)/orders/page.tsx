import { format } from "date-fns";
import db from "@/lib/db";
import { formatter } from "@/lib/utils";
import { OrderClient } from "@/app/(dashboard)/[storeId]/(routes)/orders/components/client";
import { OrderColumn } from "@/app/(dashboard)/[storeId]/(routes)/orders/components/columns";

const OrdersPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const orders = await db.order.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      orderItems: {
        include: {
          variant: {
            include: {
              product: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map((orderItem) => orderItem.variant.product.name).join(', '),
    totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
      return total + Number(item.variant.price)
    }, 0)),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
