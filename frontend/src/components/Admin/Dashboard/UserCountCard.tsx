import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { axiosInstance } from "@/lib/axios"
import { Users } from "lucide-react"
import { useEffect, useState } from "react"

export function UserCountCard() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    axiosInstance.get('/dashboard/admin/user-count').then(res => {
      setCount(res.data.count)
    })
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-normal text-zinc-400">Total Users</CardTitle>
        <Users className="h-5 w-5 text-zinc-400" />
      </CardHeader>
      <CardContent>
        <h2 className="text-3xl font-bold">{count === null ? 'Loading...' : count}</h2>
      </CardContent>
    </Card>
  )
}
