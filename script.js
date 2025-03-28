// Функция выбора товара
function selectProduct(productId) {
    const productData = {
        action: "product_selected",
        product_id: productId,
        timestamp: new Date().toISOString()
    };

    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.sendData(JSON.stringify(productData));
    } else {
        console.log("Выбран товар:", productData);
        alert(`Товар ${productId} добавлен в корзину`);
    }
}

// Функция сортировки товаров
function sortProducts(criteria) {
    const container = document.getElementById('products-container');
    const products = Array.from(container.getElementsByClassName('product-card'));
    
    products.sort((a, b) => {
        const priceA = parseFloat(a.getAttribute('data-price'));
        const priceB = parseFloat(b.getAttribute('data-price'));
        
        if (criteria === 'price_asc') return priceA - priceB;
        if (criteria === 'price_desc') return priceB - priceA;
        return 0;
    });

    // Очищаем контейнер
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // Добавляем отсортированные товары
    products.forEach(product => {
        container.appendChild(product);
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log("Каталог товаров загружен");
});
