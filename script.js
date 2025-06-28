// === URL к products.json на GitHub ===
const PRODUCTS_JSON_URL = 'https://raw.githubusercontent.com/krekerkill/Wbot/refs/heads/main/products.json ';

// === Глобальный объект для хранения данных о товарах ===
const productsData = {};

// ===== ОСНОВНЫЕ ЭЛЕМЕНТЫ =====
const selectAll = document.getElementById('selectAllBrands');
const brandCheckboxes = document.querySelectorAll('.brand-checkboxes input[type="checkbox"]');
const priceSlider = document.getElementById('priceSlider');
const priceValue = document.getElementById('priceValue');
const filterButton = document.getElementById('filterButton');
const filterModal = document.getElementById('filterModal');
const quickViewModal = document.getElementById('quickViewModal');

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
function loadTheme() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        if (themeToggle) themeToggle.textContent = '🌙';
    }
}
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    });
}

// ===== MODAL LOGIC =====
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

// Показ карточки товара
function showQuickView(productId) {
    const product = productsData[productId];
    if (!product) return;

    document.getElementById('quickViewImage').src = product.image.trim();
    document.getElementById('quickViewTitle').textContent = product.title;
    document.getElementById('quickViewDescription').textContent = product.description;
    document.getElementById('quickViewPrice').textContent = product.price + ' ₽';
    document.getElementById('quickViewModal').style.display = 'block';
    document.body.classList.add('no-scroll');
    centerModal(document.getElementById('quickViewModal'));
}

// Закрытие модального окна
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
if (priceSlider && priceValue) {
    priceSlider.addEventListener('input', () => {
        priceValue.textContent = `${priceSlider.value} ₽`;
    });
}

function applyFilters() {
    const maxPrice = parseInt(priceSlider?.value || 150000);
    const selectedBrands = Array.from(document.querySelectorAll('.brand-checkboxes input[type="checkbox"]:checked')).map(cb => cb.value);

    document.querySelectorAll('.brand-group').forEach(group => {
        const brand = group.getAttribute('data-brand');
        const isVisible = selectedBrands.includes(brand);
        group.style.display = isVisible ? 'block' : 'none';

        if (isVisible) {
            let hasVisibleProducts = false;
            group.querySelectorAll('.product-card').forEach(card => {
                const price = parseInt(card.getAttribute('data-price') || 0);
                card.style.display = price <= maxPrice ? 'block' : 'none';
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

// ===== СБРОС ФИЛЬТРОВ =====
resetBtn?.addEventListener('click', () => {
    brandCheckboxes.forEach(cb => cb.checked = true);
    selectAll.checked = true;
    priceSlider.value = '150000';
    priceValue.textContent = '150000 ₽';
    applyFilters();
});

// ===== TELEGRAM INITIALIZATION =====
window.addEventListener('DOMContentLoaded', () => {
    loadProductsFromGitHub(); // загружаем товары с GitHub
    loadFilters();           // восстанавливаем сохранённые фильтры
    loadTheme();             // тема из localStorage

    if (window.Telegram?.WebApp) {
        Telegram.WebApp.expand();
        Telegram.WebApp.enableClosingConfirmation();
    }
});

// ===== ЗАГРУЗКА ТОВАРОВ С GITHUB =====
async function loadProductsFromGitHub() {
    try {
        const response = await fetch(PRODUCTS_JSON_URL);
        if (!response.ok) throw new Error('Не могу загрузить JSON');

        const data = await response.json();

        // Очищаем старые данные
        for (const id in productsData) delete productsData[id];

        // Добавляем новые
        for (const id in data) {
            productsData[id] = data[id];
        }

        renderCatalog(); // рисуем каталог
    } catch (e) {
        console.error('❌ Ошибка загрузки:', e.message);
        document.getElementById('products-container').innerHTML = `
            <div class="error-message">
                ❗ Не удалось загрузить товары. Проверь интернет или файл products.json
            </div>
        `;
    }
}

// ===== ОТОБРАЖЕНИЕ КАТАЛОГА =====
function renderCatalog() {
    const container = document.getElementById('products-container');
    container.innerHTML = ''; // очищаем

    const brandsMap = {};
    for (const id in productsData) {
        const p = productsData[id];
        const brand = p.brand || 'other'; // если нет бренда — other

        if (!brandsMap[brand]) brandsMap[brand] = [];
        brandsMap[brand].push({ id, ...p });
    }

    for (const brand in brandsMap) {
        const group = document.createElement('div');
        group.className = 'brand-group';
        group.setAttribute('data-brand', brand);

        const title = document.createElement('h2');
        title.className = 'brand-title';
        title.textContent = capitalize(brand);
        group.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'products-grid';

        brandsMap[brand].forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.setAttribute('data-id', product.id);
            card.setAttribute('data-price', product.price.replace(/\s/g, ''));
            card.setAttribute('onclick', `showQuickView('${product.id}')`);

            card.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.image.trim()}" alt="${product.title}" loading="lazy">
                </div>
                <div class="product-details">
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                    <div class="price">${product.price}</div>
                </div>
            `;

            grid.appendChild(card);
        });

        group.appendChild(grid);
        container.appendChild(group);
    }

    applyFilters(); // применяем фильтры
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
