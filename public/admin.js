async function loadSales() {
  const res = await fetch('/api/sales');
  const summary = await res.json();
  const tbody = document.getElementById('salesBody');
  Object.entries(summary).forEach(([productId, qty]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${productId}</td><td>${qty}</td>`;
    tbody.appendChild(tr);
  });
}

loadSales();
