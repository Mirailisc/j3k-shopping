import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { SIGN_IN_PATH } from '@/constants/routes'
import authBg from '@/images/auth-bg.png'
import { toast } from 'sonner'
import { axiosInstance } from '@/lib/axios'
import axios from 'axios'

const formSchema = z
  .object({
    username: z.string().min(1, 'Username is required'),
    email: z
      .string()
      .min(1, 'Email is required')
      .regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Invalid email address'),
    firstName: z.string().min(1, 'First Name is required'),
    lastName: z.string().min(1, 'Last Name is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[\W_]/, 'Password must contain at least one special character (e.g., !@#$%^&*)'),
    confirmPassword: z.string().min(1, 'Confirm Password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

const SignUp: React.FC = () => {
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { username, email, firstName, lastName, password } = values

    try {
      await axiosInstance.post('/auth/register', {
        username,
        email,
        firstName,
        lastName,
        password,
      })
      toast.success('User has been created')
      navigate(SIGN_IN_PATH, { replace: true })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  return (
    <div className="h-screen flex items-center justify-center" style={{ backgroundImage: `url(${authBg})` }}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-6 border bg-zinc-100 dark:bg-zinc-900 backdrop-blur-sm border-black/20 dark:border-white/10 rounded-lg flex flex-col gap-4 w-full md:w-[600px]"
        >
          <h1 className="text-4xl font-bold mb-8">Sign Up</h1>
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="password">Password</Label>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
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

          <Button type="submit" variant="default" size="sm">
            Sign Up
          </Button>
          <p className="text-center">
            Already have an account ?{' '}
            <Link to={SIGN_IN_PATH} className="hover:underline text-blue-500">
              Sign In
            </Link>
          </p>
        </form>
      </Form>
    </div>
  )
}

export default SignUp
