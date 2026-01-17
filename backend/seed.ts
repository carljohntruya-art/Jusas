import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const products = [
  {
    name: "Mango Banana Boost",
    price: 149,
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1600718374662-0483d2b90400?q=80&w=800&auto=format&fit=crop",
    imageCredit: "Unsplash",
    description: "A tropical explosion of sweet mango and creamy banana to boost your day.",
    isFeatured: true
  },
  {
    name: "Green Detox Smoothie",
    price: 159,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1544145945-f904253db0ad?q=80&w=800&auto=format&fit=crop",
    imageCredit: "Unsplash",
    description: "Cleansing greens with a hint of citrus for the ultimate detox.",
    isFeatured: false
  },
  {
    name: "Strawberry Yogurt Bliss",
    price: 169,
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop",
    imageCredit: "Unsplash",
    description: "Creamy yogurt blended with fresh strawberries for a blissful treat.",
    isFeatured: true
  },
  {
    name: "Berry Antioxidant Blast",
    price: 169,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1464918642345-d343e72046ca?q=80&w=800&auto=format&fit=crop",
    imageCredit: "Unsplash",
    description: "Loaded with berries and antioxidants to keep you healthy and glowing.",
    isFeatured: false
  },
  {
    name: "Tropical Mango Pineapple",
    price: 149,
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=800&auto=format&fit=crop",
    imageCredit: "Unsplash",
    description: "Vacation in a cup! Sweet mango and tangy pineapple.",
    isFeatured: false
  },
  {
    name: "Avocado Matcha Smoothie",
    price: 179,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1543640203-1002241cf897?q=80&w=800&auto=format&fit=crop",
    imageCredit: "Unsplash",
    description: "Rich avocado meets earthy matcha for a smooth, energizing drink.",
    isFeatured: false
  },
  {
    name: "Chocolate Banana Protein Shake",
    price: 189,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1577805947697-89e18231d7af?q=80&w=800&auto=format&fit=crop",
    imageCredit: "Unsplash",
    description: "Protein-packed chocolate goodness with a banana base.",
    isFeatured: false
  }
];

async function main() {
  console.log('Start seeding...');
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Admin123!', salt);

  await prisma.user.upsert({
    where: { email: 'admin@smoothie.local' },
    update: { password: hashedPassword, name: 'Admin User', role: 'admin' },
    create: { email: 'admin@smoothie.local', password: hashedPassword, name: 'Admin User', role: 'admin' }
  });

  console.log('Upserted admin user: admin@smoothie.local');

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  for (const p of products) {
    await prisma.product.create({ data: p });
    console.log(`Created product: ${p.name}`);
  }

  console.log('Seeding finished (Unsplash URL Update).');
}

main().then(async () => await prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
