import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { MonthlyData } from '../types/MonthlyData'
import { axiosInstance } from '@/lib/axios'

const chartConfig = {
  sales: {
    label: "sales",
    color: "#5a94f2",
  },
  revenue: {
    label: "revenue",
    color: "#185cc9",
  },
} satisfies ChartConfig

export const SalesDataGraph: React.FC = () => {
     const [chartData, setMonthlyData] = useState<MonthlyData[]>([])
  
      useEffect(() => {
          const fetchMonthlyData = async () => {
                  try {
                      const {data} = await axiosInstance.get('report/monthly')
                      setMonthlyData(data)
                  }
                  catch(error) {
                      console.error("failed to fetch product chart data", error)
                  }
          }
          fetchMonthlyData()
      }, [])
  
    const percentageChanges: number = useMemo(() => {
        const lastMonthSales = Number(chartData[1]?.sales || 1)
        const thisMonthSales = Number(chartData[0]?.sales || 0)
        return ((thisMonthSales - lastMonthSales) * 100) / lastMonthSales
      }, [chartData])

    console.log(chartData)
    return (
    <div>
      <Card>
      <CardHeader>
        <CardTitle>Sales and Revenue graph</CardTitle>
        <CardDescription>Monthly sales for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className= "max-h-[400px] w-full">
        <AreaChart
          data={chartData}
          margin={{ left: 12, right: 12 }}
        >
          <CartesianGrid vertical={false} />

          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
            interval = {0}
          />

          <YAxis yAxisId="left" orientation="left" hide />
          <YAxis yAxisId="right" orientation="right" hide />

          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />

          <Area
            yAxisId="left"
            dataKey="sales"
            type="natural"
            fill="var(--color-sales)"
            fillOpacity={0.4}
            stroke="var(--color-sales)"
            stackId="a"
          />
          <Area
            yAxisId="right"
            dataKey="revenue"
            type="natural"
            fill="var(--color-revenue)"
            fillOpacity={0.4}
            stroke="var(--color-revenue)"
            stackId="b" // important: different stackId so they don't stack together
          />

          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
                {percentageChanges >= 0 ? `Gain ` : 'loss '}
                sales by {percentageChanges}% this month
                {percentageChanges >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
                }
            </div>
          </CardFooter>
      </Card>
    </div>
  )
}

