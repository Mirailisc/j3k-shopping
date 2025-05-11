import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ProductFeed } from './entities/product-feed.entity'
import { OrderStatus } from '@prisma/client'

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

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

  async allProductFeed() {
    const products = await this.prisma.$queryRaw<ProductFeed[]>`
      SELECT P.id, P.name, P.productImg, P.price, P.quantity, U.username
      FROM \`Product\` P
      JOIN User U ON P.userId = U.id
      WHERE P.quantity > 0
    `

    return products.map((product) => ({
      ...product,
      productImg: this.toBase64(product.productImg),
    }))
  }

  async recentProductFeed() {
    const products = await this.prisma.$queryRaw<ProductFeed[]>`
      SELECT P.id, P.name, P.productImg, P.price, P.quantity, U.username
      FROM \`Product\` P
      JOIN User U ON P.userId = U.id
      WHERE P.quantity > 0
      ORDER BY P.createdAt DESC
      LIMIT 10
    `

    return products.map((product) => ({
      ...product,
      productImg: this.toBase64(product.productImg),
    }))
  }

  async searchProductsByName(query: string) {
    const products = await this.prisma.$queryRaw<ProductFeed[]>`
      SELECT P.id, P.name, P.productImg, P.price, U.username
      FROM \`Product\` P
      JOIN User U ON P.userId = U.id
      WHERE P.quantity > 0
      AND P.name LIKE ${`%${query}%`}
      LIMIT 5
    `

    return products.map((product) => ({
      ...product,
      productImg: this.toBase64(product.productImg),
    }))
  }

  async stats() {
    const totalProduct = await this.prisma.$queryRaw<any[]>`
      SELECT COUNT(*) as totalProduct
      FROM \`Product\`
    `
    const totalUser = await this.prisma.$queryRaw<any[]>`
      SELECT COUNT(*) as totalUser
      FROM User
    `
    const totalSold = await this.prisma.$queryRaw<any[]>`
      SELECT COUNT(*) as totalSold
      FROM \`Order\`
      WHERE status = ${OrderStatus.Completed}
    `
    const totalInStock = await this.prisma.$queryRaw<any[]>`
      SELECT SUM(quantity) as totalInStock
      FROM \`Product\`
      WHERE quantity > 0
    `

    return {
      totalProduct: Number(totalProduct[0].totalProduct),
      totalUser: Number(totalUser[0].totalUser),
      totalSold: Number(totalSold[0].totalSold),
      totalInStock: Number(totalInStock[0].totalInStock),
    }
  }
}
