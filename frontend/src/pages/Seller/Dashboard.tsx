import MonthlyTransaction from '@/components/Admin/Dashboard/MonthlyTransaction'
import TransactionCard from '@/components/Admin/Dashboard/TransactionCard'
import UserCard from '@/components/Admin/Dashboard/UserCard'

const SellerDashboard: React.FC = () => {

  return (
    <div>
      <div className="p-4">
        <h1 className="text-4xl mt-2 font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
          <TransactionCard />
          <UserCard />
          <TransactionCard />
          <UserCard />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <MonthlyTransaction />
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard
