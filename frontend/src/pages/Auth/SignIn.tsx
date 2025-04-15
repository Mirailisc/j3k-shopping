import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { BASE_PATH, SIGN_UP_PATH } from '@/constants/routes'
import authBg from '@/images/auth-bg.png'
import { useCookies } from 'react-cookie'
import { login } from '@/store/slice/authSlice'
import { ACCESS_TOKEN } from '@/constants/cookie'
import { toast } from 'sonner'
import { useAppDispatch } from '@/store/store'
const formSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

const SignIn: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [, setCookie] = useCookies([ACCESS_TOKEN])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await dispatch(login(values)).unwrap()
      setCookie(ACCESS_TOKEN, result.access_token, { path: '/', secure: true, httpOnly: false })
      navigate(BASE_PATH, { replace: true })
    } catch (error) {
      toast.error(error as string)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center" style={{ backgroundImage: `url(${authBg})` }}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-6 border backdrop-blur-sm border-white/10 rounded-lg flex flex-col gap-4 w-full md:w-[400px]"
        >
          <h1 className="text-4xl font-bold mb-8">Sign In</h1>
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

          <Button type="submit" variant="default" size="sm">
            Sign In
          </Button>
          <p className="text-center">
            Don&apos;t have an account ?{' '}
            <Link to={SIGN_UP_PATH} className="hover:underline text-blue-500">
              Sign Up
            </Link>
          </p>
        </form>
      </Form>
    </div>
  )
}

export default SignIn
