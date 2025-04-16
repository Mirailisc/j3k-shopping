import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Order } from '@/types/order'
import { axiosInstance } from '@/lib/axios'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { OrderStatus } from '../../types/orderState'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  data: Order[]
  setData: (data: Order[]) => void
}

export const formSchema = z.object({
  status: z.nativeEnum(OrderStatus, {
    errorMap: () => ({ message: 'Invalid status selected' }),
  }),
  amount: z.string().refine((val) => !isNaN(parseInt(val)), 'amount must be a number'),
  userId: z.string().min(1, 'User ID is required'),
  productId: z.string().min(1, 'Product ID is required'),
})

export const CreateOrderForm: React.FC<Props> = ({ open, setOpen, data, setData }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: OrderStatus.Pending,
      amount: '',
      userId: '',
      productId: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    
    const newOrder = {
      id: crypto.randomUUID(),
      status: values.status,
      evidence: undefined,
      userId: values.userId,
      productId: values.productId,
      amount: values.amount,
    }

    try {
      const res = await axiosInstance.post('/order/admin', newOrder)
      setData([...data, res.data])
      toast.success("Order created successfully!")
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
          <DialogTitle>Create order</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-6">
            <div className="flex flex-col md:grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="userId">User ID</Label>
                    <FormControl>
                      <Input {...field} placeholder="User ID" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="userId">Product ID</Label>
                    <FormControl>
                      <Input {...field} placeholder="Product ID" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <label htmlFor="amount">Amount</label>
                    <FormControl>
                      <Input {...field} placeholder="Amount" inputMode="decimal" type="number" step="1" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" size="sm">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
