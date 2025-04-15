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
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { TableColumns } from './components/Column'
import { isAxiosError } from 'axios'
import { axiosInstance } from '@/lib/axios'
import { Review } from '@/types/review'
import ReviewDataController from './components/Controller'
import ReviewTableAlert from './components/Alert'
import ReviewDataPagination from './components/Pagination'
import { CreateReviewForm } from './components/Form/CreateReviewForm'
import { EditReviewForm } from './components/Form/EditReviewForm'

type Props = {
  data: Review[]
  setData: (data: Review[]) => void
  fetchReviews: () => Promise<void>
}

export function ReviewDataTable({ data, setData, fetchReviews }: Props) {
  const user = useSelector((state: RootState) => state.auth.user)

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState<{ single?: Review; multiple?: boolean } | null>(null)

  const [openCreateReviewDialog, setOpenCreateReviewDialog] = React.useState(false)
  const [openEditReviewDialog, setOpenEditReviewDialog] = React.useState(false)
  const [reviewToEdit, setReviewToEdit] = React.useState<Review | null>(null)

  const resetSelection = () => {
    setRowSelection({})
  }

  const handleAddReview = () => {
    setOpenCreateReviewDialog(true)
  }

  const handleEditReview = (review: Review) => {
    setReviewToEdit(review)
    setOpenEditReviewDialog(true)
  }

  const handleDeleteReview = (review?: Review) => {
    if (user) {
      setDeleteTarget({ single: review })
    } else {
      setDeleteTarget({ multiple: true })
    }
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (deleteTarget?.single) {
      try {
        await axiosInstance.delete(`/review/admin/${deleteTarget.single.id}`)
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
      const selectedUsers = selectedRows.map((row) => row.original)
      const selectedIds = selectedUsers.map((review) => review.id)

      const failedUsers: string[] = []

      await Promise.all(
        selectedUsers.map(async (review) => {
          try {
            await axiosInstance.delete(`/user/${review.id}`)
          } catch {
            failedUsers.push(review.id)
          }
        }),
      )

      const successfullyDeleted = selectedUsers.length - failedUsers.length
      if (successfullyDeleted > 0) {
        toast.success(`${successfullyDeleted} review(s) have been deleted`)
      }
      if (failedUsers.length > 0) {
        toast.error(`Failed to delete: ${failedUsers.join(', ')}`)
      }

      // Update frontend data
      setData(data.filter((review) => !selectedIds.includes(review.id)))
    }

    setDeleteDialogOpen(false)
    resetSelection()
  }

  const handleRefreshData = async () => {
    await fetchReviews()
    resetSelection()
    toast.success('Review data has been refreshed')
  }

  const isAdmin = user?.isAdmin

  const columns: ColumnDef<Review>[] = TableColumns({
    isAdmin,
    handleEditReview,
    handleDeleteReview,
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
      <ReviewDataController
        selectedCount={selectedCount}
        table={table}
        handleRefreshData={handleRefreshData}
        handleDeleteReview={handleDeleteReview}
        handleAddReview={handleAddReview}
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
      <CreateReviewForm
        open={openCreateReviewDialog}
        setOpen={setOpenCreateReviewDialog}
        data={data}
        setData={setData}
      />
      {reviewToEdit && (
        <EditReviewForm
          open={openEditReviewDialog}
          setOpen={setOpenEditReviewDialog}
          review={reviewToEdit}
          data={data}
          setData={setData}
        />
      )}
      <ReviewDataPagination table={table} selectedCount={selectedCount} />
      <ReviewTableAlert
        deleteTarget={deleteTarget}
        confirmDelete={confirmDelete}
        selectedCount={selectedCount}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
      />
    </div>
  )
}
