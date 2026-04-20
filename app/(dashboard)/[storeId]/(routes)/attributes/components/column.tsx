"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type AttributeColumn = {
  id: string
  name: string
  valueCount: number
  createdAt: string
}

export const columns: ColumnDef<AttributeColumn>[] = [
  {
    accessorKey: "name",
    header: "Nama Atribut",
  },
  {
    accessorKey: "valueCount",
    header: "Jumlah Pilihan",
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal Dibuat",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
