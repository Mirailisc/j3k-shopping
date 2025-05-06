import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { axiosInstance } from '@/lib/axios'
import { TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'

const LowStockCard: React.FC = () => {
  const [data, setData] = useState<number>(0)
  
    const fetchData = async () => {
      const {data} = await axiosInstance.get('dashboard/seller/lowStock')
      setData(data)
      console.log(data)
    }
    useEffect( () => {
        fetchData()
    },[])

  return (
    <Card>
      <CardHeader className = "pb-2 flex flex-row items-center justify-between">
        <CardTitle className = "text-sm font-normal text-zinc-400">Low Stock Product</CardTitle>
        <div className = "h-8 w-8 flex items-center justify-center">
          <TriangleAlert  className = "h-5 w-5 text-zinc-400"/>
        </div>
      </CardHeader>
      <CardContent>
        {
        data >= 0 ? (
        <>
        <div className = "flex items-baseline">
            <h2 className = "text-3xl text-red-500 font-bold flex-wrap">{data.toString()}</h2>
        </div>
        <div className = "flex items-center mt-1 text-sm text-zinc-400">
          Products
        </div>

        </>
        ) :
        <p className = "text-sm text-zinc-400">Loading...</p>
        }
      </CardContent>
    </Card>
  )
}

export default LowStockCard


