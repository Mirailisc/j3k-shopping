import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserRound } from 'lucide-react'
import React from 'react'

const UserCard: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-normal text-zinc-400">Total User</CardTitle>
        <div className="h-8 w-8  flex items-center justify-center">
          <UserRound className="h-4 w-4 text-zinc-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline">
          <h2 className="text-3xl font-bold">+10</h2>
        </div>
        <div className="flex items-center mt-1">
          <p className="text-sm text-green-500">+20.1% from last month</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserCard
