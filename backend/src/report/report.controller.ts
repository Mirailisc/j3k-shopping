import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common'
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
  async UnsastisfyProduct() {
    return await this.reportService.UnsastisfyProduct()
  }

  @Get('seller/revenue')
  @UseGuards(AuthGuard('jwt'))
  async getSellerRevenue(
    @Request() req,
    @Query('timePeriod') timePeriod: string,
  ){
    return await this.reportService.getSellerRevenue(timePeriod, req.user.userId)
  }

  @Get('seller/sales')
  @UseGuards(AuthGuard('jwt'))
  async getSellerMostSalesProduct(
    @Request() req,
    @Query('dataType') dataType: string,
    @Query('timePeriod') timePeriod: string,
  ){
    return await this.reportService.getSellerMostSalesProduct(dataType, timePeriod, req.user.userId)
  }

  @Get('seller/unsold')
  @UseGuards(AuthGuard('jwt'))
  async getSellerUnsoldProductsList(
      @Request() req,
      @Query('timePeriod') timePeriod: string,
  ){
      return await this.reportService.getSellerUnsoldProductsList(timePeriod, req.user.userId)
  }

  @Get('seller/status')
  @UseGuards(AuthGuard('jwt'))
  async getSellerStatusCount(
      @Request() req,
      @Query('timePeriod') timePeriod: string,
  ){
      return await this.reportService.getSellerStatusCount(timePeriod, req.user.userId)
  }

  @Get('seller/rating')
  @UseGuards(AuthGuard('jwt'))
  async getAverageSellerReview(
      @Request() req,
  ){
      return await this.reportService.getAverageSellerReview( req.user.userId)
  }

  @Get('seller/product')
  @UseGuards(AuthGuard('jwt'))
  async getSellerProductStat(
      @Request() req,
  ){
      return await this.reportService.getSellerProductStat( req.user.userId)
  }  

}
