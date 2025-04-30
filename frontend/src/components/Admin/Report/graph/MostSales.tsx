import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { SalesData } from '../types/productChartData'
import { useEffect, useMemo, useState } from 'react'
import { axiosInstance } from '@/lib/axios'
import { YAxis, XAxis, Bar, BarChart } from 'recharts'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemIndicator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown, Dot } from 'lucide-react'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { getLabelFromTimePeriod } from '../types/TimePeriod'

const DataType = [
  { label: 'amount', value: 'amount' },
  { label: 'revenue', value: 'total' },
]

type props = {
  timePeriod: string
}

export const MostSales: React.FC<props> = ({timePeriod }: props) => {
  const [loading, setLoading] = useState(true)
  const [dataType, setDataType] = useState('amount')
  const [data, setSalesData] = useState<SalesData[]>([])

  function getLabelFromDataType(value: string): string | undefined {
    const item = DataType.find((type) => type.value === value)
    return item?.label
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get('report/admin/sales', {
          params: {
            dataType,
            timePeriod,
          },
        })
        setSalesData(data)
      } catch (error) {
        if (isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || 'Something went wrong'
          toast.error(errorMessage)
        } else {
          toast.error('An unexpected error occurred')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [dataType, timePeriod])

  const chartData = useMemo(() => {
    const chartData: SalesData[] = []
    if (data) {
      data.forEach((item) => {
        chartData.push({
          name: item.name,
          value: item.value,
        })
      })
    }

    return chartData
  }, [data])

  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {
      sale: { label: 'Sales' },
    }

    chartData?.forEach((item) => {
      config[item.name] = {
        label: item.name,
        color: '#185cc9',
      }
    })

    return config
  }, [chartData])

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between gap-4 px-3">
        <CardHeader className="pb-0">
          <CardTitle>Most sales {getLabelFromDataType(dataType)} product</CardTitle>
          <CardDescription>period: {getLabelFromTimePeriod(timePeriod)}</CardDescription>
        </CardHeader>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 w-30">
              {getLabelFromDataType(dataType)}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mt-[5px] px-2 py-2 border border-black/20 dark:border-white/10 rounded-sm w-30 z-1 bg-zinc-100 dark:bg-zinc-900">
            <DropdownMenuLabel>Data Type</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={dataType} onValueChange={setDataType}>
              {DataType.map((item) => {
                return (
                  <DropdownMenuRadioItem
                    key={item.value}
                    value={item.value}
                    className="text-sm focus:outline-none focus:opacity-50"
                  >
                    <DropdownMenuItemIndicator>
                      <Dot className="rounded-full mx-1 h-[5px] w-[5px] inline-flex bg-white focus:outline-none focus:ring-2 focus:ring-white" />
                    </DropdownMenuItemIndicator>
                    {item.label}
                  </DropdownMenuRadioItem>
                )
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardContent className="max-h-[400px] overflow-auto">
        {loading ? (
          <div className="text-center py-20">Loading chart...</div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData} layout="vertical" height={400} margin={{ left: 12, right: 12 }}>
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label ?? value}
              />
              <XAxis type="number" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="value" layout="vertical" radius={5} fill="#185cc9" barSize={50} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
