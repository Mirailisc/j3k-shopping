import MonthlyTransaction from '@/components/Admin/Dashboard/MonthlyTransaction'
import TransactionCard from '@/components/Admin/Dashboard/TransactionCard'
import UserCard from '@/components/Admin/Dashboard/UserCard'
import Sidebar from '@/components/Admin/utils/Sidebar'
import { useSidebar } from '@/context/hooks/useSidebar'

const Report: React.FC = () => {
  const sidebar = useSidebar()

  return (
    <div>
      <div className={`transition-all duration-300 ${sidebar?.isSidebarOpen ? 'ml-[260px]' : 'ml-[70px]'}`}>
        <Sidebar />

        <div className="p-4">
          <h1 className="text-4xl mt-2 font-bold">Reports</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
            <TransactionCard />
            <UserCard />
            <TransactionCard />
            <UserCard />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <MonthlyTransaction />
            <MonthlyTransaction />
            <MonthlyTransaction />
            <MonthlyTransaction />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Report
