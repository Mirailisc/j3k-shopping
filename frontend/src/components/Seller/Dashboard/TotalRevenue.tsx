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
import { ChevronDown, Dot, TrendingDown, TrendingUp } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { axiosInstance } from '@/lib/axios'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItemIndicator,
} from '@radix-ui/react-dropdown-menu'
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
  range: string
  sales: number
  revenue: number
}

const timeRange = [
  { label: 'Daily', value: 'DAY' },
  { label: 'Weekly', value: 'WEEK' },
  { label: 'Monthly', value: 'MONTH' },
  { label: 'Yearly', value: 'YEAR' },
]
export const TotalRevenue: React.FC = () => {
  const [chartData, setMonthlyData] = useState<MonthlyData[]>([])
  const [range, setRange] = useState<string>('MONTH')

  function getLabelFromTimeRange(value: string): string | undefined {
    const item = timeRange.find((range) => range.value === value)
    return item?.label
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get('dashboard/seller/total', { params: { range } })
        setMonthlyData(data)
      } catch (error) {
        if (isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || 'Something went wrong'
          toast.error(errorMessage)
        } else {
          toast.error('An unexpected error occurred')
        }
      }
    }
    fetchData()
  }, [range])

  const percentageChanges: number = useMemo(() => {
    const LastSales = Number(chartData[chartData.length - 2]?.revenue || 0)
    const thisSales = Number(chartData[chartData.length - 1]?.revenue || 0)
    if (LastSales === 0) return 100
    return ((thisSales - LastSales) * 100) / LastSales
  }, [chartData])

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between gap-4 px-3">
        <CardHeader className="pb-0">
          <CardTitle>Sales and Revenue graph</CardTitle>
          <CardDescription>{getLabelFromTimeRange(range)} data</CardDescription>
        </CardHeader>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 w-30">
              {getLabelFromTimeRange(range)}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="mt-[5px] px-2 py-2 border border-black/20 dark:border-white/10 rounded-sm w-30 z-1 bg-zinc-100 dark:bg-zinc-900"
          >
            <DropdownMenuLabel>Time range</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={range} onValueChange={setRange}>
              {timeRange.map((item) => {
                return (
                  <DropdownMenuRadioItem
                    key={item.value}
                    value={item.value}
                    className="text-sm py-1 focus:outline-none focus:opacity-50"
                  >
                    <DropdownMenuItemIndicator>
                      <Dot className="rounded-full mx-1 h-[5px] w-[5px] inline-flex bg-current focus:outline-none focus:ring-2 focus:ring-white" />
                    </DropdownMenuItemIndicator>
                    {item.label}
                  </DropdownMenuRadioItem>
                )
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
          {percentageChanges >= 0 ? `Gain ` : 'loss '}
          revenue by {percentageChanges.toFixed(2)}% this {range.toLowerCase()}
          {percentageChanges >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        </div>
      </CardFooter>
    </Card>
  )
}
