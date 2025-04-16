import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ChartData } from "./types/productChartData"
import { useEffect, useMemo, useState } from "react"
import { axiosInstance } from "@/lib/axios"
const colorPalette = [
    "chart-1",
    "chart-2",
    "chart-3",
    "chart-4",
    "chart-5",
  ]

const MostMonthlySales: React.FC = () => {
    const [chartData, setChartData] = useState<ChartData[]>([])
    const [loading, setLoading] = React.useState(true)
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axiosInstance.get('report/hotProduct')
                setChartData(data)        
                console.log('chartData',chartData)
            }catch(error) {
                console.error("failed to fetch product chart data", error)
            }
            finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])
    
    const totalSales = useMemo(() => {
        let total_sale = 0
        chartData.forEach((item) => {
            total_sale += Number(item.value)
        })
        console.log('total: ', total_sale)
        return total_sale
    }, [chartData])

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
        console.log('chartConfig', config)
        return config
    }, [chartData])

    return (
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Pie Chart - Donut with Text</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
          {loading ? (
            <div className="text-center py-20">Loading chart...</div>
            ) : (
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie data={chartData} dataKey="value" nameKey = "name" innerRadius={60} strokeWidth={5}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold text-white">
                                {totalSales.toLocaleString()}
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
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
          </CardFooter>
        </Card>
      )
}
export default MostMonthlySales