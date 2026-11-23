export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Exclusive App API",
    version: "1.0.0",
    description: "Exclusive elektron do'koni uchun REST API va Swagger hujjatlari",
    contact: {
      name: "Exclusive Developer",
    },
  },
  servers: [
    {
      url: "/",
      description: "Joriy server",
    },
  ],
  components: {
    securitySchemes: {
      AdminKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-admin-key",
        description: "Admin amallari uchun maxfiy kalit (x-admin-key)",
      },
    },
    schemas: {
      Category: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Kiyim" },
          image: { type: "string", example: "/category-img/kiyimla.png" },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string", example: "67370a1b2c3d4e5f6a7b8c9d" },
          title: { type: "string", example: "Erkaklar shimlari, chinoslar Duduka Trends" },
          price: { type: "number", example: 120 },
          discount_price: { type: "number", example: 99 },
          stars: { type: "number", example: 4.5 },
          review_quantity: { type: "integer", example: 18 },
          category: { type: "integer", example: 4 },
          description: { type: "string", example: "100% paxtadan tayyorlangan juda qulay shim." },
          pictures: {
            type: "array",
            items: { type: "string" },
            example: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop"],
          },
        },
      },
      ProductInput: {
        type: "object",
        required: ["title", "price"],
        properties: {
          title: { type: "string", example: "Simsiz quloqchin P9 MAX" },
          price: { type: "number", example: 55 },
          discount_price: { type: "number", example: 39 },
          category: { type: "integer", example: 2 },
          description: { type: "string", example: "Sifatli ovoz va uzoq vaqtga yetadigan batareya." },
          pictures: {
            type: "array",
            items: { type: "string" },
            example: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop"],
          },
        },
      },
      Banner: {
        type: "object",
        properties: {
          id: { type: "string", example: "67370a1b2c3d4e5f6a7b8c9e" },
          image: { type: "string", example: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop" },
          title: { type: "string", example: "Quloqchinlar aksiyasi" },
          link: { type: "string", example: "/catalog" },
          order: { type: "integer", example: 1 },
          active: { type: "boolean", example: true },
        },
      },
      BannerInput: {
        type: "object",
        required: ["image"],
        properties: {
          image: { type: "string", example: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop" },
          title: { type: "string", example: "Yangi banner" },
          link: { type: "string", example: "/catalog" },
          order: { type: "integer", example: 1 },
          active: { type: "boolean", default: true, example: true },
        },
      },
      OrderItem: {
        type: "object",
        required: ["title", "price", "quantity"],
        properties: {
          title: { type: "string", example: "Smartfon Samsung Galaxy A05s" },
          price: { type: "number", example: 219 },
          quantity: { type: "integer", example: 1 },
        },
      },
      OrderInput: {
        type: "object",
        required: ["items"],
        properties: {
          name: { type: "string", example: "Akmal Karimov" },
          phone: { type: "string", example: "+998901234567" },
          address: { type: "string", example: "Toshkent shahri, Yunusobod tumani" },
          userId: { type: "integer", example: 123456789, description: "Telegram foydalanuvchi ID raqami" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItem" },
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean", example: false },
          message: { type: "string", example: "Xatolik haqida xabar" },
        },
      },
    },
  },
  tags: [
    { name: "Products", description: "Mahsulotlar bilan ishlash" },
    { name: "Categories", description: "Kategoriyalar ro'yxati" },
    { name: "Banners", description: "Bosh sahifa reklama bannerlari" },
    { name: "Orders", description: "Buyurtma berish va Telegram integratsiyasi" },
  ],
  paths: {
    "/product/list/": {
      get: {
        tags: ["Products"],
        summary: "Barcha mahsulotlar ro'yxatini olish",
        responses: {
          200: {
            description: "Mahsulotlar ro'yxati muvaffaqiyatli qaytarildi",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
          500: {
            description: "Server xatosi",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/product/": {
      post: {
        tags: ["Products"],
        summary: "Yangi mahsulot qo'shish (Faqat Admin)",
        security: [{ AdminKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Mahsulot muvaffaqiyatli yaratildi",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          400: {
            description: "Noto'g'ri ma'lumot",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Admin ruxsati yo'q (x-admin-key xato yoki ko'rsatilmagan)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/product/{id}": {
      delete: {
        tags: ["Products"],
        summary: "Mahsulotni o'chirish (Faqat Admin)",
        security: [{ AdminKeyAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "O'chiriladigan mahsulot ID si",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Mahsulot o'chirildi",
            content: {
              "application/json": {
                example: { ok: true },
              },
            },
          },
          400: {
            description: "ID formati noto'g'ri",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Admin ruxsati yo'q",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Mahsulot topilmadi",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/product/categories/": {
      get: {
        tags: ["Categories"],
        summary: "Kategoriyalar ro'yxatini olish",
        responses: {
          200: {
            description: "Kategoriyalar ro'yxati",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Category" },
                },
              },
            },
          },
        },
      },
    },
    "/banner/list/": {
      get: {
        tags: ["Banners"],
        summary: "Faol bannerlar ro'yxatini olish",
        responses: {
          200: {
            description: "Bannerlar ro'yxati",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Banner" },
                },
              },
            },
          },
          500: {
            description: "Server xatosi",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/banner/": {
      post: {
        tags: ["Banners"],
        summary: "Yangi banner qo'shish (Faqat Admin)",
        security: [{ AdminKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BannerInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Banner muvaffaqiyatli yaratildi",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Banner" },
              },
            },
          },
          400: {
            description: "Noto'g'ri ma'lumot",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Admin ruxsati yo'q",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/banner/{id}": {
      delete: {
        tags: ["Banners"],
        summary: "Bannerni o'chirish (Faqat Admin)",
        security: [{ AdminKeyAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "O'chiriladigan banner ID si",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Banner o'chirildi",
            content: {
              "application/json": {
                example: { ok: true },
              },
            },
          },
          400: {
            description: "ID formati noto'g'ri",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Admin ruxsati yo'q",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Banner topilmadi",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/order": {
      post: {
        tags: ["Orders"],
        summary: "Yangi buyurtma yuborish (Savat)",
        description: "Buyurtmani bazaga saqlaydi va Telegram orqali do'kon egasiga hamda xaridorga xabar yuboradi.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/OrderInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Buyurtma muvaffaqiyatli qabul qilindi",
            content: {
              "application/json": {
                example: { ok: true, orderId: 1 },
              },
            },
          },
          400: {
            description: "Savat bo'sh yoki ma'lumotlar yetarli emas",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: {
            description: "Buyurtmani saqlashda server xatosi",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
};
