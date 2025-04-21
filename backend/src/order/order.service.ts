import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { randomUUID } from 'crypto'
import { Order } from './entities/order.entity'
import { OrderStatus } from './enum/order.enum'
import { ProductService } from 'src/product/product.service'
import { Product } from 'src/product/entities/product.entity'
import { Contact } from 'src/contact/entities/contact.entity'
import { NotificationService } from 'src/notification/notification.service'

export const IMPORT_TAX_PERCENTAGE = 0.37

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
    private readonly notificationService: NotificationService,
  ) {}

  private toBase64(imageData: string | Uint8Array | Buffer): string {
    let buffer: Buffer

    if (typeof imageData === 'string') {
      buffer = Buffer.from(imageData, 'base64')
    } else if (Buffer.isBuffer(imageData)) {
      buffer = imageData
    } else {
      buffer = Buffer.from(imageData)
    }

    return `data:image/jpeg;base64,${buffer.toString('base64')}`
  }

  private transformOrders(orders: Order[]) {
    return orders.map((order) => ({
      ...order,
      evidence: order.evidence ? this.toBase64(order.evidence) : null,
    }))
  }

  private calculateTotal(product: Product, amount: number) {
    const subtotal = product.price * amount
    const tax = subtotal * IMPORT_TAX_PERCENTAGE
    const total = subtotal + tax
    return total
  }

  async getAllOrders() {
    const orders = await this.prisma.$queryRaw<Order[]>`
      SELECT * FROM \`Order\`
    `
    return this.transformOrders(orders)
  }

  async getOrderById(id: string) {
    const orders = await this.prisma.$queryRaw<Order[]>`
      SELECT * FROM \`Order\` WHERE id = ${id}
    `

    if (!orders || orders.length === 0) {
      throw new NotFoundException('Order not found')
    }

    return this.transformOrders(orders)[0]
  }

  async getOrderBySeller(id: string) {
    const orders = await this.prisma.$queryRaw<Order[] & Partial<Contact>>`
      SELECT O.id, O.status, O.total, U.username, O.productId, U.email, O.amount, O.evidence, O.createdAt,
      JSON_OBJECT(
        'phone', C.phone,
        'address', C.address,
        'city', C.city,
        'province', C.province,
        'zipCode', C.zipCode,
        'country', C.country
      ) AS contact
      FROM \`Order\` O
      LEFT JOIN Product P ON O.productId = P.id 
      LEFT JOIN User U ON O.userId = U.id
      LEFT JOIN Contact C ON U.id = C.userId
      WHERE P.userId = ${id}
    `
    return this.transformOrders(orders)
  }

  async getOrderByBuyer(id: string) {
    const orders = await this.prisma.$queryRaw<Order[]>`
      SELECT * FROM \`Order\` WHERE userId = ${id}
    `
    return this.transformOrders(orders)
  }

  async createOrderByAdmin(createOrderDto: CreateOrderDto) {
    const uuid = randomUUID()
    const product = await this.productService.getProductById(
      createOrderDto.productId,
    )

    const total = this.calculateTotal(product, createOrderDto.amount)

    await this.prisma.$executeRaw<Order>`
      INSERT INTO \`Order\` (id, status, total, userId, productId, amount)
      VALUES (${uuid}, ${OrderStatus.PENDING}, ${total}, ${createOrderDto.userId}, ${createOrderDto.productId}, ${createOrderDto.amount})
    `

    await this.prisma.$executeRawUnsafe(`
      UPDATE Product
      SET quantity = quantity + ${-createOrderDto.amount}
      WHERE id = '${createOrderDto.productId}'
    `)

    return await this.getOrderById(uuid)
  }

  async uploadEvidence(id: string, evidence: Buffer) {
    await this.prisma.$executeRaw<Order>`
      UPDATE \`Order\`
      SET evidence = ${evidence}
      WHERE id = ${id}
    `

    return await this.getOrderById(id)
  }

  async createOrderByBuyer(
    createOrderDto: Omit<CreateOrderDto, 'userId'>,
    me: string,
  ) {
    const uuid = randomUUID()
    const product = await this.productService.getProductById(
      createOrderDto.productId,
    )

    if (product.userId === me) {
      throw new BadRequestException('You cannot order your own product')
    }

    const total = this.calculateTotal(product, createOrderDto.amount)

    await this.prisma.$executeRaw<Order>`
      INSERT INTO \`Order\` (id, status, total, userId, productId, amount)
      VALUES (${uuid}, ${OrderStatus.PENDING}, ${total}, ${me}, ${createOrderDto.productId}, ${createOrderDto.amount})
    `

    await this.prisma.$executeRawUnsafe(`
      UPDATE Product
      SET quantity = quantity + ${-createOrderDto.amount}
      WHERE id = '${createOrderDto.productId}'
    `)

    await this.notificationService.sendNotification(
      product.userId,
      `A new order has been placed for your product "${product.name}`,
    )

    return await this.getOrderById(uuid)
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    const order = await this.getOrderById(id)
    const product = await this.productService.getProductById(order.productId)

    const stockUpdate = async (change: number) => {
      await this.prisma.$executeRawUnsafe(`
        UPDATE Product
        SET quantity = quantity + ${change}
        WHERE id = '${product.id}'
      `)
    }

    switch (status) {
      case OrderStatus.PENDING:
        await stockUpdate(-order.amount)
        break

      case OrderStatus.PAID:
        if (!order.evidence) {
          throw new BadRequestException('Evidence is required')
        }
        break

      case OrderStatus.DELIVERING:
        if (!order.evidence) {
          throw new BadRequestException('Evidence is required')
        }
        break

      case OrderStatus.SHIPPED:
        if (!order.evidence) {
          throw new BadRequestException('Evidence is required')
        }
        break

      case OrderStatus.COMPLETED:
        if (!order.evidence) {
          throw new BadRequestException('Evidence is required')
        }
        break

      case OrderStatus.REFUNDING:
        if (!order.evidence) {
          throw new BadRequestException('Evidence is required')
        }
        break

      case OrderStatus.REFUNDED:
        if (!order.evidence) {
          throw new BadRequestException('Evidence is required')
        }
        break

      case OrderStatus.CANCELLED:
        await stockUpdate(order.amount)
        break

      default:
        break
    }

    await this.prisma.$executeRawUnsafe(`
      UPDATE \`Order\`
      SET status = '${status}'
      WHERE id = '${id}'
    `)

    return await this.getOrderById(id)
  }

  async deleteOrder(id: string) {
    const order = await this.getOrderById(id)

    await this.prisma.$executeRaw`
      UPDATE Product
      SET quantity = quantity + ${order.amount}
      WHERE id = ${order.productId}
    `

    await this.prisma.$executeRaw`
      DELETE FROM \`Order\` WHERE id = ${id}
    `
    return order
  }
}
