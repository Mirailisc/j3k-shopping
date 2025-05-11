import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table } from '@tanstack/react-table'
import { ChevronDown, Plus, RefreshCw, Trash } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Product } from '@/types/product'

type Props = {
  selectedCount: number
  table: Table<Product>
  handleRefreshData: () => void
  handleDeleteProduct: () => void
  handleAddProduct: () => void
}

const ProductDataController: React.FC<Props> = ({
  selectedCount,
  table,
  handleRefreshData,
  handleDeleteProduct,
  handleAddProduct,
}: Props) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter product name..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
          className="max-w-sm hidden md:block"
        />
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="sm" onClick={handleRefreshData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Refresh data</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-2">
        {selectedCount > 0 && isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Bulk Actions ({selectedCount})
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleDeleteProduct()} className="text-red-600 focus:text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                Delete selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Columns
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        {isAuthenticated ? (
          <Tooltip>
            <TooltipTrigger>
              <Button onClick={handleAddProduct} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create Product</p>
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>
    </div>
  )
}

export default ProductDataController
