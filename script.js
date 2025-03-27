let cart = [];

function addToCart(name, price) {
    cart.push({name, price});
    alert(`${name} добавлен в корзину!`);
    updateCart();
}

function updateCart() {
    const cartDiv = document.getElementById('cart-items');
    cartDiv.innerHTML = '';
    
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `${item.name} - ${item.price}$`;
        cartDiv.appendChild(itemDiv);
    });
    
    if (cart.length > 0) {
        document.getElementById('cart').style.display = 'block';
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    Telegram.WebApp.sendData(JSON.stringify({
        items: cart,
        total: total
    }));
}
