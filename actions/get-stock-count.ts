import db from "@/lib/db";

export const getStockCount = async (storeId: string) => {
  const products = await db.product.findMany({
    where: {
      storeId,
      isArchived: false,
    },
    include: {
      variants: true
    }
  });

  const totalStock = products.reduce((acc, product) => {
    const productStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
    return acc + productStock;
  }, 0);

  return totalStock;
};
