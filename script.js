// Состояние фильтров
const filters = {
    brands: ['apple', 'samsung', 'xiaomi', 'tecno'],
    minPrice: 0,
    maxPrice: 150000
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Обработчик кнопки фильтра
    document.getElementById('filterButton').addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById('filterModal').style.display = 'block';
        
        // Заполняем текущие значения
        document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
            checkbox.checked = filters.brands.includes(checkbox.value);
        });
        document.getElementById('min-price').value = filters.minPrice;
        document.getElementById('max-price').value = filters.maxPrice;
    });

    // Обработчик применения фильтров
    document.getElementById('applyFilters').addEventListener('click', applyFilters);

    // Закрытие модального окна
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('filterModal');
        if (e.target === modal || e.target.classList.contains('filter-button')) {
            modal.style.display = 'none';
        }
    });

    // Первичная фильтрация
    applyFilters();
});

// Функция применения фильтров
function applyFilters() {
    // Получаем значения
    filters.brands = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
                         .map(checkbox => checkbox.value);
    filters.minPrice = parseInt(document.getElementById('min-price').value) || 0;
    filters.maxPrice = parseInt(document.getElementById('max-price').value) || 150000;

    // Фильтруем товары
    document.querySelectorAll('.brand-group').forEach(group => {
        const brand = group.dataset.brand;
        const shouldShowBrand = filters.brands.includes(brand);
        let hasVisibleProducts = false;

        group.querySelectorAll('.product-card').forEach(card => {
            const price = parseInt(card.dataset.price);
            const shouldShowProduct = price >= filters.minPrice && price <= filters.maxPrice;
            
            card.style.display = shouldShowBrand && shouldShowProduct ? 'block' : 'none';
            if (shouldShowBrand && shouldShowProduct) hasVisibleProducts = true;
        });

        group.style.display = shouldShowBrand ? 'block' : 'none';
        group.querySelector('.brand-title').style.display = hasVisibleProducts ? 'block' : 'none';
    });

    // Закрываем модальное окно
    document.getElementById('filterModal').style.display = 'none';
}

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
