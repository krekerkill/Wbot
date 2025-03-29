// script.js - обновленная версия
function selectProduct(productId) {
    const productData = {
        action: "product_selected",
        product_id: productId,
        timestamp: new Date().toISOString()
    };

    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.sendData(JSON.stringify(productData));
    } else {
        console.log("Выбран товар:", productData);
        alert(`Товар ${productId} добавлен в корзину`);
    }
}

function sortProducts(criteria) {
    const container = document.getElementById('products-container');
    const productGroups = Array.from(container.getElementsByClassName('brand-group'));
    
    productGroups.forEach(group => {
        const productsGrid = group.querySelector('.products-grid');
        const products = Array.from(productsGrid.getElementsByClassName('product-card'));
        
        products.sort((a, b) => {
            const priceA = parseFloat(a.getAttribute('data-price'));
            const priceB = parseFloat(b.getAttribute('data-price'));
            
            if (criteria === 'price_asc') return priceA - priceB;
            if (criteria === 'price_desc') return priceB - priceA;
            return 0;
        });

        while (productsGrid.firstChild) {
            productsGrid.removeChild(productsGrid.firstChild);
        }

        products.forEach(product => {
            productsGrid.appendChild(product);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Каталог загружен");
    
    // Анимация при загрузке
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + index * 50);
    });
});
