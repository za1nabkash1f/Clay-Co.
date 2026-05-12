Clay&Co. — Pottery E-Commerce Platform
A full-stack web application for browsing and purchasing handmade pottery, plus submitting custom orders.
Built with: JavaScript • Bootstrap 5 • Java Servlets • MySQL

⚡ Quick Start
bash# 1. Clone repo
git clone https://github.com/yourusername/clay-and-co.git
cd clay-and-co

# 2. Set up database
mysql -u root -p
CREATE DATABASE clayco;
# Then run schema.sql

# 3. Deploy backend to Tomcat & start frontend
python -m http.server 8000
# Visit http://localhost:8000

Features

🛍️ Browse products with category filtering
🛒 Shopping cart with localStorage persistence
📝 Submit custom pottery orders
📱 Fully responsive design
✅ Form validation & error handling


Project Structure
clay-and-co/
├── index.html, shop.html, custom-order.html    # Pages
├── styles/                                       # CSS
├── scripts/                                      # JS (shop.js, custom-order.js, etc)
├── images/                                       # Assets
└── backend/src/main/java/                        # Servlets
    ├── ShopServlet.java          # GET /api/products
    ├── CustomOrdersServlet.java  # GET/POST /api/custom-orders
    └── DBConnection.java         # Database connection

API Endpoints
EndpointMethodPurpose/api/productsGETFetch all products/api/custom-ordersGETFetch custom orders/api/custom-ordersPOSTSubmit new order
Example:
javascript// Get products
const products = await fetch(`${API}/products`).then(r => r.json());

// Submit custom order
const formData = new URLSearchParams();
formData.append("customerName", "John");
formData.append("productType", "Mug");
// ... etc

await fetch(`${API}/custom-orders`, {
  method: "POST",
  body: formData
});

Database Setup
sqlCREATE DATABASE clayco;

CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  category VARCHAR(100),
  price DECIMAL(10, 2),
  rating DECIMAL(3, 2),
  reviews INT,
  stock INT,
  image VARCHAR(500),
  description TEXT
);

CREATE TABLE custom_orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  product_type VARCHAR(100),
  quantity INT,
  color VARCHAR(255),
  budget VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

How It Works

Frontend fetches products from backend on page load
User browses, filters, and adds items to cart (stored in localStorage)
Custom Orders form submits data via POST request
Backend inserts into database and returns success/error
Gallery reloads to show new custom orders


Tech Stack

Frontend: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5
Backend: Java, Jakarta Servlets, JDBC
Database: MySQL
