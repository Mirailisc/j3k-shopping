import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async getUnreadNotifications(userId: string) {
    const notifications = await this.prisma.$queryRaw`
      SELECT * FROM \`Notification\` WHERE userId = ${userId} AND isRead = false
    `
    return notifications
  }

  async markAsRead(id: string, me: string) {
    await this.prisma.$executeRaw`
      UPDATE \`Notification\` SET isRead = true WHERE id = ${id}
    `

    return await this.getUnreadNotifications(me)
  }

  async sendNotification(userId: string, message: string) {
    const uuid = randomUUID()
    await this.prisma.$executeRaw`
      INSERT INTO \`Notification\` (id, userId, message) VALUES (${uuid}, ${userId}, ${message})
    `
    return { success: true }
  }
}
