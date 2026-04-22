import Link from 'next/link';
import { MainNav } from './main-nav';
import StoreSwitcher from './store-switcher';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { ThemeToggle } from './theme-toggle';
import Image from 'next/image';
import { UserNav } from './user-nav';
import { MobileAdminNav } from './mobile-admin-nav';

interface NavbarProps {
  currentStoreId?: string;
}

const Navbar = async ({ currentStoreId }: NavbarProps) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect('/login');
  }

  const stores = await db.store.findMany({
    where: {
      userId,
    } as any, // Cast as any because Prisma types might be syncing
  });

  return (
    <header className="flex items-center justify-between p-4 h-16 border-b bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 z-30 w-full">
      
      {/* Bagian Kiri: Mobile Nav & Logo */}
      <div className="flex items-center gap-x-4">
        <div className="md:hidden">
          <MobileAdminNav stores={stores} />
        </div>
        <Link href="/" className="flex items-center gap-x-2 text-xl font-bold hover:text-gray-700">
          {stores.find(s => s.id === currentStoreId)?.logoUrl ? (
             <div className="relative h-10 w-32 md:w-40">
               <Image fill src={stores.find(s => s.id === currentStoreId)?.logoUrl!} alt="Logo" className="object-contain object-left" />
             </div>
          ) : (
            <span className="text-sm md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-indigo-600">
               {stores.find(s => s.id === currentStoreId)?.name || "MitraSpace"}
            </span>
          )}
        </Link>
      </div>

      {/* Bagian Kanan: User & Settings */}
      <div className="flex items-center gap-x-4">
        <ThemeToggle />
        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
        <UserNav />
      </div>

    </header>
  );
}

export default Navbar;