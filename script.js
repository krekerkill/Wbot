// Данные для быстрого просмотра
const productsData = {
    'iphone15': {
        image: ' https://via.placeholder.com/500x500?text=iPhone+15',
        title: 'iPhone 15',
        description: '6.1" Super Retina XDR, 128GB, Black, 48MP камера, A16 Bionic',
        price: '89 990 ₽'
    },
    'samsungS23Ultra': {
        image: ' https://via.placeholder.com/500x500?text=Samsung+S23+Ultra',
        title: 'Samsung Galaxy S23 Ultra',
        description: '6.8" Dynamic AMOLED, 256GB, Green, 200MP камера, Snapdragon 8 Gen 2',
        price: '99 990 ₽'
    },
    'xiaomi13Pro': {
        image: ' https://via.placeholder.com/500x500?text=Xiaomi+13+Pro',
        title: 'Xiaomi 13 Pro',
        description: '6.73" AMOLED, 256GB, White, 50MP камера, Snapdragon 8 Gen 2',
        price: '79 990 ₽'
    },
    'tecnoPhantomX2': {
        image: ' https://via.placeholder.com/500x500?text=Tecno+Phantom+X2',
        title: 'Tecno Phantom X2',
        description: '6.8" AMOLED, 256GB, Silver, 64MP камера, Dimensity 9000',
        price: '34 990 ₽'
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

// ===== DOM Elements =====
const selectAll = document.getElementById('selectAllBrands');
const brandCheckboxes = document.querySelectorAll('.brand-checkboxes input[type="checkbox"]');
const priceSlider = document.getElementById('priceSlider');
const priceValue = document.getElementById('priceValue');
const filterButton = document.getElementById('filterButton');
const filterModal = document.getElementById('filterModal');
const applyBtn = document.getElementById('applyFilters');
const quickViewModal = document.getElementById('quickViewModal');

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function loadTheme() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    } else {
        body.classList.remove('dark-mode');
        themeToggle.textContent = '🌙';
    }
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    themeToggle.textContent = isDark ? '☀️' : '🌙';
});

// ===== MODAL LOGIC =====
function centerModal(modalElement) {
    const modalContent = modalElement.querySelector('.modal-content, .quick-view-content');
    if (modalContent) {
        modalContent.style.position = 'fixed';
        modalContent.style.top = '50%';
        modalContent.style.left = '50%';
        modalContent.style.transform = 'translate(-50%, -50%)';
    }
}

filterButton.addEventListener('click', () => {
    filterModal.style.display = 'block';
    document.body.classList.add('no-scroll');
    centerModal(filterModal);
});

filterModal.addEventListener('click', (e) => {
    if (e.target === filterModal) {
        filterModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
});

function showQuickView(productId) {
    const product = productsData[productId];
    if (!product) return;
    document.getElementById('quickViewImage').src = product.image;
    document.getElementById('quickViewTitle').textContent = product.title;
    document.getElementById('quickViewDescription').textContent = product.description;
    document.getElementById('quickViewPrice').textContent = product.price;
    quickViewModal.style.display = 'block';
    document.body.classList.add('no-scroll');
    centerModal(quickViewModal);
}

document.querySelector('.close-quick-view').addEventListener('click', () => {
    quickViewModal.style.display = 'none';
    document.body.classList.remove('no-scroll');
});

quickViewModal.addEventListener('click', (e) => {
    if (e.target === quickViewModal) {
        quickViewModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
});

// ===== FILTERS =====
selectAll.addEventListener('change', () => {
    brandCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
});

priceSlider.addEventListener('input', () => {
    priceValue.textContent = `${priceSlider.value} ₽`;
});

function applyFilters() {
    const maxPrice = parseInt(priceSlider.value);
    const selectedBrands = Array.from(brandCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    document.querySelectorAll('.brand-group').forEach(group => {
        const brand = group.dataset.brand;
        const isVisible = selectedBrands.includes(brand);
        group.style.display = isVisible ? 'block' : 'none';
        if (isVisible) {
            let hasVisibleProducts = false;
            group.querySelectorAll('.product-card').forEach(card => {
                const price = parseInt(card.dataset.price);
                card.style.display = price <= maxPrice ? 'block' : 'none';
                if (price <= maxPrice) hasVisibleProducts = true;
            });
            group.querySelector('.brand-title').style.display = hasVisibleProducts ? 'block' : 'none';
        }
    });

    saveFilters();
    filterModal.style.display = 'none';
    document.body.classList.remove('no-scroll');
}

applyBtn.addEventListener('click', applyFilters);

function saveFilters() {
    const filters = {
        brands: Array.from(brandCheckboxes).map(cb => cb.checked),
        maxPrice: priceSlider.value
    };
    localStorage.setItem('filters', JSON.stringify(filters));
}

function loadFilters() {
    const savedFilters = JSON.parse(localStorage.getItem('filters'));
    if (savedFilters) {
        brandCheckboxes.forEach((checkbox, i) => {
            checkbox.checked = savedFilters.brands[i] || true;
        });
        selectAll.checked = brandCheckboxes.every(cb => cb.checked);
        priceSlider.value = savedFilters.maxPrice || 150000;
        priceValue.textContent = `${priceSlider.value} ₽`;
    }
}

// ===== INITIALIZATION =====
window.addEventListener('DOMContentLoaded', () => {
    loadFilters();
    applyFilters();
    loadTheme();
    if (window.Telegram?.WebApp) {
        Telegram.WebApp.expand();
        Telegram.WebApp.enableClosingConfirmation();
    }
});
