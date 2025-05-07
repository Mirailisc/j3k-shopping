import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { axiosInstance } from '@/lib/axios'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'

export const AverageRatingCard: React.FC = () => {
  const [data, setData] = useState<number>(0)
  
    const fetchData = async () => {
      const {data} = await axiosInstance.get('report/seller/rating')
      setData(data[0]?.average_rating)
    }
    useEffect( () => {
        fetchData()
    },[])

  return (
    <Card>
      <CardHeader className = "pb-2 flex flex-row items-center justify-between">
        <CardTitle className = "text-sm font-normal text-zinc-400">Average reviews</CardTitle>
        <div className = "h-8 w-8 flex items-center justify-center">
          <Star  className = "h-5 w-5 text-zinc-400"/>
        </div>
      </CardHeader>
      <CardContent>
        {
        (Number(data) > 0) ? (
        <>
        <div className = "flex items-center">
            <h2 className = {`text-3xl font-bold flex-wrap ${data > 2.5 ? 'text-green-500' : 'text-red-500'}`}>{data.toFixed(2)}            </h2>
            <Star  className = "h-5 w-5 ml-1 text-zinc-400"/>
        </div>
        
        </>
        ) :
        (<p className = "text-xl font-bold flex-wrap">No review yet.</p>)
        }

        <div className = "flex items-center mt-1 text-sm text-zinc-400">
    
        </div>
        
      </CardContent>
    </Card>
  )
}


