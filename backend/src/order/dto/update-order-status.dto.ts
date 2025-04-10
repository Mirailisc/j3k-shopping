import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { OrderStatus } from '../enum/order.enum'

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, default: OrderStatus.PENDING })
  @IsEnum(OrderStatus)
  status: OrderStatus
}
