import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { axiosInstance } from '@/lib/axios'
import { Frown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { userRefunded } from '../types/userRefunded'


const MostRefundedUserCard: React.FC = () => {
  const [data, setData] = useState<userRefunded | null> (null)

  const fetchData = async () => {
    const {data} = await axiosInstance.get('report/refunded')
    setData(data[0])
  }

  useEffect(() => {
    fetchData()
  },[])

  return (
    <Card>
      <CardHeader className = "pb-2 flex flex-row items-center justify-between">
        <CardTitle className = "text-sm font-normal text-zinc-400">Most refunded Seller</CardTitle>
        <div className = "h-8 w-8 flex items-center justify-center">
          <Frown  className = "h-5 w-5 text-zinc-400"/>
        </div>
      </CardHeader>
      <CardContent>
        {
        data ? (
        <>
        <div className = "flex items-baseline">
            <h2 className = "text-3xl font-bold flex-wrap">{data.username}</h2>
        </div>
        <div className = "flex items-center mt-1">
          <p className = "text-sm text-red-500">{data.refunded_amount.toLocaleString()} refunds ({data.refunded_percentage.toFixed(2)}%)</p>
        </div>
        </>
        ) :
        <p className = "text-sm text-zinc-400">Loading...</p>
        }
      </CardContent>
    </Card>
  )
}

export default MostRefundedUserCard


