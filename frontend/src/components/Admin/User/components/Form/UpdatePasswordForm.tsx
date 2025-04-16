import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { User } from '../../../../../types/user'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { axiosInstance } from '@/lib/axios'
import { isAxiosError } from 'axios'

type Props = {
  open: boolean
  user: User
  setOpen: (open: boolean) => void
}

const formSchema = z
  .object({
    currentPassword: z.string().min(1, 'Password is required'),
    newPassword: z.string().min(1, 'Password is required'),
    confirmPassword: z.string().min(1, 'Confirm Password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const UpdatePasswordForm: React.FC<Props> = ({ open, setOpen, user }: Props) => {
  const [targetUser, setTargetUser] = useState<string>('')

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const updatedPassword = {
      current: values.currentPassword,
      newPassword: values.newPassword,
    }

    try {
      await axiosInstance.put(`/user/${targetUser}/reset-password`, updatedPassword)
      toast.success(`User ${user.username} password has been updated`)
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

  useEffect(() => {
    if (user) {
      setTargetUser(user.id)
    }
  }, [user])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update password for {user.username}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-6">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <FormControl>
                    <Input type="password" placeholder="Current Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="newPassword">New Password</Label>
                  <FormControl>
                    <Input type="password" placeholder="New Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <FormControl>
                    <Input type="password" placeholder="Confirm Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" size="sm">
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
