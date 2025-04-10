import { OrderDataTable } from '@/components/Admin/Order/Table'
import Sidebar from '@/components/Admin/utils/Sidebar'
import { useSidebar } from '@/context/hooks/useSidebar'
import { axiosInstance } from '@/lib/axios'
import {Order as TypeOrder} from '@/types/order'
import { useEffect, useState } from 'react'

const Order: React.FC = () => {
  const sidebar = useSidebar()

  const [data, setData] = useState<TypeOrder[]>([])

  const fetchOrders = async  () =>{ 
    const {data} = await axiosInstance.get('/order')
    setData(data)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div>
      <div className={`transition-all duration-300 ${sidebar?.isSidebarOpen ? 'ml-[260px]' : 'ml-[70px]'}`}>
        <Sidebar />

        <div className="p-4">
          <h1 className="text-4xl mt-2 font-bold">Order Management</h1>
          <OrderDataTable data = {data} setData = {setData} fetchOrders = {fetchOrders} />
        </div>
      </div>
    </div>
  )
}

export default Order
