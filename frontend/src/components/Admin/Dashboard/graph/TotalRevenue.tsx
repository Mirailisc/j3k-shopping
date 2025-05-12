import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { axiosInstance } from '@/lib/axios'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

const chartConfig = {
  sales: {
    label: 'sales',
    color: '#12AA34',
  },
  revenue: {
    label: 'revenue',
    color: '#185cc9',
  },
} satisfies ChartConfig

type MonthlyData = {
    range: string,
    sales: number,
    revenue: number,
}

export const TotalRevenue: React.FC = () => {
  const [chartData, setMonthlyData] = useState<MonthlyData[]>([])

  useEffect(() => {
    const fetchData = async () => {
        try{
        const {data} = await axiosInstance.get('dashboard/admin/total')
        setMonthlyData(data)
        } catch(error){
          if (isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Something went wrong'
            toast.error(errorMessage)
          } else {
            toast.error('An unexpected error occurred')
          }
        }
    }
    fetchData()
  }, [])

  const percentageChanges: number = useMemo(() => {
    const LastSales = Number(chartData[chartData.length - 2]?.revenue || 0)
    const thisSales = Number(chartData[chartData.length - 1]?.revenue || 0)
    if (LastSales === 0) return 100
    return ((thisSales - LastSales) * 100) / LastSales
  }, [chartData])

  return (
    <Card className = 'flex flex-col'>
      <div className='flex items-center justify-between gap-4 px-3'>
      <CardHeader className='pb-0'>
        <CardTitle>Sales and Revenue graph</CardTitle>
        <CardDescription>Daily Data</CardDescription>
      </CardHeader>
        </div>
            <CardContent>
              <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
                <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid vertical={false} />
    
                  <XAxis
                    dataKey="range"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    interval={0}
                  />
    
                  <YAxis yAxisId="left" orientation="left" hide />
                  <YAxis yAxisId="right" orientation="right" hide />
    
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
    
                  <Area
                    yAxisId="left"
                    dataKey="sales"
                    type="monotone"
                    fill="var(--color-sales)"
                    fillOpacity={0.4}
                    stroke="var(--color-sales)"
                    stackId="a"
                  />
                  <Area
                    yAxisId="right"
                    dataKey="revenue"
                    type="monotone"
                    fill="var(--color-revenue)"
                    fillOpacity={0.4}
                    stroke="var(--color-revenue)"
                    stackId="b"
                  />
    
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">
                revenue
                {percentageChanges >= 0 ? ` gain ` : ' loss '}
                by {Math.abs(percentageChanges).toFixed(2)}% today
                {percentageChanges >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              </div>
            </CardFooter>
          </Card>
  )
}
