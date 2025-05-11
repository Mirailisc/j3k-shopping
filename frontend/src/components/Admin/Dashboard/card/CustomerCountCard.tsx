import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { axiosInstance } from "@/lib/axios"
import { Users } from "lucide-react"
import { useEffect, useState } from "react"

export const CustomerCountCard: React.FC = () =>  {
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    axiosInstance.get('/dashboard/admin/customer-count').then(res => {
      setCount(res.data)
    })
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-normal text-zinc-400">Total Customer</CardTitle>
        <Users className="h-5 w-5 text-zinc-400" />
      </CardHeader>
      <CardContent>
         <div className = 'flex items-baseline'>
          <h2 className="text-3xl font-bold">{count ? count : 'loading'}</h2>
        </div>  
        <div className="flex items-center mt-1">
            <p className="text-sm text-zinc-400">accounts</p>  
        </div>
      </CardContent>
    </Card>
  )
}
