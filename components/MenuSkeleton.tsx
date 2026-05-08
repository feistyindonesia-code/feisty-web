export default function MenuSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-3/4" />

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>

        {/* Price + Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-7 bg-gray-200 rounded w-24" />
          <div className="h-10 bg-gray-200 rounded-full w-24" />
        </div>
      </div>
    </div>
  );
}