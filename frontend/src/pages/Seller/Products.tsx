import SellerTabs from '@/components/Seller/utils/SellerTabs'
import { axiosInstance } from '@/lib/axios'
import { Product as TypeProduct } from '@/types/product'
import { useEffect, useState } from 'react'
import { ProductDataTable } from '@/components/Seller/Products/Table'

const SellerProduct: React.FC = () => {

  const [data, setData] = useState<TypeProduct[]>([]);
  
  const fetchProducts = async () => {
    const response = await axiosInstance.get('/auth/me');
    const { data } = await axiosInstance.get(`/product/seller/${response.data.id}`);
    setData(data);
  }
  
  useEffect(() => {
    fetchProducts();
  }, [])

  return (
    <div className="mt-[60px]">
      <div className="p-4">
        <SellerTabs />
        <h1 className="text-4xl my-2 font-bold">Products</h1>
        <div className="w-full h-[50vh] rounded-sm px-4">
            <ProductDataTable data={data} setData={setData} fetchProducts={fetchProducts} />
        </div>
      </div>
    </div>
  )
}

export default SellerProduct
