import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartData = [
  { month: 'January', transaction: 400 },
  { month: 'February', transaction: 300 },
  { month: 'March', transaction: 200 },
  { month: 'April', transaction: 278 },
  { month: 'May', transaction: 189 },
  { month: 'June', transaction: 239 },
]

const chartConfig = {
  transaction: {
    label: 'Transaction',
    color: '#2563eb',
  },
} satisfies ChartConfig

const MonthlyTransaction: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 mt-4">Monthly Transaction</h2>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          {/* <ChartLegend content={<ChartLegendContent />} /> */}
          <Bar dataKey="transaction" fill="var(--color-transaction)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export default MonthlyTransaction
