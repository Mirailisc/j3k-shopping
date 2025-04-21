import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { axiosInstance } from '@/lib/axios'
import { PiggyBank } from 'lucide-react'
import { useEffect, useState } from 'react'

type averageSales = {
    price:number,
}

const AverageOrderValueCard: React.FC = () => {
  const [data, setData] = useState<averageSales | null> (null)

  const fetchData = async () => {
    const {data} = await axiosInstance.get('report/average_sales')
    setData(data)
  }

  useEffect(() => {
    fetchData()
  },[])


  return (
    <Card>
      <CardHeader className = "pb-2 flex flex-row items-center justify-between">
        <CardTitle className = "text-sm font-normal text-zinc-400">Average order value</CardTitle>
        <div className = "h-8 w-8 flex items-center justify-center">
          <PiggyBank  className = "h-5 w-5 text-zinc-400"/>
        </div>
      </CardHeader>
      <CardContent>
        {
        data ? (
        <>
        <div className = "flex items-baseline">
            <h2 className = "text-3xl font-bold flex-wrap">{data.price?.toFixed(2)} ฿</h2>
        </div>
        </>
        ) :
        <p className = "text-sm text-zinc-400">Loading...</p>
        }
      </CardContent>
    </Card>
  )
}

export default AverageOrderValueCard


