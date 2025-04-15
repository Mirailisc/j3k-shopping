import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import { axiosInstance } from '@/lib/axios'
import { Review } from '@/types/review'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  data: Review[]
  setData: (data: Review[]) => void
}

const formSchema = z.object({
  rating: z.string().refine((val) => Number.isInteger(Number(val)), 'Rating must be an integer'),
  comment: z.string().min(1, 'Comment is required'),
  productId: z.string().min(1, 'Product ID is required'),
  userId: z.string().min(1, 'User ID is required'),
})

export const CreateReviewForm: React.FC<Props> = ({ open, setOpen, data, setData }: Props) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: '',
      comment: '',
      productId: '',
      userId: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData()
    formData.append('rating', values.rating)
    formData.append('comment', values.comment)
    formData.append('productId', values.productId)
    formData.append('userId', values.userId)

    try {
      const res = await axiosInstance.post('/review/admin', formData)
      setData([...data, res.data])
      toast.success('Review created!')
      setOpen(false)
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message || 'Something went wrong'
        : 'An unexpected error occurred'
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create review</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="rating">Rating</Label>
                  <FormControl>
                  <select {...field} className="border rounded-lg px-3 py-2 text-sm focus:bg-black text-gray-200 focus:outline-none block w-full">
                      {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num} className="text-black" >{num}</option>))}
                  </select> 
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="comment">Comment</Label>
                  <FormControl>
                    <Input {...field} placeholder="Comment" />
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
                  <Label htmlFor="productId">Product ID</Label>
                  <FormControl>
                    <Input {...field} placeholder="Product ID"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
