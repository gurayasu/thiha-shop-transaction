let products = [];
let balance = 0;

async function loadProducts() {
  const res = await fetch('/api/products');
  products = await res.json();
  const container = document.getElementById('productList');
  products.forEach((p) => {
    const div = document.createElement('div');
    div.innerHTML = `<label>${p.name} - ¥${p.price} <input type="number" min="0" value="0" data-id="${p.id}" data-price="${p.price}" class="qty"></label>`;
    container.appendChild(div);
  });
}

function updateTotal() {
  let total = 0;
  document.querySelectorAll('.qty').forEach((input) => {
    const qty = Number(input.value);
    const price = Number(input.dataset.price);
    total += qty * price;
  });
  document.getElementById('total').textContent = String(total);
  const totalEl = document.getElementById('total');
  if (balance < total) {
    totalEl.classList.add('over');
  } else {
    totalEl.classList.remove('over');
  }
}

async function loadBalance() {
  const phone = document.getElementById('phone').value.trim();
  if (!phone) return;
  const res = await fetch(`/api/balance/${encodeURIComponent(phone)}`);
  const data = await res.json();
  balance = data.balance;
  document.getElementById('balance').textContent = String(balance);
  updateTotal();
}

document.getElementById('productList').addEventListener('input', updateTotal);

document.getElementById('phone').addEventListener('blur', loadBalance);

document.getElementById('purchaseForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const phone = document.getElementById('phone').value.trim();
  const items = [];
  document.querySelectorAll('.qty').forEach((input) => {
    const qty = Number(input.value);
    if (qty > 0) {
      items.push({ productId: input.dataset.id, quantity: qty });
    }
  });
  let total = 0;
  items.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (product) total += product.price * item.quantity;
  });
  if (balance < total) {
    alert('Insufficient balance');
    return;
  }
  const res = await fetch('/api/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: phone, items }),
  });
  if (res.ok) {
    const data = await res.json();
    balance = data.balance;
    document.getElementById('balance').textContent = String(balance);
    document.querySelectorAll('.qty').forEach((input) => (input.value = '0'));
    updateTotal();
    alert('Purchase recorded');
  } else {
    const err = await res.json();
    alert(err.error || 'Failed to record purchase');
  }
});

loadProducts();
