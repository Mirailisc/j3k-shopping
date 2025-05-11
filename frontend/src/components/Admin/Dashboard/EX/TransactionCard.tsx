import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign } from 'lucide-react'
import React from 'react'

const TransactionCard: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-normal text-zinc-400">Total Transaction</CardTitle>
        <div className="h-8 w-8  flex items-center justify-center">
          <DollarSign className="h-4 w-4 text-zinc-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline">
          <span className="text-zinc-400 mr-1">$</span>
          <h2 className="text-3xl font-bold">45,231.89</h2>
        </div>
        <div className="flex items-center mt-1">
          <p className="text-sm text-green-500">+20.1% from last month</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default TransactionCard
