import { ChartArea, CircleGauge, Package, ShoppingBag, Star, UserRound } from 'lucide-react'
import { useSidebar } from '@/context/hooks/useSidebar'
import { Link } from 'react-router-dom'
import {
  DASHBOARD_PATH,
  ORDER_MANAGE_PATH,
  PRODUCT_MANAGE_PATH,
  REPORT_PATH,
  REVIEW_MANAGE_PATH,
  USER_MANAGE_PATH,
} from '@/constants/routes'
import { motion, AnimatePresence } from 'framer-motion'

const Sidebar: React.FC = () => {
  const sidebar = useSidebar()

  return (
    <div className="fixed left-0 top-[60px] bottom-[10px]">
      <AnimatePresence mode="wait">
        <motion.div
          className="p-2 border h-[calc(100vh-90px)] border-white/10 bg-zinc-900 m-[10px] mt-[20px] rounded-sm"
          initial={{ width: sidebar?.isSidebarOpen ? 250 : 60 }}
          animate={{ width: sidebar?.isSidebarOpen ? 250 : 60 }}
          exit={{ width: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Link
            to={DASHBOARD_PATH}
            className={`p-2 rounded-sm flex items-center ${sidebar?.isSidebarOpen ? 'justify-start' : 'justify-center'} gap-2 hover:bg-zinc-800`}
          >
            <CircleGauge size={16} />
            {sidebar?.isSidebarOpen && 'Dashboard'}
          </Link>
          {sidebar?.isSidebarOpen && <h4 className="text-zinc-400 my-4 ml-2">Database Management</h4>}
          <div className="flex flex-col gap-2">
            <Link
              to={USER_MANAGE_PATH}
              className={`p-2 rounded-sm flex items-center ${sidebar?.isSidebarOpen ? 'justify-start' : 'justify-center'} gap-2 hover:bg-zinc-800`}
            >
              <UserRound size={16} />
              {sidebar?.isSidebarOpen && 'Users'}
            </Link>
            <Link
              to={PRODUCT_MANAGE_PATH}
              className={`p-2 rounded-sm flex items-center ${sidebar?.isSidebarOpen ? 'justify-start' : 'justify-center'} gap-2 hover:bg-zinc-800`}
            >
              <ShoppingBag size={16} />
              {sidebar?.isSidebarOpen && 'Products'}
            </Link>
            <Link
              to={ORDER_MANAGE_PATH}
              className={`p-2 rounded-sm flex items-center ${sidebar?.isSidebarOpen ? 'justify-start' : 'justify-center'} gap-2 hover:bg-zinc-800`}
            >
              <Package size={16} />
              {sidebar?.isSidebarOpen && 'Orders'}
            </Link>
            <Link
              to={REVIEW_MANAGE_PATH}
              className={`p-2 rounded-sm flex items-center ${sidebar?.isSidebarOpen ? 'justify-start' : 'justify-center'} gap-2 hover:bg-zinc-800`}
            >
              <Star size={16} />
              {sidebar?.isSidebarOpen && 'Reviews'}
            </Link>
          </div>
          {sidebar?.isSidebarOpen && <h4 className="text-zinc-400 my-4 ml-2">Analytics</h4>}
          <div className="flex flex-col gap-2">
            <Link
              to={REPORT_PATH}
              className={`p-2 rounded-sm flex items-center ${sidebar?.isSidebarOpen ? 'justify-start' : 'justify-center'} gap-2 hover:bg-zinc-800`}
            >
              <ChartArea size={16} />
              {sidebar?.isSidebarOpen && 'Reports'}
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Sidebar
