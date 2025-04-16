import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common'
import { ReportService } from './report.service'
import { AdminGuard } from 'src/auth/admin.guard'
import { AuthGuard } from '@nestjs/passport'

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('reviewed')
  @UseGuards(AuthGuard('jwt'))
  async getReviewedUsers() {
    return await this.reportService.getReviewedUsers()
  }

  @Get('refunded')
  @UseGuards(AuthGuard('jwt'))
  async getRefundedUsers() {
    return await this.reportService.getRefundedUsers()
  }

  @Get('hotProduct')
  @UseGuards(AuthGuard('jwt'))
  async getHotProducts() {
    return await this.reportService.getHotProducts();
  }
}
