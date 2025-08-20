let products = [];
let balance = 0;

async function loadProducts() {
  const res = await fetch('/api/products');
  products = await res.json();
  addProductSelect();
}

function addProductSelect() {
  const container = document.getElementById('productList');
  const div = document.createElement('div');
  const select = document.createElement('select');
  select.className = 'product-select border rounded px-2 py-1 w-full';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '選択';
  select.appendChild(placeholder);
  products.forEach((p) => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.name} ¥${p.price}`;
    select.appendChild(opt);
  });
  select.addEventListener('change', updateTotal);
  div.appendChild(select);
  container.appendChild(div);
}

function updateTotal() {
  let total = 0;
  document.querySelectorAll('.product-select').forEach((sel) => {
    const id = sel.value;
    if (id) {
      const product = products.find((p) => p.id === id);
      if (product) total += product.price;
    }
  });
  const totalEl = document.getElementById('total');
  totalEl.textContent = String(total);
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

document.getElementById('addProduct').addEventListener('click', addProductSelect);
document.getElementById('phone').addEventListener('blur', loadBalance);

document.getElementById('purchaseForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const phone = document.getElementById('phone').value.trim();
  const itemsMap = new Map();
  document.querySelectorAll('.product-select').forEach((sel) => {
    const id = sel.value;
    if (id) {
      itemsMap.set(id, (itemsMap.get(id) || 0) + 1);
    }
  });
  const items = Array.from(itemsMap.entries()).map(([productId, quantity]) => ({ productId, quantity }));
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
    document.getElementById('productList').innerHTML = '';
    addProductSelect();
    updateTotal();
    alert('Purchase recorded');
  } else {
    const err = await res.json();
    alert(err.error || 'Failed to record purchase');
  }
});

loadProducts();
