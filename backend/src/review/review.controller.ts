import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ReviewService } from './review.service'
import { CreateReviewDto } from './dto/create-review.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async getAllReview() {
    return await this.reviewService.getAllReview()
  }

  @Get('product/:id')
  async getReviewByProductId(@Param('id') productId: string) {
    return await this.reviewService.getReviewInfo(productId)
  }

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
}
