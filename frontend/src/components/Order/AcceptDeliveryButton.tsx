import { isAxiosError } from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { axiosInstance } from '@/lib/axios'

type Props = {
  orderId: string
}

export default function AcceptDeliveryButton({ orderId }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAcceptDelivery = async () => {
    setIsLoading(true)
    try {
      await axiosInstance.patch(`/order/complete/${orderId}`)
      toast.success('Delivery accepted')
      window.location.reload()
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleAcceptDelivery} disabled={isLoading} className="w-full">
      {isLoading ? 'Processing...' : 'Accept Delivery'}
    </Button>
  )
}
