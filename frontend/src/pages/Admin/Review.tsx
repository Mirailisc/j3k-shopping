import Sidebar from '@/components/Admin/utils/Sidebar'
import { useSidebar } from '@/context/hooks/useSidebar'
import { Review as TypeReview } from '@/types/review'
import { ReviewDataTable } from '@/components/Admin/Review/Table'
import { axiosInstance } from '@/lib/axios'
import { useEffect, useState } from 'react'

const Review: React.FC = () => {
  const sidebar = useSidebar()

  const [data, setData] = useState<TypeReview[]>([])

  const fetchReviews = async () => {
    const { data } = await axiosInstance.get('/review/admin')
    setData(data)
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  return (
    <div>
      <div className={`transition-all duration-300 ${sidebar?.isSidebarOpen ? 'ml-[260px]' : 'ml-[70px]'}`}>
        <Sidebar />

        <div className="p-4">
          <h1 className="text-4xl mt-2 font-bold">Review Management</h1>
          <div className="w-full h-[50vh] rounded-sm">
            <ReviewDataTable data={data} setData={setData} fetchReviews={fetchReviews} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Review
