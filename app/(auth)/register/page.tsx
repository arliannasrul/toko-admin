import { RegisterForm } from "@/components/auth/register-form";
import Image from "next/image";

const RegisterPage = () => {
  return ( 
    <div className="flex h-screen w-full overflow-hidden">
      {/* Kolom Kiri: Ilustrasi & Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 border-r">
        <Image 
          src="/images/auth-bg.png" 
          alt="Auth Background" 
          fill 
          priority
          sizes="50vw"
          className="object-cover opacity-80"
        />
        {/* Overlay Konten di Kolom Kiri */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent flex flex-col justify-end p-12 space-y-4">
          <div className="flex items-center gap-x-2">
            <div className="h-10 w-10 bg-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold italic">T</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Tokomu Admin
            </h1>
          </div>
          <p className="text-slate-300 text-lg max-w-md">
            Mulai bangun impian e-commerce Anda hari ini. Bergabung bersama ribuan toko modern lainnya.
          </p>
        </div>
      </div>

      {/* Kolom Kanan: Form Register */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 overflow-y-auto">
        <div className="w-full max-w-[400px] py-10 animate-in fade-in slide-in-from-right duration-700">
           <RegisterForm />
        </div>
      </div>
    </div>
   );
}
 
export default RegisterPage;
