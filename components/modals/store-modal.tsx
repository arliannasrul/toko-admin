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
import { useRouter } from "next/navigation"; // ✅ Tambahkan ini

const formSchema = z.object({
    name : z.string().min(1),
});


export const StoreModal = () => {
      const router = useRouter(); // ✅ Tambahkan ini
    const [loading, setLoading] = useState(false);
    const StoreModal = useStoreModal();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), 
        defaultValues: {
        name: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        setLoading(true)
        const response = await axios.post('/api/stores', values);

        console.log(response.data);
        toast.success("Toko berhasil dibuat")
         router.push(`/${response.data.id}`); // ✅ Redirect ke toko
         StoreModal.onClose(); // <-- Tambahkan ini untuk menutup modal
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