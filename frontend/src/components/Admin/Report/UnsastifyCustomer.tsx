"use client"

import * as React from "react"
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, UserRoundX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { axiosInstance } from "@/lib/axios"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Define the type for the data returned from the unsastisfyCustomer query
export type UnsatisfiedCustomer = {
  id: string
  username: string
  low_rating: number
  avg_rating: number
  refunded_count: number
  refunded_rate: number
}

export const columns: ColumnDef<UnsatisfiedCustomer>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: false,
    cell: ({ row }) => {
        const value = row.getValue("id") as number
        return <div className="text-sm text-zinc-400">{value}</div>
      }
    
  },
  {
    accessorKey: "username",
    header: "Username",
    enableSorting: false,
  },
  {
    accessorKey: "low_rating",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Low Ratings
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.getValue("low_rating") as number
      return <div className="text-center font-medium">{value}</div>
    },
  },
  {
    accessorKey: "avg_rating",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Avg Rating
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.getValue("avg_rating") as number
      return <div className="text-center font-medium">{value.toFixed(2)}</div>
    },
  },
  {
    accessorKey: "refunded_count",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Refunded Count
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.getValue("refunded_count") as number
      return <div className="text-center font-medium">{value}</div>
    },
  },
  {
    accessorKey: "refunded_rate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Refund Rate (%)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.getValue("refunded_rate") as number

      // Determine badge color based on refund rate
      let badgeVariant: "default" | "destructive" | "outline" | "secondary" = "outline"
      if (value > 20) {
        badgeVariant = "destructive"
      } else if (value > 10) {
        badgeVariant = "secondary"
      }

      return (
        <div className="text-center">
          <Badge variant={badgeVariant}>{value.toFixed(2)}%</Badge>
        </div>
      )
    },
  },
  {
    id:'action',
    enableHiding: false, 
    cell: ({ row }) => {
      const value = row.getValue("id") as string
      return <div className="text-center text-sm text-zinc-400 ">
        <Button variant="ghost" onClick ={() => navigator.clipboard.writeText(value)}>copy User ID</Button>
      </div>
    },
   }
]

export function UnsatisfyCustomerTable() {
  const [data, setData] = useState<UnsatisfiedCustomer[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "refunded_rate", desc: true }, // Default sort by refunded_rate descending
  ])

  const fetchData = async () => {
    const{data} = await axiosInstance('report/admin/unsastisfyCustomer')
    setData(data)
  }
  React.useEffect(() => {
    fetchData()
  }, [])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <Card>
    <CardHeader className = "flex flex-row items-center justify-between">
        <CardTitle className = 'text-sm font-normal text-zinc-400'>Unsastified/Suspicious Behavior Buyer</CardTitle>
        <div className = "h-8 w-8 flex items-center justify-center">
          <UserRoundX    className = "h-5 w-5 text-zinc-400"/>
        </div>
    </CardHeader>
        <CardContent>
            <div className="w-full">
            <div style={{ height: "400px", overflow: "hidden" }}>
                <div className="h-full flex flex-col">
                <div className="rounded-sm border sticky top-0 z-10 bg-background">
                    <Table>
                    <TableHeader >
                        {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                            return (
                                <TableHead key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            )
                            })}
                        </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="hover:bg-muted/50">
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id} className="py-2">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
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
                </div>
            </div>
            </div>
        </CardContent>
    </Card>
  )
}
