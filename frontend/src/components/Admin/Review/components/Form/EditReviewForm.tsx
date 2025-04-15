import { useEffect, useState } from 'react'
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
  review: Review
  data: Review[]
  setData: (data: Review[]) => void
}

const formSchema = z.object({
  rating: z.string().refine((val) => Number.isInteger(Number(val)), 'Rating must be an integer'),
  comment: z.string().min(1, 'Comment is required'),
})

export const EditReviewForm: React.FC<Props> = ({ open, setOpen, review, data, setData }: Props) => {
  const [targetReview, setTargetReview] = useState<string>('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: '',
      comment: '',
    },
  })

  useEffect(() => {
    if (review) {
      setTargetReview(review.id)
      form.reset({
        rating: String(review.rating),
        comment: review.comment,
      })
    }
  }, [review, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = {
      rating: values.rating,
      comment: values.comment
    }
    try {
      const res = await axiosInstance.patch(`/review/admin/${targetReview}`, formData)

      const updatedData = data.map((item) => (item.id === review.id ? { ...item, ...res.data } : item))
      setData(updatedData)
      toast.success('Review updated!')
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
          <DialogTitle>Edit review</DialogTitle>
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
