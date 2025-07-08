// app/(dashboard)/[storeId]/(routes)/categories/[categoryId]/components/category-form-client.tsx
"use client"

import { CategoryForm } from "./category-form"
import { Category, Banner } from "@/app/generated/prisma"

export default function CategoryFormClient({
  initialData,
  banners,
}: {
  initialData: Category | null;
  banners: Banner[];
}) {
  return <CategoryForm initialData={initialData} banners={banners} />
}
