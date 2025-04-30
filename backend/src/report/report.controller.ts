import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ReportService } from './report.service'
import { AdminGuard } from 'src/auth/admin.guard'
import { AuthGuard } from '@nestjs/passport'

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('admin/reviewed')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getReviewedUsers() {
    return await this.reportService.getReviewedUsers()
  }

  @Get('admin/refunded')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getRefundedUsers() {
    return await this.reportService.getRefundedUsers()
  }

  @Get('admin/income-taxes')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getAverageSagetIncomeFromTaxeslesPrice(
    @Query('timePeriod') timePeriod: string,
  ) {
    return await this.reportService.getIncomeFromTaxes(timePeriod)
  }

  @Get('admin/sales')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getHotProductSales(
    @Query('dataType') dataType: string,
    @Query('timePeriod') timePeriod: string,
  ) {
    return await this.reportService.getHotProductSales(dataType, timePeriod)
  }

  @Get('admin/status')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getStatusCount(
    @Query('timePeriod') timePeriod: string,
  ) {
    return await this.reportService.getStatusCount(timePeriod)
  }

  @Get('admin/newUser')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getNewUser(@Query('timePeriod') timePeriod: string,) {
    return await this.reportService.getNewUser(timePeriod)
  }

  @Get('admin/unsastisfyCustomer')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async unsastisfyCustomer() {
    return await this.reportService.unsastisfyCustomer()
  }

  @Get('admin/UnsatisfyProduct')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async UnsatisfyProduct() {
    return await this.reportService.UnsatisfyProduct()
  }
}
