import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { FullUserInfo } from '@/types/user'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { axiosInstance } from '@/lib/axios'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  user: FullUserInfo
  data: FullUserInfo[]
  setData: (data: FullUserInfo[]) => void
}

const formSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Invalid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  admin: z.boolean(),
  superAdmin: z.boolean(),
  line: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  website: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
})

export const EditUserForm: React.FC<Props> = ({ open, setOpen, user, data, setData }: Props) => {
  const [targetUser, setTargetUser] = useState<string>('')

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      admin: false,
      superAdmin: false,
      line: '',
      facebook: '',
      instagram: '',
      tiktok: '',
      website: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      zipCode: '',
      country: '',
    },
  })

  useEffect(() => {
    if (user) {
      setTargetUser(user.id)

      form.setValue('username', user.username)
      form.setValue('email', user.email)
      form.setValue('firstName', user.firstName || '')
      form.setValue('lastName', user.lastName || '')
      form.setValue('admin', !!user.isAdmin)
      form.setValue('superAdmin', !!user.isSuperAdmin)
      form.setValue('line', user.line || '')
      form.setValue('facebook', user.facebook || '')
      form.setValue('instagram', user.instagram || '')
      form.setValue('tiktok', user.tiktok || '')
      form.setValue('website', user.website || '')
      form.setValue('phone', user.phone || '')
      form.setValue('address', user.address || '')
      form.setValue('city', user.city || '')
      form.setValue('province', user.province || '')
      form.setValue('zipCode', user.zipCode || '')
      form.setValue('country', user.country || '')
    }
  }, [user, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newUser = {
      username: values.username,
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      isAdmin: values.admin,
      isSuperAdmin: values.superAdmin,
      line: values.line,
      facebook: values.facebook,
      instagram: values.instagram,
      tiktok: values.tiktok,
      website: values.website,
      phone: values.phone,
      address: values.address,
      city: values.city,
      province: values.province,
      zipCode: values.zipCode,
      country: values.country,
    }

    try {
      const res = await axiosInstance.put(`/user/${targetUser}`, newUser)

      const updatedData = data.map((item) => (item.username === user.username ? { ...item, ...res.data } : item))

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
          <DialogTitle>Edit user</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="username">Username</Label>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Email Address</Label>
                  <FormControl>
                    <Input type="email" placeholder="Email Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col md:grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="firstName">First Name</Label>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="lastName">Last Name</Label>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="admin"
              render={({ field }) => (
                <FormItem className="flex gap-2 items-center">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(!!checked)} />
                  </FormControl>
                  <Label htmlFor="admin">Admin</Label>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="superAdmin"
              render={({ field }) => (
                <FormItem className="flex gap-2 items-center">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(!!checked)} />
                  </FormControl>
                  <Label htmlFor="superAdmin">Super Admin</Label>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h2 className="text-xl font-bold my-4">Social</h2>

            <div className="flex flex-col md:grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="line"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="line">Line</Label>
                    <FormControl>
                      <Input placeholder="Line" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="facebook">Facebook</Label>
                    <FormControl>
                      <Input placeholder="Facebook" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="instagram">Instagram</Label>
                    <FormControl>
                      <Input placeholder="Instagram" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tiktok"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="tiktok">Tiktok</Label>
                    <FormControl>
                      <Input placeholder="Tiktok" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="website">Website</Label>
                    <FormControl>
                      <Input placeholder="Website" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h2 className="text-xl font-bold my-4">Contact</h2>

            <div className="flex flex-col md:grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="phone">Phone number</Label>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="address">Address</Label>
                    <FormControl>
                      <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="city">City</Label>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="province">Province</Label>
                    <FormControl>
                      <Input placeholder="Province" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <FormControl>
                      <Input placeholder="Zip Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="country">Country</Label>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
