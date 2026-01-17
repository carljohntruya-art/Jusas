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
  
  // 1. Create/Update Admin User (Safe Upsert)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Admin123!', salt);

  await prisma.user.upsert({
    where: { email: 'admin@smoothie.local' },
    update: {
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin'
    },
    create: {
      email: 'admin@smoothie.local',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin'
    }
  });

  console.log('Upserted admin user: admin@smoothie.local');

  // 2. Upsert products to avoid duplicates or deletion
  for (const p of products) {
    // We assume name is unique for simplicity in finding, or we can't easily upsert without a unique field.
    // If name isn't unique in schema, we'll try findFirst -> update or create.
    // Ideally Product should have @unique on name or we use a known ID. 
    // For this existing schema, let's just use create but check existence first to be safe, 
    // or rely on a "soft" seed approach. 
    // Better yet, let's check by name.
    
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    
    if (existing) {
        await prisma.product.update({
            where: { id: existing.id },
            data: p
        });
        console.log(`Updated product: ${p.name}`);
    } else {
        const product = await prisma.product.create({
            data: p
        });
        console.log(`Created product: ${p.name}`);
    }
  }

  console.log('Seeding finished (Idempotent).');
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
