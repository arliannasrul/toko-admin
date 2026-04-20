"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

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

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
})

export const LoginForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setLoading(true)
    try {
      const callback = await signIn("credentials", {
        ...values,
        redirect: false,
      })

      if (callback?.error) {
        toast.error("Invalid credentials")
      }

      if (callback?.ok && !callback?.error) {
        toast.success("Logged in!")
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      toast.error("Something went wrong")
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
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Selamat datang kembali! Silakan masuk ke akun Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              Login
            </Button>
          </form>
        </Form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Atau lanjut dengan</span>
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
          Belum punya akun?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Daftar Sekarang
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
