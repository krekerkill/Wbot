// === URL к products.json с параметром избежания кэширования ===
const PRODUCTS_JSON_URL = `https://raw.githubusercontent.com/krekerkill/Wbot/main/products.json?t=${Date.now()}`;

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

// ... (остальной код темы остается без изменений) ...

// ===== ЗАГРУЗКА ТОВАРОВ С GITHUB =====
async function loadProductsFromGitHub() {
    try {
        // Показываем индикатор загрузки
        document.getElementById('products-container').innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Загрузка товаров...</p>
            </div>
        `;
        
        const response = await fetch(PRODUCTS_JSON_URL, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
        if (!response.ok) throw new Error('Не могу загрузить JSON');

        const data = await response.json();

        // Очищаем старые данные
        for (const id in productsData) delete productsData[id];

        // Добавляем новые с проверкой изображений
        for (const id in data) {
            productsData[id] = data[id];
            // Проверяем и корректируем URL изображения
            if (!productsData[id].image.startsWith('http')) {
                productsData[id].image = 'https://via.placeholder.com/500x500?text=No+Image';
            }
            productsData[id].image = productsData[id].image.trim();
        }

        renderCatalog(); // рисуем каталог
        startAutoRefresh(); // запускаем автообновление
    } catch (e) {
        console.error('❌ Ошибка загрузки:', e.message);
        document.getElementById('products-container').innerHTML = `
            <div class="error-message">
                ❗ Не удалось загрузить товары. Проверьте интернет или файл products.json
                <button onclick="loadProductsFromGitHub()">Повторить попытку</button>
            </div>
        `;
    }
}

// ===== АВТООБНОВЛЕНИЕ ДАННЫХ =====
let refreshInterval;
function startAutoRefresh() {
    // Очищаем предыдущий интервал, если был
    if (refreshInterval) clearInterval(refreshInterval);
    
    // Устанавливаем новый интервал (каждые 30 секунд)
    refreshInterval = setInterval(() => {
        loadProductsFromGitHub();
    }, 30000);
}

// ===== ОТОБРАЖЕНИЕ КАТАЛОГА =====
function renderCatalog() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = ''; // очищаем

    const brandsMap = {};
    for (const id in productsData) {
        const p = productsData[id];
        const brand = p.brand?.toLowerCase() || 'other'; // нормализуем бренд

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
            
            // Обрабатываем цену для фильтрации
            const priceNum = parseInt(product.price.replace(/\D/g, '')) || 0;
            card.setAttribute('data-price', priceNum);
            
            card.onclick = () => showQuickView(product.id);

            card.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.title}" 
                         loading="lazy" 
                         onerror="this.src='https://via.placeholder.com/500x500?text=No+Image'">
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

// ... (остальной код остается без изменений) ...

// Инициализация при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    loadProductsFromGitHub(); // загружаем товары с GitHub
    loadFilters();           // восстанавливаем сохранённые фильтры
    loadTheme();             // тема из localStorage
});
