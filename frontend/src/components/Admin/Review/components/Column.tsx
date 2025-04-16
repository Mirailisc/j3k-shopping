import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal, Trash, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Review } from '@/types/review'

type Props = {
  isSuperAdmin: boolean | undefined
  handleEditReview: (user: Review) => void
  handleDeleteReview: (user?: Review) => void
}

export const TableColumns = ({ isSuperAdmin, handleEditReview, handleDeleteReview }: Props) => {

  const columns: ColumnDef<Review>[] = [
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
      header: 'Review ID',
      cell: ({ row }) => <div className="text-xs text-muted-foreground px-5">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'rating',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Rating
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-xs text-muted-foreground px-6" >{row.getValue('rating')}</div>,
    },
    {
      accessorKey: 'comment',
      header: 'Comment',
      cell: ({ row }) => <div>{row.getValue('comment')}</div>,
    },
    {
      accessorKey: 'productId',
      header: 'product ID',
      cell: ({ row }) => <div className='px-6'>{row.getValue('productId')}</div>,
    },
    {
      accessorKey: 'userId',
      header: 'User ID',
      cell: ({ row }) => <div>{row.getValue('userId')}</div>,
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
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'))
        return <div>{date.toLocaleDateString()}</div>
      },
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Updated At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue('updatedAt'))
        return <div>{date.toLocaleDateString()}</div>
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const Review = row.original

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(Review.id)}>
                Copy Review ID
              </DropdownMenuItem>
              {isSuperAdmin ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleEditReview(Review)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Review
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteReview(Review)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Review
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
