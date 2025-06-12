

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MainNav } from './main-nav';
import  StoreSwitcher  from './store-switcher';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import db from '@/lib/db';

const Navbar = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const stores = await db.store.findMany()
    where: {
      userId
    }
  return (
    <header className="flex items-center justify-between p-4 h-16 border-b bg-white/10 backdrop-blur-md sticky top-0 z-50">
      
      {/* Bagian Kiri: Logo atau Nama Brand */}
      <div>
        <Link href="/" className="text-xl font-bold hover:text-gray-700">
          Tokomu
        </Link>
      </div>

      {/* Bagian Tengah: Link Navigasi Utama (Hanya muncul saat login) */}
      <SignedIn> {/* <-- CUKUP TAMBAHKAN INI */}
        <StoreSwitcher items={stores} />
        <MainNav className='mx-6'/>
      </SignedIn> {/* <-- DAN PENUTUPNYA DI SINI */}


      {/* Bagian Kanan: Tombol Autentikasi dan User */}
      <div className="flex items-center gap-4">
        <SignedOut>
          <div className='hover:text-[#08a4a7] text-sm font-medium'>
            <SignInButton mode="modal" />
          </div>
          <div className='hover:text-[#08a4a7] text-sm font-medium'>
            <SignUpButton mode="modal" />
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

    </header>
  );
}

export default Navbar;