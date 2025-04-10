import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal, Trash, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Order } from '@/types/order'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'

type Props = {
  isSuperAdmin: boolean | undefined
  handleEditOrder: (user: Order) => void
  handleDeleteOrder: (user?: Order) => void
}

export const TableColumns = ({ isSuperAdmin, handleEditOrder, handleDeleteOrder }: Props) => {
  const [openImage, setOpenImage] = useState<string | null>(null)
  const columns: ColumnDef<Order>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: 'Order ID',
      cell: ({ row }) => <div className="text-xs text-muted-foreground">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'userId',
      header: 'userId',
      cell: ({ row }) => <div>{row.getValue('userId')}</div>,
    },
    {
      accessorKey: 'productId',
      header: 'productId',
      cell: ({ row }) => <div>{row.getValue('productId')}</div>,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue('status')}</div>,
    },
    {
      accessorKey: 'evidence',
      header: 'Payment evidence',
      cell: ({ row }) => {
        const evidence = row.getValue('evidence')
        const orderId = row.getValue('id') as string

        if (!evidence) {
          return <div>No Image</div>
        }

        const handleOpenDialog = () => {
          setOpenImage(orderId)
        }

        const handleCloseDialog = () => {
          setOpenImage(null)
        }

        return (
          <Dialog open={openImage === orderId} onOpenChange={(open) => !open && handleCloseDialog()}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-white/50" onClick={handleOpenDialog}>
                Click to show image
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogTitle>Product Image</DialogTitle>
              <DialogDescription>
                <img src={evidence as string} alt="Payment evidence" className="w-full h-auto" />
              </DialogDescription>
              <DialogClose asChild>
                <Button variant="ghost" onClick={handleCloseDialog}>
                  Close
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        )
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <div>{row.getValue('amount')}</div>,
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => <div>{row.getValue('total')}</div>,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
           Created At 
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue('createdAt')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>Copy Order ID</DropdownMenuItem>
              {isSuperAdmin ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit order
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteOrder(order)} className="text-red-600 focus:text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete order
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return columns
}
