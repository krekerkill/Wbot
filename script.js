function selectProduct(productId) {
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.sendData(JSON.stringify({
            action: "product_selected",
            product_id: productId,
            timestamp: new Date().getTime()
        }));
        Telegram.WebApp.close();
    } else {
        console.log("Selected product ID:", productId);
    }
}

function sortProducts(criteria) {
    const container = document.querySelector('.products');
    const products = Array.from(document.querySelectorAll('.product'));
    
    products.sort((a, b) => {
        const aPrice = parseFloat(a.getAttribute('data-price'));
        const bPrice = parseFloat(b.getAttribute('data-price'));
        
        if (criteria === 'price_asc') return aPrice - bPrice;
        if (criteria === 'price_desc') return bPrice - aPrice;
        return 0;
    });
    
    products.forEach(product => container.appendChild(product));
}
