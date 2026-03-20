import { Skeleton } from '@/components/ui/skeleton'

const TableSkeleton = ({ cols, rows = 5 }: { cols: number; rows?: number }) => (
  <div className="glass-card rounded-2xl overflow-hidden mb-8">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="p-4">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-b border-border/30 last:border-0">
              {Array.from({ length: cols }).map((_, colIdx) => (
                <td key={colIdx} className="p-4">
                  {colIdx === 1 ? (
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  ) : (
                    <Skeleton className="h-4 w-16" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const ProductDetailSkeleton = () => {
  return (
    <>
      {/* Header */}
      <div className="glass-card rounded-2xl p-2 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-2xl shrink-0" />
          <div className="flex-1 flex flex-wrap justify-between gap-3 mb-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card border-white/5 rounded-xl p-6">
            <div className="flex justify-between items-center mb-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <div className="glass-card rounded-2xl p-6 mb-8">
        <Skeleton className="h-5 w-48 mb-6" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>

      {/* Creators Table */}
      <div className="mb-2">
        <Skeleton className="h-6 w-36 mb-4" />
      </div>
      <TableSkeleton cols={6} rows={5} />

      {/* Videos Table */}
      <div className="mb-2">
        <Skeleton className="h-6 w-32 mb-4" />
      </div>
      <TableSkeleton cols={6} rows={5} />
    </>
  )
}

export default ProductDetailSkeleton
