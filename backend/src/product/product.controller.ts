import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ProductService } from './product.service'
import { AuthGuard } from '@nestjs/passport'
import { AdminGuard } from 'src/auth/admin.guard'
import { UpdateProductDto } from './dto/update-product.dto'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProduct() {
    return await this.productService.getAllProduct()
  }

  @Get('search/:name')
  async searchProductByName(@Param('name') name: string) {
    return await this.productService.searchProductByName(name)
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return await this.productService.getProductById(id)
  }

  @Get('seller/:id')
  @UseGuards(AuthGuard('jwt'))
  async getProductBySellerId(@Param('id') id: string) {
    return await this.productService.getProductBySellerId(id)
  }

  @Put('seller/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateProductBySeller(
    @Param('id') id: string,
    @Request() req,
    @Body() product: UpdateProductDto,
  ) {
    return await this.productService.updateProductBySeller(
      id,
      product,
      req.user.userId,
    )
  }

  @Put('admin/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async updateProductByAdmin(
    @Param('id') id: string,
    @Body() product: UpdateProductDto,
  ) {
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
