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
  UseInterceptors,
} from '@nestjs/common'
import { ProductService } from './product.service'
import { AuthGuard } from '@nestjs/passport'
import { AdminGuard } from 'src/auth/admin.guard'
import { UpdateProductDto } from './dto/update-product.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { CreateProductDto } from './dto/create-product.dto'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getAllProduct() {
    return await this.productService.getAllProduct()
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return await this.productService.getProductInfo(id)
  }

  @Get('seller/:id')
  @UseGuards(AuthGuard('jwt'))
  async getProductBySellerId(@Param('id') id: string) {
    return await this.productService.getProductBySellerId(id)
  }

  @Post('seller')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('productImg'))
  async createProductBySeller(
    @Request() req,
    @Body() product: Omit<CreateProductDto, 'userId'>,
    @UploadedFile() productImg: Express.Multer.File,
  ) {
    if (productImg) {
      product.productImg = productImg.buffer
    }

    return await this.productService.createProductBySeller(
      product,
      req.user.userId,
    )
  }

  @Post('admin')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @UseInterceptors(FileInterceptor('productImg'))
  async createProductByAdmin(
    @Body() product: CreateProductDto,
    @UploadedFile() productImg: Express.Multer.File,
  ) {
    if (productImg) {
      product.productImg = productImg.buffer
    }

    return await this.productService.createProductByAdmin(product)
  }

  @Put('seller/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('productImg'))
  async updateProductBySeller(
    @Param('id') id: string,
    @Request() req,
    @Body() product: UpdateProductDto,
    @UploadedFile() productImg: Express.Multer.File,
  ) {
    if (productImg) {
      product.productImg = productImg.buffer
    }

    return await this.productService.updateProductBySeller(
      id,
      product,
      req.user.userId,
    )
  }

  @Put('admin/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @UseInterceptors(FileInterceptor('productImg'))
  async updateProductByAdmin(
    @Param('id') id: string,
    @Body() product: UpdateProductDto,
    @UploadedFile() productImg: Express.Multer.File,
  ) {
    if (productImg) {
      product.productImg = productImg.buffer
    }

    return await this.productService.updateProductByAdmin(id, product)
  }

  @Delete('seller/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteProductBySeller(@Param('id') id: string, @Request() req) {
    return await this.productService.deleteProductBySeller(id, req.user.userId)
  }

  @Delete('admin/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async deleteProductByAdmin(@Param('id') id: string) {
    return await this.productService.deleteProductByAdmin(id)
  }
}
