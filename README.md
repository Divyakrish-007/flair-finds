# FLAIR FINDS 🛍️✨
> **“Find Your Style. Find Your Flair.”**

A modern, responsive, full-stack fashion-tech e-commerce application powered by an intelligent AI assistant, multi-marketplace aggregation conceptual architecture, personalized outfit recommendations, cart & wishlist management, mock checkout, customer reviews, and a comprehensive admin management dashboard.

---

## 🌟 Key Features

### 1. 🛍️ Dynamic Product Catalog & Shop
* **35+ Curated Fashion Products** across 11 categories: Dresses, Tops, Shirts, T-Shirts, Jeans, Trousers, Shoes, Bags, Watches, Jewellery, and Accessories.
* **Pricing in Indian Rupees (₹)** with realistic original vs discounted prices and discount badges.
* **Multi-Platform Sources**: Conceptual integration showing products from **Amazon**, **Flipkart**, **Meesho**, and **Snapdeal** with official source tags and outbound preview buttons.

### 2. 🔍 Real Working Multi-Field Search
* Real-time search engine querying **Product Name**, **Brand**, **Category**, **Description**, **Tags**, and **Colors**.
* Examples that work instantly:
  * `dress` -> Filters all dress varieties
  * `black` -> Finds all black pieces across categories
  * `Nike` -> Filters Nike sneakers & sportswear
  * `women shoes` -> Finds heels, sandals, and women's footwear
  * `party wear under 2000` -> Discovers party outfits under ₹2,000 budget
* Instant **Clear Search** and intuitive empty states.

### 3. 🎛️ Faceted Filters & Real-Time Sorting
* **Category**: Multiple category checkbox filtering.
* **Gender**: Women, Men, Unisex.
* **Price Ranges**: Under ₹500, ₹500–₹1,000, ₹1,000–₹2,500, ₹2,500–₹5,000, Above ₹5,000.
* **Rating**: 4★ & above, 3★ & above.
* **Brands**: Multi-brand selection.
* **Sorting**: Recommended, Price: Low to High, Price: High to Low, Rating, Newest, Biggest Discount %.

### 4. 🤖 Flair AI Fashion Assistant & Chatbot
* Floating AI Chatbot widget with conversational interface.
* Dedicated **Flair AI Fashion Studio** page (`/ai-stylist`).
* Understands budget constraints, occasion, preferred style, color preferences, and gender.
* Displays **interactive, clickable product recommendation cards right inside chat messages**.
* **Zero-Failure Fallback Engine**: If no external AI key is configured, uses a high-performance rule-based natural language parsing engine.

### 5. 👗 "Build My Outfit" 4-Piece Recommender
* Interactive outfit generator wizard.
* Selects Occasion (College, Party, Formal, Wedding, Casual, Date Night), Style (Chic, Streetwear, Minimalist, Glam), Budget Slider (₹1,500 to ₹12,000), and Color accents.
* Synthesizes a coordinated **Top**, **Bottom**, **Shoes**, and **Accessories** look with AI styling notes.
* **1-Click "Add Entire Outfit to Bag"** button.

### 6. 💖 Persistent Wishlist & 🛒 Shopping Bag
* Interactive heart toggle on all cards and product detail views.
* Move saved items directly to cart.
* Full quantity increment/decrement, tax & shipping calculations (Free shipping over ₹1,500).

### 7. 💳 Simulated Mock Checkout
* Shipping address form (Name, Email, Phone, Address, City, State, Pincode).
* Demo payment methods: **Cash on Delivery**, **UPI**, **Card**.
* Order confirmation generation with unique **Order ID**, **Date**, **Tracking code**, and **Order Item receipts**.

### 8. 🚚 Order History & Real-Time Status Tracking
* **My Orders** page with visual 4-step progress tracker:
  `Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`

### 9. ⭐ Customer Reviews & Ratings
* Live customer reviews with star ratings (1 to 5 stars).
* Verified review submission form updating product average ratings automatically.

### 10. 🛡️ Admin Management Dashboard (`/admin`)
* **Analytics**: Total Revenue, Total Orders, Total Live Products, Total Users, Category revenue & count distribution.
* **Product Management**: Add new products, Edit existing product details/pricing/stock/source, Delete products.
* **Order Management**: View all customer orders and update dispatch status (`Confirmed` -> `Processing` -> `Shipped` -> `Delivered`).
* **User Accounts**: View all registered users and assigned roles.
* **Review Moderation**: View all product reviews and remove inappropriate content.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons |
| **Routing & State** | React Router v7, React Context API (`AuthContext`, `CartContext`, `WishlistContext`) |
| **Backend API** | Node.js, Express 5, TypeScript (`tsx`) |
| **Database** | Persistent JSON / File-Backed Relational Engine (`server/data/flairfinds_db.json`) |
| **Authentication** | JSON Web Tokens (JWT) + bcrypt password hashing |
| **Styling & Design** | Glassmorphism, Dark Mode, Luxury Fashion Gradients, Smooth Animations |

---

## 📂 Project Structure

```
Flairfinds/
├── server/                           # Backend API Server
│   ├── data/
│   │   └── flairfinds_db.json        # Persistent database file
│   ├── src/
│   │   ├── db/
│   │   │   ├── database.ts           # DB methods & CRUD operations
│   │   │   └── seed.ts               # 35+ realistic fashion products & seed accounts
│   │   ├── middleware/
│   │   │   └── auth.ts               # JWT verification & role authorization
│   │   ├── routes/
│   │   │   ├── auth.ts               # /api/auth (Login, Register, Me)
│   │   │   ├── products.ts           # /api/products (Search, Filters, Details)
│   │   │   ├── cart.ts               # /api/cart (Get, Add, Update, Remove)
│   │   │   ├── wishlist.ts           # /api/wishlist (Get, Toggle)
│   │   │   ├── orders.ts             # /api/orders (Checkout, History)
│   │   │   ├── reviews.ts            # /api/reviews (Get, Add)
│   │   │   ├── admin.ts              # /api/admin (Stats, Manage Products & Orders)
│   │   │   └── ai.ts                 # /api/ai (Chatbot, Outfit Builder)
│   │   └── index.ts                  # Express server entry point (Port 5000)
├── src/                              # Frontend React Application
│   ├── components/
│   │   ├── Navbar.tsx                # Sticky navbar with search & badges
│   │   ├── Footer.tsx                # Platform tags, features, newsletter
│   │   ├── ProductCard.tsx           # Product card with badges & actions
│   │   ├── FilterSidebar.tsx         # Category, Gender, Price, Rating filters
│   │   ├── AIChatbot.tsx             # Floating Flair AI widget
│   │   ├── OutfitBuilderModal.tsx    # "Build My Outfit" 4-piece generator
│   │   ├── ReviewSection.tsx         # Customer reviews and star submission
│   │   └── LoadingSkeleton.tsx       # Shimmer loading skeletons
│   ├── context/
│   │   ├── AuthContext.tsx           # User session & auth state
│   │   ├── CartContext.tsx           # Shopping bag & calculations
│   │   └── WishlistContext.tsx       # Saved products & sync
│   ├── pages/
│   │   ├── Home.tsx                  # Landing page with hero & trending grid
│   │   ├── Shop.tsx                  # Full catalog with search & filters
│   │   ├── ProductDetail.tsx         # Product views, size/color selectors
│   │   ├── Cart.tsx                  # Shopping bag & summary
│   │   ├── Checkout.tsx              # Simulated checkout & payment options
│   │   ├── Wishlist.tsx              # Saved styles page
│   │   ├── Orders.tsx                # Order history & status tracking
│   │   ├── Login.tsx                 # Login with 1-click demo shortcuts
│   │   ├── Register.tsx              # Account registration
│   │   ├── Profile.tsx               # Customer profile overview
│   │   ├── AIAssistantPage.tsx       # Dedicated Flair AI Fashion Studio
│   │   └── admin/
│   │       ├── AdminLayout.tsx       # Admin sidebar & layout
│   │       ├── AdminDashboard.tsx    # Analytics & statistics
│   │       ├── AdminProducts.tsx     # Add/Edit/Delete products
│   │       ├── AdminOrders.tsx       # Order fulfillment & status updates
│   │       ├── AdminUsers.tsx        # Registered users list
│   │       └── AdminReviews.tsx      # Review moderation
│   ├── services/
│   │   └── api.ts                    # Axios API client
│   ├── types/
│   │   └── index.ts                  # Data models & interfaces
│   ├── App.tsx                       # React Router configuration
│   ├── index.css                     # Design tokens & styles
│   └── main.tsx                      # Vite React entry point
├── .env.example
├── .env
├── .gitignore
├── package.json
├── vite.config.ts
└── README.md
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
* **Node.js** (v18 or higher recommended, tested on v24)
* **npm** (v9 or higher)

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create or verify your `.env` file (defaults are already configured):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=flairfinds_dev_jwt_secret_2026
GEMINI_API_KEY=
CLIENT_URL=http://localhost:5173
```

### 4. Run Frontend & Backend Simultaneously
```bash
npm run dev
```
* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000](http://localhost:5000)
* **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Pre-Configured Demo Credentials

For seamless testing, the application includes 1-click demo buttons on the login page:

| Role | Email | Password |
|---|---|---|
| **Demo Customer** | `user@flairfinds.com` | `user123` |
| **Demo Admin** | `admin@flairfinds.com` | `admin123` |

---

## 🧪 Testing User Flows

1. **Browsing & Search**:
   * Navigate to **Shop**, type `dress` or `Nike` or `party wear under 2000`.
   * Apply filters (e.g. Category: `Dresses`, Gender: `Women`, Rating: `4★ & above`).
   * Sort by **Price: Low to High** or **Biggest Discount**.
2. **Product Details & Interaction**:
   * Open any product, choose a **Size** and **Color**.
   * Click **Add to Wishlist** and **Add to Cart**.
   * Post a customer review with a 5-star rating.
3. **Cart & Checkout**:
   * View **Shopping Bag**, adjust quantities, and click **Proceed to Checkout**.
   * Fill out the address, select **UPI** / **COD**, and click **Place Mock Order**.
   * View your generated receipt and track status in **My Orders**.
4. **AI Assistant & Outfit Generator**:
   * Click the floating **Flair AI** button or visit **AI Assistant**.
   * Try asking: *"I need a party dress under ₹2000"* or *"Suggest casual outfits for college"*.
   * Click **Build My Outfit**, select an occasion and budget, and click **Add Entire Outfit to Bag**.
5. **Admin Dashboard**:
   * Login as **Demo Admin** (`admin@flairfinds.com`).
   * Access `/admin` to view revenue analytics, add/edit products, and update customer order fulfillment statuses (`Confirmed` ➔ `Shipped` ➔ `Delivered`).

---

## 📜 License
Flair Finds is built for modern fashion retail discovery. All rights reserved.
