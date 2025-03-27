let cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    Telegram.WebApp.HapticFeedback.impactOccurred('light');
}

function checkout() {
    Telegram.WebApp.sendData(JSON.stringify({
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0)
    }));
}