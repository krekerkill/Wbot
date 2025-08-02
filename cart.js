class Cart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.cartModal = null;
        this.init();
    }

    init() {
        this.renderCartIcon();
        this.setupEventListeners();
    }

    setupEventListeners() {
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

    updateCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.renderCartIcon();
        if (this.cartModal) this.renderCartModal();
    }

    renderCartIcon() {
        const cartCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.cart-count').textContent = cartCount;
    }

    showCartModal() {
        if (!this.cartModal) {
            this.createCartModal();
        }
        this.cartModal.style.display = 'block';
        document.body.classList.add('no-scroll');
    }

    createCartModal() {
        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-modal-content">
                <div class="cart-header">
                    <h2>Ваша корзина</h2>
                    <span class="close-cart-modal">&times;</span>
                </div>
                <div class="cart-items"></div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <span>Итого:</span>
                        <span class="total-price">0 ₽</span>
                    </div>
                    <button class="checkout-btn">Оформить заказ</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.cartModal = modal;

        // Добавляем обработчики событий
        modal.querySelector('.close-cart-modal').addEventListener('click', () => {
            this.hideCartModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideCartModal();
            }
        });

        modal.querySelector('.checkout-btn').addEventListener('click', () => {
            alert('Заказ оформлен! Спасибо за покупку!');
            this.cart = [];
            this.updateCart();
            this.hideCartModal();
        });

        this.renderCartModal();
    }

    renderCartModal() {
        const container = this.cartModal.querySelector('.cart-items');
        const totalPriceElement = this.cartModal.querySelector('.total-price');

        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Корзина пуста</p>
                </div>
            `;
            totalPriceElement.textContent = '0 ₽';
            return;
        }

        container.innerHTML = this.cart.map(item => {
            const hasDiscount = item.old_price && item.old_price !== item.price;
            return `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.images?.[0] || item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-title">${item.title}</h3>
                        <div class="price-container">
                            <span class="price">${item.price}</span>
                            ${hasDiscount ? `
                                <span class="old-price">${item.old_price}</span>
                            ` : ''}
                        </div>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button class="quantity-btn minus">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <button class="remove-item-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        totalPriceElement.textContent = `${this.getTotalPrice().toLocaleString()} ₽`;

        // Добавляем обработчики для элементов корзины
        this.addCartEventListeners();
    }

    addCartEventListeners() {
        const container = this.cartModal?.querySelector('.cart-items');
        if (!container) return;

        container.querySelectorAll('.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.closest('.cart-item').dataset.id;
                const item = this.cart.find(i => i.id === itemId);
                if (item) this.updateQuantity(itemId, item.quantity - 1);
            });
        });

        container.querySelectorAll('.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.closest('.cart-item').dataset.id;
                const item = this.cart.find(i => i.id === itemId);
                if (item) this.updateQuantity(itemId, item.quantity + 1);
            });
        });

        container.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const itemId = e.target.closest('.cart-item').dataset.id;
                const newQuantity = parseInt(e.target.value);
                if (!isNaN(newQuantity)) {
                    this.updateQuantity(itemId, newQuantity);
                } else {
                    e.target.value = 1;
                }
            });
        });

        container.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.closest('.cart-item').dataset.id;
                this.removeItem(itemId);
            });
        });
    }

    hideCartModal() {
        if (this.cartModal) {
            this.cartModal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }
    }

    removeItem(productId) {
        const itemElement = document.querySelector(`.cart-item[data-id="${productId}"]`);
        if (itemElement) {
            itemElement.classList.add('removing');
            setTimeout(() => {
                this.cart = this.cart.filter(item => item.id !== productId);
                this.updateCart();
            }, 300);
        }
    }

    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            this.updateCart();
        }
    }

    getTotalPrice() {
        return this.cart.reduce((sum, item) => {
            return sum + (this.parsePrice(item.price) * item.quantity);
        }, 0);
    }

    parsePrice(priceStr) {
        return parseFloat(priceStr.replace(/[^\d]/g, ''));
    }
}

export default Cart;
