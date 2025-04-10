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
import {Order} from '@/types/order'
import OrderDataController from './components/Controller'
import { CreateOrderForm } from './components/Form/CreateOrderForm'
import { EditOrderForm } from './components/Form/EditOrderForm'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { TableColumns } from './components/Column'
import { isAxiosError } from 'axios'
import { axiosInstance } from '@/lib/axios'
import OrderTableAlert from './components/Alert'
import OrderDataPagination from './components/Pagination'


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

  const handleDeleteOrder = (order?: Order) => {
    if (user) {
      setDeleteTarget({ single: order })
    } else {
      setDeleteTarget({ multiple: true })
    }
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (deleteTarget?.single) {
      try {
        await axiosInstance.delete(`/order/admin/${deleteTarget.single.id}`)
        toast.success(`Order ${deleteTarget.single.id} has been deleted`)
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
      const selectedUsers = selectedRows.map((row) => row.original)
      const selectedIds = selectedUsers.map((order) => order.id)

      const failedUsers: string[] = []

      await Promise.all(
        selectedUsers.map(async (order) => {
          try {
            await axiosInstance.delete(`/user/${order.id}`)
          } catch {
            failedUsers.push(order.id)
          }
        }),
      )

      const successfullyDeleted = selectedUsers.length - failedUsers.length
      if (successfullyDeleted > 0) {
        toast.success(`${successfullyDeleted} user(s) have been deleted`)
      }
      if (failedUsers.length > 0) {
        toast.error(`Failed to delete: ${failedUsers.join(', ')}`)
      }

      // Update frontend data
      setData(data.filter((order) => !selectedIds.includes(order.id)))
    }

    setDeleteDialogOpen(false)
    resetSelection()
  }


  const handleRefreshData = async () => {
    await fetchOrders()
    resetSelection()
    toast.success('Order data has been refreshed')
  }

  const isSuperAdmin = user?.isSuperAdmin

  const columns: ColumnDef<Order>[] = TableColumns({
    isSuperAdmin,
    handleEditOrder,
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
        table={table}
        handleRefreshData={handleRefreshData}
        handleDeleteOrder={handleDeleteOrder}
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
        <EditOrderForm
          open={openEditOrderDialog}
          setOpen={setOpenEditOrderDialog}
          order={orderToEdit}
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
