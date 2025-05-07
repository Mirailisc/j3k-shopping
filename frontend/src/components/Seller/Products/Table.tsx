import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { TableColumns } from './components/Column'
import { isAxiosError } from 'axios'
import { axiosInstance } from '@/lib/axios'
import { Product } from '@/types/product'
import ProductDataController from './components/Controller'
import ProductTableAlert from './components/Alert'
import ProductDataPagination from './components/Pagination'
import { EditProductForm } from './components/Form/EditProductForm'
import { CreateSellerProductForm } from './components/Form/CreateSellerProductForm'

type Props = {
  data: Product[]
  setData: (data: Product[]) => void
  fetchProducts: () => Promise<void>
}

export function ProductDataTable({ data, setData, fetchProducts }: Props) {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState<{ single?: Product; multiple?: boolean } | null>(null)

    const [openCreateProductDialog, setOpenCreateProductDialog] = React.useState(false)
  const [openEditProductDialog, setOpenEditProductDialog] = React.useState(false)
  const [productToEdit, setProductToEdit] = React.useState<Product | null>(null)

  const resetSelection = () => {
    setRowSelection({})
  }

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product)
    setOpenEditProductDialog(true)
  }

  const handleDeleteProduct = (product?: Product) => {
    if (product) {
      setDeleteTarget({ single: product })
    } else {
      setDeleteTarget({ multiple: true })
    }
    setDeleteDialogOpen(true)
  }

  const handleAddProduct = () => {
    setOpenCreateProductDialog(true)
  }

  const confirmDelete = async () => {
    if (deleteTarget?.single) {
      try {
        await axiosInstance.delete(`/product/seller/${deleteTarget.single.id}`)
        toast.success(`Product ${deleteTarget.single.id} has been deleted`)
      } catch (error) {
        if (isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || 'Something went wrong'
          toast.error(errorMessage)
        } else {
          toast.error('An unexpected error occurred')
        }
      }
    } else if (deleteTarget?.multiple) {
      const selectedRows = table.getSelectedRowModel().rows
      const selectedProducts = selectedRows.map((row) => row.original)
      const selectedIds = selectedProducts.map((product) => product.id)

      const failedProducts: string[] = []

      await Promise.all(
        selectedProducts.map(async (product) => {
          try {
            await axiosInstance.delete(`/user/${product.id}`)
          } catch {
            failedProducts.push(product.id)
          }
        }),
      )

      const successfullyDeleted = selectedProducts.length - failedProducts.length
      if (successfullyDeleted > 0) {
        toast.success(`${successfullyDeleted} product(s) have been deleted`)
      }
      if (failedProducts.length > 0) {
        toast.error(`Failed to delete: ${failedProducts.join(', ')}`)
      }

      // Update frontend data
      setData(data.filter((product) => !selectedIds.includes(product.id)))
    }

    setDeleteDialogOpen(false)
    resetSelection()
  }

  const handleRefreshData = async () => {
    await fetchProducts()
    resetSelection()
    toast.success('Product data has been refreshed')
  }

  const columns: ColumnDef<Product>[] = TableColumns({
    handleEditProduct,
    handleDeleteProduct,
  })

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const selectedCount = table.getFilteredSelectedRowModel().rows.length

  return (
    <div className="w-full">
      <ProductDataController
        selectedCount={selectedCount}
        table={table}
        handleRefreshData={handleRefreshData}
        handleDeleteProduct={handleDeleteProduct}
        handleAddProduct={handleAddProduct}
      />

      <div className="rounded-sm border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <CreateSellerProductForm
              open={openCreateProductDialog}
              setOpen={setOpenCreateProductDialog}
              data = {data}
              setData = {setData}
            />

      {productToEdit && (
        <EditProductForm
          open={openEditProductDialog}
          setOpen={setOpenEditProductDialog}
          product={productToEdit}
          data={data}
          setData={setData}
        />
      )}
      <ProductDataPagination table={table} selectedCount={selectedCount} />
      <ProductTableAlert
        deleteTarget={deleteTarget}
        confirmDelete={confirmDelete}
        selectedCount={selectedCount}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
      />
    </div>
  )
}
