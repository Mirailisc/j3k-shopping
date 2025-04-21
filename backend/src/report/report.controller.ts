import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ReportService } from './report.service'
import { AdminGuard } from 'src/auth/admin.guard'
import { AuthGuard } from '@nestjs/passport'

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('reviewed')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getReviewedUsers() {
    return await this.reportService.getReviewedUsers()
  }

  @Get('refunded')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getRefundedUsers() {
    return await this.reportService.getRefundedUsers()
  }

  @Get("average_sales")
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getAverageSalesPrice() {
    return await this.reportService.getAverageSalesPrice()
  }

  @Get('sales')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getHotProductSales(
    @Query('dataType') dataType: string,
    @Query('timePeriod') timePeriod: string,
  ) {
    return await this.reportService.getHotProductSales(dataType, timePeriod);
  }

  @Get('monthly')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getMonthlySales() {
    return await this.reportService.getMonthlySales()
  }

  @Get('newUser')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getNewUserThisMonth() {
    return await this.reportService.getNewUserThisMonth()
  }
}
