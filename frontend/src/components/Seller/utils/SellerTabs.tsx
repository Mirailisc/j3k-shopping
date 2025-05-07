import { Button } from '@/components/ui/button'
import { SELLER_DASHBOARD_PATH, SELLER_ORDER_PATH, SELLER_PRODUCT_PATH, SELLER_REPRORT_PATH} from '@/constants/routes'
import { ChartArea, CircleGauge, Package, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const SellerTabs: React.FC = () => {
  const location = useLocation()

  return (
    <div className="flex my-10 bg-zinc-100 dark:bg-zinc-900 border border-black/20 dark:border-white/10 rounded-md p-4 flex-col md:flex-row gap-2 items-center">
      <Link to={SELLER_DASHBOARD_PATH} className='w-full md:w-auto'>
        <Button variant={location.pathname === SELLER_DASHBOARD_PATH ? 'default' : 'outline'} className='w-full md:w-auto'>
          <CircleGauge size={16} />
          Dashboard
        </Button>
      </Link>
      <Link to={SELLER_ORDER_PATH} className='w-full md:w-auto'>
        <Button variant={location.pathname === SELLER_ORDER_PATH ? 'default' : 'outline'} className='w-full md:w-auto'>
          <Package size={16} />
          Orders
        </Button>
      </Link>
      <Button variant="outline" className='w-full md:w-auto'>
        <ShoppingBag size={16} />
        Products
      </Button>
      <Link to={SELLER_PRODUCT_PATH} className='w-full md:w-auto'>
        <Button variant="outline" className='w-full md:w-auto'>
          <ShoppingBag size={16} />
          Products
        </Button>
      </Link>
      <Link to = {SELLER_REPRORT_PATH} className = 'w-full md:w-auto'>
        <Button variant={location.pathname === SELLER_REPRORT_PATH ? 'default' : 'outline'} className='w-full md:w-auto'>
        <ChartArea size={16} />
        Reports
      </Button>
      </Link>
    </div>
  )
}

export default SellerTabs
