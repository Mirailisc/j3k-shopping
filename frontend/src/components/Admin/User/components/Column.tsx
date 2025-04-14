import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Shield, ShieldCheck, MoreHorizontal, Trash, Edit, Key } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FullUserInfo } from '../../../../types/user'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link } from 'react-router-dom'
import { USER_INFO_PATH } from '@/constants/routes'

type Props = {
  isSuperAdmin: boolean | undefined
  handleEditUser: (user: FullUserInfo) => void
  handleChangePassword: (user: FullUserInfo) => void
  handleDeleteUser: (user?: FullUserInfo) => void
}

export const tableColumns = ({ isSuperAdmin, handleEditUser, handleChangePassword, handleDeleteUser }: Props) => {
  const columns: ColumnDef<FullUserInfo>[] = [
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
      header: 'User ID',
      cell: ({ row }) => <div className="text-xs text-muted-foreground">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'username',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Username
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue('username')}</div>,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
      cell: ({ row }) => <div>{row.getValue('firstName')}</div>,
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      cell: ({ row }) => <div>{row.getValue('lastName')}</div>,
    },
    {
      accessorKey: 'isAdmin',
      header: 'Admin',
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.getValue('isAdmin') ? <Shield className="h-5 w-5 text-blue-500" /> : <div className="h-5 w-5"></div>}
        </div>
      ),
    },
    {
      accessorKey: 'isSuperAdmin',
      header: 'Super Admin',
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.getValue('isSuperAdmin') ? (
            <ShieldCheck className="h-5 w-5 text-purple-500" />
          ) : (
            <div className="h-5 w-5"></div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'line',
      header: 'Line',
      cell: ({ row }) => <div>{row.getValue('line')}</div>,
    },
    {
      accessorKey: 'facebook',
      header: 'Facebook',
      cell: ({ row }) => <div>{row.getValue('facebook')}</div>,
    },
    {
      accessorKey: 'website',
      header: 'Website',
      cell: ({ row }) => <div>{row.getValue('website')}</div>,
    },
    {
      accessorKey: 'instagram',
      header: 'Instagram',
      cell: ({ row }) => <div>{row.getValue('instagram')}</div>,
    },
    {
      accessorKey: 'tiktok',
      header: 'Tiktok',
      cell: ({ row }) => <div>{row.getValue('tiktok')}</div>,
    },
    {
      accessorKey: 'citizenId',
      header: 'Citizen ID',
      cell: ({ row }) => <div>{row.getValue('citizenId')}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'address',
      header: 'Address',
      cell: ({ row }) => <div>{row.getValue('address')}</div>,
    },
    {
      accessorKey: 'city',
      header: 'City',
      cell: ({ row }) => <div>{row.getValue('city')}</div>,
    },
    {
      accessorKey: 'province',
      header: 'Province',
      cell: ({ row }) => <div>{row.getValue('province')}</div>,
    },
    {
      accessorKey: 'zipCode',
      header: 'Zip Code',
      cell: ({ row }) => <div>{row.getValue('zipCode')}</div>,
    },
    {
      accessorKey: 'country',
      header: 'Country',
      cell: ({ row }) => <div>{row.getValue('country')}</div>,
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
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original

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
              <Link to={USER_INFO_PATH.replace(':username', user.username)}>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                  Go to profile
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Copy user ID</DropdownMenuItem>
              {isSuperAdmin ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleEditUser(user)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit user
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleChangePassword(user)}>
                    <Key className="mr-2 h-4 w-4" />
                    Change password
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-red-600 focus:text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete user
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
