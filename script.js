// ===== GLOBAL CONFIG =====
const PRODUCTS_JSON_URL = 'https://raw.githubusercontent.com/ ваш-логин/ваш-репо/ваш-бранч/products.json';
const productsData = {}; // Будет заполнен из JSON

// ===== ЗАГРУЗКА ТОВАРОВ С GITHUB =====
async function loadProductsFromGitHub() {
    try {
        const response = await fetch(PRODUCTS_JSON_URL);
        if (!response.ok) throw new Error('Ошибка загрузки products.json');
        const data = await response.json();

        for (const id in data) {
            productsData[id] = data[id];
        }

        renderCatalog(); // рисуем каталог
    } catch (e) {
        console.error('❌ Ошибка: не могу загрузить JSON:', e.message);
        document.getElementById('products-container').innerHTML = `
            <div style="text-align:center; padding:20px; color:#f44336;">
                ❌ Не удалось загрузить товары. Проверь файл products.json.
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
                    <div class="price">${product.price} ₽</div>
                </div>
            `;

            grid.appendChild(card);
        });

        group.appendChild(grid);
        container.appendChild(group);
    }

    applyFilters();
}

// ===== ФИЛЬТРАЦИЯ =====
function applyFilters() {
    const maxPrice = parseInt(document.getElementById('priceSlider')?.value || 150000);
    const selectedBrands = Array.from(document.querySelectorAll('.brand-checkboxes input[type="checkbox"]:checked'))
        .map(cb => cb.value);

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
    document.getElementById('filterModal').style.display = 'none';
    document.body.classList.remove('no-scroll');
}

// ===== QUICK VIEW =====
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

// ===== HELPERS =====
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function centerModal(modalElement) {
    const modalContent = modalElement.querySelector('.modal-content, .quick-view-content');
    if (!modalContent) return;

    modalContent.style.position = 'fixed';
    modalContent.style.top = '50%';
    modalContent.style.left = '50%';
    modalContent.style.transform = 'translate(-50%, -50%)';
}

// ===== FILTERS LOGIC =====
document.getElementById('applyFilters').addEventListener('click', applyFilters);
document.getElementById('resetFilters').addEventListener('click', () => {
    document.querySelectorAll('.brand-checkboxes input[type="checkbox"]').forEach(cb => cb.checked = true);
    document.getElementById('selectAllBrands').checked = true;
    document.getElementById('priceSlider').value = '150000';
    document.getElementById('priceValue').textContent = '150000 ₽';
    applyFilters();
});

document.getElementById('selectAllBrands').addEventListener('change', () => {
    document.querySelectorAll('.brand-checkboxes input[type="checkbox"]').forEach(cb => {
        cb.checked = document.getElementById('selectAllBrands').checked;
    });
});

document.getElementById('priceSlider').addEventListener('input', () => {
    document.getElementById('priceValue').textContent = `${document.getElementById('priceSlider').value} ₽`;
});

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
    loadProductsFromGitHub();
    loadFilters();
    if (window.Telegram?.WebApp) {
        Telegram.WebApp.expand();
        Telegram.WebApp.enableClosingConfirmation();
    }
});
