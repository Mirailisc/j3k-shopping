import KanbanBoard from '@/components/Seller/KanbanBoard'
import SellerTabs from '@/components/Seller/utils/SellerTabs'

const SellerOrder = () => {
  return (
    <div className="mt-[60px]">
      <div className="p-4">
        <SellerTabs />
        <h1 className="text-4xl my-8 font-bold">Orders</h1>
        <KanbanBoard />
      </div>
    </div>
  )
}

export default SellerOrder
