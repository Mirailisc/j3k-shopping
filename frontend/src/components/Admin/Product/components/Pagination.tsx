import { Button } from '@/components/ui/button'
import { Table } from '@tanstack/react-table'
import { Product } from '@/types/product'

type Props = {
  table: Table<Product>
  selectedCount: number
}

const ProductDataPagination: React.FC<Props> = ({ table, selectedCount }: Props) => {
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-sm text-muted-foreground">
        {selectedCount} of {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="space-x-2">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}

export default ProductDataPagination
