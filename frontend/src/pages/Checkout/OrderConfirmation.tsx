"use client"

import { useLocation, useNavigate } from "react-router-dom"
import { Check, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProductFeed } from "@/types/feed"
import NotFound from "../NotFound"

interface ShippingInfo {
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  province: string
  zipCode: string
  country: string
}

export default function OrderConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const orderId = location.state?.orderId
  const product = location.state?.product as ProductFeed | undefined
  const shipping = location.state?.shipping as ShippingInfo | undefined
  const quantity = (location.state?.quantity as number) || 1
  const subtotal = location.state?.subtotal as number
  const tax = location.state?.tax as number
  const total = location.state?.total as number

  if (!orderId || !product) return <NotFound />


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(price)
  }

  const calculatedSubtotal = subtotal || product.price * quantity
  const calculatedTax = tax || calculatedSubtotal * 0.37
  const calculatedTotal = total || calculatedSubtotal + calculatedTax

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
          <CardTitle>Order #{orderId}</CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
              <img
                src={product.productImg || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium line-clamp-2">{product.name}</h3>
              <p className="text-sm text-muted-foreground">
                Quantity: {quantity} {quantity > 1 ? "items" : "item"} × {formatPrice(product.price)}
              </p>
              <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatPrice(calculatedSubtotal)}</p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-medium">Order Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>
                  Subtotal ({quantity} {quantity === 1 ? "item" : "items"})
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

          {shipping && (
            <div>
              <h3 className="font-medium mb-2">Shipping Information</h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-1 text-sm">
                <p>
                  {shipping.firstName} {shipping.lastName}
                </p>
                <p>{shipping.address}</p>
                <p>
                  {shipping.city}, {shipping.province} {shipping.zipCode}
                </p>
                <p>{shipping.country}</p>
                <p className="mt-2">Phone: {shipping.phone}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => navigate("/products")}
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
