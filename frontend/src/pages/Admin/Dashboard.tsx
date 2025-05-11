import { AverageRatingCard } from '@/components/Admin/Dashboard/card/AverageRatingCard'
import { CustomerCountCard } from '@/components/Admin/Dashboard/card/CustomerCountCard'
import { TotalRevenueCard } from '@/components/Admin/Dashboard/card/TotalRevenueCard'
import Sidebar from '@/components/Admin/utils/Sidebar'
import { TotalRevenue } from '@/components/Admin/Dashboard/graph/TotalRevenue'
import { useSidebar } from '@/context/hooks/useSidebar'
import RatingStarGraph from '@/components/Admin/Dashboard/graph/RatingStarGraph'
import { TotalOrderCard } from '@/components/Admin/Dashboard/card/TotalOrderCard'

const AdminDashboard: React.FC = () => {
  const sidebar = useSidebar()

  return (
    <div>
      <div className={`transition-all duration-300 ${sidebar?.isSidebarOpen ? 'ml-[260px]' : 'ml-[70px]'}`}>
        <Sidebar />

        <div className="p-4">
          <h1 className="text-4xl mt-2 font-bold">Dashboard</h1>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2'>
            <CustomerCountCard />
            <TotalOrderCard />
            <TotalRevenueCard />
            <AverageRatingCard/>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2'>
            <TotalRevenue />
            <RatingStarGraph />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
