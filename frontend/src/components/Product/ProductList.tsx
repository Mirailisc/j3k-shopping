import type React from 'react'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { CHECKOUT_PATH, PRODUCT_INFO_PATH, SIGN_IN_PATH } from '@/constants/routes'
import type { ProductFeed } from '@/types/feed'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

type Props = {
  products: ProductFeed[]
}

const ProductList: React.FC<Props> = ({ products }: Props) => {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({})

  const navigate = useNavigate()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  const handleImageLoad = (productId: string) => {
    setLoadedImages((prev) => ({
      ...prev,
      [productId]: true,
    }))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(price)
  }

  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) return { label: 'Out of Stock', variant: 'destructive' as const }
    if (quantity < 5) return { label: 'Low Stock', variant: 'secondary' as const }
    return { label: `In Stock: ${quantity}`, variant: 'default' as const }
  }

  const handleBuyNow = (e: React.MouseEvent, product: ProductFeed) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAuthenticated) {
      navigate(CHECKOUT_PATH, { state: { product } })
    } else {
      navigate(SIGN_IN_PATH)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
      {products.map((product) => {
        const stockStatus = getStockStatus(product.quantity)
        const imageLoaded = loadedImages[product.id] || false

        return (
          <Link
            to={PRODUCT_INFO_PATH.replace(':productId', product.id)}
            key={product.id}
            className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
          >
            <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md border-border group p-0">
              <CardHeader className="p-0 relative aspect-square overflow-hidden">
                {!imageLoaded && <Skeleton className="absolute inset-0 z-10" />}
                <img
                  src={product.productImg}
                  className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  alt={product.name}
                  onLoad={() => handleImageLoad(product.id)}
                />
                <Badge variant={stockStatus.variant} className="absolute bottom-2 left-2 z-20">
                  {stockStatus.label}
                </Badge>
              </CardHeader>
              <CardContent className="px-4 flex-grow">
                <h3 className="font-medium text-base line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(product.price)}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={product.quantity <= 0}
                  onClick={(e) => handleBuyNow(e, product)}
                >
                  {product.quantity <= 0 ? 'Out of Stock' : 'Buy now'}
                </Button>
              </CardFooter>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}

export default ProductList
