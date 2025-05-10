import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin/country-total-orders')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getCountryTotalOrders() {
    return await this.dashboardService.CountryTotalOrder();
  }

  @Get('admin/rating-distribution')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getRatingDistribution() {
    return await this.dashboardService.RatingCount();
  }

  @Get('admin/user-count')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getUserCount() {
    return await this.dashboardService.UserCount();
  }

  @Get('admin/product-count')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getProductCount() {
    return await this.dashboardService.ProductCount();
  }

  @Get('admin/product-stock')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getProductInStock() {
    return await this.dashboardService.ProductInStock();
  }

  @Get('admin/average-rating')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getAverageRating() {
    return await this.dashboardService.AvgRating();
  }
}
