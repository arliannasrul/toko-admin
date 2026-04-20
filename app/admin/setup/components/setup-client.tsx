"use client"

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

export const SetupClient = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);
  
  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center animate-pulse">
            <p className="text-slate-500 font-medium italic">Anda belum memiliki toko. Membuka form pendaftaran...</p>
        </div>
    </div>
  );
};
