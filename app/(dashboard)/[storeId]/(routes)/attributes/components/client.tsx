"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

import { AttributeColumn, columns } from "./column";

interface AttributeClientProps {
  data: AttributeColumn[];
}

export const AttributeClient: React.FC<AttributeClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Attributes (${data.length})`} description="Manage your product attributes (RAM, Storage, Color, etc.)" />
        <Button onClick={() => router.push(`/${params.storeId}/attributes/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Attributes" />
      <Separator />
      <ApiList namaIndikator="attributes" idIndikator="attributeId" />
    </>
  );
};
