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

    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCart();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            this.updateCart();
        }
    }

    getTotalItems() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    getTotalPrice() {
        return this.cart.reduce((sum, item) => {
            return sum + (this.parsePrice(item.price) * item.quantity);
        }, 0);
    }

    updateCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.renderCartIcon();
        if (this.cartModal) this.renderCartModal();
    }

    renderCartIcon() {
        const cartCount = this.getTotalItems();
        document.querySelector('.cart-count').textContent = cartCount;
    }

    showCartModal() {
        if (!this.cartModal) {
            this.createCartModal();
        }
        this.renderCartModal();
        this.cartModal.style.display = 'block';
        document.body.classList.add('no-scroll');
    }

    createCartModal() {
        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-modal-content">
                <span class="close-cart-modal">&times;</span>
                <h2>Корзина</h2>
                <div class="cart-items-container"></div>
                <div class="cart-summary">
                    <div class="cart-total">
                        <span>Итого:</span>
                        <span class="total-price">0 ₽</span>
                    </div>
                    <button class="checkout-btn">Оформить заказ</button>
                </div>
                <div class="empty-cart-message">Корзина пуста</div>
            </div>
        `;

        document.body.appendChild(modal);
        this.cartModal = modal;

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
    }

    renderCartModal() {
        const container = this.cartModal.querySelector('.cart-items-container');
        const emptyMessage = this.cartModal.querySelector('.empty-cart-message');
        const totalPriceElement = this.cartModal.querySelector('.total-price');

        if (this.cart.length === 0) {
            container.innerHTML = '';
            emptyMessage.style.display = 'block';
            totalPriceElement.textContent = '0 ₽';
            return;
        }

        emptyMessage.style.display = 'none';
        container.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.images?.[0] || item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.title}</h3>
                    <div class="cart-item-price">${item.price}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn minus">−</button>
                        <input type="number" value="${item.quantity}" min="1">
                        <button class="quantity-btn plus">+</button>
                        <button class="remove-item-btn">Удалить</button>
                    </div>
                </div>
            </div>
        `).join('');

        totalPriceElement.textContent = `${this.getTotalPrice().toLocaleString()} ₽`;

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

        container.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', (e) => {
                const itemId = e.target.closest('.cart-item').dataset.id;
                this.updateQuantity(itemId, parseInt(e.target.value));
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
        this.cartModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }

    parsePrice(priceStr) {
        return parseFloat(priceStr.replace(/[^\d]/g, ''));
    }
}

export default Cart;
