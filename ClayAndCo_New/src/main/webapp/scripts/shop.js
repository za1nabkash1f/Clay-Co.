let products = [];



// ── CART STATE ───────────────────────────────────────────────────

let cart = JSON.parse(localStorage.getItem('cart') || '[]');

let currentProduct = null;

let currentQty = 1;



function saveCart() {

  localStorage.setItem('cart', JSON.stringify(cart));

}



// ── CART COUNT ───────────────────────────────────────────────────

function updateCartCount() {

  const total = cart.reduce((sum, item) => sum + item.quantity, 0);

  const badge = document.getElementById('cart-count');

  if (!badge) return;

  badge.textContent = total;

  badge.style.display = total > 0 ? 'flex' : 'none';

}



// ── CART SIDEBAR ─────────────────────────────────────────────────

function openCart(e) {

  if (e) e.preventDefault();

  document.getElementById('cart-sidebar').classList.add('open');

  document.getElementById('cart-overlay').classList.add('active');

  renderCartItems();

}



function closeCart() {

  document.getElementById('cart-sidebar').classList.remove('open');

  document.getElementById('cart-overlay').classList.remove('active');

}



function renderCartItems() {

  const container = document.getElementById('cart-items-container');

  const footer = document.getElementById('cart-footer');



  if (cart.length === 0) {

    container.innerHTML = `

      <div class="cart-empty">

        <i class="fa-solid fa-cart-shopping"></i>

        <p>Your cart is empty</p>

        <span>Add some beautiful pieces to get started</span>

      </div>`;

    footer.style.display = 'none';

    return;

  }



  footer.style.display = 'flex';



  container.innerHTML = cart.map(item => `

    <div class="cart-item">

      <img class="cart-item-img" src="${item.image}" alt="${item.name}" />

      <div>

        <div class="cart-item-name">${item.name}</div>

        <div class="cart-item-price">$${item.price}</div>

        <div class="cart-item-qty">

          <button class="cart-item-qty-btn" onclick="updateCartQty(${item.id}, -1)">−</button>

          <span class="cart-item-qty-num">${item.quantity}</span>

          <button class="cart-item-qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>

        </div>

      </div>

      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">

        <i class="fa-solid fa-xmark"></i>

      </button>

    </div>

  `).join('');



  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  document.getElementById('cart-total').textContent = `$${total}`;

}



function updateCartQty(id, change) {

  const item = cart.find(i => i.id === id);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {

    cart = cart.filter(i => i.id !== id);

  }

  saveCart();

  updateCartCount();

  renderCartItems();

}



function removeFromCart(id) {

  cart = cart.filter(i => i.id !== id);

  saveCart();

  updateCartCount();

  renderCartItems();

}



// ── ADD TO CART ──────────────────────────────────────────────────

function addToCartFromModal() {

  if (!currentProduct) return;



  const existing = cart.find(i => i.id === currentProduct.id);

  if (existing) {

    existing.quantity += currentQty;

  } else {

    cart.push({

      id: currentProduct.id,

      name: currentProduct.name,

      price: currentProduct.price,

      image: currentProduct.image,

      quantity: currentQty

    });

  }



  saveCart();

  updateCartCount();



  // Close product modal and open cart

  bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();

  setTimeout(() => openCart(), 300);

}



// ── QUANTITY SELECTOR ────────────────────────────────────────────

function changeQty(change) {

  currentQty = Math.max(1, currentQty + change);

  document.getElementById('qty-display').textContent = currentQty;

}



// ── PRODUCT MODAL ────────────────────────────────────────────────

function openProduct(id) {

  const product = products.find(p => p.id === id);

  if (!product) return;



  currentProduct = product;

  currentQty = 1;

  document.getElementById('qty-display').textContent = '1';



  document.getElementById('modal-img').src = product.image;

  document.getElementById('modal-img').alt = product.name;

  document.getElementById('modal-category').textContent = product.category;

  document.getElementById('modal-name').textContent = product.name;

  document.getElementById('modal-price').textContent = `$${product.price}`;

  document.getElementById('modal-desc').textContent = product.description;

  document.getElementById('modal-rating').innerHTML = `

    <i class="fa-solid fa-star"></i> ${product.rating} · ${product.reviews} reviews

  `;



  // Stock indicator

  const stockEl = document.getElementById('modal-stock');

  if (product.stock === 0) {

    stockEl.innerHTML = `<span class="stock-out">Out of stock</span>`;

  } else if (product.stock <= 3) {

    stockEl.innerHTML = `<span class="stock-low">Only ${product.stock} left</span>`;

  } else {

    stockEl.innerHTML = `<span class="stock-ok">In stock</span>`;

  }



  // Disable add button if out of stock

  const addBtn = document.querySelector('.modal-add-btn');

  if (product.stock === 0) {

    addBtn.disabled = true;

    addBtn.style.opacity = '0.5';

    addBtn.innerHTML = 'OUT OF STOCK';

  } else {

    addBtn.disabled = false;

    addBtn.style.opacity = '1';

    addBtn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> ADD TO CART';

  }



  new bootstrap.Modal(document.getElementById('productModal')).show();

}



// ── PRODUCT GRID ─────────────────────────────────────────────────

function renderProducts(filter = 'all') {

  const grid = document.getElementById('productGrid');

  grid.innerHTML = '';



  const filtered = filter === 'all'

    ? products

    : products.filter(p => p.category === filter);



  if (filtered.length === 0) {

    grid.innerHTML = `

      <div class="empty-state">

        <i class="fa-solid fa-box-open"></i>

        <p>No products found</p>

        <span>Try selecting a different category</span>

      </div>`;

    return;

  }



  filtered.forEach(product => {

    const stockBadge = product.stock === 0

      ? `<div class="product-stock-badge">Out of Stock</div>`

      : product.stock <= 3

        ? `<div class="product-stock-badge">Only ${product.stock} left</div>`

        : '';



    const card = document.createElement('div');

    card.className = 'product-card';

    card.innerHTML = `

      <div class="product-card-img-wrapper">

        <img

          class="product-card-img"

          src="${product.image}"

          alt="${product.name}"

          onclick="openProduct(${product.id})"

          style="cursor:pointer;"

        />

        ${stockBadge}

      </div>

      <div style="padding: 0 2px;">

        <div class="product-card-name" onclick="openProduct(${product.id})" style="cursor:pointer;">

          ${product.name}

        </div>

        <div class="product-card-category">${product.category}</div>

        <div class="product-card-footer">

          <span class="product-card-price">$${product.price}</span>

          <span class="product-card-rating">

            <i class="fa-solid fa-star"></i> ${product.rating} (${product.reviews})

          </span>

        </div>

        <button class="add-to-cart-btn" onclick="openProduct(${product.id})">

          <i class="fa-solid fa-cart-shopping"></i> ADD TO CART

        </button>

      </div>

    `;

    grid.appendChild(card);

  });

}



// ── FILTERS ──────────────────────────────────────────────────────

function filterProducts(category, btn) {

  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));

  btn.classList.add('active');

  renderProducts(category);

}



// ── INIT ─────────────────────────────────────────────────────────

fetch(`${API}/products`, { credentials: "include" })
  .then(res => res.json())
  .then(data => {
    products = data;
    renderProducts();
    updateCartCount();
  })
  .catch(err => console.error('Failed to load products:', err));

updateCartCount();







