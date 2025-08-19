const ss = SpreadsheetApp.getActive();

function getProducts() {
  const sheet = ss.getSheetByName('Products');
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  return values.map(r => ({
    product_id: r[0],
    name: r[1],
    price: r[2],
  }));
}

function getBalance(phoneNumber) {
  const sheet = ss.getSheetByName('Users');
  if (!sheet) return 0;
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  const phoneIdx = headers.indexOf('phone_number');
  const balanceIdx = headers.indexOf('balance');
  for (let row of values) {
    if (String(row[phoneIdx]) === String(phoneNumber)) {
      return Number(row[balanceIdx]) || 0;
    }
  }
  return 0;
}

function purchase(phoneNumber, productId, quantity) {
  const products = getProducts();
  const product = products.find(p => String(p.product_id) === String(productId));
  if (!product) throw new Error('Product not found');

  quantity = Number(quantity);
  const total = product.price * quantity;

  const usersSheet = ss.getSheetByName('Users');
  const values = usersSheet.getDataRange().getValues();
  const headers = values.shift();
  const phoneIdx = headers.indexOf('phone_number');
  const balanceIdx = headers.indexOf('balance');
  let rowIndex = -1;
  let balance = 0;
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][phoneIdx]) === String(phoneNumber)) {
      rowIndex = i + 2; // account for header
      balance = Number(values[i][balanceIdx]) || 0;
      break;
    }
  }
  if (rowIndex === -1) throw new Error('User not found');
  if (balance < total) throw new Error('Insufficient balance');

  usersSheet.getRange(rowIndex, balanceIdx + 1).setValue(balance - total);

  const transSheet = ss.getSheetByName('Transactions');
  transSheet.appendRow([new Date(), phoneNumber, productId, quantity, total]);

  return { balance: balance - total };
}

function charge(phoneNumber, amount) {
  const usersSheet = ss.getSheetByName('Users');
  const values = usersSheet.getDataRange().getValues();
  const headers = values.shift();
  const phoneIdx = headers.indexOf('phone_number');
  const balanceIdx = headers.indexOf('balance');
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][phoneIdx]) === String(phoneNumber)) {
      const rowIndex = i + 2;
      const balance = (Number(values[i][balanceIdx]) || 0) + Number(amount);
      usersSheet.getRange(rowIndex, balanceIdx + 1).setValue(balance);
      return { balance };
    }
  }
  // user not found - create new
  usersSheet.appendRow([phoneNumber, '', Number(amount)]);
  return { balance: Number(amount) };
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}
