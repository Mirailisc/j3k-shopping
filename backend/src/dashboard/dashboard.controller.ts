import { Controller, Get, UseGuards, Query, Request } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { DashboardService } from "./dashboard.service"
import { AdminGuard } from "src/auth/admin.guard"


@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

   @Get('admin/average-rating')
  @UseGuards(AuthGuard('jwt'),AdminGuard)
  async getAverageRating() {
    return await this.dashboardService.getAverageRating()
  }

    @Get('admin/orders')
  @UseGuards(AuthGuard('jwt'),AdminGuard)
  async getTotalOrders() {
    return await this.dashboardService.getTotalOrders()
  }

  @Get('admin/customer-count')
  @UseGuards(AuthGuard('jwt'),AdminGuard)
  async getCustomerCount() {
    return await this.dashboardService.getCustomerCount()
  }

  @Get('admin/revenue')
  @UseGuards(AuthGuard('jwt'),AdminGuard)
  async getTotalRevenue() {
    return await this.dashboardService.getTotalRevenue()
  }

  @Get('admin/total')
  @UseGuards(AuthGuard('jwt'),AdminGuard)
  async GetSalesOverTimeAdmin(
    @Query('range') range: string,
  ) {
    return await this.dashboardService.GetSalesOverTimeAdmin(range)
  }

   @Get('admin/rating-count')
  @UseGuards(AuthGuard('jwt'),AdminGuard)
  async RatingCount() {
    return await this.dashboardService.RatingCount()
  }

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
