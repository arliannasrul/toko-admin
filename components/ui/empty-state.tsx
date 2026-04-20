"use client";

import { Button } from "@/components/ui/button";
import { LucideIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  actionPath?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  actionLabel,
  actionPath
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-lg bg-muted/20">
      <div className="p-4 rounded-full bg-muted/40 mb-4">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mb-6 text-sm italic">{description}</p>
      {actionLabel && actionPath && (
        <Button onClick={() => router.push(actionPath)}>
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
