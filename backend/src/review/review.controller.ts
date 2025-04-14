import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
} from '@nestjs/common'
import { ReviewService } from './review.service'
import { AuthGuard } from '@nestjs/passport'
import { AdminGuard } from 'src/auth/admin.guard'
import { UpdateReviewDto } from './dto/update-review.dto'
import { CreateReviewDto } from './dto/create-review.dto'

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async getAllReview() {
    return await this.reviewService.getAllReview()
  }
}
