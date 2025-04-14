import { Button } from '@/components/ui/button'
import { BASE_PATH } from '@/constants/routes'
import Emoji from '@/images/emoji.gif'
import { useNavigate } from 'react-router-dom'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="h-screen flex flex-col gap-4 items-center justify-center">
      <img src={Emoji} alt="404" className="size-[200px]" />
      <h1 className="text-2xl font-bold">404 Not Found</h1>
      <p className="text-sm text-zinc-400">The page you are looking for does not exist.</p>
      <div className='flex flex-row gap-4'>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button onClick={() => navigate(BASE_PATH, { replace: true })}> Back to Home</Button>
      </div>
    </div>
  )
}

export default NotFound
