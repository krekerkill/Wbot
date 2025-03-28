// Обработка выбора товара
function selectProduct(productId) {
    const productData = {
        action: "product_selected",
        product_id: productId,
        timestamp: Date.now()
    };
    
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.sendData(JSON.stringify(productData));
        Telegram.WebApp.close();
    } else {
        console.log("Product selected:", productData);
    }
}

// Сортировка товаров
function sortProducts(criteria) {
    const container = document.getElementById('products-container');
    const products = Array.from(container.children);
    
    products.sort((a, b) => {
        const aPrice = parseFloat(a.dataset.price);
        const bPrice = parseFloat(b.dataset.price);
        
        return criteria === 'price_asc' ? aPrice - bPrice : bPrice - aPrice;
    });
    
    products.forEach(product => container.appendChild(product));
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Можно добавить дополнительную логику инициализации
});
