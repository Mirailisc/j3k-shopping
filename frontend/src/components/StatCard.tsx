import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

type Props = {
  title: string
  value: number
  icon: LucideIcon
}

const StatCard: React.FC<Props> = ({ title, value, icon }: Props) => {
  const Icon = icon

  const iconVariants = {
    initial: { opacity: 0.2, y: 0 },
    hover: { opacity: 0.8, y: -5, transition: { duration: 0.3 } },
  }

  return (
    <motion.div
      className="border relative border-white/20 rounded-md p-4 overflow-hidden"
      initial="initial"
      whileHover="hover"
    >
      <div className="text-sm font-bold">{title}</div>
      <div className="text-4xl text-emerald-600 mt-2 font-bold">{value.toLocaleString()}</div>

      <motion.div className="absolute -bottom-[20px] right-0 size-[100px] text-zinc-200" variants={iconVariants}>
        <Icon className="w-full h-full" />
      </motion.div>
    </motion.div>
  )
}

export default StatCard
