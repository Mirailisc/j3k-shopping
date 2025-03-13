import shirokoLoading from '@/images/shiroko-dance.gif'

const Loading: React.FC = () => {
  return (
    <div className="h-[50vh] flex items-center justify-center">
      <img src={shirokoLoading} alt="loading" className='size-[200px]' />
    </div>
  )
}

export default Loading
