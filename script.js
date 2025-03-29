// Управление фильтрами
let currentFilters = {
    brands: ['apple', 'samsung', 'xiaomi', 'tecno'],
    minPrice: 0,
    maxPrice: 150000
};

function toggleFilters() {
    const modal = document.getElementById('filterModal');
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
    } else {
        // Заполняем текущие значения
        document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
            checkbox.checked = currentFilters.brands.includes(checkbox.value);
        });
        document.getElementById('min-price').value = currentFilters.minPrice;
        document.getElementById('max-price').value = currentFilters.maxPrice;
        
        modal.style.display = 'block';
    }
}

function applyFilters() {
    // Получаем новые значения
    currentFilters.brands = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
                                .map(checkbox => checkbox.value);
    currentFilters.minPrice = parseInt(document.getElementById('min-price').value) || 0;
    currentFilters.maxPrice = parseInt(document.getElementById('max-price').value) || 150000;

    // Применяем фильтры
    document.querySelectorAll('.brand-group').forEach(group => {
        const brand = group.getAttribute('data-brand');
        const isBrandVisible = currentFilters.brands.includes(brand);
        
        // Фильтрация товаров
        let hasVisibleProducts = false;
        group.querySelectorAll('.product-card').forEach(card => {
            const price = parseInt(card.getAttribute('data-price'));
            const isPriceInRange = price >= currentFilters.minPrice && 
                                 price <= currentFilters.maxPrice;
            
            card.style.display = (isBrandVisible && isPriceInRange) ? 'block' : 'none';
            if (isBrandVisible && isPriceInRange) hasVisibleProducts = true;
        });
        
        // Показываем/скрываем группу
        group.style.display = isBrandVisible ? 'block' : 'none';
        group.querySelector('.brand-title').style.display = hasVisibleProducts ? 'block' : 'none';
    });
    
    toggleFilters(); // Закрываем модальное окно
}

// Закрытие модального окна
window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('filterModal')) {
        toggleFilters();
    }
});

// Обработчик выбора товара (без изменений)
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

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    applyFilters(); // Применяем фильтры по умолчанию
});
