document.addEventListener('DOMContentLoaded', function() {
    // Элементы управления
    const filterButton = document.getElementById('filterButton');
    const filterModal = document.getElementById('filterModal');
    const priceSlider = document.getElementById('priceSlider');
    const priceValue = document.getElementById('priceValue');
    const applyButton = document.getElementById('applyFilters');

    // Обновление отображения цены
    priceSlider.addEventListener('input', function() {
        priceValue.textContent = this.value + ' ₽';
    });

    // Управление видимостью кнопки
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > lastScroll && currentScroll > 100) {
            filterButton.classList.add('hidden');
        } else {
            filterButton.classList.remove('hidden');
        }
        lastScroll = currentScroll;
    });

    // Открытие/закрытие модального окна
    filterButton.addEventListener('click', function(e) {
        e.stopPropagation();
        filterModal.style.display = 'block';
    });

    document.addEventListener('click', function(e) {
        if (e.target === filterModal) {
            filterModal.style.display = 'none';
        }
    });

    // Функция фильтрации
    function applyFilters() {
        const maxPrice = parseInt(priceSlider.value);
        const selectedBrands = Array.from(
            document.querySelectorAll('input[name="brand"]:checked')
        ).map(el => el.value);

        document.querySelectorAll('.brand-group').forEach(group => {
            const brand = group.dataset.brand;
            const shouldShowBrand = selectedBrands.includes(brand);
            let hasVisibleProducts = false;

            group.querySelectorAll('.product-card').forEach(card => {
                const price = parseInt(card.dataset.price);
                const shouldShow = shouldShowBrand && price <= maxPrice;
                
                card.style.display = shouldShow ? 'block' : 'none';
                if (shouldShow) hasVisibleProducts = true;
            });

            group.style.display = shouldShowBrand ? 'block' : 'none';
            group.querySelector('.brand-title').style.display = 
                hasVisibleProducts ? 'block' : 'none';
        });

        filterModal.style.display = 'none';
    }

    applyButton.addEventListener('click', applyFilters);
});

function selectProduct(productId) {
    // Ваш существующий код
}
