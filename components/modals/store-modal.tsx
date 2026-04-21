"use client"

import * as z from "zod"

import { useStoreModal } from "@/hooks/use-store-modal"
import Modal from "../ui/modal"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const storeTypes = [
    "Pakaian & Fashion",
    "Elektronik & Gadget",
    "Makanan & Minuman",
    "Kesehatan & Kecantikan",
    "Jasa & Layanan",
    "Karya Seni & Kerajinan",
    "Lainnya"
];

const formSchema = z.object({
    name : z.string().min(1, { message: "Nama toko wajib diisi" }),
    type : z.string().min(1, { message: "Tipe toko wajib dipilih" })
});


export const StoreModal = () => {
      const router = useRouter(); // ✅ Tambahkan ini
    const [loading, setLoading] = useState(false);
    const StoreModal = useStoreModal();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), 
        defaultValues: {
            name: "",
            type: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        setLoading(true)
        const response = await axios.post('/api/stores', values);

        console.log(response.data);
        toast.success("Toko berhasil dibuat")
        window.location.assign(`/${response.data.id}`);
    } catch (error) {
        toast.error("Gagal Membuat Toko")
    } finally {
        setLoading(false)}
      
    };

    return(
        <Modal
        title="Buat Store"
        description="Tambahkan Store untuk membuat produk dan kategori"
        isOpen={StoreModal.isOpen}
        onClose={StoreModal.onClose}
        >
        <div>
            <div className="space-y-4 py-2 pb-4">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField 
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input 
                                placeholder="Nama Toko"
                                {...field} 
                                disabled={loading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField 
                    control={form.control}
                    name="type"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Tipe Toko</FormLabel>
                            <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Tipe Toko" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {storeTypes.map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                        <Button
                        disabled={loading} variant="outline"
                        onClick={StoreModal.onClose}
                        >Cancel</Button>
                        <Button disabled={loading} type="submit">Continue</Button>
                    </div>
                </form>
                </Form>
            </div>
        </div>
        </Modal>
    )
}