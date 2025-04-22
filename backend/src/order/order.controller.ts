import {
  Body,
  Controller,
  Delete,
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

  @Get('buyer')
  @UseGuards(AuthGuard('jwt'))
  async getOrderByBuyer(@Request() req) {
    return await this.orderService.getOrderByBuyer(req.user.userId)
  }

  @Get('buyer/:id')
  @UseGuards(AuthGuard('jwt'))
  async getOrderDetails(@Param('id') id: string) {
    return await this.orderService.getOrderDetails(id)
  }

  @Get('seller')
  @UseGuards(AuthGuard('jwt'))
  async getOrderBySeller(@Request() req) {
    return await this.orderService.getOrderBySeller(req.user.userId)
  }

  @Post('admin')
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  async createOrderByAdmin(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.createOrderByAdmin(createOrderDto)
  }

  @Post('buyer')
  @UseGuards(AuthGuard('jwt'))
  async createOrderByBuyer(
    @Body() createOrderDto: Omit<CreateOrderDto, 'userId'>,
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

  @Patch('complete/:id')
  @UseGuards(AuthGuard('jwt'))
  async completeOrder(@Param('id') id: string) {
    return await this.orderService.completeOrder(id)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  async deleteOrder(@Param('id') id: string) {
    return await this.orderService.deleteOrder(id)
  }
}
