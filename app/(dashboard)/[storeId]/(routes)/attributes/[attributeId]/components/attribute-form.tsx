"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash, Plus, X } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Attribute, AttributeValue } from "@/app/generated/prisma"
import { Card, CardContent } from "@/components/ui/card"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  values: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Value label is required (e.g. 8GB)"),
    value: z.string().optional().nullable(), // For hex code if it's a color
  })).min(1, "At least one value is required")
});

type AttributeFormValues = z.infer<typeof formSchema>

interface AttributeFormProps {
  initialData: (Attribute & {
    values: AttributeValue[]
  }) | null;
};

export const AttributeForm: React.FC<AttributeFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Attribute' : 'Create Attribute';
  const description = initialData ? 'Edit a product attribute.' : 'Add a new product attribute';
  const toastMessage = initialData ? 'Attribute updated.' : 'Attribute created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<AttributeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
        name: initialData.name,
        values: initialData.values.map(v => ({
            id: v.id,
            name: v.name,
            value: v.value || ""
        }))
    } : {
      name: '',
      values: [{ name: '', value: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "values",
  });

  const onSubmit = async (data: AttributeFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/attributes/${params.attributeId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/attributes`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/attributes`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/attributes/${params.attributeId}`);
      router.refresh();
      router.push(`/${params.storeId}/attributes`);
      toast.success('Attribute deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all products using this attribute first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
    <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
     <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="max-w-md">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Attribute Category Name</FormLabel>
                    <FormControl>
                    <Input disabled={loading} placeholder="e.g. RAM, Storage, Color" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Attribute Values (Options)</h3>
                <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => append({ name: '', value: '' })}
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Value
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field, index) => (
                    <Card key={field.id} className="border-slate-200">
                        <CardContent className="pt-6 relative">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-slate-400 hover:text-rose-500"
                                onClick={() => remove(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name={`values.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Label (Option)</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="e.g. 8GB, Space Gray" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`values.${index}.value`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Value (Optional: e.g. #000000 for color circles)</FormLabel>
                                            <div className="flex items-center gap-x-2">
                                                <FormControl>
                                                    <Input disabled={loading} placeholder="#hexcode" {...field} value={field.value || ""} />
                                                </FormControl>
                                                {field.value && (
                                                     <div className="h-8 w-8 rounded-full border" style={{ backgroundColor: field.value }} />
                                                )}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
