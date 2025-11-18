// Данные привилегий (удалил WARRIOR и ELITE)
const privileges = [
    { name: "BRONZE", price: 9 },
    { name: "HERO", price: 15 },
    { name: "IRON", price: 24 },
    { name: "GHAST", price: 31 },
    { name: "ZOOMBIE", price: 45 },
    { name: "DRAGON", price: 75 },
    { name: "TITAN", price: 99 },
    { name: "PRINCE", price: 115 }
];

// Курсы валют
const exchangeRates = {
    uah: { symbol: '₴', rate: 1 },
    usd: { symbol: '$', rate: 0.027 },
    eur: { symbol: '€', rate: 0.025 }
};

let currentCurrency = 'uah';

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('privilegesGrid')) {
        loadPrivileges();
    }
    setupEventListeners();
});

// Загрузка привилегий
function loadPrivileges() {
    const grid = document.getElementById('privilegesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    privileges.forEach(privilege => {
        const priceInCurrency = (privilege.price * exchangeRates[currentCurrency].rate).toFixed(2);
        
        const card = document.createElement('div');
        card.className = 'privilege-card';
        card.innerHTML = `
            <h3 class="privilege-name">${privilege.name}</h3>
            <div class="privilege-price">${priceInCurrency} ${exchangeRates[currentCurrency].symbol}</div>
            <button class="buy-btn" onclick="showPayment(${privilege.price}, 'Привилегия ${privilege.name}')">
                Купить
            </button>
        `;
        grid.appendChild(card);
    });
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Бургер-меню
    const hamburger = document.querySelector('.hamburger-menu');
    const closeBtn = document.querySelector('.close-btn');
    
    if (hamburger) {
        hamburger.addEventListener('click', toggleSidebar);
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', toggleSidebar);
    }
    
    // Выбор валюты
    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) {
        currencySelect.addEventListener('change', function(e) {
            currentCurrency = e.target.value;
            if (document.getElementById('privilegesGrid')) {
                loadPrivileges();
            }
            updateCasePrices();
        });
    }
    
    // Закрытие модального окна
    const closeModalBtn = document.querySelector('.close-modal');
    const paymentModal = document.getElementById('paymentModal');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    if (paymentModal) {
        paymentModal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', toggleSidebar);
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Переключение бокового меню
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// Показать окно оплаты
function showPayment(priceUAH, productName) {
    const priceInCurrency = (priceUAH * exchangeRates[currentCurrency].rate).toFixed(2);
    const symbol = exchangeRates[currentCurrency].symbol;
    
    const paymentAmount = document.getElementById('paymentAmount');
    if (paymentAmount) {
        paymentAmount.textContent = `${priceInCurrency} ${symbol}`;
    }
    
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.style.display = 'block';
    }
}

// Закрыть модальное окно
function closeModal() {
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.style.display = 'none';
    }
}

// Обновление цен кейсов
function updateCasePrices() {
    document.querySelectorAll('.case-card').forEach(card => {
        const priceUAH = parseFloat(card.dataset.price);
        const priceInCurrency = (priceUAH * exchangeRates[currentCurrency].rate).toFixed(2);
        const symbol = exchangeRates[currentCurrency].symbol;
        
        const btn = card.querySelector('.buy-btn');
        if (btn) {
            btn.setAttribute('onclick', `showPayment(${priceUAH}, '${card.querySelector('h3').textContent}')`);
        }
    });
}

// Копирование текста в буфер обмена
function copyToClipboard(text) {
    // Создаем временный input элемент
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    
    // Выделяем и копируем текст
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // Для мобильных устройств
    
    try {
        const successful = document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        if (successful) {
            // Показываем уведомление об успешном копировании
            const btn = event.target;
            const originalText = btn.textContent;
            const originalBackground = btn.style.background;
            
            btn.textContent = 'СКОПИРОВАНО!';
            btn.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
            btn.style.color = '#000';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = originalBackground;
                btn.style.color = 'white';
            }, 2000);
        }
    } catch (err) {
        document.body.removeChild(tempInput);
        console.error('Ошибка копирования: ', err);
        
        // Альтернативный способ через Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function() {
                const btn = event.target;
                const originalText = btn.textContent;
                const originalBackground = btn.style.background;
                
                btn.textContent = 'СКОПИРОВАНО!';
                btn.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
                btn.style.color = '#000';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = originalBackground;
                    btn.style.color = 'white';
                }, 2000);
            }).catch(function(err) {
                console.error('Ошибка Clipboard API: ', err);
                alert('Не удалось скопировать текст. Скопируйте вручную: ' + text);
            });
        } else {
            alert('Скопируйте текст вручную: ' + text);
        }
    }
}
