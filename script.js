// Данные всех товаров (для быстрого просмотра)
const productsData = {
    'iphone15': {
        image: 'https://via.placeholder.com/500x500?text=iPhone+15',
        title: 'iPhone 15',
        description: '6.1" Super Retina XDR, 128GB, Black, 48MP камера, A16 Bionic',
        price: '89 990 ₽'
    },
    'iphone15pro': {
        image: 'https://via.placeholder.com/500x500?text=iPhone+15+Pro',
        title: 'iPhone 15 Pro',
        description: '6.1" Super Retina XDR, 256GB, Titanium, 48MP камера, A17 Pro',
        price: '119 990 ₽'
    },
    'samsungS23Ultra': {
        image: 'https://via.placeholder.com/500x500?text=Samsung+S23+Ultra',
        title: 'Samsung Galaxy S23 Ultra',
        description: '6.8" Dynamic AMOLED, 256GB, Green, 200MP камера, Snapdragon 8 Gen 2',
        price: '99 990 ₽'
    },
    // ... остальные товары (аналогично)
};

// Открытие быстрого просмотра
function showQuickView(productId) {
    const product = productsData[productId];
    if (!product) return;

    const modal = document.getElementById('quickViewModal');
    modal.querySelector('#quickViewImage').src = product.image;
    modal.querySelector('#quickViewTitle').textContent = product.title;
    modal.querySelector('#quickViewDescription').textContent = product.description;
    modal.querySelector('#quickViewPrice').textContent = product.price;

    modal.style.display = 'block';
    document.body.classList.add('no-scroll');
}

// Закрытие быстрого просмотра
document.querySelector('.close-quick-view').addEventListener('click', () => {
    document.getElementById('quickViewModal').style.display = 'none';
    document.body.classList.remove('no-scroll');
});

// Клик по карточке товара (обновлённый код)
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function() {
        const productId = this.getAttribute('onclick').replace("selectProduct('", "").replace("')", "");
        showQuickView(productId);
    });
});

// Фильтры (полный код)
const selectAll = document.getElementById('selectAllBrands');
const brandCheckboxes = document.querySelectorAll('.brand-checkboxes input[type="checkbox"]');
const priceSlider = document.getElementById('priceSlider');
const priceValue = document.getElementById('priceValue');
const resetBtn = document.getElementById('resetFilters');

// Выбрать все бренды
selectAll.addEventListener('change', () => {
    brandCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
});

// Сброс фильтров
resetBtn.addEventListener('click', () => {
    brandCheckboxes.forEach(checkbox => checkbox.checked = true);
    selectAll.checked = true;
    priceSlider.value = 150000;
    priceValue.textContent = '150000 ₽';
    applyFilters(); // Применяем сброс
});

// Применение фильтров
document.getElementById('applyFilters').addEventListener('click', applyFilters);

function applyFilters() {
    const maxPrice = parseInt(priceSlider.value);
    const selectedBrands = Array.from(brandCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    // Прячем/показываем товары
    document.querySelectorAll('.brand-group').forEach(group => {
        const brand = group.dataset.brand;
        if (!selectedBrands.includes(brand)) {
            group.style.display = 'none';
            return;
        }
        group.style.display = 'block';

        // Фильтр по цене внутри бренда
        let hasVisibleProducts = false;
        group.querySelectorAll('.product-card').forEach(card => {
            const price = parseInt(card.dataset.price);
            if (price <= maxPrice) {
                card.style.display = 'block';
                hasVisibleProducts = true;
            } else {
                card.style.display = 'none';
            }
        });

        // Прячем заголовок бренда, если нет товаров
        group.querySelector('.brand-title').style.display = hasVisibleProducts ? 'block' : 'none';
    });

    saveFilters();
}

// Сохранение фильтров
function saveFilters() {
    const filters = {
        brands: Array.from(brandCheckboxes).map(checkbox => checkbox.checked),
        maxPrice: priceSlider.value
    };
    localStorage.setItem('filters', JSON.stringify(filters));
}

// Загрузка фильтров при старте
window.addEventListener('DOMContentLoaded', () => {
    const savedFilters = JSON.parse(localStorage.getItem('filters'));
    if (savedFilters) {
        brandCheckboxes.forEach((checkbox, i) => {
            checkbox.checked = savedFilters.brands[i];
        });
        selectAll.checked = brandCheckboxes.every(checkbox => checkbox.checked);
        priceSlider.value = savedFilters.maxPrice;
        priceValue.textContent = `${savedFilters.maxPrice} ₽`;
    }
    applyFilters(); // Применяем сохранённые фильтры
});
