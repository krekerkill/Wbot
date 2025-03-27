let cart = [];

function addToCart(name, price) {
    cart.push({name, price});
    updateCart();
    Telegram.WebApp.HapticFeedback.impactOccurred('light');
}

function updateCart() {
    // Обновляем счетчик корзины
    document.getElementById('cart-counter').textContent = cart.length;
    
    // Обновляем список товаров в корзине
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${item.name}</span>
            <span>${item.price} ₽</span>
        `;
        cartItems.appendChild(div);
    });
}

function toggleCart() {
    const cart = document.getElementById('cart');
    cart.style.display = cart.style.display === 'block' ? 'none' : 'block';
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
