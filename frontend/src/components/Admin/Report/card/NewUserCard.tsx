import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { axiosInstance } from '@/lib/axios'
import { User } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type newUser = {
    newUser: number
}
type props = {
  timePeriod:string
}
const NewUserCar: React.FC<props> = ({timePeriod}: props) => {
  const [data, setData] = useState<newUser[]> ([])
  const fetchData = async () => {
    const {data} = await axiosInstance.get('report/admin/newUser', {params:{timePeriod}})
    setData(data)
  }

  useEffect(() => {
    fetchData()
  },[timePeriod])

  const increasedPercentage = useMemo(() => {
    const lastMonthUser = data[1]?.newUser
    if(lastMonthUser === 0) return 100
    const percentage = ((data[0]?.newUser-lastMonthUser)*100 / lastMonthUser)
    return percentage.toFixed(2)
  }, [data])

  const total = useMemo(() => {
    if(timePeriod === "ALL TIME")
      return data[0]?.newUser
    else 
      return data[0]?.newUser-data[1]?.newUser
  },[data, timePeriod])
  
  return (
    <Card>
      <CardHeader className = "pb-2 flex flex-row items-center justify-between">
        <CardTitle className = "text-sm font-normal text-zinc-400">Total User</CardTitle>
        <div className = "h-8 w-8 flex items-center justify-center">
          <User  className = "h-5 w-5 text-zinc-400"/>
        </div>
      </CardHeader>
      <CardContent>
        {
        data ? (
        <>
        <div className = "flex items-baseline">
            <h2 className = "text-3xl font-bold flex-wrap">{total >= 0 ? '+': ''}{total}</h2>
        </div>
        <div className = "flex items-center mt-1">
          {timePeriod !== 'ALL TIME' && <p className = {`text-sm ${Number(increasedPercentage) >= 0 ? 'text-green-500' : 'text-red-500'}`}>{Number(increasedPercentage) >= 0 ? '+' : ''}{increasedPercentage.toString()}% from last {timePeriod}</p>}
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

export default NewUserCar


