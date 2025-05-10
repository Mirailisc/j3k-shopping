// components/RatingDistributionChart.tsx
import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart'
import { useEffect, useMemo, useState } from 'react'
import { axiosInstance } from '@/lib/axios'
import { YAxis, XAxis, Bar, BarChart } from 'recharts'
import { toast } from 'sonner'

interface RatingData {
  rating: number
  count: number
}

export const RatingDistributionChart: React.FC = () => {
  const [data, setData] = useState<RatingData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/admin/rating-distribution')
        setData(res.data)
      } catch (err) {
        toast.error('Failed to fetch rating data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {}
    data.forEach((item) => {
      config[item.rating.toString()] = {
        label: `${item.rating} stars`,
        color: '#10b981'
      }
    })
    return config
  }, [data])

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Rating Distribution</CardTitle>
        <CardDescription>Based on customer reviews</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-auto">
        {loading ? (
          <div className="text-center py-20">Loading chart...</div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              data={data.map((item) => ({
                name: item.rating.toString(),
                value: item.count
              }))}
              layout="vertical"
              height={400}
              margin={{ left: 12, right: 12 }}
            >
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => chartConfig[value]?.label ?? value}
              />
              <XAxis type="number" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="value" layout="vertical" radius={5} fill="#10b981" barSize={50} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
