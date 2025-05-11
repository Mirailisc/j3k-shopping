import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { axiosInstance } from "@/lib/axios"
import { Star } from "lucide-react"
import { useState, useEffect } from "react"

export function AverageRatingCard() {
  const [average, setAverage] = useState<string | null>(null)

  useEffect(() => {
    axiosInstance.get('/dashboard/admin/average-rating').then(res => {
      setAverage(res.data.average)
    })
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-normal text-zinc-400">Average Rating</CardTitle>
        <Star className="h-5 w-5 text-zinc-400" />
      </CardHeader>
      <CardContent>
        <h2 className="text-3xl font-bold">{average === null ? 'Loading...' : `${average} ⭐`}</h2>
      </CardContent>
    </Card>
  )
}
