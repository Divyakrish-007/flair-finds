// Comprehensive automated test suite for Flair Finds
const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 RUNNING COMPLETE FLAIR FINDS TEST SUITE...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  // 1. Health Check
  await test('Server health check', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('Health check failed');
  });

  // 2. Products Catalog & Counts
  await test('Fetch all products (30+ items)', async () => {
    const res = await fetch(`${BASE_URL}/products`);
    const data = await res.json();
    if (data.count < 30) throw new Error(`Expected at least 30 products, got ${data.count}`);
  });

  // 3. Search Engine
  await test('Search query "dress"', async () => {
    const res = await fetch(`${BASE_URL}/products?q=dress`);
    const data = await res.json();
    if (data.products.length === 0) throw new Error('Search for "dress" returned 0 items');
  });

  await test('Search query "Nike"', async () => {
    const res = await fetch(`${BASE_URL}/products?q=Nike`);
    const data = await res.json();
    if (data.products.length === 0 || !data.products.some(p => p.brand.toLowerCase() === 'nike')) {
      throw new Error('Search for "Nike" failed');
    }
  });

  await test('Search query "black"', async () => {
    const res = await fetch(`${BASE_URL}/products?q=black`);
    const data = await res.json();
    if (data.products.length === 0) throw new Error('Search for "black" failed');
  });

  // 4. Filters & Sorting
  await test('Filter by Category (Dresses) and Gender (Women)', async () => {
    const res = await fetch(`${BASE_URL}/products?category=Dresses&gender=Women`);
    const data = await res.json();
    if (!data.products.every(p => p.category === 'Dresses')) throw new Error('Category filter mismatch');
  });

  await test('Filter by Price range (under 2000)', async () => {
    const res = await fetch(`${BASE_URL}/products?maxPrice=2000`);
    const data = await res.json();
    if (!data.products.every(p => p.price <= 2000)) throw new Error('Price filter mismatch');
  });

  await test('Sort by Price: Low to High', async () => {
    const res = await fetch(`${BASE_URL}/products?sortBy=price-low`);
    const data = await res.json();
    for (let i = 0; i < data.products.length - 1; i++) {
      if (data.products[i].price > data.products[i + 1].price) {
        throw new Error('Sorting order incorrect');
      }
    }
  });

  // 5. Product Details & Similar Products
  await test('Get Product Details by ID', async () => {
    const res = await fetch(`${BASE_URL}/products/prod_001`);
    const data = await res.json();
    if (!data.product || data.product.id !== 'prod_001') throw new Error('Product detail fetch failed');
    if (!data.similarProducts || data.similarProducts.length === 0) throw new Error('Similar products missing');
  });

  // 6. User Authentication
  let userToken = '';
  await test('Customer login with demo credentials', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@flairfinds.com', password: 'user123' })
    });
    const data = await res.json();
    if (!data.success || !data.token) throw new Error('Customer login failed');
    userToken = data.token;
  });

  // 7. Cart Flow
  await test('Add item to cart and fetch cart', async () => {
    const addRes = await fetch(`${BASE_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ productId: 'prod_001', quantity: 2, size: 'M', color: 'Emerald Green' })
    });
    const addData = await addRes.json();
    if (!addData.success || addData.cart.length === 0) throw new Error('Add to cart failed');
  });

  // 8. Wishlist Flow
  await test('Toggle wishlist item', async () => {
    const res = await fetch(`${BASE_URL}/wishlist/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ productId: 'prod_014' })
    });
    const data = await res.json();
    if (!data.success) throw new Error('Wishlist toggle failed');
  });

  // 9. Mock Checkout & Order Creation
  let orderId = '';
  await test('Complete mock checkout', async () => {
    const checkoutRes = await fetch(`${BASE_URL}/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        items: [
          {
            productId: 'prod_001',
            productName: 'Floral A-Line Midi Cocktail Dress',
            productImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
            price: 1899,
            quantity: 1,
            size: 'M',
            color: 'Emerald Green',
            source: 'Amazon'
          }
        ],
        shippingAddress: {
          fullName: 'Priya Sharma',
          email: 'user@flairfinds.com',
          phone: '+91 98765 43210',
          address: 'Flat 402, Sunshine Heights',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038'
        },
        paymentMethod: 'UPI',
        subtotal: 1899,
        discount: 0,
        shippingFee: 0,
        total: 1899
      })
    });
    const data = await checkoutRes.json();
    if (!data.success || !data.order?.id) throw new Error('Checkout failed');
    orderId = data.order.id;
  });

  // 10. Order History
  await test('Verify Order History contains placed order', async () => {
    const res = await fetch(`${BASE_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const data = await res.json();
    if (!data.orders.some(o => o.id === orderId)) throw new Error('Placed order not found in history');
  });

  // 11. Customer Review Submission
  await test('Submit product review', async () => {
    const res = await fetch(`${BASE_URL}/reviews/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        productId: 'prod_001',
        rating: 5,
        comment: 'Outstanding quality and fit! Absolutely loved wearing it.',
        userName: 'Priya Sharma'
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error('Review submission failed');
  });

  // 12. AI Chatbot
  await test('Flair AI chatbot natural query "party dress under 2000"', async () => {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'I need a party dress under 2000' })
    });
    const data = await res.json();
    if (!data.success || data.recommendedProducts.length === 0) throw new Error('AI recommendation failed');
  });

  // 13. Outfit Builder
  await test('Build My Outfit 4-piece look generation', async () => {
    const res = await fetch(`${BASE_URL}/ai/build-outfit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        occasion: 'College',
        style: 'Casual',
        budget: 3500,
        preferredColor: 'Black',
        gender: 'Women'
      })
    });
    const data = await res.json();
    if (!data.success || !data.recommendation?.items?.top) throw new Error('Outfit recommendation failed');
  });

  // 14. Admin Operations
  let adminToken = '';
  await test('Admin login and fetch stats', async () => {
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@flairfinds.com', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    adminToken = loginData.token;

    const statsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const statsData = await statsRes.json();
    if (!statsData.success || statsData.stats.totalRevenue <= 0) throw new Error('Admin stats failed');
  });

  await test('Admin update order status to Shipped', async () => {
    const res = await fetch(`${BASE_URL}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'Shipped' })
    });
    const data = await res.json();
    if (!data.success || data.order.status !== 'Shipped') throw new Error('Order status update failed');
  });

  console.log(`\n========================================`);
  console.log(`🎉 TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests();
