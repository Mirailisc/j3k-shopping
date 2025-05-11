import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { axiosInstance } from '@/lib/axios'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

type props = {
  timePeriod: string,
}

export const UnsoldProductsCard: React.FC<props> = ({timePeriod} : props) => {
  const [data, setData] = useState<number>(0)
  
    const fetchData = async () => {
      const {data} = await axiosInstance.get('report/seller/unsold', {params: {timePeriod}})
      setData(data[0]?.total)
    }
    useEffect( () => {
        fetchData()
    },[timePeriod])
  
  return (
    <Card>
      <CardHeader className = "pb-2 flex flex-row items-center justify-between">
        <CardTitle className = "text-sm font-normal text-zinc-400">Unsold Product count</CardTitle>
        <div className = "h-8 w-8 flex items-center justify-center">
          <X  className = "h-5 w-5 text-zinc-400"/>
        </div>
      </CardHeader>
      <CardContent>
        {
        data >= 0 ? (
        <>
        <div className = "flex items-baseline">
            <h2 className = "text-3xl font-bold flex-wrap">{data}</h2>
        </div>
        </>
        ) :
        (<p className = "text-xl font-bold flex-wrap">Loading...</p>)
        }

        <div className = "flex items-center mt-1 text-sm text-zinc-400">
                 <p className='text-sm text-zinc-400'>Period: {timePeriod}</p>
        </div>
        
      </CardContent>
    </Card>
  )
}


