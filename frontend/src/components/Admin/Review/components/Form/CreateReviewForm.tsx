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
import { UserCombobox } from '@/components/Admin/utils/UserCombobox'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  data: Review[]
  setData: (data: Review[]) => void
}

const formSchema = z.object({
  rating: z.number().min(1).max(5).default(1),
  comment: z.string().min(1, 'Comment is required'),
  productId: z.string().min(1, 'Product ID is required'),
  userId: z.string().min(1, 'User ID is required'),
})

export const CreateReviewForm: React.FC<Props> = ({ open, setOpen, data, setData }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 1,
      comment: '',
      productId: '',
      userId: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axiosInstance.post('/review/admin', values)
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
                    <select
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="border rounded-lg px-3 py-2 text-sm focus:bg-black text-gray-200 focus:outline-none block w-full"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num} className="text-black">
                          {num}
                        </option>
                      ))}
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
                    <Input {...field} placeholder="Product ID" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <UserCombobox name="userId" />

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
