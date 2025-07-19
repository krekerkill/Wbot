class SimCards {
    constructor() {
        this.simData = {};
        this.currentModal = null;
    }

    init(data) {
        this.simData = data;
    }

    renderSimContainer(container) {
        const simContainer = document.createElement('div');
        simContainer.className = 'sim-container';
        
        const simGrid = document.createElement('div');
        simGrid.className = 'sim-grid';
        
        for (const [key, sim] of Object.entries(this.simData)) {
            const simCard = document.createElement('div');
            simCard.className = 'sim-card';
            simCard.dataset.id = key;
            simCard.style.backgroundColor = sim.color;
            
            simCard.innerHTML = `
                <div class="sim-card-content">
                    <span>${sim.title}</span>
                </div>
            `;
            
            simGrid.appendChild(simCard);
        }
        
        simContainer.appendChild(simGrid);
        container.appendChild(simContainer);
        
        this.addSimCardEventListeners(simGrid);
    }

    addSimCardEventListeners(simGrid) {
        simGrid.querySelectorAll('.sim-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                const simId = card.dataset.id;
                this.showSimTariffsModal(simId);
            });
        });
    }

    showSimTariffsModal(simId) {
        const sim = this.simData[simId];
        if (!sim || !sim.tariffs) {
            console.error('SIM card data or tariffs not found for:', simId);
            return;
        }

        // Закрываем предыдущее модальное окно, если оно есть
        if (this.currentModal) {
            document.body.removeChild(this.currentModal);
            document.body.classList.remove('no-scroll');
        }

        const modal = document.createElement('div');
        modal.className = 'sim-tariffs-modal';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="sim-tariffs-content">
                <span class="close-sim-tariffs">&times;</span>
                <h2>${sim.title} - Выберите тариф</h2>
                
                <div class="tariff-tabs">
                    ${Object.keys(sim.tariffs).map((key, index) => `
                        <button class="tariff-tab ${index === 0 ? 'active' : ''}" 
                                data-tariff="${key}"
                                aria-label="Тариф ${sim.tariffs[key].name}">
                            ${sim.tariffs[key].name}
                        </button>
                    `).join('')}
                </div>
                
                <div class="tariff-content">
                    ${Object.entries(sim.tariffs).map(([key, tariff], index) => `
                        <div class="tariff-details ${index === 0 ? 'active' : ''}" 
                             data-tariff="${key}"
                             role="tabpanel"
                             aria-labelledby="tab-${key}">
                            <div class="tariff-price">${tariff.price}</div>
                            ${tariff.description ? `<p>${tariff.description}</p>` : ''}
                            <button class="select-tariff-btn" 
                                    data-sim="${simId}" 
                                    data-tariff="${key}"
                                    aria-label="Выбрать тариф ${tariff.name}">
                                Выбрать тариф
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.classList.add('no-scroll');
        this.currentModal = modal;

        this.setupModalEventHandlers(modal, sim);
    }

    setupModalEventHandlers(modal, sim) {
        // Закрытие модального окна
        const closeBtn = modal.querySelector('.close-sim-tariffs');
        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });

        // Клик по фону
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Переключение табов
        modal.querySelectorAll('.tariff-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(modal, tab.dataset.tariff);
            });
        });

        // Выбор тарифа
        modal.querySelectorAll('.select-tariff-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectTariff(sim, btn.dataset.tariff);
            });
        });

        // Закрытие по Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    switchTab(modal, tariffId) {
        // Убираем активный класс у всех табов
        modal.querySelectorAll('.tariff-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Добавляем активный класс выбранному табу
        const activeTab = modal.querySelector(`.tariff-tab[data-tariff="${tariffId}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Скрываем все тарифы
        modal.querySelectorAll('.tariff-details').forEach(details => {
            details.classList.remove('active');
        });

        // Показываем выбранный тариф
        const activeDetails = modal.querySelector(`.tariff-details[data-tariff="${tariffId}"]`);
        if (activeDetails) {
            activeDetails.classList.add('active');
        }
    }

    selectTariff(sim, tariffId) {
        const tariff = sim.tariffs[tariffId];
        if (!tariff) return;

        // Здесь можно добавить логику обработки выбранного тарифа
        alert(`Выбран тариф: ${tariff.name}\nЦена: ${tariff.price}`);
        this.closeModal();
    }

    closeModal() {
        if (this.currentModal) {
            document.body.removeChild(this.currentModal);
            document.body.classList.remove('no-scroll');
            this.currentModal = null;
        }
    }
}

export default SimCards;
