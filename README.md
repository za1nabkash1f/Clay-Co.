# Clay&Co. — Pottery E-Commerce Platform

A full-stack web application for browsing and purchasing handmade pottery, plus submitting custom orders.

**Built with:** JavaScript • Bootstrap 5 • Java Servlets • MySQL

---

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/clay-and-co.git
cd clay-and-co
```

### 2. Set Up the Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE clayco;
```

Then run the `schema.sql` file.

### 3. Deploy Backend & Start Frontend

Deploy the Java backend to Apache Tomcat, then run:

```bash
python -m http.server 8000
```

Visit:

```text
http://localhost:8000
```

---

## ✨ Features

- 🛍️ Browse products with category filtering
- 🛒 Shopping cart with `localStorage` persistence
- 📝 Submit custom pottery orders
- 📱 Fully responsive design
- ✅ Form validation & error handling

---

## 📁 Project Structure

```text
clay-and-co/
├── index.html
├── shop.html
├── custom-order.html
├── styles/                        # CSS files
├── scripts/                       # JavaScript files
│   ├── shop.js
│   ├── custom-order.js
│   └── ...
├── images/                        # Assets
└── backend/src/main/java/
    ├── ShopServlet.java           # GET /api/products
    ├── CustomOrdersServlet.java   # GET/POST /api/custom-orders
    └── DBConnection.java          # Database connection
```

---

## 🔌 API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/products` | GET | Fetch all products |
| `/api/custom-orders` | GET | Fetch custom orders |
| `/api/custom-orders` | POST | Submit a new custom order |

### Example Usage

#### Fetch Products

```javascript
const products = await fetch(`${API}/products`)
  .then(response => response.json());
```

#### Submit a Custom Order

```javascript
const formData = new URLSearchParams();

formData.append("customerName", "John");
formData.append("productType", "Mug");
// Add additional fields...

await fetch(`${API}/custom-orders`, {
  method: "POST",
  body: formData
});
```

---

## 🗄️ Database Setup

```sql
CREATE DATABASE clayco;

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
```

---

## ⚙️ How It Works

1. Frontend fetches products from the backend on page load
2. Users browse, filter, and add items to cart
3. Cart data is stored using `localStorage`
4. Custom order form submits data via `POST`
5. Backend inserts order data into MySQL
6. Server returns success/error responses
7. Gallery reloads to display new custom orders

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5

### Backend
- Java
- Jakarta Servlets
- JDBC

### Database
- MySQL
