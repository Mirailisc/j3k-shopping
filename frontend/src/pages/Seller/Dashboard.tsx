import LowStockCard from '@/components/Seller/Dashboard/cards/LowStockCard'
import OnPendingorderCard from '@/components/Seller/Dashboard/cards/OnPendingOrderCard'
import TotalOrderCard from '@/components/Seller/Dashboard/cards/TotalOrderCard'
import TotalSaleCard from '@/components/Seller/Dashboard/cards/totalSaleCard'
import SellerTabs from '@/components/Seller/utils/SellerTabs'
import { TotalRevenue } from '../../components/Seller/Dashboard/TotalRevenue';
import { LowStockColumns } from '@/components/Seller/Dashboard/LowStockColumns'

const SellerDashboard: React.FC = () => {
  return (
    <div className="mt-[60px]">
      <div className="p-4">
        <SellerTabs />
        <h1 className="text-4xl my-8 font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
          <TotalOrderCard />
          <TotalSaleCard />
          <OnPendingorderCard/>
          <LowStockCard />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <TotalRevenue />
          <LowStockColumns />
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard
