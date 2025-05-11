import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { axiosInstance } from "@/lib/axios"
import { ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"

export const TotalOrderCard : React.FC = () =>  {
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    axiosInstance.get('/dashboard/admin/orders').then(res => {
      setCount(res.data)
    })
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-normal text-zinc-400">Total Order</CardTitle>
        <ShoppingCart className="h-5 w-5 text-zinc-400" />
      </CardHeader>
      <CardContent>
        <div className = 'flex items-baseline'>
          <h2 className="text-3xl font-bold">{count}</h2>
        </div>  
        <div className="flex items-center mt-1">
            <p className="text-sm text-zinc-400">orders</p>  
        </div>
      </CardContent>
    </Card>
  )
}

