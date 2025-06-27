// Данные для быстрого просмотра
const productsData = {
    'iphone15': {
        image: ' https://via.placeholder.com/500x500?text=iPhone+15',
        title: 'iPhone 15',
        description: '6.1" Super Retina XDR, 128GB, Black, 48MP камера, A16 Bionic',
        price: '89 990 ₽'
    },
    'iphone15pro': {
        image: ' https://via.placeholder.com/500x500?text=iPhone+15+Pro',
        title: 'iPhone 15 Pro',
        description: '6.1" Super Retina XDR, 256GB, Titanium, 48MP камера, A17 Pro',
        price: '119 990 ₽'
    },
    'samsungS23Ultra': {
        image: ' https://via.placeholder.com/500x500?text=Samsung+S23+Ultra',
        title: 'Samsung Galaxy S23 Ultra',
        description: '6.8" Dynamic AMOLED, 256GB, Green, 200MP камера, Snapdragon 8 Gen 2',
        price: '99 990 ₽'
    },
    'samsungS23': {
        image: ' https://via.placeholder.com/500x500?text=Samsung+S23',
        title: 'Samsung Galaxy S23',
        description: '6.1" Dynamic AMOLED, 128GB, Lavender, 50MP камера, Snapdragon 8 Gen 2',
        price: '79 990 ₽'
    },
    'xiaomi13Pro': {
        image: ' https://via.placeholder.com/500x500?text=Xiaomi+13+Pro',
        title: 'Xiaomi 13 Pro',
        description: '6.73" AMOLED, 256GB, White, 50MP камера, Snapdragon 8 Gen 2',
        price: '79 990 ₽'
    },
    'xiaomi13': {
        image: ' https://via.placeholder.com/500x500?text=Xiaomi+13',
        title: 'Xiaomi 13',
        description: '6.36" AMOLED, 128GB, Black, 50MP камера, Snapdragon 8 Gen 2',
        price: '59 990 ₽'
    },
    'tecnoPhantomX2': {
        image: ' https://via.placeholder.com/500x500?text=Tecno+Phantom+X2',
        title: 'Tecno Phantom X2',
        description: '6.8" AMOLED, 256GB, Silver, 64MP камера, Dimensity 9000',
        price: '34 990 ₽'
    },
    'tecnoCamon19': {
        image: ' https://via.placeholder.com/500x500?text=Tecno+Camon+19',
        title: 'Tecno Camon 19',
        description: '6.8" IPS, 128GB, Black, 64MP камера, Helio G85',
        price: '27 990 ₽'
    },
    'honorMagic5Pro': {
        image: ' https://via.placeholder.com/500x500?text=Honor+Magic+5+Pro',
        title: 'Honor Magic 5 Pro',
        description: '6.81" OLED, 256GB, Blue, 50MP камера, Snapdragon 8 Gen 2',
        price: '69 990 ₽'
    },
    'nothingPhone2': {
        image: ' https://via.placeholder.com/500x500?text=Nothing+Phone+2',
        title: 'Nothing Phone 2',
        description: '6.7" OLED, 256GB, White, 50MP камера, Snapdragon 8+ Gen 1',
        price: '54 990 ₽'
    }
};

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function loadTheme() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        body.classList.add('dark-mode');
        if (themeToggle) themeToggle.textContent = '☀️';
    } else {
        body.classList.remove('dark-mode');
        if (themeToggle) themeToggle.textContent = '🌙';
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    });
}

// ===== MODAL LOGIC =====
const filterButton = document.getElementById('filterButton');
const filterModal = document.getElementById('filterModal');
const quickViewModal = document.getElementById('quickViewModal');

function centerModal(modalElement) {
    const modalContent = modalElement?.querySelector('.modal-content, .quick-view-content');
    if (modalContent) {
        modalContent.style.position = 'fixed';
        modalContent.style.top = '50%';
        modalContent.style.left = '50%';
        modalContent.style.transform = 'translate(-50%, -50%)';
    }
}

// Открытие фильтра
if (filterButton && filterModal) {
    filterButton.addEventListener('click', () => {
        filterModal.style.display = 'block';
        document.body.classList.add('no-scroll');
        centerModal(filterModal);
    });

    // Закрытие кликом вне области
    filterModal.addEventListener('click', (e) => {
        const modalContent = filterModal.querySelector('.modal-content');
        if (!modalContent || !modalContent.contains(e.target)) {
            filterModal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }
    });
}

// Показ товара
function showQuickView(productId) {
    const product = productsData[productId];
    if (!product) return;

    const imgEl = document.getElementById('quickViewImage');
    const titleEl = document.getElementById('quickViewTitle');
    const descEl = document.getElementById('quickViewDescription');
    const priceEl = document.getElementById('quickViewPrice');

    if (imgEl) imgEl.src = product.image;
    if (titleEl) titleEl.textContent = product.title;
    if (descEl) descEl.textContent = product.description;
    if (priceEl) priceEl.textContent = product.price;

    quickViewModal.style.display = 'block';
    document.body.classList.add('no-scroll');
    centerModal(quickViewModal);
}

// Закрытие кликом вне окна
document.querySelector('.close-quick-view')?.addEventListener('click', () => {
    quickViewModal.style.display = 'none';
    document.body.classList.remove('no-scroll');
});
quickViewModal?.addEventListener('click', (e) => {
    const modalContent = quickViewModal.querySelector('.quick-view-content');
    if (!modalContent || !modalContent.contains(e.target)) {
        quickViewModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
});

// ===== ФИЛЬТРАЦИЯ =====
const selectAll = document.getElementById('selectAllBrands');
const brandCheckboxes = document.querySelectorAll('.brand-checkboxes input[type="checkbox"]');
const priceSlider = document.getElementById('priceSlider');
const priceValue = document.getElementById('priceValue');

if (selectAll && brandCheckboxes.length > 0) {
    selectAll.addEventListener('change', () => {
        brandCheckboxes.forEach(cb => cb.checked = selectAll.checked);
    });
}

if (priceSlider && priceValue) {
    priceSlider.addEventListener('input', () => {
        priceValue.textContent = `${priceSlider.value} ₽`;
    });
}

function applyFilters() {
    const maxPrice = parseInt(priceSlider?.value || 150000);
    const selectedBrands = Array.from(brandCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    document.querySelectorAll('.brand-group').forEach(group => {
        const brand = group.dataset.brand;
        const isVisible = selectedBrands.includes(brand);
        group.style.display = isVisible ? 'block' : 'none';

        if (isVisible) {
            let hasVisibleProducts = false;
            group.querySelectorAll('.product-card').forEach(card => {
                const price = parseInt(card.dataset.price);
                card.style.display = price <= maxPrice ? 'flex' : 'none';
                if (price <= maxPrice) hasVisibleProducts = true;
            });

            const title = group.querySelector('.brand-title');
            if (title) title.style.display = hasVisibleProducts ? 'block' : 'none';
        }
    });

    saveFilters();
    if (filterModal) filterModal.style.display = 'none';
    document.body.classList.remove('no-scroll');
}

function saveFilters() {
    const filters = {
        brands: Array.from(brandCheckboxes).map(cb => cb.checked),
        maxPrice: priceSlider?.value || 150000
    };
    localStorage.setItem('filters', JSON.stringify(filters));
}

function loadFilters() {
    const savedFilters = JSON.parse(localStorage.getItem('filters'));
    if (savedFilters) {
        brandCheckboxes.forEach((cb, i) => {
            if (savedFilters.brands[i] !== undefined) cb.checked = savedFilters.brands[i];
        });
        selectAll.checked = brandCheckboxes.every(cb => cb.checked);
        if (priceSlider) priceSlider.value = savedFilters.maxPrice || 150000;
        if (priceValue) priceValue.textContent = `${priceSlider?.value || 150000} ₽`;
    }
}

function resetFilters() {
    brandCheckboxes.forEach(cb => cb.checked = true);
    selectAll.checked = true;
    priceSlider.value = 150000;
    priceValue.textContent = '150000 ₽';
    applyFilters();
}

// Привязка кнопок
document.getElementById('applyFilters')?.addEventListener('click', applyFilters);
document.getElementById('resetFilters')?.addEventListener('click', resetFilters);

// ===== TELEGRAM INITIALIZATION =====
window.addEventListener('DOMContentLoaded', () => {
    loadFilters();
    applyFilters();
    loadTheme();

    if (window.Telegram?.WebApp) {
        Telegram.WebApp.expand();
        Telegram.WebApp.enableClosingConfirmation();
    }
});
