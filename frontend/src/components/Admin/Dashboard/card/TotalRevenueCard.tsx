import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { axiosInstance } from "@/lib/axios"
import { DollarSign } from "lucide-react"
import { useState, useEffect } from "react"

export function TotalRevenueCard() {
  const [data, setData] = useState<number>(0)

  useEffect(() => {
    axiosInstance.get('/dashboard/admin/revenue').then(res => {
      setData(res.data)
    })
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-normal text-zinc-400">Total Revenue</CardTitle>
        <DollarSign className="h-5 w-5 text-zinc-400" />
      </CardHeader>
      <CardContent>
        <div className = 'flex items-baseline'>
          <h2 className="text-3xl font-bold">{data.toFixed(2)} ฿</h2>
        </div>  
        <div className="flex items-center mt-1">
            <p className="text-sm text-zinc-400"></p>  
        </div>
      </CardContent>
    </Card>
  )
}

