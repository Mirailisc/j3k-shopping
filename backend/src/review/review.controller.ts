import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common'
import { AdminGuard } from 'src/auth/admin.guard'
import { SuperAdminGuard } from 'src/auth/super-admin.guard'
import { AuthGuard } from '@nestjs/passport'
import { CreateReviewDto } from './dto/create-review.dto'
import { ReviewService } from './review.service';
import { UpdateReviewDto } from './dto/update-review.dto'

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('admin')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getAllReview(){
    return await this.reviewService.getAllReview()
  }

  @Get(":id")
  async getReviewById(@Param('id') id: string){
    return await this.reviewService.getReviewById(id)
  }

  @Get("search/:id")
  async getReviewByProductId(@Param('id') id: string){
    return await this.reviewService.getReviewByProductId(id)
  }

  @Get("buyer/:id")
  async getReviewByUserId(@Param('id') id : string){
    return await this.reviewService.getReviewByUserId(id)
  }

  @Post("/buyer")
  @UseGuards(AuthGuard('jwt'))
  async createReviewByBuyer(
    @Request() req,
    @Body() review: CreateReviewDto
  ){
    return await this.reviewService.createReviewByBuyer(review, req.user.userId)
  }

  @Post("/admin")
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  async createReviewByAdmin(
    @Body() review: CreateReviewDto
  ){
    return await this.reviewService.createReviewByAdmin(review)
  }

  @Delete('buyer/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteReviewByBuyer(
    @Param('id') id:string,
    @Request() req
  ){
      return await this.reviewService.deleteReviewByBuyer(id,req.user.userId)
  }

  @Delete("admin/:id")
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  async deleteReviewByAdmin(
    @Param('id') id:string
  ){
    return await this.reviewService.deleteReviewByAdmin(id)
  }

  @Patch("buyer/:id")
  @UseGuards(AuthGuard('jwt'))
  async updateReviewByBuyer(
    @Param('id') id:string,
    @Request() req,
    @Body() review: UpdateReviewDto
  ){
    return await this.reviewService.updateReviewByBuyer(id, review, req.user.userId)
  }

  @Patch("admin/:id")
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  async updateReviewByAdmin(
    @Param('id') id:string,
    @Body() review: UpdateReviewDto
  ){
    return await this.reviewService.updateReviewByAdmin(id, review)
  }

}


