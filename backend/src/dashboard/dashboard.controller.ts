import { Controller, Get, UseGuards } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { AdminGuard } from 'src/auth/admin.guard'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard('jwt'), AdminGuard)
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
    return await this.dashboardService.RefundedProductName()
  }
}
