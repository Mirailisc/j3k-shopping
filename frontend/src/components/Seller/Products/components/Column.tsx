import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal, Trash, Edit, Copy, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Product } from '@/types/product'
import { SELLER_PRODUCT_REVIEWS_PATH,
} from '@/constants/routes'
import { useNavigate } from 'react-router-dom';
import NoIMG from '@/images/img-notfound.jpeg'



type Props = {
  handleEditProduct: (product: Product) => void
  handleDeleteProduct: (product?: Product) => void
}

export const TableColumns = ({handleEditProduct, handleDeleteProduct }: Props) => {

  const navigate = useNavigate();

  const columns: ColumnDef<Product>[] = [
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
      header: 'Product ID',
      cell: ({ row }) => <div className="text-xs text-muted-foreground">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'productImg',
      header: () => <div >Product Image</div>,
      cell: ({ row }) => {
        const productImg = row.getValue('productImg')

        if (!productImg) {
          return <div>No Image</div>
        }

        return (
          <div className="center md:w-1/2 relative">
            <div className="aspect-square w-30 rounded-lg overflow-hidden border">
            {productImg ? (
              <img src={productImg as string} alt="Product Image" className="object-cover size-full" />
            ):<img src={NoIMG} alt="No Image" className="object-cover size-full" />
            }
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => <div>{row.getValue('description')}</div>,
    },
    {
      accessorKey: 'price',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue('price')} ฿</div>,
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Quantity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue('quantity')}</div>,
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
        const product = row.original

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.id)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy product ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Product
              </DropdownMenuItem>
              <DropdownMenuItem
                    onClick={() => navigate(SELLER_PRODUCT_REVIEWS_PATH.replace(':productId', product.id))} // Goto /seller/products/:productId/reviews
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Product&apos;s Reviews
              </DropdownMenuItem>
              <DropdownMenuItem
                    onClick={() => handleDeleteProduct(product)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Product
              </DropdownMenuItem>
          </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return columns
}
