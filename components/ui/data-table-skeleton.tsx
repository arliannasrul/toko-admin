import { Skeleton } from "@/components/ui/skeleton";

export const DataTableSkeleton = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <div className="h-[1px] w-full bg-border" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-[250px]" />
          <div className="rounded-md border">
            <div className="h-12 border-b px-4 flex items-center bg-muted/50">
                <Skeleton className="h-4 w-full" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 border-b px-4 flex items-center">
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
