import type React from 'react'

import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Minus, Plus } from 'lucide-react'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import { axiosInstance } from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import type { ProductFeed } from '@/types/feed'
import { Shipping } from '@/types/profile'
import NotFound from '../NotFound'

export default function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [shipping, setShipping] = useState<Shipping>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    zipCode: '',
    country: '',
  })
  const [isEditingShipping, setIsEditingShipping] = useState(false)
  const [isLoadingShipping, setIsLoadingShipping] = useState(true)

  const product = location.state?.product as ProductFeed | undefined

  const getShippingInfo = async () => {
    setIsLoadingShipping(true)
    try {
      const response = await axiosInstance.get('/profile/shipping-info')
      setShipping({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phone: response.data.contact.phone,
        address: response.data.contact.address,
        city: response.data.contact.city,
        province: response.data.contact.province,
        zipCode: response.data.contact.zipCode,
        country: response.data.contact.country,
      })
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setIsLoadingShipping(false)
    }
  }

  useEffect(() => {
    getShippingInfo()
  }, [])

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setShipping((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveShipping = async () => {
    try {
      const response = await axiosInstance.put('/profile/shipping-info', {
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        phone: shipping.phone,
        address: shipping.address,
        city: shipping.city,
        province: shipping.province,
        zipCode: shipping.zipCode,
        country: shipping.country,
      })
      setIsEditingShipping(false)
      setShipping({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phone: response.data.contact.phone,
        address: response.data.contact.address,
        city: response.data.contact.city,
        province: response.data.contact.province,
        zipCode: response.data.contact.zipCode,
        country: response.data.contact.country,
      })
      toast.success('Shipping information updated')
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to update shipping information'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const increaseQuantity = () => {
    if (quantity < 100) {
      setQuantity(quantity + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value)) {
      if (value > 100) {
        setQuantity(100)
      } else if (value < 1) {
        setQuantity(1)
      } else {
        setQuantity(value)
      }
    }
  }

  if (!product) return <NotFound />

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(price)
  }

  const subtotal = product.price * quantity
  const tax = subtotal * 0.37
  const total = subtotal + tax

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await axiosInstance.post('/payment/checkout', {
        productId: product.id,
        amount: quantity,
      })
      setIsSubmitting(false)
      window.location.href = res.data.url
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderLoadingState = () => {
    return (
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
        <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
        <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
      </div>
    )
  }

  const renderShippingEditForm = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={shipping.firstName}
              onChange={handleShippingChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" value={shipping.lastName} onChange={handleShippingChange} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" value={shipping.phone} onChange={handleShippingChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea id="address" name="address" value={shipping.address} onChange={handleShippingChange} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" value={shipping.city} onChange={handleShippingChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="province">Province</Label>
            <Input id="province" name="province" value={shipping.province} onChange={handleShippingChange} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input id="zipCode" name="zipCode" value={shipping.zipCode} onChange={handleShippingChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" value={shipping.country} onChange={handleShippingChange} required />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setIsEditingShipping(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSaveShipping}>
            Save Address
          </Button>
        </div>
      </div>
    )
  }

  const renderShippingInfo = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Name</h4>
            <p>
              {shipping.firstName} {shipping.lastName}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Phone</h4>
            <p>{shipping.phone || '—'}</p>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Address</h4>
            <p>{shipping.address || '—'}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">City</h4>
            <p>{shipping.city || '—'}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Province</h4>
            <p>{shipping.province || '—'}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Zip Code</h4>
            <p>{shipping.zipCode || '—'}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Country</h4>
            <p>{shipping.country || '—'}</p>
          </div>
        </div>
      </div>
    )
  }

  const renderShippingContent = () => {
    if (isLoadingShipping) {
      return renderLoadingState()
    }

    if (isEditingShipping) {
      return renderShippingEditForm()
    }

    return renderShippingInfo()
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={product.productImg || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium line-clamp-2">{product.name}</h3>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatPrice(product.price)}</p>

                {/* Quantity Controls */}
                <div className="flex items-center mt-2">
                  <Label htmlFor="quantity" className="mr-2 text-sm">
                    Qty:
                  </Label>
                  <div className="flex items-center border rounded-md">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max="100"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="h-8 w-12 text-center border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={increaseQuantity}
                      disabled={quantity >= 100}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(product.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (37%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmitOrder} className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>Your saved shipping details</CardDescription>
              </div>
              {!isLoadingShipping && !isEditingShipping && (
                <Button variant="outline" size="sm" onClick={() => setIsEditingShipping(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              )}
            </CardHeader>
            <CardContent>{renderShippingContent()}</CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Complete Order'}
          </Button>
        </form>
      </div>
    </div>
  )
}
