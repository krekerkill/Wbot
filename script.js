// URL к products.json
const PRODUCTS_JSON_URL = 'https://raw.githubusercontent.com/krekerkill/Wbot/refs/heads/main/products.json';

// Глобальный объект для хранения данных о товарах
const productsData = {};

// Основные элементы
const quickViewModal = document.getElementById('quickViewModal');

// Показ карточки товара
function showQuickView(productId) {
    const product = productsData[productId];
    if (!product) return;

    document.getElementById('quickViewImage').src = product.image.trim();
    document.getElementById('quickViewTitle').textContent = product.title;
    document.getElementById('quickViewDescription').textContent = product.description;
    document.getElementById('quickViewPrice').textContent = product.price;
    quickViewModal.style.display = 'block';
    document.body.classList.add('no-scroll');
}

// Закрытие модального окна
document.querySelector('.close-quick-view')?.addEventListener('click', () => {
    quickViewModal.style.display = 'none';
    document.body.classList.remove('no-scroll');
});

quickViewModal?.addEventListener('click', (e) => {
    if (e.target === quickViewModal) {
        quickViewModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
});

// Загрузка товаров с GitHub
async function loadProductsFromGitHub() {
    try {
        const response = await fetch(PRODUCTS_JSON_URL);
        if (!response.ok) throw new Error('Не могу загрузить JSON');

        const data = await response.json();
        Object.assign(productsData, data);
        renderCatalog();
    } catch (e) {
        console.error('Ошибка загрузки:', e);
        document.getElementById('products-container').innerHTML = `
            <div class="error-message">
                ❗ Не удалось загрузить товары. Проверьте интернет или файл products.json
            </div>
        `;
    }
}

// Отрисовка каталога
function renderCatalog() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    const brandsMap = {};
    for (const id in productsData) {
        const product = productsData[id];
        const brand = product.brand || 'other';
        
        if (!brandsMap[brand]) brandsMap[brand] = [];
        brandsMap[brand].push({ id, ...product });
    }

    for (const brand in brandsMap) {
        const group = document.createElement('div');
        group.className = 'brand-group';
        group.setAttribute('data-brand', brand);

        const title = document.createElement('h2');
        title.className = 'brand-title';
        title.textContent = brand.charAt(0).toUpperCase() + brand.slice(1);
        group.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'products-grid';

        brandsMap[brand].forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.onclick = () => showQuickView(product.id);

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
}

// Инициализация
window.addEventListener('DOMContentLoaded', () => {
    loadProductsFromGitHub();
});
