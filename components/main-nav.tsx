"use client"
import { cn } from '@/lib/utils'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

import { 
    LayoutDashboard, 
    Image as ImageIcon, 
    List, 
    Package, 
    Settings2, 
    CreditCard, 
    Settings 
} from 'lucide-react';

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
    onClick?: () => void;
    isCollapsed?: boolean;
}

export function MainNav({
    className,
    onClick,
    isCollapsed,
    ...props
}: MainNavProps) {
    const pathname = usePathname();
    const params = useParams()
    const routes = [
        {
            href: `/${params.storeId}`,
            label: 'Dashboard',
            active: pathname === `/${params.storeId}`,
            icon: LayoutDashboard
        },
        {
            href: `/${params.storeId}/banners`,
            label: 'Banners',
            active: pathname === `/${params.storeId}/banners`,
            icon: ImageIcon
        },
        {
            href: `/${params.storeId}/categories`,
            label: 'Categories',
            active: pathname === `/${params.storeId}/categories`,
            icon: List
        },
        {
            href: `/${params.storeId}/products`,
            label: 'Products',
            active: pathname === `/${params.storeId}/products`,
            icon: Package
        },
        {
            href: `/${params.storeId}/attributes`,
            label: 'Attributes',
            active: pathname === `/${params.storeId}/attributes`,
            icon: Settings2
        },
        {
            href: `/${params.storeId}/orders`,
            label: 'Orders',
            active: pathname === `/${params.storeId}/orders`,
            icon: CreditCard
        },
        {
            href: `/${params.storeId}/settings`,
            label: 'Settings',
            active: pathname === `/${params.storeId}/settings`,
            icon: Settings
        }
    ]
    return (
        <nav className={cn(
            "flex items-center space-x-4 lg:space-x-6",
            isCollapsed && "flex-col space-x-0 space-y-4 items-center",
            !isCollapsed && className.includes("flex-col") && "flex-col space-x-0 space-y-2 items-start",
            className
        )}>
            {routes.map((route) => (
                <Link 
                    key={route.href} 
                    href={route.href} 
                    onClick={onClick}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary flex items-center gap-x-2",
                        route.active ? "text-black dark:text-white" : "text-muted-foreground",
                        isCollapsed && "justify-center w-full"
                    )}
                >
                    <route.icon className={cn(
                        "h-4 w-4",
                        isCollapsed && "h-5 w-5"
                    )} />
                    {!isCollapsed && <span>{route.label}</span>}
                </Link>
            ))}
        </nav>
    )
}