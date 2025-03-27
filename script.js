let cart = [];

function selectItem(name, price) {
    cart.push({ name, price });
    updateCart();
}

function updateCart() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('total-price').textContent = `${total} ₽`;
}

function sendOrder() {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }

    const order = {
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0)
    };

    // Отправка данных в Telegram-бота
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.sendData(JSON.stringify(order));
    } else {
        alert(`Заказ оформлен!\n${JSON.stringify(order, null, 2)}`);
    }
}
