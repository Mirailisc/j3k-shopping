import Sidebar from '@/components/Admin/utils/Sidebar'
import { useSidebar } from '@/context/hooks/useSidebar'

const Product: React.FC = () => {
  const sidebar = useSidebar()

  return (
    <div>
      <div className={`transition-all duration-300 ${sidebar?.isSidebarOpen ? 'ml-[260px]' : 'ml-[70px]'}`}>
        <Sidebar />

        <div className="p-4">
          <h1 className="text-4xl mt-2 font-bold">Product Management</h1>
          <div className="bg-zinc-900 w-full h-[50vh] rounded-sm mt-4"></div>
        </div>
      </div>
    </div>
  )
}

export default Product
