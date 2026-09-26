import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "./product/product-model";
import { Category } from "./category/category-model";
import { User } from "./user/user-model";

dotenv.config();

const DB_URL = process.env.DB_URL || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "3m-store";

const sampleLaptops = [
  {
    name: "Dell XPS 15 9510 Touch 4K",
    description: "لابتوب ديل كسر زيرو فرز أول ممتاز، شاشة 4K Touch OLED خرافية، مناسب جداً للمونتاج والجرافيك الهندسي وصناع المحتوى.",
    imageCover: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80"
    ],
    price: 34500,
    brand: "Dell",
    processor: "Intel Core i7-11800H (8 Cores 16 Threads)",
    ram: "32GB DDR4 3200MHz",
    storage: "1TB NVMe SSD",
    gpu: "NVIDIA GeForce RTX 3050 Ti 4GB",
    screen: '15.6" 4K UHD (3840x2400) Touch OLED',
    grade: "فرز أول (Grade A+)",
    battery: "حالة ممتازة 88%",
    warranty: "ضمان 14 يوم تجربة واستبدال + شاحن أصلي Type-C",
    stockQuantity: 5,
    isFeatured: true,
    categoryName: "برمجة ومونتاج"
  },
  {
    name: "HP EliteBook 840 G8 Workstation",
    description: "أقوى لابتوب بيزنس وأعمال هيكل ألومنيوم بالكامل متين وفاخر، وزن خفيف جداً وصوت خيالي من Bang & Olufsen.",
    imageCover: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80"
    ],
    price: 19800,
    brand: "HP",
    processor: "Intel Core i7-1165G7 (11th Gen)",
    ram: "16GB DDR4 High Speed",
    storage: "512GB NVMe SSD",
    gpu: "Intel Iris Xe Graphics",
    screen: '14.0" Full HD (1920x1080) IPS Anti-Glare',
    grade: "فرز أول (Grade A+)",
    battery: "حالة ممتازة 92%",
    warranty: "ضمان 14 يوم فحص وتجربة + شاحن أصلي HP",
    stockQuantity: 8,
    isFeatured: true,
    categoryName: "بيزنس وأعمال"
  },
  {
    name: "Lenovo ThinkPad T14 Gen 2",
    description: "أسطورة الاعتمادية وسيد الكيبورد بلا منازع. لابتوب لينوفو ثينك باد للبرمجة والمكتب الشاق ومحبين الأداء الثابت بدون سخونية.",
    imageCover: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80"
    ],
    price: 21500,
    brand: "Lenovo",
    processor: "Intel Core i7-1185G7 vPro",
    ram: "16GB DDR4",
    storage: "512GB NVMe M.2 SSD",
    gpu: "Intel Iris Xe Graphics",
    screen: '14.0" FHD IPS 300 nits',
    grade: "كسر زيرو (Like New)",
    battery: "حالة جيدة جداً 85%+",
    warranty: "ضمان 14 يوم استبدال + 3 شهور صيانة",
    stockQuantity: 6,
    isFeatured: true,
    categoryName: "برمجة ومونتاج"
  },
  {
    name: "HP Victus 15 Gaming RTX 3050",
    description: "وحش الجيمينج والألعاب والـ 3D Rendering. شاشة 144Hz لتجربة ألعاب سلسة وسريعة مع تبريد قوي ذكي.",
    imageCover: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80"
    ],
    price: 27900,
    brand: "HP",
    processor: "AMD Ryzen 5 5600H (6 Cores 12 Threads)",
    ram: "16GB DDR4 3200MHz",
    storage: "512GB High Speed SSD",
    gpu: "NVIDIA GeForce RTX 3050 4GB GDDR6",
    screen: '15.6" FHD 144Hz IPS Refresh Rate',
    grade: "فرز أول (Grade A+)",
    battery: "حالة ممتازة 89%",
    warranty: "ضمان 14 يوم تجربة واستبدال فوري",
    stockQuantity: 4,
    isFeatured: true,
    categoryName: "لابات جيمنج"
  },
  {
    name: "Apple MacBook Air M1",
    description: "لابتوب أبل الشهير بمبتكر الشريحة M1 أداء مذهل بدون مراوح وبطارية شغال طوال اليوم بدون ما تحتاج شاحن.",
    imageCover: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80"
    ],
    price: 31000,
    brand: "Apple",
    processor: "Apple Silicon M1 8-Core CPU",
    ram: "8GB Unified Memory",
    storage: "256GB High-Speed SSD",
    gpu: "7-Core GPU / 16-Core Neural Engine",
    screen: '13.3" Retina Display True Tone',
    grade: "كسر زيرو (Like New)",
    battery: "صحة البطارية 94% (عدد دورات شحن قليلة)",
    warranty: "ضمان 14 يوم فحص كامل وشاحن أبل الأصلي",
    stockQuantity: 3,
    isFeatured: true,
    categoryName: "بيزنس وأعمال"
  },
  {
    name: "Dell Latitude 5420 Slim",
    description: "لابتوب طلابي ومكتبي ممتاز وعملي جداً لمهام العمل اليومية والدراسة والشركات ببطارية قوية جداً وشحن سريع.",
    imageCover: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80"
    ],
    price: 15400,
    brand: "Dell",
    processor: "Intel Core i5-1145G7 (11th Gen)",
    ram: "16GB DDR4",
    storage: "256GB NVMe SSD",
    gpu: "Intel Iris Xe Graphics",
    screen: '14.0" Full HD IPS Anti-Glare',
    grade: "فرز أول (Grade A+)",
    battery: "حالة ممتازة 86%",
    warranty: "ضمان 14 يوم تجربة فحص شامل",
    stockQuantity: 10,
    isFeatured: false,
    categoryName: "دراسة ومكتب"
  }
];

async function seed() {
  try {
    await mongoose.connect(`${DB_URL}/${DB_NAME}`);
    console.log("Connected to MongoDB successfully");

    // Find or create admin user for seeding
    let adminUser = await User.findOne();

    if (!adminUser) {
      console.log("No user found. Seeding without admin assignment...");
    }

    const adminId = adminUser ? adminUser._id : new mongoose.Types.ObjectId();

    // Create categories
    const categoriesMap: { [key: string]: mongoose.Types.ObjectId } = {};
    const categoriesNames = ["لابات جيمنج", "بيزنس وأعمال", "برمجة ومونتاج", "دراسة ومكتب"];

    for (const name of categoriesNames) {
      let category = await Category.findOne({ name });
      if (!category) {
        category = await Category.create({
          name,
          description: `أفضل أجهزة اللابتوب الاستيراد مخصصة لـ ${name}`,
          userID: adminId
        });
        console.log(`Created category: ${name}`);
      }
      categoriesMap[name] = category._id as mongoose.Types.ObjectId;
    }

    // Insert sample laptops
    for (const laptop of sampleLaptops) {
      const categoryID = categoriesMap[laptop.categoryName] || Object.values(categoriesMap)[0];
      
      const existingProduct = await Product.findOne({ name: laptop.name });
      if (!existingProduct) {
        await Product.create({
          ...laptop,
          categoryID,
          userID: adminId
        });
        console.log(`Created laptop: ${laptop.name}`);
      } else {
        await Product.updateOne({ name: laptop.name }, { ...laptop, categoryID });
        console.log(`Updated laptop: ${laptop.name}`);
      }
    }

    console.log("✨ Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
