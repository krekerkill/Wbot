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

        productsGrid.innerHTML = '';
        products.forEach(product => productsGrid.appendChild(product));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Каталог загружен");
});
