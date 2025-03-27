// Добавление товара в корзину
function addToCart(name, price) {
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.sendData(JSON.stringify({
            action: "add_to_cart",
            product: name,
            price: price
        }));
    } else {
        alert(`Товар "${name}" добавлен в корзину!\nЦена: ${price} ₽`);
    }
}
