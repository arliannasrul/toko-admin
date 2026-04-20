import db from "@/lib/db";

export const getRevenue = async (storeId: string) => {
  const paidOrders = await db.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return orderSum + Number(item.variant.price);
    }, 0);
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
