
// ── CART STATE ───────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// ── CART COUNT BADGE ─────────────────────────────────────────────
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
  const footer    = document.getElementById('cart-footer');

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
  if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
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

// ── INIT (runs on every page) ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  // Close sidebar when clicking the overlay
  const overlay = document.getElementById('cart-overlay');
  if (overlay) overlay.addEventListener('click', closeCart);
});