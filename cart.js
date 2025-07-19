class Cart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.renderCartIcon();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Обработчик для открытия корзины
        document.querySelector('.cart-icon').addEventListener('click', (e) => {
            e.stopPropagation();
            this.showCartModal();
        });
    }

    addItem(productId, productData) {
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: productId,
                quantity: 1,
                ...productData
            });
        }

        this.updateCart();
    }

    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCart();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity
