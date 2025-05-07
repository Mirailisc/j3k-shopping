import { useEffect, useState } from 'react'
import { axiosInstance } from '@/lib/axios'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Card, CardContent, CardHeader } from '@/components/ui/card'

type lowStockList = {
    id: string,
    name: string,
    quantity: number,
}
export const LowStockColumns = () => {
    const [data, setData] = useState<lowStockList[]>([])
    
    const fetchData = async () => {
        const {data} = await axiosInstance.get('dashboard/seller/lowstock/list')
              setData(data)
    }

    useEffect(() => {
        fetchData()
    }, [])

  return (
    <Card className = 'text-center'>
        <CardHeader>Low Stock Product</CardHeader>
        <CardContent>
            <Table className = 'max-h-[400px] w-full overflow-auto border-1'>
                <TableHeader>
                    <TableRow>
                    <TableHead className = 'text-center'>Product</TableHead>
                    <TableHead className = 'text-center'>Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody >
                    {data.map((row) => (
                        <TableRow key = {row.id}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.quantity.toString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  )
}
