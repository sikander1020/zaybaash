const mongoose = require('mongoose');
const uri = 'mongodb+srv://sik1020:Sik1020@cluster0.i2cm3j2.mongodb.net/zaybaash?appName=Cluster0';

async function run() {
  await mongoose.connect(uri);
  const products = await mongoose.connection.collection('products').find({}).toArray();
  for (const p of products) {
    if (p.images) {
      for (let i = 0; i < p.images.length; i++) {
        if (p.images[i] && p.images[i].startsWith('data:image')) {
          console.log(`Product ${p.name} has a base64 image at index ${i} with length ${p.images[i].length}`);
        }
      }
    }
  }
  process.exit(0);
}
run();
