import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { axiosInstance } from "@/lib/axios"
import { PackageCheck } from "lucide-react"
import { useState, useEffect } from "react"

export function ProductStockCard() {
  const [stock, setStock] = useState<number | null>(null)

  useEffect(() => {
    axiosInstance.get('/dashboard/admin/product-stock').then(res => {
      setStock(res.data.stock)
    })
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-normal text-zinc-400">Products In Stock</CardTitle>
        <PackageCheck className="h-5 w-5 text-zinc-400" />
      </CardHeader>
      <CardContent>
        <h2 className="text-3xl font-bold">{stock === null ? 'Loading...' : stock}</h2>
      </CardContent>
    </Card>
  )
}

