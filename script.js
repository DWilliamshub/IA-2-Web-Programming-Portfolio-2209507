let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(bookTitle, price, image) {
  const existingItem = cart.find(item => item.title === bookTitle);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ title: bookTitle, price, image, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${bookTitle} has been added to your cart!`);
}

function displayCart() {
  const cartContainer = document.getElementById("cart-container");
  const summary = document.getElementById("cart-summary");

  if (!cartContainer) return; // Ensure we’re on cart.html

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <p class="empty-cart">
        Your cart is empty — go explore our 
        <a href="products.html" style="color:#008C8C;">book collection</a>!
      </p>`;
    summary.style.display = "none";
    return;
  }

  summary.style.display = "block";

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("book-card");
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="cart-img">
      <h3>${item.title}</h3>
      <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
      <div class="cart-actions">
        <button class="btn-small" onclick="changeQuantity(${index}, 'increase')">+</button>
        <button class="btn-small" onclick="changeQuantity(${index}, 'decrease')">-</button>
        <button class="btn-small" style="background:#b30000;" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
    cartContainer.appendChild(itemDiv);
  });

  updateTotals();
}

function changeQuantity(index, action) {
  if (action === "increase") {
    cart[index].quantity++;
  } else if (action === "decrease" && cart[index].quantity > 1) {
    cart[index].quantity--;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

function updateTotals() {
  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");

  let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let tax = subtotal * 0.1;
  let total = subtotal + tax;

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

function validateForm(event) {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const errorMsg = document.getElementById("error-message");

  errorMsg.textContent = "";

  if (!name.value.trim() || !email.value.trim()) {
    errorMsg.textContent = "Please fill out all required fields.";
    event.preventDefault();
    return false;
  }

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!emailPattern.test(email.value)) {
    errorMsg.textContent = "Please enter a valid email address.";
    event.preventDefault();
    return false;
  }

  return true;
}

function completeCheckout() {
  alert("Thank you for your purchase! Your order is complete.");
  localStorage.removeItem("cart");
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.contains(document.getElementById("cart-container"))) {
    displayCart();
  }

  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", validateForm);
  }

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", completeCheckout);
  }
});
