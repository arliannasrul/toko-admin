"use client"
import * as z from 'zod';

import { Store } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import  {AlertModal}  from '@/components/modals/alert-modal';
import { ApiAlert } from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';

interface SettingsFormProps {
    initialData: Store
}

const formSchema = z.object({
    name: z.string().min(3)
})

type SettingsFormValues = z.infer<typeof formSchema>;


export const SettingsForm: React.FC<SettingsFormProps> = ({initialData}) => {
    const params = useParams()
    const router = useRouter()
    const origin = useOrigin()
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData 
    });

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: SettingsFormValues) => {
       try {
         setLoading(true)
         await axios.patch(`/api/stores/${params.storeId}`, data)
         router.refresh()
            toast.success("Store updated successfully")
       } catch (error) {
        toast.error ("recheck your input")
        
       } finally {
        setLoading(false);
       }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh()
            router.push('/')
            toast.success("Store was successfull deleted")
        } catch (error) {
            toast.error("something went wrong")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }
    return (
        <>
        <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading}/>

            <div className="flex items-center justify-between">
                <Heading 
                title="Settings"
                description="Atur Toko"/>

                <Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
                    <Trash className="h-4 w-4"/>
                </Button>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField control={form.control} name="name" render={({field}) => (
                            <FormItem>
                                <FormLabel>Nama</FormLabel>
                                <FormControl>
                                    <Input placeholder='Nama Toko' disabled={loading} {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        ) }/>

                    </div>
                    <Button disabled={loading} className='ml-auto' type="submit">
                        Save
                    </Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert title="PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant='public'/>
        </>
    )
}