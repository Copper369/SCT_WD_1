// Domino's-style pizza data:
const pizzas = [
  {
    id: 1,
    name: "Hand Tossed Pepperoni",
    desc: "A classic with pepperoni & mozzarella.",
    price: 13.99,
    img: "https://cache.dominos.com/olo/6_158_4/assets/build/market/US/_en/images/builder/pizza/crusts/HANDTOSS.png"
  },
  {
    id: 2,
    name: "Handmade Pan Cheese",
    desc: "Golden & crispy thick crust with cheese.",
    price: 14.99,
    img: "https://cache.dominos.com/olo/6_158_4/assets/build/market/US/_en/images/builder/pizza/crusts/PAN.png"
  },
  {
    id: 3,
    name: "Brooklyn Style",
    desc: "XL slices, foldable, cheesy goodness.",
    price: 15.49,
    img: "https://cache.dominos.com/olo/6_158_4/assets/build/market/US/_en/images/builder/pizza/crusts/BK.png"
  },
  {
    id: 4,
    name: "Thin Crust Veggie",
    desc: "Crispy thin crust, loaded with veggies.",
    price: 13.79,
    img: "https://cache.dominos.com/olo/6_158_4/assets/build/market/US/_en/images/builder/pizza/crusts/THIN.png"
  },
  {
    id: 5,
    name: "Parmesan Stuffed Crust",
    desc: "Cheesy, crispy outside, gooey inside.",
    price: 16.49,
    img: "https://cache.dominos.com/olo/6_158_4/assets/build/market/US/_en/images/builder/pizza/crusts/PSC.png"
  }
];

const pizzaGrid = document.getElementById('pizzaGrid');
const cartModal = document.getElementById('cartModal');
const cartItemsDiv = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartIcon = document.getElementById('cartMenu');
const closeCartBtn = document.getElementById('closeCart');
const cartTotal = document.getElementById('cartTotal');

// Load/persist cart from sessionStorage
let cart = [];
try {
  cart = JSON.parse(sessionStorage.getItem('cart')) || [];
} catch (e) {
  cart = [];
}

function syncCartStorage() {
  sessionStorage.setItem('cart', JSON.stringify(cart));
}

function renderPizzas() {
  pizzaGrid.innerHTML = pizzas.map(pizza => `
    <div class="pizza-card">
      <img class="pizza-img" src="${pizza.img}" alt="${pizza.name}" />
      <h3>${pizza.name}</h3>
      <p class="pizza-desc">${pizza.desc}</p>
      <div class="pizza-price">$${pizza.price.toFixed(2)}</div>
      <button class="add-cart-btn" data-id="${pizza.id}">Add to Cart</button>
    </div>
  `).join('');

  // Attach add-to-cart events
  document.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = Number(e.target.dataset.id);
      addToCart(id);
    });
  });
}

function addToCart(id) {
  const found = cart.find(item => item.id === id);
  if (found) {
    found.qty += 1;
  } else {
    const pizza = pizzas.find(p => p.id === id);
    cart.push({ ...pizza, qty: 1 });
  }
  updateCartDisplay();
  syncCartStorage();
}

function updateCartDisplay() {
  cartCount.textContent = cart.reduce((s, item) => s + item.qty, 0);
  if(cartItemsDiv){
    if(cart.length === 0) {
      cartItemsDiv.innerHTML = '<p>Your cart is empty!</p>';
    } else {
      cartItemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
          <span>${item.name} x${item.qty}</span>
          <button class="cart-remove" data-id="${item.id}">&times;</button>
        </div>
      `).join('');
      document.querySelectorAll('.cart-remove').forEach(btn => {
        btn.addEventListener('click', e => {
          const id = Number(e.target.dataset.id);
          cart = cart.filter(it => it.id !== id);
          updateCartDisplay();
          syncCartStorage();
        });
      });
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
  }
  syncCartStorage();
}
// Cart modal logic
if(cartIcon && cartModal && closeCartBtn){
  cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'flex';
    updateCartDisplay();
  });
  closeCartBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
  });
}
// Render menu grid on menu.html
if(pizzaGrid){
  renderPizzas();
  updateCartDisplay();
}
