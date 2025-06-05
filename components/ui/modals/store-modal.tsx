"use client"

import { useStoreModal } from "@/hooks/use-store-modal"
import Modal from "../modal"

export const StoreModal = () => {
    const StoreModal = useStoreModal();
    return(
        <Modal
        title="Buat Store"
        description="Tambahkan Store untuk membuat produk dan kategori"
        isOpen={StoreModal.isOpen}
        onClose={StoreModal.onClose}
        >
            Store From
        </Modal>
    )
}