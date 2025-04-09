import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { OrderService } from './order.service'
import { AuthGuard } from '@nestjs/passport'
import { AdminGuard } from 'src/auth/admin.guard'
import { SuperAdminGuard } from 'src/auth/super-admin.guard'
import { CreateOrderDto } from './dto/create-order.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import { ApiBody, ApiConsumes } from '@nestjs/swagger'

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getAllOrders() {
    return await this.orderService.getAllOrders()
  }

  @Get('buyer/:id')
  @UseGuards(AuthGuard('jwt'))
  async getOrderByBuyer(@Param('id') id: string) {
    return await this.orderService.getOrderByBuyer(id)
  }

  @Get('seller/:id')
  @UseGuards(AuthGuard('jwt'))
  async getOrderBySeller(@Param('id') id: string) {
    return await this.orderService.getOrderBySeller(id)
  }

  @Post('admin')
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  async createOrderByAdmin(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.createOrderByAdmin(createOrderDto)
  }

  @Post('buyer')
  @UseGuards(AuthGuard('jwt'))
  async createOrderByBuyer(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req,
  ) {
    return await this.orderService.createOrderByBuyer(
      createOrderDto,
      req.user.userId,
    )
  }

  @Patch('evidence/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('evidence'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload payment evidence as a file',
    schema: {
      type: 'object',
      properties: {
        evidence: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadEvidence(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.orderService.uploadEvidence(id, file.buffer)
  }

  @Patch('status/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return await this.orderService.updateOrderStatus(
      id,
      updateOrderStatusDto.status,
    )
  }
}
