// Данные привилегий
const privileges = [
    { name: "BRONZE", price: 9 },
    { name: "HERO", price: 15 },
    { name: "IRON", price: 24 },
    { name: "GHAST", price: 31 },
    { name: "ZOOMBIE", price: 45 },
    { name: "WARRIOR", price: 60 },
    { name: "DRAGON", price: 75 },
    { name: "ELITE", price: 85 },
    { name: "TITAN", price: 99 },
    { name: "PRINCE", price: 115 }
];

// Курсы валют (примерные)
const exchangeRates = {
    uah: { symbol: '₴', rate: 1 },
    usd: { symbol: '$', rate: 0.027 },
    eur: { symbol: '€', rate: 0.025 }
};

// Текущая валюта
let currentCurrency = 'uah';

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    loadPrivileges();
    setupEventListeners();
});

// Загрузка привилегий
function loadPrivileges() {
    const grid = document.getElementById('privilegesGrid');
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
    document.querySelector('.hamburger-menu').addEventListener('click', toggleSidebar);
    document.querySelector('.close-btn').addEventListener('click', toggleSidebar);
    
    // Выбор валюты
    document.getElementById('currencySelect').addEventListener('change', function(e) {
        currentCurrency = e.target.value;
        loadPrivileges();
        updateCasePrices();
    });
    
    // Закрытие модального окна
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('paymentModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', toggleSidebar);
    });
}

// Переключение бокового меню
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

// Показать окно оплаты
function showPayment(priceUAH, productName) {
    const priceInCurrency = (priceUAH * exchangeRates[currentCurrency].rate).toFixed(2);
    const symbol = exchangeRates[currentCurrency].symbol;
    
    document.getElementById('paymentAmount').textContent = 
        `${priceInCurrency} ${symbol} (${productName})`;
    
    document.getElementById('paymentModal').style.display = 'block';
}

// Закрыть модальное окно
function closeModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

// Обновление цен кейсов
function updateCasePrices() {
    document.querySelectorAll('.case-card').forEach(card => {
        const priceUAH = parseFloat(card.dataset.price);
        const priceInCurrency = (priceUAH * exchangeRates[currentCurrency].rate).toFixed(2);
        const symbol = exchangeRates[currentCurrency].symbol;
        
        const btn = card.querySelector('.buy-btn');
        btn.setAttribute('onclick', `showPayment(${priceUAH}, '${card.querySelector('h3').textContent}')`);
    });
}

// Закрытие модального окна по ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});
