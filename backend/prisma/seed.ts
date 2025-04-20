import { PrismaClient, OrderStatus } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

function randomDateBetween(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

async function main() {
  const START_DATE = new Date('2025-04-13T00:00:00Z')
  const END_DATE = new Date('2025-04-20T23:59:59Z')

  console.log('Seeding database...')

  await prisma.reviews.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.social.deleteMany()
  await prisma.user.deleteMany()

  const users = []
  for (let i = 0; i < 50; i++) {
    const createdAt = randomDateBetween(START_DATE, END_DATE)

    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        isAdmin: false,
        isSuperAdmin: false,
        createdAt,
        Contact: {
          create: {
            citizenId: faker.string.numeric(13),
            phone: `0${faker.number.int({ min: 800000000, max: 999999999 })}`,
            address: faker.location.streetAddress(),
            city: faker.helpers.arrayElement([
              'Bangkok', 'Chiang Mai', 'Khon Kaen', 'Phuket', 'Nakhon Ratchasima',
              'Chonburi', 'Udon Thani', 'Songkhla', 'Surat Thani', 'Nakhon Si Thammarat'
            ]),
            province: faker.helpers.arrayElement([
              'Bangkok', 'Chiang Mai', 'Khon Kaen', 'Phuket', 'Nakhon Ratchasima',
              'Chonburi', 'Udon Thani', 'Songkhla', 'Surat Thani', 'Nakhon Si Thammarat'
            ]),
            zipCode: faker.string.numeric(5),
            country: 'Thailand',
            createdAt,
            updatedAt: createdAt
          },
        },
        Social: {
          create: {
            line: faker.internet.userName(),
            facebook: faker.internet.url(),
            website: faker.internet.url(),
            instagram: faker.internet.userName(),
            tiktok: `@${faker.internet.userName()}`,
            createdAt,
            updatedAt: createdAt
          },
        },
      },
    })
    users.push(user)
  }

  const products = []
  for (let i = 0; i < 100; i++) {
    const owner = faker.helpers.arrayElement(users)
    const createdAt = randomDateBetween(START_DATE, END_DATE)

    const product = await prisma.product.create({
      data: {
        id: randomUUID(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 100, max: 500 })),
        quantity: faker.number.int({ min: 1, max: 20 }),
        productImg: Buffer.from('sample-image'),
        userId: owner.id,
        createdAt,
        updatedAt: createdAt
      },
    })
    products.push(product)
  }

  const orders = []
  for (let i = 0; i < 100; i++) {
    const buyer = faker.helpers.arrayElement(users)
    const product = faker.helpers.arrayElement(products)
    if (buyer.id === product.userId) continue

    const createdAt = randomDateBetween(START_DATE, END_DATE)

    const order = await prisma.order.create({
      data: {
        id: randomUUID(),
        status: faker.helpers.arrayElement(Object.values(OrderStatus)),
        total: product.price,
        userId: buyer.id,
        productId: product.id,
        amount: faker.number.int({ min: 1, max: 5 }),
        createdAt,
      },
    })
    orders.push(order)
  }

  for (const order of orders) {
    const createdAt = randomDateBetween(START_DATE, END_DATE)

    await prisma.reviews.create({
      data: {
        id: randomUUID(),
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.sentence(),
        productId: order.productId,
        userId: order.userId,
        createdAt,
        updatedAt: createdAt,
      },
    })
  }

  console.log('Seed finished!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
