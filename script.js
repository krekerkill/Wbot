function selectBrand(brand) {
    if (window.Telegram && Telegram.WebApp) {
        // Отправка данных в Telegram-бота
        Telegram.WebApp.sendData(JSON.stringify({
            action: "select_brand",
            brand: brand
        }));
    } else {
        console.log("Выбран бренд:", brand); // Для теста вне Telegram
    }
}
