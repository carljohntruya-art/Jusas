import { PrismaClient } from '@prisma/client';

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
  
  // Create default admin
  // Password: adminpassword123 (hashed needs to be generated in real app, here we might need bcrypt to hash it runtime or use pre-hashed)
  // For simplicity in seed, we'll rely on the app to hash, or we can use a hardcoded hash.
  // Let's use a placeholder hash for now or try to import bcrypt if available.
  // Since we can't easily rely on bcrypt in seed without typescript compiling it first sometimes, we'll try standard import.
  
  // Delete existing
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create products
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
