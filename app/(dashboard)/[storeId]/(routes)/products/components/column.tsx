// arliannasrul/toko-admin/toko-admin-58ba32a6833f7446551d61ddc8c126baad028b60/app/(dashboard)/[storeId]/(routes)/products/components/column.ts
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type ProductColumn = {
  id: string
  name: string
  priceRange: string
  totalStock: number
  variantCount: number
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
    accessorKey: "priceRange",
    header: "Price Range",
  },
  {
    accessorKey: "variantCount",
    header: "Variants",
  },
  {
    accessorKey: "totalStock",
    header: "Total Stock",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => (row.original.isFeatured ? "Yes" : "No"),
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
    cell: ({ row }) => (row.original.isArchived ? "Yes" : "No"),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "action",
    cell: ({row}) => <CellAction data={row.original}/>
  }
]