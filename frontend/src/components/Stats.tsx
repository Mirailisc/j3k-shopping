import { axiosInstance } from '@/lib/axios'
import { isAxiosError } from 'axios'
<<<<<<< HEAD
import { CircleCheck, Package, ShoppingBag, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
=======
import { CircleCheck, Icon, Package, ShoppingBag, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
>>>>>>> dd1e2b2 (a)
import StatCard from './StatCard'

interface IStats {
  totalProduct: number
  totalUser: number
  totalSold: number
  totalInStock: number
}

const Stats = () => {
  const [stats, setStats] = useState<IStats>({
    totalProduct: 0,
    totalUser: 0,
    totalSold: 0,
    totalInStock: 0,
  })

  const getStats = async () => {
    try {
      const response = await axiosInstance.get('/feed/stats')
      setStats(response.data)
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  useEffect(() => {
    getStats()
  }, [])

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      <StatCard title="Total Users" value={stats.totalUser} icon={UserRound} />
      <StatCard title="Total Products" value={stats.totalProduct} icon={ShoppingBag} />
      <StatCard title="Total In Stock" value={stats.totalInStock} icon={Package} />
      <StatCard title="Total Sold" value={stats.totalSold} icon={CircleCheck} />
    </div>
  )
}

export default Stats
