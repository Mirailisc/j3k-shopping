import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table } from '@tanstack/react-table'
import { ChevronDown, Plus, RefreshCw } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Order } from '@/types/order'

type Props = {
  table: Table<Order>
  handleRefreshData: () => void
  handleAddOrder: () => void
}

const OrderDataController: React.FC<Props> = ({ table, handleRefreshData, handleAddOrder }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user)

  const isSuperAdmin = user?.isSuperAdmin

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter productId..."
          value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('productId')?.setFilterValue(event.target.value)}
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
        {isSuperAdmin ? (
          <Tooltip>
            <TooltipTrigger>
              <Button onClick={handleAddOrder} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create Order</p>
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>
    </div>
  )
}

export default OrderDataController
