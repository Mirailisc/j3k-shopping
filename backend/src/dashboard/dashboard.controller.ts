import { Controller, Get, UseGuards, Query, Request } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { DashboardService } from "./dashboard.service"


@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('country-total-order')
  async getCountryTotalOrder() {
    return await this.dashboardService.CountryTotalOrder()
  }

  @Get('rating-amount')
  async getRatingAmount() {
    return await this.dashboardService.RatingAmount()
  }

  @Get('rating-count')
  async getRatingCount() {
    return await this.dashboardService.RatingCount()
  }

  @Get('refunded-product')
  async getRefundedProductName() {
    return await this.dashboardService.RefundedProductName()}
  @Get('seller/totalOrders')
  @UseGuards(AuthGuard('jwt'))
  async getSellerTotalOrder(@Request() req){
    return await this.dashboardService.getSellerTotalOrder(req.user.userId)

  }

  @Get('seller/totalSales')
  @UseGuards(AuthGuard('jwt'))
  async getSellerTotalSales(@Request() req){
    return await this.dashboardService.getSellerTotalSales(req.user.userId)
  }

  @Get('seller/pending')
  @UseGuards(AuthGuard('jwt'))
  async OnPendingOrder(@Request() req){
    return await this.dashboardService.OnPendingOrder(req.user.userId)
  }
  @Get('seller/lowStock')
  @UseGuards(AuthGuard('jwt'))
  async LowStockProduct(@Request() req){
    return await this.dashboardService.LowStockProduct(req.user.userId)
  }

  @Get('seller/lowStock/list')
  @UseGuards(AuthGuard('jwt'))
  async getLowStockList(@Request() req){
    return await this.dashboardService.getLowStockList(req.user.userId)
  }


  @Get('seller/total')
  @UseGuards(AuthGuard('jwt'))
  async GetSalesOverTime(
    @Request() req,
    @Query('range') range:string,
  ){
    return await this.dashboardService.GetSalesOverTime(range, req.user.userId)
  }
}
