import { formatCurrency, formatDate } from '@/lib/utils'
import { getOrderStatusEnum, OrderStatus, OrderStatusSeller, OrderWithUsername } from '@/types/order'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Clock, Mail, MapPin, Package, Phone, User } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { axiosInstance } from '@/lib/axios'
import { Link } from 'react-router-dom'
import { USER_INFO_PATH } from '@/constants/routes'

interface OrderDetailsDialogProps {
  order: OrderWithUsername | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  if (!order) return <></>

  const statusEnum = getOrderStatusEnum(order.status)

  const statusColors: Record<OrderStatusSeller, string> = {
    [OrderStatus.Pending]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    [OrderStatus.Paid]: 'bg-green-500/10 text-green-500 border-green-500/20',
    [OrderStatus.Shipped]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    [OrderStatus.Delivering]: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    [OrderStatus.Cancelled]: 'bg-red-500/10 text-red-500 border-red-500/20',
    [OrderStatus.Refunded]: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    [OrderStatus.Refunding]: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  }

  const handleUpdateStatus = async () => {
    if (!selectedStatus) return

    if ((order.status as number) === parseInt(selectedStatus)) return onOpenChange(false)

    setIsUpdating(true)
    try {
      await axiosInstance.patch(`/order/status/${order.id}`, {
        status: OrderStatus[selectedStatus as keyof typeof OrderStatus],
      })

      toast.success('Order status updated')
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to update status'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setIsUpdating(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order #{order.id.slice(0, 8)}</span>
            <Badge variant="outline" className={statusColors[order.status]}>
              {OrderStatus[order.status]}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="contact">Contact Information</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="font-medium">Created: </span>
                {formatDate(order.createdAt)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="font-medium">Customer: </span>
                <Link
                  to={USER_INFO_PATH.replace(':username', order.username)}
                  className="hover:text-emerald-500 transition-colors"
                >
                  {order.username || 'Unknown'}
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="font-medium">Product ID: </span>
                {order.productId}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-1">Quantity</div>
                <div>{order.amount}</div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Total</div>
                <div className="text-lg font-bold">{formatCurrency(order.total)}</div>
              </div>
            </div>

            {order.evidence && (
              <>
                <Separator />
                <div>
                  <div className="text-sm font-medium mb-2">Evidence</div>
                  {typeof order.evidence === 'string' && order.evidence.startsWith('data:image') ? (
                    <div className="flex justify-center">
                      <img
                        src={order.evidence || '/placeholder.svg'}
                        alt="Payment evidence"
                        className="max-h-48 object-contain rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="bg-muted p-3 rounded-md text-sm">{order.evidence}</div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="contact" className="space-y-4 mt-4">
            {order.contact ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                  <CardDescription>Customer contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Email</div>
                        <div className="font-medium">{order.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Phone</div>
                        <div className="font-medium">{order.contact.phone}</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm font-medium mb-2">Shipping Address</div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        <p>{order.contact.address}</p>
                        <p>
                          {order.contact.city}, {order.contact.province} {order.contact.zipCode}
                        </p>
                        <p>{order.contact.country}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No contact information available for this order.
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Update Status
          </label>
          <Select onValueChange={setSelectedStatus} defaultValue={statusEnum.toString()}>
            <SelectTrigger className="w-full my-2">
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(OrderStatus)
                .filter(([key, value]) => isNaN(Number(key)) && value !== OrderStatus.Completed)
                .map(([key, value]) => (
                  <SelectItem key={value} value={value.toString()}>
                    <Badge variant="outline" className={statusColors[value as OrderStatusSeller]}>
                      {key}
                    </Badge>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleUpdateStatus} disabled={!selectedStatus || isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Status'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
