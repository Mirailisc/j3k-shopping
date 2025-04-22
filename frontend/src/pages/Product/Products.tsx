import ProductList from '@/components/Product/ProductList'
import { ProductListSkeleton } from '@/components/Product/ProductListSkeleton'
import { axiosInstance } from '@/lib/axios'
import { ProductFeed } from '@/types/feed'
import { isAxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductFeed[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const getProducts = async () => {
    try {
      const response = await axiosInstance.get('/feed/products')
      setProducts(response.data)
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  if (loading)
    return (
      <div className="mt-[100px] px-4">
        <h2 className="text-3xl font-bold my-10">All Products</h2>
        <ProductListSkeleton count={12} />
      </div>
    )

  return (
    <div className="mt-[100px] px-4">
      <h2 className="text-3xl font-bold my-10">All Products</h2>
      <ProductList products={products} />
    </div>
  )
}

export default Products
