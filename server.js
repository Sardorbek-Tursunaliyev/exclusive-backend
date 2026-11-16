import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Bot } from "grammy";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------- MIDDLEWARE (routelardan OLDIN bo'lishi shart) ---------------- //

// CORS: frontend (localhost:5173) dan so'rovlarga ruxsat beradi
app.use(cors());

// POST so'rovlardagi JSON ni o'qish uchun (req.body ishlashi uchun)
app.use(express.json());

// Botni ishga tushirish
const bot = new Bot(process.env.BOT_TOKEN);

// ---------------- MOCK MA'LUMOTLAR ---------------- //

// Kategoriyalar ro'yxati
const categories = [
  { id: 1, title: "Kiyim", image: "/category-img/kiyimla.png" },
  { id: 2, title: "Elektronika", image: "/category-img/elektronika.png" },
  { id: 3, title: "Ayollar kiyimi", image: "/category-img/ayollar.png" },
  { id: 4, title: "Erkaklar kiyimi", image: "/category-img/E-kiyimi.png" },
  { id: 5, title: "Bolalar oyinchog'i", image: "/category-img/B-oyinchiqlar.png" },
];

// Mahsulotlar ro'yxati
const products = [
  {
    id: 1,
    title: "Erkaklar shimlari, chinoslar Duduka Trends",
    price: 120,
    discount_price: 99,
    stars: 4.5,
    review_quantity: 18,
    category: 4,
    description: "100% paxtadan tayyorlangan juda qulay va zamonaviy erkaklar shimi.",
    pictures: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop",
    ],
  },
  {
    id: 2,
    title: "Simsiz quloqchin P9 MAX, mikrofonli",
    price: 55,
    discount_price: 39,
    stars: 4.8,
    review_quantity: 42,
    category: 2,
    description: "Sifatli ovoz va uzoq vaqtga yetadigan batareya.",
    pictures: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop",
    ],
  },
  {
    id: 3,
    title: "Smartfon Samsung Galaxy A05s 128 GB",
    price: 250,
    discount_price: 219,
    stars: 5.0,
    review_quantity: 65,
    category: 2,
    description: "Katta ekran va quvvatli akkumulyator.",
    pictures: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop",
    ],
  },
  {
    id: 4,
    title: "Smartfon Samsung Galaxy A05s 128 GB",
    price: 250,
    discount_price: 219,
    stars: 5.0,
    review_quantity: 65,
    category: 2,
    description: "Katta ekran va quvvatli akkumulyator.",
    pictures: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop",
    ],
  },
  {
    id: 5,
    title: "Smartfon Samsung Galaxy A05s 128 GB",
    price: 250,
    discount_price: 219,
    stars: 5.0,
    review_quantity: 65,
    category: 2,
    description: "Katta ekran va quvvatli akkumulyator.",
    pictures: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop",
    ],
  },
];

// Xotirada buyurtmalarni saqlab turish uchun ro'yxat
const orders = [];

// ---------------- API ENDPOINTLAR ---------------- //

// 1. Server ishlayotganini tekshirish
app.get("/", (req, res) => {
  res.send("🚀 Backend serverimiz 100% ishlayapti!");
});

// 2. Kategoriyalarni qaytaruvchi API
app.get("/product/categories/", (req, res) => {
  res.json(categories);
});

// 3. Mahsulotlarni qaytaruvchi API
app.get("/product/list/", (req, res) => {
  res.json(products);
});

// 4. Buyurtma qabul qilish
app.post("/order", async (req, res) => {
  const { items, name, phone, address, userId } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ ok: false, message: "Savat bo'sh" });
  }

  const newOrder = {
    id: orders.length + 1,
    items,
    name: name || "Noma'lum",
    phone: phone || "Ko'rsatilmagan",
    address: address || "Ko'rsatilmagan",
    userId,
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);

  // Tovarlar ro'yxati matni
  const itemsText = items
    .map((item) => `• ${item.title} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`)
    .join("\n");

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Telegramga yuboriladigan chek
  const messageText = `🛍 YANGI BUYURTMA #${newOrder.id}

👤 Mijoz: ${newOrder.name}
📞 Telefon: ${newOrder.phone}
📍 Manzil: ${newOrder.address}

📦 Tovarlar:
${itemsText}

💰 Jami: $${total.toFixed(2)}`;

  try {
    // Do'kon egasiga (adminga) xabar
    if (process.env.ADMIN_ID) {
      await bot.api.sendMessage(process.env.ADMIN_ID, messageText);
    }

    // Mini App ichidan buyurtma bergan mijozga ham xabar
    if (userId) {
      await bot.api.sendMessage(
        userId,
        `✅ Buyurtmangiz qabul qilindi!\nBuyurtma raqami: #${newOrder.id}\nTez orada siz bilan bog'lanamiz.`
      );
    }
  } catch (error) {
    console.error("Bot xabar yuborishda xatolik:", error.message);
  }

  res.json({ ok: true, orderId: newOrder.id });
});

// ---------------- SERVERNI YOQISH (eng oxirida) ---------------- //
app.listen(PORT, () => {
  console.log(`✅ Server muvaffaqiyatli ishga tushdi: http://localhost:${PORT}`);
});

// Botni ishga tushirish kerak bo'lsa, quyidagi qatorni oching:
// bot.start();