// app/layout.tsx

import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import localFont from "next/font/local";
import "./globals.css";
import { ModalProvider } from '@/providers/modal-provider';
import { ToastProvider } from '@/providers/toast.provider';


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Comp Shop",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ToastProvider />
          <ModalProvider />
        
          <main className=''>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}