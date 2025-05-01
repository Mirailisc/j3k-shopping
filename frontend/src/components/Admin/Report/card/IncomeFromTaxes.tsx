import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { axiosInstance } from '@/lib/axios'
import { PiggyBank } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getLabelFromTimePeriod } from '../types/TimePeriod'

type IncomeTaxes = {
    price:number,
}

type props = {
  timePeriod: string
}
const IncomeFromTaxes: React.FC<props> = ({timePeriod} : props) => {
  console.log(timePeriod)
  const [data, setData] = useState<IncomeTaxes | null> (null)

  const fetchData = async () => {
    const {data} = await axiosInstance.get('report/admin/income-taxes', {params: {timePeriod}})
    setData(data)
  }

  useEffect(() => {
    fetchData()
  },[timePeriod])


  return (
    <Card>
      <CardHeader className = "pb-2 flex flex-row items-center justify-between">
        <CardTitle className = "text-sm font-normal text-zinc-400">Income from taxes</CardTitle>
        <div className = "h-8 w-8 flex items-center justify-center">
          <PiggyBank  className = "h-5 w-5 text-zinc-400"/>
        </div>
      </CardHeader>
      <CardContent>
        {
        data ? (
        <>
        <div className = "flex items-baseline">
            <h2 className = "text-3xl font-bold flex-wrap">{data.price ? data.price.toFixed(2) : 0} ฿</h2>
        </div>
        </>
        ) :
        <p className = "text-sm text-zinc-400">Loading...</p>
        }
        <div className = 'flex items-center mt-1'>
          <p className = 'text-sm text-zinc-400'>period: {getLabelFromTimePeriod(timePeriod)}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default IncomeFromTaxes


