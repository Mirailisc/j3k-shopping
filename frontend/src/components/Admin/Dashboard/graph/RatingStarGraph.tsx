import * as React from "react"
import { Check } from "lucide-react"
import { Cell, Label, Pie, PieChart } from "recharts"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useMemo, useState } from "react"
import { axiosInstance } from "@/lib/axios"

const colorPalette = [
  "#32a852",
  "#74c47b",
  "#f1faaa",
  "#e6aa8a",
  "#f07569", 
]


type ChartData = {
    name: string,
    value: number,
}

const RatingStarGraph: React.FC = () => {
    const [chartData, setChartData] = useState<ChartData[]>([])
    const [loading, setLoading] = React.useState(true)
  
    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axiosInstance.get('dashboard/admin/rating-count')
                setChartData(data)    
            }catch(error) {
                console.error("failed to fetch product chart data", error)
            }
            finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])
    
    const totalOrders = useMemo(() => {
        let total_order = 0
        chartData?.forEach((item) => {
            total_order += Number(item.value)
        })
        return total_order
    }, [chartData])

    const fiveStarPercentage = useMemo(() => {
          let five = 0
          chartData?.forEach((item) => {
            if(Number(item.name) === 5) five = item.value
          })
          return (five *100 / totalOrders).toFixed(2)
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
            <CardTitle>Stars rating</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
          {chartData.length === 0 && <div className="text-center py-20">No review yet</div>}
          {loading ? (
            <div className="text-center py-20">Loading chart...</div>
            ) : ( chartData.length > 0 &&
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie data={chartData} dataKey="value" nameKey = "name" innerRadius={80} strokeWidth={5}>
                    {chartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={`${colorPalette[5-Number(_entry.name)]}`} />
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
                                Reviews
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
            { 
            chartData.length > 0 && <div className="flex items-center gap-2 font-medium leading-none">
              Having {fiveStarPercentage}% of  5 stars <Check className="h-4 w-4" />
            </div>}
          </CardFooter>
        </Card>
      )
}
export default RatingStarGraph