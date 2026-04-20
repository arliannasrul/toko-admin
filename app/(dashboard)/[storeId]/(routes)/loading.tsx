import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Loading = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="space-y-2">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
        </div>
        <div className="h-[1px] w-full bg-border" />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[100px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-[100px]" />
          </CardHeader>
          <CardContent className="pl-2">
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Loading;
