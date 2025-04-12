import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { Order } from '@/types/order'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { axiosInstance } from '@/lib/axios'
import { OrderStatus, stateOption } from '../../types/orderState';

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  order: Order
  data: Order[]
  setData: (data: Order[]) => void
  
}

export const formSchema = z.object({
  status: z
    .nativeEnum(OrderStatus, {
      errorMap: () => ({ message: 'Invalid status selected' }),
  }),
})


export const UpdateOrderStatusForm: React.FC<Props> = ({ open, setOpen, order, data, setData}: Props) => {
  const [targetOrder, setTargetOrder] = useState<string>('')

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: order.status,
        },
  })

  useEffect(() => {
    if (order) {
      setTargetOrder(order.id)
      form.reset({
        status: order.status,

      })
    }
  }, [order, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newStatus = {
      status: values.status
    }
    
    try {
      const res = await axiosInstance.put(`/order/status/${targetOrder}`, newStatus)
      
      const updatedData = data.map((item) => (item.id === order.id ? { ...item, ...res.data } : item))

      setData(updatedData)
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update status</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-6">
            <FormField
              control = {form.control}
              name = "status"
              render = {({ field }) => (
                <FormItem>
                  <label htmlFor = "status">Status</label>
                  <FormControl>
                  <select
                    className="border rounded-lg px-3 py-2 text-sm focus:bg-black text-gray-200 focus:outline-none block w-full"
                    value={OrderStatus[field.value] ?? ''}
                    onChange={(e) => {
                      const selected = OrderStatus[e.target.value as keyof typeof OrderStatus]
                      field.onChange(Number(selected))
                    }}
                  >
                    {stateOption.map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  </FormControl>
                </FormItem>
              )} />
            <DialogFooter>
              <Button type="submit" size="sm">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}