// Фильтрация товаров
function filterProducts() {
    const maxPrice = parseInt(document.getElementById('price-slider').value);
    const selectedBrands = Array.from(document.querySelector('.brand-select').selectedOptions)
                               .map(opt => opt.value);
    
    document.querySelectorAll('.brand-group').forEach(group => {
        const brand = group.getAttribute('data-brand');
        const showGroup = selectedBrands.includes(brand);
        group.style.display = showGroup ? 'block' : 'none';
        
        if (showGroup) {
            group.querySelectorAll('.product-card').forEach(card => {
                const price = parseInt(card.getAttribute('data-price'));
                card.style.display = price <= maxPrice ? 'block' : 'none';
            });
        }
    });
    
    document.getElementById('price-value').textContent = maxPrice.toLocaleString() + ' ₽';
}

// Скрытие фильтров при скролле
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const filters = document.querySelector('.filters-container');
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        filters.classList.add('hidden');
    } else {
        filters.classList.remove('hidden');
    }
    lastScroll = currentScroll;
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('price-slider').addEventListener('input', filterProducts);
    document.querySelector('.brand-select').addEventListener('change', filterProducts);
    filterProducts();
});

// Функция выбора товара (без изменений)
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
