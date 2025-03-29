// Данные для быстрого просмотра
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
    'samsungS23': {
        image: 'https://via.placeholder.com/500x500?text=Samsung+S23',
        title: 'Samsung Galaxy S23',
        description: '6.1" Dynamic AMOLED, 128GB, Lavender, 50MP камера, Snapdragon 8 Gen 2',
        price: '79 990 ₽'
    },
    'xiaomi13Pro': {
        image: 'https://via.placeholder.com/500x500?text=Xiaomi+13+Pro',
        title: 'Xiaomi 13 Pro',
        description: '6.73" AMOLED, 256GB, White, 50MP камера, Snapdragon 8 Gen 2',
        price: '79 990 ₽'
    },
    'xiaomi13': {
        image: 'https://via.placeholder.com/500x500?text=Xiaomi+13',
        title: 'Xiaomi 13',
        description: '6.36" AMOLED, 128GB, Black, 50MP камера, Snapdragon 8 Gen 2',
        price: '59 990 ₽'
    },
    'tecnoPhantomX2': {
        image: 'https://via.placeholder.com/500x500?text=Tecno+Phantom+X2',
        title: 'Tecno Phantom X2',
        description: '6.8" AMOLED, 256GB, Silver, 64MP камера, Dimensity 9000',
        price: '34 990 ₽'
    },
    'tecnoCamon19': {
        image: 'https://via.placeholder.com/500x500?text=Tecno+Camon+19',
        title: 'Tecno Camon 19',
        description: '6.8" IPS, 128GB, Black, 64MP камера, Helio G85',
        price: '27 990 ₽'
    },
    'honorMagic5Pro': {
        image: 'https://via.placeholder.com/500x500?text=Honor+Magic+5+Pro',
        title: 'Honor Magic 5 Pro',
        description: '6.81" OLED, 256GB, Blue, 50MP камера, Snapdragon 8 Gen 2',
        price: '69 990 ₽'
    },
    'nothingPhone2': {
        image: 'https://via.placeholder.com/500x500?text=Nothing+Phone+2',
        title: 'Nothing Phone 2',
        description: '6.7" OLED, 256GB, White, 50MP камера, Snapdragon 8+ Gen 1',
        price: '54 990 ₽'
    }
};

// ========== ФИЛЬТРЫ ==========
const selectAll = document.getElementById('selectAllBrands');
const brandCheckboxes = document.querySelectorAll('.brand-checkboxes input[type="checkbox"]');
const priceSlider = document.getElementById('priceSlider');
const priceValue = document.getElementById('priceValue');
const filterButton = document.getElementById('filterButton');
const filterModal = document.getElementById('filterModal');
const applyBtn = document.getElementById('applyFilters');
const resetBtn = document.getElementById('resetFilters');

// Открытие/закрытие модалки фильтров
filterButton.addEventListener('click', () => {
    filterModal.style.display = 'block';
    document.body.classList.add('no-scroll');
});

filterModal.addEventListener('click', (e) => {
    if (e.target === filterModal) {
        filterModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
});

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
    applyFilters();
});

// Обновление цены в реальном времени
priceSlider.addEventListener('input', () => {
    priceValue.textContent = `${priceSlider.value} ₽`;
});

// Применение фильтров
function applyFilters() {
    const maxPrice = parseInt(priceSlider.value);
    const selectedBrands = Array.from(brandCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    document.querySelectorAll('.brand-group').forEach(group => {
        const brand = group.dataset.brand;
        if (!selectedBrands.includes(brand)) {
            group.style.display = 'none';
            return;
        }
        group.style.display = 'block';

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

        group.querySelector('.brand-title').style.display = hasVisibleProducts ? 'block' : 'none';
    });

    saveFilters();
    filterModal.style.display = 'none';
    document.body.classList.remove('no-scroll');
}

applyBtn.addEventListener('click', applyFilters);

// Сохранение фильтров
function saveFilters() {
    const filters = {
        brands: Array.from(brandCheckboxes).map(checkbox => checkbox.checked),
        maxPrice: priceSlider.value
    };
    localStorage.setItem('filters', JSON.stringify(filters));
}

// Загрузка фильтров
function loadFilters() {
    const savedFilters = JSON.parse(localStorage.getItem('filters'));
    if (savedFilters) {
        brandCheckboxes.forEach((checkbox, i) => {
            checkbox.checked = savedFilters.brands[i];
        });
        selectAll.checked = brandCheckboxes.every(checkbox => checkbox.checked);
        priceSlider.value = savedFilters.maxPrice;
        priceValue.textContent = `${savedFilters.maxPrice} ₽`;
    }
}

// ========== БЫСТРЫЙ ПРОСМОТР ==========
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

// Закрытие quick-view
document.querySelector('.close-quick-view').addEventListener('click', () => {
    document.getElementById('quickViewModal').style.display = 'none';
    document.body.classList.remove('no-scroll');
});

// Инициализация
window.addEventListener('DOMContentLoaded', () => {
    loadFilters();
    applyFilters();
});
