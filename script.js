function openBrand(brandName) {
    // Можно реализовать:
    // 1. Переход на другую страницу
    // 2. Загрузку товаров через API
    // 3. Отправку данных в Telegram-бота
    
    Telegram.WebApp.sendData(JSON.stringify({
        action: "select_brand",
        brand: brandName
    }));
    
    // Временное уведомление
    Telegram.WebApp.HapticFeedback.impactOccurred('light');
    alert(`Выбран бренд: ${brandName}`);
}
