import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function MarketTableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-2 border-b">
          <Skeleton width={120} />
          <Skeleton width={80} />
          <Skeleton width={60} />
          <Skeleton width={60} />
          <Skeleton width={100} height={30} />
        </div>
      ))}
    </div>
  );
}

function MarketStatsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton height={40} />
      <Skeleton height={40} />
      <Skeleton height={40} />
    </div>
  );
}
