let cart = [];

async function fetchProducts() {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQcwrizhut-mmnuFO8Z0aBpUKLVEkr9X7Dj9QAZ2jAzqyqy8PavGJukUEmGYKNkspn01Tiokw4gFcSB/pub?output=csv';
    const response = await fetch(sheetUrl);
    const data = await response.text();
    const rows = data.split('\n').slice(0); // Omite la fila de encabezado
    const productList = document.getElementById('product-list');

    rows.forEach(row => {
        const [name, price, imageUrl] = row.split(',');
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${imageUrl.trim()}" alt="${name}">
            <h3>${name}</h3>
            <p>S/ ${parseFloat(price).toFixed(2)}</p>
            <button onclick="addToCart('${name}', ${parseFloat(price)})">Agregar al Carrito</button>
        `;
        productList.appendChild(productDiv);
    });
}

function addToCart(productName, price) {
    const existingProduct = cart.find(item => item.productName === productName);

    if (existingProduct) {
        existingProduct.quantity++;
        existingProduct.totalPrice += price;
    } else {
        cart.push({ productName, price, quantity: 1, totalPrice: price });
    }
    displayCart();
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.productName} (x${item.quantity}) - S/ ${item.totalPrice.toFixed(2)}`;
        cartItems.appendChild(listItem);
        total += item.totalPrice;
    });

    document.getElementById('total').textContent = `Total: S/ ${total.toFixed(2)}`;
}

function sendWhatsApp() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    let message = '%0AResumen de Compra:%0A';
    let total = 0;

    cart.forEach(item => {
        message += `${item.productName} (x${item.quantity}): S/ ${item.totalPrice.toFixed(2)}%0A`;
        total += item.totalPrice;
    });

    message += `%0A**Total: S/ ${total.toFixed(2)}**`;

    const phoneNumber = '51910010500';
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
}

// Llama a la función para obtener los productos al cargar la página
fetchProducts();
