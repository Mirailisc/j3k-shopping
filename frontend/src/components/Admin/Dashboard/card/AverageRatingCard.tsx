import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { axiosInstance } from "@/lib/axios"
import { Star } from "lucide-react"
import { useState, useEffect } from "react"

export const AverageRatingCard: React.FC = () =>  {
  const [average, setAverage] = useState<number>(0)

  useEffect(() => {
    axiosInstance.get('/dashboard/admin/average-rating').then(res => {
      setAverage(res.data)
    })
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-normal text-zinc-400">Average Product Rating</CardTitle>
        <Star className="h-5 w-5 text-zinc-400" />
      </CardHeader>
      <CardContent>
        <div className = 'flex items-center'>
          <h2 className="text-3xl font-bold">{average === null ? 'Loading...' : `${average.toFixed(2)} `}</h2>
          <Star className = 'h-5 w-5 ml-1 text-zinc-400' />
        </div>
      </CardContent>
    </Card>
  )
}
