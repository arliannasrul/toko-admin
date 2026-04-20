"use client"
import * as z from 'zod';

import { Category, Image, Product, ProductVariant, Attribute, AttributeValue } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Trash, Plus } from "lucide-react";
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import  {AlertModal}  from '@/components/modals/alert-modal';
import ImageUpload from '@/components/ui/image-upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductFormProps {
    initialData: (Product & {
        variants: (ProductVariant & {
            images: Image[];
            attributeValues: AttributeValue[];
        })[]
    }) | null;
    categories: Category[];
    attributes: (Attribute & {
        values: AttributeValue[];
    })[];
}

const variantSchema = z.object({
    id: z.string().optional(),
    price: z.coerce.number().min(1, "Harga harus lebih dari 0"),
    stock: z.coerce.number().min(0, "Stok tidak boleh negatif"),
    // Now we store a map of attributeId -> valueId to ensure one value per attribute category
    selectedValues: z.record(z.string(), z.string()).refine((val) => Object.keys(val).length > 0, {
        message: "Pilih setidaknya satu variasi"
    }),
    images: z.object({ url: z.string() }).array().min(1, "Minimal harus ada 1 foto untuk varian ini"),
});

const formSchema = z.object({
    name: z.string().min(1, "Nama produk wajib diisi"),
    description: z.string().min(1, "Deskripsi wajib diisi"),
    categoryId: z.string().min(1, "Kategori wajib dipilih"),
    isFeatured: z.boolean(),
    isArchived: z.boolean(),
    variants: z.array(variantSchema).min(1, "Minimal harus ada 1 varian produk"),
})

type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm: React.FC<ProductFormProps> = ({initialData, categories, attributes}) => {
    const params = useParams()
    const router = useRouter()
    
    const title = initialData ? "Edit Master Produk" : "Buat Master Produk"
    const description = initialData ? "Kelola informasi produk dan variannya" : "Tambahkan produk baru beserta variannya"
    const toastMassage = initialData ? "Produk berhasil diperbarui" : "Produk berhasil dibuat"
    const action = initialData ? "Simpan Perubahan" : "Buat Produk"

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            description: initialData.description,
            categoryId: initialData.categoryId,
            isFeatured: !!initialData.isFeatured,
            isArchived: !!initialData.isArchived,
            variants: initialData.variants.map((v) => {
                // Convert attributeValues array to a map { [attributeId]: valueId }
                const valMap: Record<string, string> = {};
                v.attributeValues.forEach(av => {
                    valMap[av.attributeId] = av.id;
                });

                return {
                    id: v.id,
                    price: parseFloat(String(v.price)),
                    stock: v.stock,
                    selectedValues: valMap,
                    images: v.images.map((img) => ({ url: img.url }))
                }
            })
        } : {
            name: "",
            description: "",
            categoryId: '',
            isFeatured: false,
            isArchived: false,
            variants: [{
                price: 0,
                stock: 0,
                selectedValues: {},
                images: []
            }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "variants",
    });

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: ProductFormValues) => {
       try {
         setLoading(true)
         if (initialData) {
            await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
         } else {
            await axios.post(`/api/${params.storeId}/products`, data)
         }
         router.refresh()
         router.push(`/${params.storeId}/products`)
         toast.success(toastMassage)
       } catch (error) {
         toast.error("Terjadi kesalahan, periksa kembali inputan Anda.")
       } finally {
         setLoading(false);
       }
     }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success("Produk berhasil dihapus")
        } catch (error) {
            toast.error("Gagal menghapus produk")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
        <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
        />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description}/>
                {initialData && (
                    <Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
                        <Trash className="h-4 w-4"/>
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 w-full pb-20">
                    
                    {/* General Information Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-x-2">
                             <div className="h-8 w-2 bg-sky-600 rounded-full" />
                             <h2 className="text-xl font-bold">Informasi Umum</h2>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Produk Utama</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Contoh: HP Pavilion Gaming 15' disabled={loading} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kategori Produk</FormLabel>
                                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} placeholder="Pilih Kategori" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="md:col-span-2">
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Deskripsi Lengkap Produk</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder='Tuliskan deskripsi umum produk di sini...' disabled={loading} {...field} className="min-h-[120px]" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="isFeatured"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 bg-slate-50/50">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className='space-y-1 leading-none'>
                                            <FormLabel>Tampilkan di Home (Featured)</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isArchived"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 bg-slate-50/50">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className='space-y-1 leading-none'>
                                            <FormLabel>Arsipkan Produk</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Variants Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-x-2">
                                <div className="h-8 w-2 bg-sky-600 rounded-full" />
                                <h2 className="text-xl font-bold">Varian Produk</h2>
                                <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-md text-xs font-bold">{fields.length} Varian</span>
                            </div>
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => append({ price: 0, stock: 0, selectedValues: {}, images: [] })}
                                className="flex items-center gap-x-2 border-sky-200 text-sky-700 hover:bg-sky-50"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Varian Baru
                            </Button>
                        </div>

                        <div className="space-y-8">
                            {fields.map((field, index) => (
                                <Card key={field.id} className="relative overflow-hidden border-slate-200 shadow-sm transition-all hover:shadow-md">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-sky-600" />
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/30">
                                        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                            Variant #{index + 1}
                                        </CardTitle>
                                        {fields.length > 1 && (
                                             <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => remove(index)}
                                                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                            {/* Variant Images */}
                                            <div className="lg:col-span-4 border-b pb-6">
                                                <FormField
                                                    control={form.control}
                                                    name={`variants.${index}.images`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="font-bold text-slate-700">Foto Varian Ini</FormLabel>
                                                            <FormControl>
                                                                <ImageUpload
                                                                    disabled={loading}
                                                                    onChange={(url) => field.onChange([...field.value, {url}])}
                                                                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                                                    value={field.value.map((image) => image.url)}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Variant Price */}
                                            <FormField
                                                control={form.control}
                                                name={`variants.${index}.price`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Harga (Rp)</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" placeholder="0" disabled={loading} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Variant Stock */}
                                            <FormField
                                                control={form.control}
                                                name={`variants.${index}.stock`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Stok</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" placeholder="0" disabled={loading} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Dynamic Attributes Mapping */}
                                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {attributes.map((attr) => (
                                                    <FormField
                                                        key={attr.id}
                                                        control={form.control}
                                                        name={`variants.${index}.selectedValues.${attr.id}`}
                                                        render={({ field: selectField }) => (
                                                            <FormItem>
                                                                <FormLabel>Pilih {attr.name}</FormLabel>
                                                                <Select 
                                                                    disabled={loading} 
                                                                    onValueChange={selectField.onChange} 
                                                                    value={selectField.value || ""} 
                                                                    defaultValue={selectField.value || ""}
                                                                >
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder={`Pilih ${attr.name}`} />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {attr.values.map((v) => (
                                                                            <SelectItem key={v.id} value={v.id}>
                                                                                <div className="flex items-center gap-x-2">
                                                                                    {v.value && (
                                                                                        <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: v.value }} />
                                                                                    )}
                                                                                    {v.name}
                                                                                </div>
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-end gap-x-4 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                        <Button disabled={loading} variant="outline" type="button" onClick={() => router.push(`/${params.storeId}/products`)}>
                            Batal
                        </Button>
                        <Button disabled={loading} className="bg-sky-600 hover:bg-sky-700 min-w-[150px]" type="submit">
                            {action}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
};