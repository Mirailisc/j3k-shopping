import * as React from "react"
import { Check } from "lucide-react"
import { Cell, Label, Pie, PieChart } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useMemo, useState } from "react"
import { axiosInstance } from "@/lib/axios"
import { getLabelFromTimePeriod } from "../types/TimePeriod"

const colorPalette = [
  "#1b3da8", // navy-ish blue
  "#2648b9", // deep blue
  "#3252c7", // darker blue
  "#4661d4", // strong blue
  "#5c75d6", // mid blue
  "#7189d7", // slightly deeper blue
  "#8b9fdc", // lavender blue
  "#94a5d4", // soft light blue
]

type ChartData = {
    name: string,
    value: number,
}

type props = {
    timePeriod: string,
}
const StatusCountGraph: React.FC<props> = ({timePeriod}: props) => {
    const [chartData, setChartData] = useState<ChartData[]>([])
    const [loading, setLoading] = React.useState(true)

  
    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axiosInstance.get('report/admin/status',{params: {timePeriod}})
                setChartData(data)        
            }catch(error) {
                console.error("failed to fetch product chart data", error)
            }
            finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [timePeriod])
    
    const totalOrders = useMemo(() => {
        let total_order = 0
        chartData.forEach((item) => {
            total_order += Number(item.value)
        })
        return total_order
    }, [chartData])

    const completedPercentage = useMemo(() => {
          let completed = 0
          chartData.forEach((item) => {
            if(item.name === 'Completed') completed = item.value
          })
          return (completed / totalOrders).toFixed(2)
    },[chartData, totalOrders])

    const chartConfig: ChartConfig = useMemo(() => {
        const config: ChartConfig = {
            sale: {label: "Sales"},
        }
    
        chartData.forEach((item, index) => {
            config[item.name] = {
                label: item.name,
                color: colorPalette[index % colorPalette.length],
            }
        })
        return config
    }, [chartData])

    return (
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Order Status</CardTitle>
            <CardDescription>{getLabelFromTimePeriod(timePeriod)}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
          {loading ? (
            <div className="text-center py-20">Loading chart...</div>
            ) : (
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie data={chartData} dataKey="value" nameKey = "name" innerRadius={80} strokeWidth={5}>
                    {chartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={`${colorPalette[index % colorPalette.length]}`} />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold text-white">
                                {totalOrders.toLocaleString()}
                              </tspan>
                              <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                Sales
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Having {completedPercentage}% of completed orders <Check className="h-4 w-4" />
            </div>
          </CardFooter>
        </Card>
      )
}
export default StatusCountGraph