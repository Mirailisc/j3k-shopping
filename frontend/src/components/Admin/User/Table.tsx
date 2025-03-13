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
import { User } from './types/type'
import UserTableAlert from './components/Alert'
import UserDataPagination from './components/Pagination'
import UserDataController from './components/Controller'
import { CreateUserForm } from './components/Form/CreateUserForm'
import { EditUserForm } from './components/Form/EditUserForm'
import { UpdatePasswordForm } from './components/Form/UpdatePasswordForm'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { tableColumns } from './components/Column'
import { isAxiosError } from 'axios'
import { axiosInstance } from '@/lib/axios'

type Props = {
  data: User[]
  setData: (data: User[]) => void
  fetchUsers: () => Promise<void>
}

export function UsersDataTable({ data, setData, fetchUsers }: Props) {
  const user = useSelector((state: RootState) => state.auth.user)

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState<{ single?: User; multiple?: boolean } | null>(null)

  const [openCreateUserDialog, setOpenCreateUserDialog] = React.useState(false)
  const [openEditUserDialog, setOpenEditUserDialog] = React.useState(false)
  const [openUpdatePasswordDialog, setOpenUpdatePasswordDialog] = React.useState(false)
  const [userToEdit, setUserToEdit] = React.useState<User | null>(null)
  const [userToUpdatePassword, setUserToUpdatePassword] = React.useState<User | null>(null)

  const resetSelection = () => {
    setRowSelection({})
  }

  const handleAddUser = () => {
    setOpenCreateUserDialog(true)
  }

  const handleEditUser = (user: User) => {
    setUserToEdit(user)
    setOpenEditUserDialog(true)
  }

  const handleDeleteUser = (user?: User) => {
    if (user) {
      setDeleteTarget({ single: user })
    } else {
      setDeleteTarget({ multiple: true })
    }
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (deleteTarget?.single) {
      try {
        await axiosInstance.delete(`/user/${deleteTarget.single.id}`)
        toast.success(`User ${deleteTarget.single.username} has been deleted`)
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
      const selectedIds = selectedRows.map((row) => row.original.id)
      setData(data.filter((user) => !selectedIds.includes(user.id)))
      toast.success(`${selectedRows.length} users have been deleted`)
    }

    setDeleteDialogOpen(false)
    resetSelection()
  }

  const handleChangePassword = (user: User) => {
    setUserToUpdatePassword(user)
    setOpenUpdatePasswordDialog(true)
  }

  const handleRefreshData = async () => {
    await fetchUsers()
    resetSelection()
    toast.success('User data has been refreshed')
  }

  const isSuperAdmin = user?.isSuperAdmin

  const columns: ColumnDef<User>[] = tableColumns({
    isSuperAdmin,
    handleEditUser,
    handleChangePassword,
    handleDeleteUser,
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
      <UserDataController
        selectedCount={selectedCount}
        table={table}
        handleRefreshData={handleRefreshData}
        handleDeleteUser={handleDeleteUser}
        handleAddUser={handleAddUser}
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
      <CreateUserForm open={openCreateUserDialog} setOpen={setOpenCreateUserDialog} data={data} setData={setData} />
      {userToEdit && (
        <EditUserForm
          open={openEditUserDialog}
          setOpen={setOpenEditUserDialog}
          user={userToEdit}
          data={data}
          setData={setData}
        />
      )}
      {userToUpdatePassword && (
        <UpdatePasswordForm
          open={openUpdatePasswordDialog}
          setOpen={setOpenEditUserDialog}
          user={userToUpdatePassword}
        />
      )}
      <UserDataPagination table={table} selectedCount={selectedCount} />
      <UserTableAlert
        deleteTarget={deleteTarget}
        confirmDelete={confirmDelete}
        selectedCount={selectedCount}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
      />
    </div>
  )
}
