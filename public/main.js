async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const select = document.getElementById('products');
  products.forEach((p) => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = `${p.name} - ¥${p.price}`;
    option.dataset.price = p.price;
    select.appendChild(option);
  });
}

function updateTotal() {
  const select = document.getElementById('products');
  const option = select.value ? select.querySelector(`option[value="${select.value}"]`) : null;
  const total = option ? Number(option.dataset.price) : 0;
  document.getElementById('total').textContent = String(total);
}

document.getElementById('products').addEventListener('change', updateTotal);

document.getElementById('purchaseForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const select = document.getElementById('products');
  const items = [{ productId: select.value, quantity: 1 }];
  await fetch('/api/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  alert('Purchase recorded');
  select.value = '';
  updateTotal();
});

loadProducts();
