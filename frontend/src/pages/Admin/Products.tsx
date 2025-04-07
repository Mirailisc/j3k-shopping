import { ProductDataTable } from '@/components/Admin/Product/Table'
import Sidebar from '@/components/Admin/utils/Sidebar'
import { useSidebar } from '@/context/hooks/useSidebar'
import { axiosInstance } from '@/lib/axios'
import { Product as TypeProduct } from '@/types/product'
import { useEffect, useState } from 'react'

const Product: React.FC = () => {
  const sidebar = useSidebar()

  const [data, setData] = useState<TypeProduct[]>([])

  const fetchProducts = async () => {
    const { data } = await axiosInstance.get('/product')
    setData(data)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div>
      <div className={`transition-all duration-300 ${sidebar?.isSidebarOpen ? 'ml-[260px]' : 'ml-[70px]'}`}>
        <Sidebar />

        <div className="p-4">
          <h1 className="text-4xl mt-2 font-bold">Product Management</h1>
          <div className="w-full h-[50vh] rounded-sm">
            <ProductDataTable data={data} setData={setData} fetchProducts={fetchProducts} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product
