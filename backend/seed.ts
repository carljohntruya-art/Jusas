import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const products = [
  {
    name: "Mango Banana Boost",
    price: 149,
    stock: 50,
    imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    imageCredit: "Pexels – Frida Gay",
    description: "A tropical explosion of sweet mango and creamy banana to boost your day.",
    isFeatured: true
  },
  {
    name: "Green Detox Smoothie",
    price: 159,
    stock: 40,
    imageUrl: "https://images.pexels.com/photos/7187426/pexels-photo-7187426.jpeg",
    imageCredit: "Pexels – Daria Shevtsova",
    description: "Cleansing greens with a hint of citrus for the ultimate detox.",
    isFeatured: false
  },
  {
    name: "Strawberry Yogurt Bliss",
    price: 169,
    stock: 45,
    imageUrl: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
    imageCredit: "Pexels – Lisa Fotios",
    description: "Creamy yogurt blended with fresh strawberries for a blissful treat.",
    isFeatured: true
  },
  {
    name: "Berry Antioxidant Blast",
    price: 169,
    stock: 40,
    imageUrl: "https://images.pexels.com/photos/414555/pexels-photo-414555.jpeg",
    imageCredit: "Pexels – Lisa Fotios",
    description: "Loaded with berries and antioxidants to keep you healthy and glowing.",
    isFeatured: false
  },
  {
    name: "Tropical Mango Pineapple",
    price: 149,
    stock: 50,
    imageUrl: "https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg",
    imageCredit: "Pexels – Brenda Godinez",
    description: "Vacation in a cup! Sweet mango and tangy pineapple.",
    isFeatured: false
  },
  {
    name: "Avocado Matcha Smoothie",
    price: 179,
    stock: 30,
    imageUrl: "https://images.pexels.com/photos/5945754/pexels-photo-5945754.jpeg",
    imageCredit: "Pexels – Charlotte May",
    description: "Rich avocado meets earthy matcha for a smooth, energizing drink.",
    isFeatured: false
  },
  {
    name: "Chocolate Banana Protein Shake",
    price: 189,
    stock: 35,
    imageUrl: "https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg",
    imageCredit: "Pexels – Jess Bailey",
    description: "Protein-packed chocolate goodness with a banana base.",
    isFeatured: false
  }
];

async function main() {
  console.log('Start seeding...');
  
  // 1. Clean up database
  // Note: This wipes all user data. In a real production seed, you might want check existence first.
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Admin User
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Admin123!', salt);

  await prisma.user.create({
    data: {
      email: 'admin@smoothie.local',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin' // Lowercase to match middleware auth check
    }
  });

  console.log('Created admin user: admin@smoothie.local');

  // 3. Create products
  for (const p of products) {
    const product = await prisma.product.create({
      data: p,
    });
    console.log(`Created product with id: ${product.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
