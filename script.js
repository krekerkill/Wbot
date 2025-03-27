function selectBrand(brand) {
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.sendData(JSON.stringify({
            action: "select_brand",
            brand: brand
        }));
    } else {
        alert("Выбран бренд: " + brand); // Для теста вне Telegram
    }
}
