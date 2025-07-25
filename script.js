import Cart from './cart.js';

const PRODUCTS_JSON_URL = 'products.json';
const productsData = {};
const cart = new Cart();
const quickViewModal = document.getElementById('quickViewModal');
const productsContainer = document.getElementById('products-container');

document.addEventListener('DOMContentLoaded', () => {
    loadProductsFromGitHub();
    initBackToTopButton();
});

async function loadProductsFromGitHub() {
    try {
        const response = await fetch(PRODUCTS_JSON_URL);
        if (!response.ok) throw new Error('Не могу загрузить JSON');

        const data = await response.json();
        Object.assign(productsData, data);
        
        initBrandFilters();
        renderCatalog();
        initImageSliders();
        initAddToCartButtons();
    } catch (e) {
        console.error('Ошибка загрузки:', e);
        productsContainer.innerHTML = `
            <div class="error-message">
                ❗ Не удалось загрузить товары. Проверьте интернет или файл products.json
            </div>
        `;
    }
}

function initBrandFilters() {
    const brandsContainer = document.querySelector('.brands-scroll-container');
    const brands = new Set();
    
    // Собираем все уникальные бренды
    for (const id in productsData) {
        if (id === 'sim_cards') continue;
        const brand = productsData[id].brand?.toLowerCase() || 'other';
        brands.add(brand);
    }
    
    // Создаем кнопки для каждого бренда
    brands.forEach(brand => {
        const btn = document.createElement('button');
        btn.className = 'brand-filter-btn';
        btn.dataset.brand = brand;
        btn.textContent = brand.charAt(0).toUpperCase() + brand.slice(1);
        brandsContainer.appendChild(btn);
    });
    
    // Обработчик кликов
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

    const brandsMap = {};
    for (const id in productsData) {
        if (id === 'sim_cards') continue;
        
        const product = productsData[id];
        const brand = product.brand?.toLowerCase() || 'other';
        
        if (!brandsMap[brand]) brandsMap[brand] = [];
        brandsMap[brand].push({ id, ...product });
    }

    // Рендерим только выбранный бренд или все, если selectedBrand === 'all'
    const brandsToRender = selectedBrand === 'all' 
        ? Object.keys(brandsMap) 
        : [selectedBrand];

    brandsToRender.forEach(brand => {
        const products = brandsMap[brand];
        if (!products) return;

        const group = document.createElement('div');
        group.className = 'brand-group';
        group.setAttribute('data-brand', brand);

        const title = document.createElement('h2');
        title.className = 'brand-title';
        title.textContent = brand.charAt(0).toUpperCase() + brand.slice(1);
        group.appendChild(title);

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
                    <div class="image-slider">
                        ${(product.images || [product.image]).map((img, i) => 
                            `<img src="${img.trim()}" ${i === 0 ? 'class="active"' : ''} loading="lazy" alt="${product.title}">`
                        ).join('')}
                    </div>
                    <button class="slider-prev">&lt;</button>
                    <button class="slider-next">&gt;</button>
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

function initImageSliders() {
    document.querySelectorAll('.product-card').forEach(card => {
        const slider = card.querySelector('.image-slider');
        const images = slider.querySelectorAll('img');
        let currentIndex = 0;
        
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'image-dots';
        
        images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `image-dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.index = index;
            dotsContainer.appendChild(dot);
        });
        
        slider.appendChild(dotsContainer);
        
        function showImage(index) {
            images.forEach(img => img.classList.remove('active'));
            images[index].classList.add('active');
            
            const dots = slider.querySelectorAll('.image-dot');
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            
            currentIndex = index;
        }
        
        dotsContainer.querySelectorAll('.image-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                showImage(parseInt(dot.dataset.index));
            });
        });
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const threshold = 50;
            if (touchStartX - touchEndX > threshold) {
                currentIndex = (currentIndex + 1) % images.length;
                showImage(currentIndex);
            } else if (touchEndX - touchStartX > threshold) {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                showImage(currentIndex);
            }
        }
        
        const prevBtn = card.querySelector('.slider-prev');
        const nextBtn = card.querySelector('.slider-next');
        
        prevBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        });
        
        nextBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        });
    });
}

function initAddToCartButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = btn.closest('.product-card').dataset.id;
            cart.addItem(productId, productsData[productId]);
            
            btn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-shopping-cart"></i>';
            }, 1000);
        });
    });
}

function showQuickView(productId) {
    const product = productsData[productId];
    if (!product) return;

    const hasDiscount = product.old_price && product.old_price !== product.price;
    const discountPercent = hasDiscount 
        ? Math.round((1 - parsePrice(product.price) / parsePrice(product.old_price)) * 100)
        : 0;

    const sliderContainer = quickViewModal.querySelector('.image-slider');
    sliderContainer.innerHTML = (product.images || [product.image]).map((img, i) => 
        `<img src="${img.trim()}" ${i === 0 ? 'class="active"' : ''} alt="${product.title}">`
    ).join('');

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'image-dots';
    
    (product.images || [product.image]).forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `image-dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.index = index;
        dotsContainer.appendChild(dot);
    });
    
    sliderContainer.appendChild(dotsContainer);

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

    const quickViewCartBtn = quickViewModal.querySelector('.quick-view-cart-btn');
    quickViewCartBtn.onclick = (e) => {
        e.stopPropagation();
        cart.addItem(productId, product);
        quickViewCartBtn.innerHTML = '<i class="fas fa-check"></i> Добавлено';
        setTimeout(() => {
            quickViewCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Добавить в корзину';
        }, 2000);
    };

    let touchStartX = 0;
    let touchEndX = 0;
    let currentIndex = 0;
    const images = sliderContainer.querySelectorAll('img');
    const dots = sliderContainer.querySelectorAll('.image-dot');

    function showQuickViewImage(index) {
        images.forEach(img => img.classList.remove('active'));
        images[index].classList.add('active');
        
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        currentIndex = index;
    }

    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleQuickViewSwipe();
    }, { passive: true });

    function handleQuickViewSwipe() {
        const threshold = 50;
        if (touchStartX - touchEndX > threshold) {
            currentIndex = (currentIndex + 1) % images.length;
            showQuickViewImage(currentIndex);
        } else if (touchEndX - touchStartX > threshold) {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showQuickViewImage(currentIndex);
        }
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            showQuickViewImage(parseInt(dot.dataset.index));
        });
    });

    quickViewModal.style.display = 'block';
    document.body.classList.add('no-scroll');
}

function initBackToTopButton() {
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        backToTopBtn.classList.toggle('visible', window.scrollY > 300);
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

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

productsContainer.addEventListener('click', (e) => {
    const productCard = e.target.closest('.product-card');
    if (productCard && !e.target.closest('.add-to-cart-btn')) {
        showQuickView(productCard.dataset.id);
    }
});

function parsePrice(priceStr) {
    return parseFloat(priceStr.replace(/[^\d]/g, ''));
}
