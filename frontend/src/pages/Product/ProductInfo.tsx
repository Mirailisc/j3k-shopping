import Info from '@/components/Product/Info'
import Reviews from '@/components/Product/Reviews'
import { useParams } from 'react-router-dom'
import Loading from '../Loading'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { axiosInstance } from '@/lib/axios'
import { ProductDisplay } from '@/types/product'
import { isAxiosError } from 'axios'
import NotFound from '../NotFound'

const ProductInfo: React.FC = () => {
  const [info, setInfo] = useState<ProductDisplay | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const { productId } = useParams()

  const getProduct = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/product/${productId}`)
      setInfo(response.data)
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
  }, [productId])

  useEffect(() => {
    getProduct()
  }, [getProduct])

  if (loading) return <Loading />
  else if (!info) return <NotFound />

  return (
    <div className="mt-[100px] container mx-auto px-4 py-8">
      <Info product={info} />
      <Reviews productName={info.name} productId={info.id} />
    </div>
  )
}

export default ProductInfo
