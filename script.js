// Функция renderCatalog() - обновлённая версия
function renderCatalog() {
    productsContainer.innerHTML = '';

    const brandsMap = {};
    for (const id in productsData) {
        const product = productsData[id];
        const brand = product.brand?.toLowerCase() || 'other';
        
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
            const hasDiscount = product.old_price && product.old_price !== product.price;
            const discountPercent = hasDiscount 
                ? Math.round((1 - parsePrice(product.price) / parsePrice(product.old_price)) * 100)
                : 0;

            const card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.id = product.id;

            // Гарантируем минимум 3 изображения
            const images = product.images || [product.image];
            while (images.length < 3) {
                images.push(images[0]); // Дублируем первое изображение
            }

            card.innerHTML = `
                <div class="product-image-container">
                    <div class="image-slider">
                        ${images.slice(0, 3).map((img, i) => 
                            `<img src="${img.trim()}" ${i === 0 ? 'class="active"' : ''} loading="lazy" alt="${product.title}">`
                        ).join('')}
                    </div>
                    <span class="image-counter">1/${images.length}</span>
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
    }
}

// Обновлённая функция initImageSliders()
function initImageSliders() {
    document.querySelectorAll('.product-card').forEach(card => {
        const slider = card.querySelector('.image-slider');
        const images = slider.querySelectorAll('img');
        const counter = card.querySelector('.image-counter');
        let currentIndex = 0;
        
        function showImage(index) {
            images.forEach(img => img.classList.remove('active'));
            images[index].classList.add('active');
            if (counter) {
                counter.textContent = `${index + 1}/${images.length}`;
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

// Обновлённая функция showQuickView()
function showQuickView(productId) {
    const product = productsData[productId];
    if (!product) return;

    const hasDiscount = product.old_price && product.old_price !== product.price;
    const discountPercent = hasDiscount 
        ? Math.round((1 - parsePrice(product.price) / parsePrice(product.old_price)) * 100)
        : 0;

    // Установка изображений (гарантируем 3 фото)
    const images = product.images || [product.image];
    while (images.length < 3) {
        images.push(images[0]);
    }

    const sliderContainer = quickViewModal.querySelector('.image-slider');
    sliderContainer.innerHTML = images.slice(0, 3).map((img, i) => 
        `<img src="${img.trim()}" ${i === 0 ? 'class="active"' : ''} alt="${product.title}">`
    ).join('');

    // Установка деталей
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

    // Обработчик для кнопки "Добавить в корзину"
    const quickViewCartBtn = quickViewModal.querySelector('.quick-view-cart-btn');
    quickViewCartBtn.onclick = (e) => {
        e.stopPropagation();
        addToCart(productId);
        quickViewCartBtn.innerHTML = '<i class="fas fa-check"></i> Добавлено';
        setTimeout(() => {
            quickViewCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Добавить в корзину';
        }, 2000);
    };

    quickViewModal.style.display = 'block';
    document.body.classList.add('no-scroll');
                }
