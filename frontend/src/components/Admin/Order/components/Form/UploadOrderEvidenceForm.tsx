import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { Order } from '@/types/order'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { axiosInstance } from '@/lib/axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  order: Order
  data: Order[]
  setData: (data: Order[]) => void
}

export const formSchema = z.object({
  evidence: z.any().refine((file) => file instanceof File, 'Payment Evidence is required'),
})


export const UploadOrderEvidenceForm: React.FC<Props> = ({ open, setOpen, order, data, setData}: Props) => {
  const [targetOrder, setTargetOrder] = useState<string>('')
  const [previewImg, setPreviewImg] = useState<string>('')
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      evidence: undefined,
        },
  })

  useEffect(() => {
    if (order) {
      setTargetOrder(order.id)
    }
  }, [order])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newOrder = {
      evidence: values.evidence
    }
    
    try {
      const res = await axiosInstance.put(`/order/evidence/${targetOrder}`, newOrder)
      
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
          <DialogTitle>Post Evidence</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-6">
          <FormField
              control={form.control}
              name="evidence"
              render={() => (
                <FormItem>
                  <Label htmlFor="evidence">Payment evidence</Label>
                  <FormControl>
                    <>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            form.setValue('evidence', file)
                            setPreviewImg(URL.createObjectURL(file))
                          }
                        }}
                      />
                      {previewImg && (
                        <img src={previewImg} alt="Preview" className="mt-2 rounded-md max-h-40 object-contain" />
                      )}
                    </>
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
