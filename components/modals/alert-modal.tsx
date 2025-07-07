"use client"

import { useEffect, useState } from "react";
import Modal from "../ui/modal";
import { Button } from "../ui/button";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean

}

export const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading
}) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;    // Prevents hydration mismatch client-side rendering issues
    }

    return (
        <Modal title="Are you sure for deleting?" description="This action cannot be undone." isOpen={isOpen} onClose={onClose}>
            <div className="space-x-2 pt-6 flex items-center justify-end w-full ">
                <Button disabled={loading} variant={"outline"} onClick={onClose}>
                    Cancel
                </Button>
                 <Button disabled={loading} variant={"destructive"} onClick={onConfirm}>
                    Confirm
                </Button>
            </div>
        </Modal>
    )
}