import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function CoinRowSkeleton() {
  return (
    <tr>
      <td className="px-4 py-2">
        <div className="flex items-center gap-2">
          <Skeleton circle width={24} height={24} />
          <Skeleton width={80} />
        </div>
      </td>
      <td className="px-4 py-2">
        <Skeleton width={70} />
      </td>
      <td className="px-4 py-2">
        <Skeleton width={50} />
      </td>
      <td className="px-4 py-2">
        <Skeleton width={50} />
      </td>
      <td className="px-4 py-2">
        <Skeleton width={50} />
      </td>
      <td className="px-4 py-2">
        <Skeleton width={100} height={30} />
      </td>
    </tr>
  );
}
