document.getElementById('chargeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const phone = document.getElementById('phone').value.trim();
  const amount = Number(document.getElementById('amount').value);
  const res = await fetch('/api/charge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: phone, amount }),
  });
  if (res.ok) {
    alert('Charged');
    document.getElementById('amount').value = '';
  } else {
    const err = await res.json();
    alert(err.error || 'Failed to charge');
  }
});
