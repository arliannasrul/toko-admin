"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { signIn } from "next-auth/react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { FcGoogle } from "react-icons/fc"
import Link from "next/link"
import { register } from "@/actions/register"

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password minimal 6 karakter"),
  name: z.string().min(1, "Nama wajib diisi"),
})

export const RegisterForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setLoading(true)
    try {
      const data = await register(values)
      if (data.error) {
        toast.error(data.error)
      }
      if (data.success) {
        toast.success("Akun berhasil dibuat! Silakan login.")
        router.push("/login")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const onSocialClick = (provider: "google") => {
    signIn(provider, {
        callbackUrl: "/"
    })
  }

  return (
    <Card className="w-[400px] shadow-md border-none bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Daftar Akun</CardTitle>
        <CardDescription className="text-center">
          Buat akun baru untuk mulai mengelola toko Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} placeholder="Nama Anda" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} placeholder="email@contoh.com" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} placeholder="******" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={loading} type="submit" className="w-full">
              Daftar
            </Button>
          </form>
        </Form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Atau daftar dengan</span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onSocialClick("google")}
          disabled={loading}
        >
          <FcGoogle className="h-5 w-5 mr-2" />
          Google
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Login di sini
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
