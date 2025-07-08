// arliannasrul/toko-admin/toko-admin-58ba32a6833f7446551d61ddc8c126baad028b60/app/(dashboard)/[storeId]/(routes)/products/components/column.ts
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action" ///(routes)/products/components/cell-action.tsx]

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string
  name: string
  price: string
  category: string
  isFeatured: boolean
  isArchived: boolean
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
    cell: ({ row }) => (row.original.isArchived ? "Yes" : "No"), // Modifikasi di sini
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => (row.original.isFeatured ? "Yes" : "No"), // Tambahkan juga untuk isFeatured agar konsisten
  },
   {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "action",
    cell: ({row}) => <CellAction data={row.original}/> ///(routes)/products/components/cell-action.tsx]
  }
]