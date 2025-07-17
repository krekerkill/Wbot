// Рендеринг карточки
function renderProduct(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.id = product.id;
  
  card.innerHTML = `
    <!-- Вставить HTML из первого блока -->
  `;

  // Инициализация галереи
  if (product.images.length > 1) {
    const thumbnails = card.querySelectorAll('.thumbnails img');
    const mainImg = card.querySelector('.main-img');
    
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        mainImg.src = thumb.src;
      });
    });
  }

  // Обработчик корзины
  card.querySelector('.cart-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    addToCart(product.id);
    // Анимация
    const icon = e.currentTarget.querySelector('i');
    icon.classList.replace('fa-shopping-cart', 'fa-check');
    setTimeout(() => icon.classList.replace('fa-check', 'fa-shopping-cart'), 1000);
  });

  return card;
}

// Добавление в корзину (прежняя реализация)
function addToCart(productId) {
  // ... существующая логика ...
}
