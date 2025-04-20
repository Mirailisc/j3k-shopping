import { Button } from '@/components/ui/button'
import { SELLER_DASHBOARD_PATH, SELLER_ORDER_PATH } from '@/constants/routes'
import { ChartArea, CircleGauge, Package, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const SellerTabs: React.FC = () => {
  const location = useLocation()

  return (
    <div className="flex my-10 bg-zinc-900 border border-white/10 rounded-md p-4 flex-row gap-2 items-center">
      <Link to={SELLER_DASHBOARD_PATH}>
        <Button variant={location.pathname === SELLER_DASHBOARD_PATH ? 'default' : 'outline'}>
          <CircleGauge size={16} />
          Dashboard
        </Button>
      </Link>
      <Link to={SELLER_ORDER_PATH}>
        <Button variant={location.pathname === SELLER_ORDER_PATH ? 'default' : 'outline'}>
          <Package size={16} />
          Orders
        </Button>
      </Link>
      <Button variant="outline">
        <ShoppingBag size={16} />
        Products
      </Button>
      <Button variant="outline">
        <ChartArea size={16} />
        Reports
      </Button>
    </div>
  )
}

export default SellerTabs
