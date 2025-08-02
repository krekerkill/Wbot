import Cart from './cart.js';

const PRODUCTS_JSON_URL = 'products.json';
const productsData = {};
const cart = new Cart();
const quickViewModal = document.getElementById('quickViewModal');
const productsContainer = document.getElementById('products-container');

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    initEventListeners();
});

async function loadProducts() {
    try {
        const response = await fetch(PRODUCTS_JSON_URL);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        Object.assign(productsData, data);
        
        initBrandFilters();
        renderCatalog();
    } catch (error) {
        console.error('Error loading products:', error);
        showErrorMessage();
    }
}

function showErrorMessage() {
    productsContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>Не удалось загрузить товары. Пожалуйста, попробуйте позже.</p>
        </div>
    `;
}

function initEventListeners() {
    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTopBtn.classList.toggle('visible', window.scrollY > 300);
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Quick view modal
    document.querySelector('.close-quick-view')?.addEventListener('click', closeQuickView);
    quickViewModal?.addEventListener('click', (e) => {
        if (e.target === quickViewModal) closeQuickView();
    });

    // Product interactions
    productsContainer.addEventListener('click', handleProductInteraction);
}

function handleProductInteraction(e) {
    const target = e.target;
    
    // Add to cart button
    const addToCartBtn = target.closest('.add-to-cart-btn');
    if (addToCartBtn) {
        e.preventDefault();
        e.stopPropagation();
        const productId = addToCartBtn.closest('.product-card').dataset.id;
        addToCart(productId, addToCartBtn);
        return;
    }

    // Product card click (for quick view)
    const productCard = target.closest('.product-card');
    if (productCard) {
        showQuickView(productCard.dataset.id);
    }
}

function addToCart(productId, button) {
    const product = productsData[productId];
    if (!product) return;

    cart.addItem(productId, product);
    
    // Visual feedback
    if (button) {
        const originalHtml = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Добавлено';
        button.classList.add('added');
        setTimeout(() => {
            button.innerHTML = originalHtml;
            button.classList.remove('added');
        }, 1500);
    }
}

function initBrandFilters() {
    const brandsContainer = document.querySelector('.brands-scroll-container');
    const brands = new Set();
    
    // Collect unique brands
    for (const id in productsData) {
        const brand = productsData[id].brand?.toLowerCase() || 'other';
        brands.add(brand);
    }
    
    // Create filter buttons
    const allBrandsBtn = document.createElement('button');
    allBrandsBtn.className = 'brand-filter-btn active';
    allBrandsBtn.dataset.brand = 'all';
    allBrandsBtn.textContent = 'Все';
    brandsContainer.appendChild(allBrandsBtn);

    [...brands].sort().forEach(brand => {
        const btn = document.createElement('button');
        btn.className = 'brand-filter-btn';
        btn.dataset.brand = brand;
        btn.textContent = brand.charAt(0).toUpperCase() + brand.slice(1);
        brandsContainer.appendChild(btn);
    });
    
    // Filter click handler
    brandsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.brand-filter-btn');
        if (!btn) return;
        
        document.querySelectorAll('.brand-filter-btn').forEach(b => 
            b.classList.remove('active')
        );
        btn.classList.add('active');
        
        const brand = btn.dataset.brand;
        renderCatalog(brand);
    });
}

function renderCatalog(selectedBrand = 'all') {
    productsContainer.innerHTML = '';

    // Group products by brand
    const brandsMap = {};
    for (const id in productsData) {
        const product = productsData[id];
        const brand = product.brand?.toLowerCase() || 'other';
        
        if (!brandsMap[brand]) brandsMap[brand] = [];
        brandsMap[brand].push({ id, ...product });
    }

    // Render selected brands
    const brandsToRender = selectedBrand === 'all' 
        ? Object.keys(brandsMap) 
        : [selectedBrand];

    brandsToRender.forEach(brand => {
        const products = brandsMap[brand];
        if (!products || products.length === 0) return;

        // Brand group container
        const group = document.createElement('div');
        group.className = 'brand-group';
        group.setAttribute('data-brand', brand);

        // Brand title
        const title = document.createElement('h2');
        title.className = 'brand-title';
        title.textContent = brand.charAt(0).toUpperCase() + brand.slice(1);
        group.appendChild(title);

        // Products grid
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

        group.appendChild(grid);
        productsContainer.appendChild(group);
    });
}

function showQuickView(productId) {
    const product = productsData[productId];
    if (!product) return;

    const hasDiscount = product.old_price && product.old_price !== product.price;
    const discountPercent = hasDiscount 
        ? Math.round((1 - parsePrice(product.price) / parsePrice(product.old_price)) * 100)
        : 0;

    // Update modal content
    document.getElementById('quickViewTitle').textContent = product.title;
    document.getElementById('quickViewDescription').textContent = product.description;
    
    const priceContainer = document.getElementById('quickViewPrice');
    priceContainer.innerHTML = `
        <span class="price">${product.price}</span>
        ${hasDiscount ? `
            <span class="old-price">${product.old_price}</span>
            <span class="discount-badge">-${discountPercent}%</span>
        ` : ''}
    `;

    // Set up add to cart button in quick view
    const quickViewCartBtn = quickViewModal.querySelector('.quick-view-cart-btn');
    quickViewCartBtn.onclick = (e) => {
        e.stopPropagation();
        addToCart(productId);
        quickViewCartBtn.innerHTML = '<i class="fas fa-check"></i> Добавлено';
        quickViewCartBtn.classList.add('added');
        setTimeout(() => {
            quickViewCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> В корзину';
            quickViewCartBtn.classList.remove('added');
        }, 1500);
    };

    // Show modal
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
