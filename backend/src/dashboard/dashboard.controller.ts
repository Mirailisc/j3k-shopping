import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

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
