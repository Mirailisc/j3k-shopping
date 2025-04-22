import { formatDistanceToNow } from 'date-fns'
import { Clock, Package, User } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { ProductDisplay } from '@/types/product'
import { Link, useNavigate } from 'react-router-dom'
import { CHECKOUT_PATH, SIGN_IN_PATH, USER_INFO_PATH } from '@/constants/routes'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import { ProductFeed } from '@/types/feed'

type Props = {
  product: ProductDisplay
}

const Info: React.FC<Props> = ({ product }: Props) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const formattedDate = formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })
  const navigate = useNavigate()

  const formattedPrice = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  }).format(product.price)

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
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="pb-0">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 relative">
            <div className="aspect-square relative rounded-lg overflow-hidden border">
              <img src={product.productImg || '/placeholder.svg'} alt={product.name} className="object-cover size-full" />
            </div>
          </div>
          <div className="md:w-1/2 space-y-4">
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-3xl font-bold mt-2">{formattedPrice}</p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1">
                ID: {product.id}
              </Badge>
              {product.quantity > 0 ? (
                <Badge variant="secondary" className="px-3 py-1">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="destructive" className="px-3 py-1">
                  Out of Stock
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>Quantity: {product.quantity} units available</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>
                  Seller :{' '}
                  <Link
                    className="text-emerald-600 hover:text-emerald-500 transition-colors"
                    to={USER_INFO_PATH.replace(':username', product.seller)}
                  >
                    {product.seller}
                  </Link>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Updated {formattedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-end flex-col sm:flex-row gap-4">
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors sm:w-auto"
          disabled={product.quantity <= 0}
          onClick={(e) =>
            handleBuyNow(e, {
              id: product.id,
              name: product.name,
              productImg: product.productImg,
              price: product.price,
              quantity: product.quantity,
              seller: product.seller,
              updatedAt: product.createdAt,
            })
          }
        >
          {product.quantity <= 0 ? 'Out of Stock' : 'Buy now'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Info
