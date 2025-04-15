import ProductList from '@/components/ProductList'
import Stats from '@/components/Stats'
import { axiosInstance } from '@/lib/axios'
import { ProductFeed } from '@/types/feed'
import { isAxiosError } from 'axios'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

const Home: React.FC = () => {
  const [products, setProducts] = React.useState<ProductFeed[]>([])

  const getProducts = async () => {
    try {
      const response = await axiosInstance.get('/feed/products/recent')
      setProducts(response.data)
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  return (
    <div className="mt-[100px] px-4">
      <Stats />
      <h2 className="text-3xl font-bold my-10">Recently Added</h2>
      <ProductList products={products} />
    </div>
  )
}

export default Home
