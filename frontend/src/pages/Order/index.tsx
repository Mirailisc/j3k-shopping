/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderStatus, toOrderStatus } from '@/types/order'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Package, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ORDER_INFO_PATH } from '@/constants/routes'
import { useEffect, useState } from 'react'
import { OrderDetails } from '@/components/Order/OrderDetails'
import { axiosInstance } from '@/lib/axios'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  [OrderStatus.Paid]: 'bg-green-500/10 text-green-500 border-green-500/20',
  [OrderStatus.Shipped]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  [OrderStatus.Delivering]: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  [OrderStatus.Completed]: 'bg-green-700/10 text-green-700 border-green-700/20',
  [OrderStatus.Cancelled]: 'bg-red-500/10 text-red-500 border-red-500/20',
  [OrderStatus.Refunded]: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  [OrderStatus.Refunding]: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
}

function getStatusLabel(status: OrderStatus) {
  const statusMap = {
    [OrderStatus.Pending]: 'Pending',
    [OrderStatus.Paid]: 'Paid',
    [OrderStatus.Delivering]: 'Delivering',
    [OrderStatus.Shipped]: 'Shipped',
    [OrderStatus.Completed]: 'Completed',
    [OrderStatus.Refunding]: 'Refunding',
    [OrderStatus.Refunded]: 'Refunded',
    [OrderStatus.Cancelled]: 'Cancelled',
  }

  return statusMap[status] || 'Unknown'
}

export default function Orders() {
  const [orders, setOrders] = useState<OrderDetails[]>([])

  const getOrders = async () => {
    try {
      const res = await axiosInstance.get('/order/buyer')

      const mappedOrders = (res.data as any[]).map((order) => ({
        ...order,
        status: toOrderStatus(order.status),
      }))

      setOrders(mappedOrders)
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
    getOrders()
  }, [])

  const activeOrders = orders.filter((order) =>
    [OrderStatus.Pending, OrderStatus.Paid, OrderStatus.Delivering, OrderStatus.Shipped].includes(order.status),
  )
  const completedOrders = orders.filter((order) => [OrderStatus.Completed].includes(order.status))
  const refundOrders = orders.filter((order) => [OrderStatus.Refunding, OrderStatus.Refunded].includes(order.status))
  const cancelledOrders = orders.filter((order) => [OrderStatus.Cancelled].includes(order.status))

  function OrderCard({ order }: { order: OrderDetails }) {
    const address =
      order.contact.address +
      ', ' +
      order.contact.city +
      ', ' +
      order.contact.province +
      ', ' +
      order.contact.zipCode +
      ', ' +
      order.contact.country

    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base">Order #{order.id.slice(0, 8)}</CardTitle>
              <CardDescription>{formatDate(order.createdAt)}</CardDescription>
            </div>
            <Badge variant="outline" className={statusColors[order.status as OrderStatus]}>
              {getStatusLabel(order.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Product #{order.productId.slice(0, 8)}</p>
              <p className="font-medium">${order.total.toFixed(2)}</p>
            </div>
            <div className="text-sm text-muted-foreground">Quantity: {order.amount}</div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <p className="text-sm text-muted-foreground">{address.substring(0, 30) + '...'}</p>
          <Link to={ORDER_INFO_PATH.replace(':orderId', order.id)}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="container mt-20 mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">View and manage your orders</p>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="active">Active ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
          <TabsTrigger value="refunds">Refunds ({refundOrders.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">You don&apos;t have any active orders</p>
              </CardContent>
            </Card>
          ) : (
            activeOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">You don&apos;t have any completed orders</p>
              </CardContent>
            </Card>
          ) : (
            completedOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>

        <TabsContent value="refunds" className="space-y-4">
          {refundOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">You don&apos;t have any refund orders</p>
              </CardContent>
            </Card>
          ) : (
            refundOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">You don&apos;t have any cancelled orders</p>
              </CardContent>
            </Card>
          ) : (
            cancelledOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
