import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { PaymentService } from './payment.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  @UseGuards(AuthGuard('jwt'))
  checkout(
    @Body() checkoutDto: { productId: string; amount: number },
    @Request() req,
  ) {
    return this.paymentService.checkout(
      checkoutDto.productId,
      checkoutDto.amount,
      req.user.userId,
    )
  }

  @Get('session/:sessionId')
  @UseGuards(AuthGuard('jwt'))
  async getSession(@Param('sessionId') sessionId: string, @Request() req) {
    return this.paymentService.getStripeSession(sessionId, req.user.userId)
  }
}
