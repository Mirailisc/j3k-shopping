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
import { ArrowUpDown, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { axiosInstance } from "@/lib/axios"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Define the type for the data returned from the unsastisfyCustomer query
export type UnsatisfiedCustomer = {
  name: string
  avg_rating: number
  total_order: number
  amount_sales: number
  revenue: number
  refunded_rate: number
}

export const columns: ColumnDef<UnsatisfiedCustomer>[] = [
  {
    accessorKey: "name",
    header: "name",
    enableSorting: false,
    cell: ({ row }) => {
      const value = row.getValue("name") as number
      return <div className="ml-1 font-bold flex-nowrap">{value}</div>
    },
  },
  {
    accessorKey: "total_order",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Completed Order
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.getValue("total_order") as number
      return <div className="text-center font-medium">{value.toFixed(0)}</div>
    },
  },
  {
    accessorKey: "amount_sales",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Sales Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.getValue("amount_sales") as number
      return <div className="text-center font-medium">{value.toFixed(0)}</div>
    },
  },
  {
    accessorKey: "revenue",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total Revenue
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.getValue("revenue") as number
      return <div className="text-center font-medium">{value.toFixed(2)}</div>
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
]

export function SellerProductStatTable() {
  const [data, setData] = useState<UnsatisfiedCustomer[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "refunded_rate", desc: true }, // Default sort by refunded_rate descending
  ])

  const fetchData = async () => {
    const{data} = await axiosInstance('report/seller/product')
    console.log(data)
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
        <CardTitle className = 'text-sm font-normal text-zinc-400'>Products breakdown</CardTitle>
        <div className = "h-8 w-8 flex items-center justify-center">
          <Search className = "h-5 w-5 text-zinc-400"/>
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
