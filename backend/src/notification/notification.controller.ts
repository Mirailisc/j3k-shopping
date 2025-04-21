import {
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common'
import { NotificationService } from './notification.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUnreadNotifications(@Request() req) {
    return this.notificationService.getUnreadNotifications(req.user.userId)
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationService.markAsRead(id, req.user.userId)
  }
}
