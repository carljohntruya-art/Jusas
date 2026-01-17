import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrate() {
  console.log('--- Starting Image URL Cleanup Migration ---');
  
  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products to check.`);

  for (const product of products) {
    // 1. Clean URL: Remove newlines, tabs, and multiple spaces
    const cleanUrl = product.imageUrl
      .replace(/[\n\r\t]/g, '') // remove newlines/tabs
      .trim()
      .replace(/\s+/g, ''); // remove all internal whitespace
    
    // 2. Fix known corruption "jpegeg" or "pexels-hoto" seen in logs
    let finalizedUrl = cleanUrl
        .replace(/jpegeg$/, 'jpeg')
        .replace(/hoto-/, 'photo-');

    if (product.imageUrl !== finalizedUrl) {
      console.log(`✅ Fixing Product ID ${product.id} (${product.name}):`);
      console.log(`   Old: ${JSON.stringify(product.imageUrl)}`);
      console.log(`   New: ${finalizedUrl}`);
      
      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl: finalizedUrl }
      });
    }
  }

  console.log('--- Migration Complete ---');
}

migrate()
  .then(() => process.exit(0))
  .catch(e => {
    console.error('Migration failed:', e);
    process.exit(1);
  });
