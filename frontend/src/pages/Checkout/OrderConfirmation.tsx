import { useNavigate } from 'react-router-dom'
import { Check, ShoppingBag } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { ProductFeed } from '@/types/feed'
import NotFound from '../NotFound'
import { Shipping } from '@/types/profile'
import { useCallback, useEffect, useState } from 'react'
import { axiosInstance } from '@/lib/axios'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import Loading from '../Loading'
import { BASE_PATH } from '@/constants/routes'

interface CheckoutInfo {
  orderId: string
  product: ProductFeed
  shipping: Shipping
  quantity: number
  subtotal: number
  tax: number
  total: number
}

export default function OrderConfirmationPage() {
  const [info, setInfo] = useState<CheckoutInfo>({
    orderId: '',
    product: {} as ProductFeed,
    shipping: {} as Shipping,
    quantity: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
  })
  const [loading, setLoading] = useState<boolean>(true)

  const navigate = useNavigate()
  const sessionId = new URLSearchParams(window.location.search).get('session_id')

  const fetchSessionData = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/payment/session/${sessionId}`)
      setInfo({...response.data, shipping: {
        firstName: response.data.shipping.firstName,
        lastName: response.data.shipping.lastName,
        phone: response.data.shipping.contact.phone,
        address: response.data.shipping.contact.address,
        city: response.data.shipping.contact.city,
        province: response.data.shipping.contact.province,
        zipCode: response.data.shipping.contact.zipCode,
        country: response.data.shipping.contact.country
      }})
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
  }, [sessionId])

  useEffect(() => {
    fetchSessionData()
  }, [fetchSessionData])

  if (!sessionId) return <NotFound />

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(price)
  }

  const calculatedSubtotal = info.subtotal || info.product.price * info.quantity
  const calculatedTax = info.tax || calculatedSubtotal * 0.37
  const calculatedTotal = info.total || calculatedSubtotal + calculatedTax

  if (loading) return <Loading />

  return (
    <div className="container mt-20 max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 mb-4">
          <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">Thank you for your purchase. Your order has been confirmed.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order #{info.orderId}</CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
              <img
                src={info.product.productImg || '/placeholder.svg'}
                alt={info.product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium line-clamp-2">{info.product.name}</h3>
              <p className="text-sm text-muted-foreground">
                Quantity: {info.quantity} {info.quantity > 1 ? 'items' : 'item'} × {formatPrice(info.product.price)}
              </p>
              <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatPrice(calculatedSubtotal)}</p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-medium">Order Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>
                  Subtotal ({info.quantity} {info.quantity === 1 ? 'item' : 'items'})
                </span>
                <span>{formatPrice(calculatedSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (37%)</span>
                <span>{formatPrice(calculatedTax)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-border mt-2">
                <span>Total</span>
                <span>{formatPrice(calculatedTotal)}</span>
              </div>
            </div>
          </div>

          {info.shipping && (
            <div>
              <h3 className="font-medium mb-2">Shipping Information</h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-1 text-sm">
                <p>
                  {info.shipping.firstName} {info.shipping.lastName}
                </p>
                <p>{info.shipping.address}</p>
                <p>
                  {info.shipping.city}, {info.shipping.province} {info.shipping.zipCode}
                </p>
                <p>{info.shipping.country}</p>
                <p className="mt-2">Phone: {info.shipping.phone}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => navigate(BASE_PATH, { replace: true })}
          >
            <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
          </Button>
          <Button variant="outline" className="w-full" onClick={() => window.print()}>
            Print Receipt
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
