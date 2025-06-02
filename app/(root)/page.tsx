"use client"

import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import Modal from "@/components/ui/modal";

const SetupPage = () => {
  return (
    <div>
      <Modal 
        title="Test Title"
        description="test des"
        isOpen
        onClose={() => {}}
      >
        Children
      </Modal>
    </div>
  );
};

export default SetupPage;