import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common'
import { AdminGuard } from 'src/auth/admin.guard'
import { SuperAdminGuard } from 'src/auth/super-admin.guard'
import { AuthGuard } from '@nestjs/passport'
import { CreateReviewDto } from './dto/create-review.dto'
import { ReviewService } from './review.service'
import { UpdateReviewDto } from './dto/update-review.dto'

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('admin')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getAllReview() {
    return await this.reviewService.getAllReview()
  }
  
  //Added Here
  // Incase of We want only Seller to be able to see all their Product Reviews PS:I think everyone should be able to see.
  /*@Get('seller/:productId')
  @UseGuards(AuthGuard('jwt'))
  async getReviewsForSellerProduct(
    @Param('productId') productId: string,
    @Request() req,
    )   {
      return await this.reviewService.getReviewsForSellerProduct(productId, req.user.userId)
    }*/

  @Get('seller/:productId')
  async getReviewsForSellerProduct(@Param('productId') productId: string) {
  return this.reviewService.getReviewsForSellerProduct(productId)
}
  @Get('stats/:productId')
  async getRatingStats(@Param('productId') productId: string) {
  return this.reviewService.getRatingStats(productId)
}
    //Ended Add


  @Post('product')
  @UseGuards(AuthGuard('jwt'))
  async createReview(
    @Body() createReviewDto: Omit<CreateReviewDto, 'userId'>,
    @Request() req,
  ) {
    return await this.reviewService.createReview(
      createReviewDto,
      req.user.userId,
    )
  }

  @Post('admin')
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  async createReviewByAdmin(@Body() review: CreateReviewDto) {
    return await this.reviewService.createReviewByAdmin(review)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteReviewByBuyer(@Param('id') id: string, @Request() req) {
    return await this.reviewService.deleteReviewByBuyer(id, req.user.userId)
  }

  @Delete('admin/:id')
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  async deleteReviewByAdmin(@Param('id') id: string) {
    return await this.reviewService.deleteReviewByAdmin(id)
  }

  @Put('admin/:id')
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  async updateReviewByAdmin(
    @Param('id') id: string,
    @Body() review: UpdateReviewDto,
  ) {
    return await this.reviewService.updateReviewByAdmin(id, review)
  }
}
