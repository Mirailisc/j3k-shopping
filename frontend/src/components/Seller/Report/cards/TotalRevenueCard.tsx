import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { axiosInstance } from '@/lib/axios'
import { HandCoins } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { getLabelFromTimePeriod } from '../types/TimePeriod'

type props = {
  timePeriod: string,
}

type totalRevenue = {
  revenue:number,
}
export const TotalRevenueCard: React.FC<props> = ({timePeriod} : props) => {
  const [data, setData] = useState<totalRevenue[]>([])
  
    const fetchData = async () => {
      const {data} = await axiosInstance.get('report/seller/revenue', {params: {timePeriod}})
      setData(data)
    }
    useEffect( () => {
        fetchData()
    },[timePeriod])

    const total = useMemo(() => {
      if(timePeriod === "ALL TIME")
        return data[0]?.revenue
      else 
        return data[0]?.revenue-data[1]?.revenue
    },[data, timePeriod])

    const increasedPercentage = useMemo(() => {
        const lastMonthUser = data[1] ? data[1].revenue : 0
        if (lastMonthUser === 0) return 100
        const percentage = ((data[0]?.revenue-lastMonthUser)*100 / lastMonthUser)
        return percentage
      }, [data])

  return (
    <Card>
      <CardHeader className = "pb-2 flex flex-row items-center justify-between">
        <CardTitle className = "text-sm font-normal text-zinc-400">Total Revenue</CardTitle>
        <div className = "h-8 w-8 flex items-center justify-center">
          <HandCoins  className = "h-5 w-5 text-zinc-400"/>
        </div>
      </CardHeader>
      <CardContent>
        {
        data.length > 0 ? (
        <>
        <div className = "flex items-baseline">
            <h2 className = "text-3xl font-bold flex-wrap">{(total).toFixed(2)} ฿</h2>
        </div>
        <div className = "flex items-center mt-1 text-sm text-zinc-400">
                    {timePeriod !== 'ALL TIME' && <p className = {`text-sm ${Number(increasedPercentage) >= 0 ? 'text-green-500' : 'text-red-500'}`}>{Number(increasedPercentage) >= 0 ? '+' : ''}{increasedPercentage.toFixed(2)}% from last {getLabelFromTimePeriod(timePeriod)}</p>}
                    {timePeriod === 'ALL TIME' && <p className = 'text-sm text-zinc-400'>All time</p>}
        </div>

        </>
        ) :
        <p className = "text-sm text-zinc-400">Loading...</p>
        }
      </CardContent>
    </Card>
  )
}


