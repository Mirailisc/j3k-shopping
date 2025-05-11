import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { axiosInstance } from '@/lib/axios'
import { Flame } from 'lucide-react'
import { useEffect, useState } from 'react'

type props = {
  timePeriod: string,
}

type HotProduct = {
  name: string, 
  value: number,
}
export const MostSalesProductCard: React.FC<props> = ({timePeriod} : props) => {
  const [data, setData] = useState<HotProduct | null>(null)
  const dataType = 'amount'
    const fetchData = async () => {
      const {data} = await axiosInstance.get('report/seller/sales', {params: { dataType,timePeriod}})
      setData(data[0])
    }
    useEffect( () => {
        fetchData()
    },[timePeriod])

  return (
    <Card>
      <CardHeader className = "pb-2 flex flex-row items-center justify-between">
        <CardTitle className = "text-sm font-normal text-zinc-400">Most Sales Product</CardTitle>
        <div className = "h-8 w-8 flex items-center justify-center">
          <Flame  className = "h-5 w-5 text-zinc-400"/>
        </div>
      </CardHeader>
      <CardContent>
        {
        data ? (
        <>
        <div className = "flex items-baseline">
            <h2 className = "text-3xl font-bold flex-wrap">{data?.name}</h2>
        </div>
        </>
        ) :
        (<p className = "text-xl font-bold flex-wrap">No sales for this period yet.</p>)
        }

        <div className = "flex items-center mt-1 text-sm text-zinc-400">
                 <p className='text-sm text-zinc-400'>Period: {timePeriod}</p>
        </div>
        
      </CardContent>
    </Card>
  )
}


