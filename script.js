// Данные для быстрого просмотра
const productsData = {
    'iphone15': {
        image: 'https://via.placeholder.com/500x500?text=iPhone+15',
        title: 'iPhone 15',
        description: '6.1" Super Retina XDR, 128GB, Black, 48MP камера, A16 Bionic',
        price: '89 990 ₽'
    },
    'iphone15pro': {
        image: 'https://via.placeholder.com/500x500?text=iPhone+15+Pro',
        title: 'iPhone 15 Pro',
        description: '6.1" Super Retina XDR, 256GB, Titanium, 48MP камера, A17 Pro',
        price: '119 990 ₽'
    },
    // ... (остальные товары остаются без изменений)
    'nothingPhone2': {
        image: 'https://via.placeholder.com/500x500?text=Nothing+Phone+2',
        title: 'Nothing Phone 2',
        description: '6.7" OLED, 256GB, White, 50MP камера, Snapdragon 8+ Gen 1',
        price: '54 990 ₽'
    }
};

// ===== ОСНОВНЫЕ ЭЛЕМЕНТЫ =====
const selectAll = document.getElementById('selectAllBrands');
const brandCheckboxes = document.querySelectorAll('.brand-checkboxes input[type="checkbox"]');
const priceSlider = document.getElementById('priceSlider');
const priceValue = document.getElementById('priceValue');
const filterButton = document.getElementById('filterButton');
const filterModal = document.getElementById('filterModal');
const applyBtn = document.getElementById('applyFilters');
const resetBtn = document.getElementById('resetFilters');
const quickViewModal = document.getElementById('quickViewModal');

// ===== СИСТЕМА ФОНА =====
const BACKGROUND_CONFIG = {
    url: 'https://i.ibb.co/pNbynVp/1743409234018.jpg',
    backupUrl: 'https://telegra.ph/file/1743409234018.jpg',
    settings: {
        width: window.innerWidth,
        height: window.innerHeight,
        blur: 0,
        bgColor: '#111111',
        version: '2.0'
    }
};

function initBackground() {
    // Основная установка
    setBackground(BACKGROUND_CONFIG.url);
    
    // Резервная через 1 секунду
    setTimeout(() => {
        if (!checkBackgroundApplied()) {
            setBackground(BACKGROUND_CONFIG.backupUrl);
        }
    }, 1000);
    
    // Обновление при ресайзе
    window.addEventListener('resize', () => {
        BACKGROUND_CONFIG.settings.width = window.innerWidth;
        BACKGROUND_CONFIG.settings.height = window.innerHeight;
        setBackground(BACKGROUND_CONFIG.url);
    });
}

function setBackground(url) {
    try {
        const config = { ...BACKGROUND_CONFIG.settings, url };
        
        // Для всех версий Telegram
        ['z-background', 'kz-background', 'tg-background'].forEach(key => {
            localStorage.setItem(key, JSON.stringify(config));
        });
        
        // CSS-дублирование
        document.body.style.background = `
            url('${url}') 
            center/cover 
            no-repeat 
            fixed
            ${BACKGROUND_CONFIG.settings.bgColor}
        `;
        
        console.log('Фон установлен:', url);
        return true;
    } catch (e) {
        console.error('Ошибка установки фона:', e);
        return false;
    }
}

function checkBackgroundApplied() {
    return document.body.style.backgroundImage.includes(BACKGROUND_CONFIG.url) ||
           Object.keys(localStorage).some(key => key.includes('background'));
}

// ===== ФИЛЬТРЫ ===== 
// ... (все ваши функции фильтров остаются без изменений)
filterButton.addEventListener('click', () => {
    filterModal.style.display = 'block';
    document.body.classList.add('no-scroll');
});

// ... (остальные обработчики фильтров)

// ===== БЫСТРЫЙ ПРОСМОТР =====
// ... (ваш существующий код быстрого просмотра)

// ===== ИНИЦИАЛИЗАЦИЯ =====
window.addEventListener('DOMContentLoaded', () => {
    // Инициализация системы фона
    initBackground();
    
    // Ваша существующая инициализация
    loadFilters();
    applyFilters();
    
    // Интеграция с Telegram WebApp
    if (window.Telegram?.WebApp) {
        Telegram.WebApp.expand();
        Telegram.WebApp.enableClosingConfirmation();
        
        // Дополнительная проверка фона для Telegram
        Telegram.WebApp.onEvent('viewportChanged', () => {
            setTimeout(initBackground, 300);
        });
    }
    
    // Финалная проверка через 3 секунды
    setTimeout(() => {
        if (!checkBackgroundApplied()) {
            console.warn('Фон не применился, пробуем резервный метод');
            document.body.style.background = `
                linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)),
                url('${BACKGROUND_CONFIG.backupUrl}')
                center/cover
            `;
        }
    }, 3000);
});
