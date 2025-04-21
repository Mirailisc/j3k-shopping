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
import { Order } from '@/types/order'
import OrderDataController from './components/Controller'
import { CreateOrderForm } from './components/Form/CreateOrderForm'
import { UpdateOrderStatusForm } from './components/Form/UpdateOrderStatusForm'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { TableColumns } from './components/Column'
import OrderDataPagination from './components/Pagination'
import { UploadOrderEvidenceForm } from './components/Form/UploadOrderEvidenceForm'
import { axiosInstance } from '@/lib/axios'
import { isAxiosError } from 'axios'
import OrderTableAlert from './components/Alert'

type Props = {
  data: Order[]
  setData: (data: Order[]) => void
  fetchOrders: () => Promise<void>
}

export function OrderDataTable({ data, setData, fetchOrders }: Props) {
  const user = useSelector((state: RootState) => state.auth.user)

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState<{ single?: Order; multiple?: boolean } | null>(null)

  const [openCreateOrderDialog, setOpenCreateOrderDialog] = React.useState(false)
  const [openEditOrderDialog, setOpenEditOrderDialog] = React.useState(false)
  const [orderToEdit, setOrderToEdit] = React.useState<Order | null>(null)
  const [openUploadOrderEvidence, setOpenUploadOrderEvidence] = React.useState(false)
  const [orderToUpload, setOrderToUpload] = React.useState<Order | null>(null)
  const resetSelection = () => {
    setRowSelection({})
  }

  const handleAddOrder = () => {
    setOpenCreateOrderDialog(true)
  }

  const handleEditOrder = (order: Order) => {
    setOrderToEdit(order)
    setOpenEditOrderDialog(true)
  }

  const handleUploadEvidence = (order: Order) => {
    setOrderToUpload(order)
    setOpenUploadOrderEvidence(true)
  }

  const handleRefreshData = async () => {
    await fetchOrders()
    resetSelection()
    toast.success('Order data has been refreshed')
  }

  const handleDeleteOrder = (order?: Order) => {
    if (order) {
      setDeleteTarget({ single: order })
    } else {
      setDeleteTarget({ multiple: true })
    }
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (deleteTarget?.single) {
      try {
        await axiosInstance.delete(`/order/${deleteTarget.single.id}`)
        toast.success(`Review ${deleteTarget.single.id} has been deleted`)
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
      const selectedOrders = selectedRows.map((row) => row.original)
      const selectedIds = selectedOrders.map((order) => order.id)

      const failedOrders: string[] = []

      await Promise.all(
        selectedOrders.map(async (order) => {
          try {
            await axiosInstance.delete(`/order/${order.id}`)
          } catch {
            failedOrders.push(order.id)
          }
        }),
      )

      const successfullyDeleted = selectedOrders.length - failedOrders.length
      if (successfullyDeleted > 0) {
        toast.success(`${successfullyDeleted} order(s) have been deleted`)
      }
      if (failedOrders.length > 0) {
        toast.error(`Failed to delete: ${failedOrders.join(', ')}`)
      }

      setData(data.filter((order) => !selectedIds.includes(order.id)))
    }

    setDeleteDialogOpen(false)
    resetSelection()
  }

  const isAdmin = user?.isAdmin
  const isSuperAdmin = user?.isSuperAdmin

  const columns: ColumnDef<Order>[] = TableColumns({
    isAdmin,
    isSuperAdmin,
    handleEditOrder,
    handleUploadEvidence,
    handleDeleteOrder,
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
      <OrderDataController
        selectedCount={selectedCount}
        handleDeleteOrder={handleDeleteOrder}
        table={table}
        handleRefreshData={handleRefreshData}
        handleAddOrder={handleAddOrder}
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
      <CreateOrderForm open={openCreateOrderDialog} setOpen={setOpenCreateOrderDialog} data={data} setData={setData} />
      {orderToEdit && (
        <UpdateOrderStatusForm
          open={openEditOrderDialog}
          setOpen={setOpenEditOrderDialog}
          order={orderToEdit}
          data={data}
          setData={setData}
        />
      )}
      {orderToEdit && (
        <UpdateOrderStatusForm
          open={openEditOrderDialog}
          setOpen={setOpenEditOrderDialog}
          order={orderToEdit}
          data={data}
          setData={setData}
        />
      )}
      {orderToUpload && (
        <UploadOrderEvidenceForm
          open={openUploadOrderEvidence}
          setOpen={setOpenUploadOrderEvidence}
          order={orderToUpload}
          data={data}
          setData={setData}
        />
      )}
      <OrderDataPagination table={table} selectedCount={selectedCount} />
      <OrderTableAlert
        deleteTarget={deleteTarget}
        confirmDelete={confirmDelete}
        selectedCount={selectedCount}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
      />
    </div>
  )
}
