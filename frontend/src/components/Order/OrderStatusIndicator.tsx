import React from 'react'

import { OrderStatus } from '@/types/order'
import { CheckCircle2, Clock, Package, Truck, XCircle, RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import AcceptDeliveryButton from './AcceptDeliveryButton'

interface OrderStatusIndicatorProps {
  status: OrderStatus
  order: { id: string }
}

export default function OrderStatusIndicator({ status, order }: OrderStatusIndicatorProps) {
  const steps = [
    {
      status: OrderStatus.Pending,
      label: 'Pending',
      icon: Clock,
      description: 'Waiting for payment confirmation',
    },
    {
      status: OrderStatus.Paid,
      label: 'Paid',
      icon: CheckCircle2,
      description: 'Payment confirmed',
    },
    {
      status: OrderStatus.Delivering,
      label: 'Processing',
      icon: Package,
      description: 'Order is being prepared',
    },
    {
      status: OrderStatus.Shipped,
      label: 'Shipped',
      icon: Truck,
      description: 'Order is on the way',
    },
    {
      status: OrderStatus.Completed,
      label: 'Completed',
      icon: CheckCircle2,
      description: 'Order has been delivered',
    },
  ]

  const specialStatuses = {
    [OrderStatus.Refunding]: {
      label: 'Refunding',
      icon: RefreshCcw,
      description: 'Refund in progress',
    },
    [OrderStatus.Refunded]: {
      label: 'Refunded',
      icon: RefreshCcw,
      description: 'Refund completed',
    },
    [OrderStatus.Cancelled]: {
      label: 'Cancelled',
      icon: XCircle,
      description: 'Order has been cancelled',
    },
  }

  const isSpecialStatus = status in specialStatuses

  return (
    <div className="dark:bg-zinc-900 rounded-lg shadow-sm border border-black/20 dark:border-white/10 p-6">
      <h2 className="text-lg font-semibold mb-4">Order Status</h2>

      {isSpecialStatus ? (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
          {React.createElement(specialStatuses[status as keyof typeof specialStatuses].icon, {
            className: cn(
              'h-8 w-8',
              status === OrderStatus.Refunding || status === OrderStatus.Refunded ? 'text-amber-500' : 'text-red-500',
            ),
          })}
          <div>
            <p className="font-medium">{specialStatuses[status as keyof typeof specialStatuses].label}</p>
            <p className="text-sm text-muted-foreground">
              {specialStatuses[status as keyof typeof specialStatuses].description}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => {
              const isActive = status >= step.status
              const isCurrent = status === step.status

              return (
                <div key={index} className="flex flex-col items-center relative z-10">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center mb-2',
                      isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400',
                    )}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={cn('text-xs font-medium', isCurrent || isActive ? 'text-green-600' : 'text-gray-500')}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Progress bar */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{
                width: `${Math.min(100, (status / (steps.length - 1)) * 100)}%`,
              }}
            />
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm">
              {isSpecialStatus
                ? specialStatuses[status as keyof typeof specialStatuses].description
                : steps.find((step) => step.status === status)?.description || 'Status unknown'}
            </p>
          </div>

          {status === OrderStatus.Shipped && (
            <div className="mt-4">
              <AcceptDeliveryButton orderId={order.id} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
