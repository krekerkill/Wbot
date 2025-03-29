// Управление кнопкой фильтра
let lastScroll = 0;
const filterButton = document.getElementById('filterButton');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 200) {
        // Скролл вниз - скрываем
        filterButton.classList.add('hidden');
    } else {
        // Скролл вверх - показываем
        filterButton.classList.remove('hidden');
    }
    lastScroll = currentScroll;
});

// Модальное окно
const filterModal = document.getElementById('filterModal');
const applyButton = document.getElementById('applyFilters');

document.getElementById('filterButton').addEventListener('click', () => {
    filterModal.style.display = 'block';
});

document.addEventListener('click', (e) => {
    if (e.target === filterModal) {
        filterModal.style.display = 'none';
    }
});

// Фильтрация
function applyFilters() {
    const selectedBrands = Array.from(
        document.querySelectorAll('input[name="brand"]:checked')
    ).map(el => el.value);
    
    const maxPrice = parseInt(document.getElementById('price-slider').value);

    document.querySelectorAll('.brand-group').forEach(group => {
        const brand = group.dataset.brand;
        const shouldShow = selectedBrands.includes(brand);
        
        group.style.display = shouldShow ? 'block' : 'none';
    });

    filterModal.style.display = 'none';
}

applyButton.addEventListener('click', applyFilters);

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
        alert(`Товар ${productId} добавлен в корзину`);
    }
}
