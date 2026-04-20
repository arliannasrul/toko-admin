import Link from 'next/link';
import { MainNav } from './main-nav';
import StoreSwitcher from './store-switcher';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { ThemeToggle } from './theme-toggle';
import Image from 'next/image';
import { UserNav } from './user-nav';

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
    <header className="flex items-center justify-between p-4 h-16 border-b bg-white/10 backdrop-blur-md sticky top-0 z-50">
      
      {/* Bagian Kiri: Logo atau Nama Brand */}
      <div>
        <Link href="/" className="flex items-center gap-x-2 text-xl font-bold hover:text-gray-700">
          {stores.find(s => s.id === currentStoreId)?.logoUrl ? (
             <div className="relative h-14 w-52">
               <Image fill src={stores.find(s => s.id === currentStoreId)?.logoUrl!} alt="Logo" className="object-contain object-left" />
             </div>
          ) : (
            "Tokomu"
          )}
        </Link>
      </div>

      {/* Bagian Tengah: Link Navigasi Utama */}
      <div className="flex items-center space-x-4">
        <StoreSwitcher items={stores} />
        <MainNav className='mx-6'/>
      </div>

      {/* Bagian Kanan: User & Settings */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserNav />
      </div>

    </header>
  );
}

export default Navbar;