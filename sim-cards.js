class SimCards {
    constructor() {
        this.simData = {};
    }

    init(data) {
        this.simData = data;
    }

    renderSimContainer(container) {
        const simContainer = document.createElement('div');
        simContainer.className = 'sim-container';
        
        const title = document.createElement('h2');
        title.className = 'brand-title';
        title.textContent = 'SIM-карты';
        container.appendChild(title);
        
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
        
        this.addSwipeHandlers(simGrid);
        
        simContainer.querySelectorAll('.sim-card').forEach(card => {
            card.addEventListener('click', () => {
                this.showSimTariffsModal(card.dataset.id);
            });
        });
    }

    addSwipeHandlers(element) {
        let startX, scrollLeft;
        let isDown = false;

        // Для мыши
        element.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - element.offsetLeft;
            scrollLeft = element.scrollLeft;
            element.style.cursor = 'grabbing';
        });

        element.addEventListener('mouseleave', () => {
            isDown = false;
            element.style.cursor = 'grab';
        });

        element.addEventListener('mouseup', () => {
            isDown = false;
            element.style.cursor = 'grab';
        });

        element.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - element.offsetLeft;
            const walk = (x - startX) * 2;
            element.scrollLeft = scrollLeft - walk;
        });

        // Для тач-устройств
        element.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - element.offsetLeft;
            scrollLeft = element.scrollLeft;
        }, { passive: true });

        element.addEventListener('touchend', () => {
            isDown = false;
        }, { passive: true });

        element.addEventListener('touchmove', (e) => {
            if(!isDown) return;
            const x = e.touches[0].pageX - element.offsetLeft;
            const walk = (x - startX) * 2;
            element.scrollLeft = scrollLeft - walk;
        }, { passive: true });
    }

    showSimTariffsModal(simId) {
        const sim = this.simData[simId];
        if (!sim) return;

        const modal = document.createElement('div');
        modal.className = 'sim-tariffs-modal';
        modal.innerHTML = `
            <div class="sim-tariffs-content">
                <span class="close-sim-tariffs">&times;</span>
                <h2>${sim.title} - Выберите тариф</h2>
                
                <div class="tariff-tabs">
                    ${Object.keys(sim.tariffs).map((key, index) => `
                        <button class="tariff-tab ${index === 0 ? 'active' : ''}" data-tariff="${key}">
                            ${sim.tariffs[key].name}
                        </button>
                    `).join('')}
                </div>
                
                <div class="tariff-content">
                    ${Object.entries(sim.tariffs).map(([key, tariff], index) => `
                        <div class="tariff-details ${index === 0 ? 'active' : ''}" data-tariff="${key}">
                            <div class="tariff-price">${tariff.price}</div>
                            <p>${tariff.description}</p>
                            <button class="select-tariff-btn" data-sim="${simId}" data-tariff="${key}">
                                Выбрать тариф
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.classList.add('no-scroll');

        modal.querySelectorAll('.tariff-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                modal.querySelector('.tariff-tab.active').classList.remove('active');
                tab.classList.add('active');
                
                const tariffId = tab.dataset.tariff;
                modal.querySelector('.tariff-details.active').classList.remove('active');
                modal.querySelector(`.tariff-details[data-tariff="${tariffId}"]`).classList.add('active');
            });
        });

        modal.querySelectorAll('.select-tariff-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                alert(`Выбран тариф ${sim.tariffs[btn.dataset.tariff].name} от ${sim.title}`);
                document.body.removeChild(modal);
                document.body.classList.remove('no-scroll');
            });
        });

        modal.querySelector('.close-sim-tariffs').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.body.classList.remove('no-scroll');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.body.classList.remove('no-scroll');
            }
        });
    }
}

export default SimCards;
