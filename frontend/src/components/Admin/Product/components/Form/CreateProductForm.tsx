import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import { axiosInstance } from '@/lib/axios'
import { Product } from '@/types/product'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { UserCombobox } from '@/components/Admin/utils/UserCombobox'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  data: Product[]
  setData: (data: Product[]) => void
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  productImg: z.any().refine((file) => file instanceof File, 'Product image is required'),
  description: z.string().min(1, 'Description is required').max(255, 'Description must be less than 255 characters'),
  price: z.string().refine((val) => !isNaN(parseFloat(val)), 'Price must be a number'),
  quantity: z.string().refine((val) => Number.isInteger(Number(val)), 'Quantity must be an integer'),
  userId: z.string().min(1, 'User ID is required'),
})

export const CreateProductForm: React.FC<Props> = ({ open, setOpen, data, setData }: Props) => {
  const [previewImg, setPreviewImg] = useState<string>('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      productImg: undefined,
      description: '',
      price: '',
      quantity: '',
      userId: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('description', values.description)
    formData.append('price', values.price)
    formData.append('quantity', values.quantity)
    formData.append('userId', values.userId)
    if (values.productImg instanceof File) {
      formData.append('productImg', values.productImg)
    }

    try {
      const res = await axiosInstance.post('/product/admin', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setData([...data, res.data])
      toast.success('Product created!')
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
          <DialogTitle>Create product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name">Name</Label>
                  <FormControl>
                    <Input {...field} placeholder="Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productImg"
              render={() => (
                <FormItem>
                  <Label htmlFor="productImg">Product Image</Label>
                  <FormControl>
                    <>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            form.setValue('productImg', file)
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="description">Description</Label>
                  <FormControl>
                    <Input {...field} placeholder="Description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="price">Price</Label>
                  <FormControl>
                    <Input {...field} placeholder="Price" inputMode="decimal" type="number" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="quantity">Quantity</Label>
                  <FormControl>
                    <Input {...field} placeholder="Quantity" inputMode="numeric" type="number" step="1" />
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
