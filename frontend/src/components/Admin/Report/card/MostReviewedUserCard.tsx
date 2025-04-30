import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { axiosInstance } from '@/lib/axios'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { userReview } from '../types/userReview'


const MostReviewedUserCard: React.FC = () => {
  const [data, setData] = useState<userReview|null>(null)
 
  const fetchUser = async () => {
      const {data} = await axiosInstance.get('/report/admin/reviewed')
      setData(data[0])
    }
    
  

  useEffect(() => {
    fetchUser()
  }, [])
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-normal text-zinc-400">
          Most Reviewed Seller
        </CardTitle>
        <div className="h-8 w-8 flex items-center justify-center">
          <Star className="h-5 w-5 text-zinc-400" />
        </div>
      </CardHeader>
      <CardContent>
        {data ? (
          <>
            <div className="flex items-baseline">
              <h2 className="text-3xl font-bold flex-wrap">{data.username}</h2>
            </div>
            <div className="flex items-center mt-1">
              <p className="text-sm text-green-500">
                {data.reviews_amount.toLocaleString()} reviews (avg{' '}
                {data.average_rating.toFixed(2)} stars)
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-zinc-400">Loading...</p>
        )}
      </CardContent>
    </Card>
  )
}

export default MostReviewedUserCard

