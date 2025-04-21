/* eslint-disable @typescript-eslint/no-magic-numbers */
import { BadRequestException, Injectable } from '@nestjs/common'
import { IMPORT_TAX_PERCENTAGE, OrderService } from 'src/order/order.service'
import { Product } from 'src/product/entities/product.entity'
import { ProductService } from 'src/product/product.service'
import { ProfileService } from 'src/profile/profile.service'
import Stripe from 'stripe'

@Injectable()
export class PaymentService {
  private stripe: Stripe

  constructor(
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
    private readonly profileService: ProfileService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: '2025-03-31.basil',
    })
  }

  private calculateTotal(product: Product, amount: number) {
    const subtotal = product.price * amount
    const tax = subtotal * IMPORT_TAX_PERCENTAGE
    const total = subtotal + tax
    return Math.round(total * 100)
  }

  async checkout(productId: string, amount: number, me: string) {
    const product = await this.productService.getProductById(productId)

    if (product.userId === me) {
      throw new BadRequestException('You cannot order your own product')
    }

    if (product.quantity < amount) {
      throw new BadRequestException('Not enough stock')
    }

    const total = this.calculateTotal(product, amount)

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card', 'promptpay'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'thb',
            product_data: {
              name: product.name,
              images: ['https://github.com/Mirailisc.png'],
            },
            unit_amount: total,
          },
          quantity: amount,
        },
      ],
      success_url:
        'http://localhost:3000/checkout/order-confirmation?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000',
      metadata: {
        productId: product.id,
        buyerId: me,
        sellerId: product.userId,
        quantity: String(amount),
      },
    })

    return { url: session.url }
  }

  async getStripeSession(sessionId: string, me: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    })

    const order = await this.orderService.createOrderByBuyer(
      {
        productId: session.metadata.productId,
        amount: Number(session.metadata.quantity),
      },
      me,
    )

    const product = await this.productService.getProductById(order.productId)
    const shipping = await this.profileService.getShippingInfo(order.userId)

    const subtotal = product.price * order.amount
    const tax = subtotal * IMPORT_TAX_PERCENTAGE
    const total = subtotal + tax

    return {
      orderId: order.id,
      product: product,
      shipping,
      quantity: order.amount,
      subtotal,
      tax,
      total,
    }
  }
}
