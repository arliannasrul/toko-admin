import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-[200px]" />
                        <Skeleton className="h-4 w-[300px]" />
                    </div>
                    <Skeleton className="h-10 w-10" />
                </div>
                <div className="h-[1px] w-full bg-border" />
                <div className="space-y-4 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-[100px]" />
                </div>
            </div>
        </div>
    );
}

export default Loading;
