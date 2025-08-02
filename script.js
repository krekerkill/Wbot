import Cart from './cart.js';

const PRODUCTS_JSON_URL = 'products.json';
const productsData = {};
const cart = new Cart();
const quickViewModal = document.getElementById('quickViewModal');
const productsContainer = document.getElementById('products-container');
const brandsFilter = document.querySelector('.brands-filter');

let lastScrollPosition = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    initEventListeners();
    initScrollHandler();
});

function initScrollHandler() {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScrollPosition && currentScroll > 100) {
            // Прокрутка вниз
            brandsFilter.classList.add('hidden');
        } else {
            // Прокрутка вверх
            brandsFilter.classList.remove('hidden');
        }
        
        lastScrollPosition = currentScroll;
    });
}

async function loadProducts() {
    try {
        const response = await fetch(PRODUCTS_JSON_URL);
        if (!response.ok) throw new Error('Не удалось загрузить товары');
        
        const data = await response.json();
        Object.assign(productsData, data);
        
        initBrandFilters();
        renderCatalog();
    } catch (error) {
        console.error('Ошибка:', error);
        showErrorMessage();
    }
}

function showErrorMessage() {
    productsContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Не удалось загрузить товары. Пожалуйста, попробуйте позже.</p>
        </div>
    `;
}

function initEventListeners() {
    // Кнопка "Наверх"
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTopBtn.classList.toggle('visible', window.scrollY > 300);
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Закрытие быстрого просмотра
    document.querySelector('.close-quick-view')?.addEventListener('click', closeQuickView);
    quickViewModal?.addEventListener('click', (e) => {
        if (e.target === quickViewModal) closeQuickView();
    });

    // Обработчик кликов по товарам
    productsContainer.addEventListener('click', handleProductClick);
}

function handleProductClick(e) {
    const target = e.target;
    
    // Клик по кнопке "В корзину"
    const addToCartBtn = target.closest('.add-to-cart-btn');
    if (addToCartBtn) {
        e.preventDefault();
        e.stopPropagation();
        const productId = addToCartBtn.closest('.product-card').dataset.id;
        addToCart(productId, addToCartBtn);
        return;
    }
    
    // Клик по карточке товара (открыть быстрый просмотр)
    const productCard = target.closest('.product-card');
    if (productCard) {
        showQuickView(productCard.dataset.id);
    }
}

function addToCart(productId, button) {
    const product = productsData[productId];
    if (!product) return;

    cart.addItem(productId, product);
    
    // Анимация добавления
    if (button) {
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.add('added-to-cart');
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-shopping-cart"></i>';
            button.classList.remove('added-to-cart');
        }, 1000);
    }
}

function initBrandFilters() {
    const brandsContainer = document.querySelector('.brands-scroll-container');
    const brands = new Set();
    
    // Собираем уникальные бренды
    for (const id in productsData) {
        const brand = productsData[id].brand?.toLowerCase() || 'other';
        brands.add(brand);
    }
    
    // Создаем кнопки только для брендов (без "Все")
    [...brands].sort().forEach((brand, index) => {
        const btn = document.createElement('button');
        btn.className = 'brand-filter-btn';
        btn.dataset.brand = brand;
        btn.textContent = brand.charAt(0).toUpperCase() + brand.slice(1);
        brandsContainer.appendChild(btn);
        
        // Первый бренд активен по умолчанию
        if (index === 0) {
            btn.classList.add('active');
            renderCatalog(brand);
        }
    });
    
    // Обработчик кликов по фильтрам
    brandsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.brand-filter-btn');
        if (!btn) return;
        
        document.querySelectorAll('.brand-filter-btn').forEach(b => 
            b.classList.remove('active')
        );
        btn.classList.add('active');
        
        renderCatalog(btn.dataset.brand);
    });
}

function renderCatalog(selectedBrand) {
    productsContainer.innerHTML = '';

    const brandsMap = {};
    for (const id in productsData) {
        const product = productsData[id];
        const brand = product.brand?.toLowerCase() || 'other';
        
        if (!brandsMap[brand]) brandsMap[brand] = [];
        brandsMap[brand].push({ id, ...product });
    }

    const products = selectedBrand ? brandsMap[selectedBrand] : Object.values(productsData);
    if (!products) return;

    const grid = document.createElement('div');
    grid.className = 'products-grid';

    products.forEach(product => {
        const hasDiscount = product.old_price && product.old_price !== product.price;
        const discountPercent = hasDiscount 
            ? Math.round((1 - parsePrice(product.price) / parsePrice(product.old_price)) * 100)
            : 0;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = product.id;

        card.innerHTML = `
            <div class="product-image-container">
                <img src="${product.images?.[0] || product.image}" loading="lazy" alt="${product.title}">
                <button class="add-to-cart-btn" title="Добавить в корзину">
                    <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
            <div class="product-details">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <div class="price-container">
                    <span class="price">${product.price}</span>
                    ${hasDiscount ? `
                        <span class="old-price">${product.old_price}</span>
                        <span class="discount-badge">-${discountPercent}%</span>
                    ` : ''}
                </div>
            </div>
        `;

        grid.appendChild(card);
    });

    productsContainer.appendChild(grid);
}

function showQuickView(productId) {
    const product = productsData[productId];
    if (!product) return;

    const hasDiscount = product.old_price && product.old_price !== product.price;
    const discountPercent = hasDiscount 
        ? Math.round((1 - parsePrice(product.price) / parsePrice(product.old_price)) * 100)
        : 0;

    // Заполняем модальное окно
    document.getElementById('quickViewTitle').textContent = product.title;
    document.getElementById('quickViewDescription').textContent = product.description;
    document.getElementById('quickViewImage').src = product.images?.[0] || product.image;
    document.getElementById('quickViewImage').alt = product.title;
    
    const priceContainer = document.getElementById('quickViewPrice');
    priceContainer.innerHTML = `
        <span class="price">${product.price}</span>
        ${hasDiscount ? `
            <span class="old-price">${product.old_price}</span>
            <span class="discount-badge">-${discountPercent}%</span>
        ` : ''}
    `;

    // Настраиваем кнопку в модальном окне
    const quickViewCartBtn = quickViewModal.querySelector('.quick-view-cart-btn');
    quickViewCartBtn.onclick = (e) => {
        e.stopPropagation();
        addToCart(productId);
        quickViewCartBtn.innerHTML = '<i class="fas fa-check"></i> Добавлено';
        setTimeout(() => {
            quickViewCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Добавить в корзину';
        }, 1500);
    };

    // Показываем модальное окно
    quickViewModal.style.display = 'block';
    document.body.classList.add('no-scroll');
}

function closeQuickView() {
    quickViewModal.style.display = 'none';
    document.body.classList.remove('no-scroll');
}

function parsePrice(priceStr) {
    return parseFloat(priceStr.replace(/[^\d]/g, ''));
}
