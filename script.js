// E-commerce Store JavaScript

// Global variables
let products = [];
let cart = [];
let users = [];
let currentUser = null;
let orders = [];

// Sample products data
const sampleProducts = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        description: "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
        price: 99.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        stock: 50
    },
    {
        id: 2,
        name: "Premium Cotton T-Shirt",
        description: "Soft, comfortable 100% organic cotton t-shirt available in multiple colors. Sustainable and eco-friendly fashion choice.",
        price: 24.99,
        category: "clothing",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
        stock: 100
    },
    {
        id: 3,
        name: "JavaScript: The Definitive Guide",
        description: "Comprehensive guide to JavaScript programming language. Perfect for beginners and advanced developers alike.",
        price: 39.99,
        category: "books",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
        stock: 25
    },
    {
        id: 4,
        name: "Smart Fitness Watch",
        description: "Advanced fitness tracking with heart rate monitor, GPS, and 7-day battery life. Perfect companion for your fitness journey.",
        price: 199.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
        stock: 30
    },
    {
        id: 5,
        name: "Classic Denim Jeans",
        description: "Timeless straight-cut denim jeans made from premium quality fabric. Comfortable fit for everyday wear.",
        price: 59.99,
        category: "clothing",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop",
        stock: 75
    },
    {
        id: 6,
        name: "Python Programming Cookbook",
        description: "Learn Python programming with practical recipes and real-world examples. Great for data science and web development.",
        price: 44.99,
        category: "books",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop",
        stock: 40
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadProducts();
    updateCartUI();
    checkUserSession();
});

// Initialize app data
function initializeApp() {
    // Load data from memory (simulating database)
    const storedProducts = getFromStorage('products');
    const storedCart = getFromStorage('cart');
    const storedUsers = getFromStorage('users');
    const storedOrders = getFromStorage('orders');
    const storedCurrentUser = getFromStorage('currentUser');

    products = storedProducts || sampleProducts;
    cart = storedCart || [];
    users = storedUsers || [];
    orders = storedOrders || [];
    currentUser = storedCurrentUser || null;

    // Save initial data if not exists
    if (!storedProducts) saveToStorage('products', products);
}

// Memory storage functions (replacing localStorage)
function saveToStorage(key, data) {
    window[key] = JSON.stringify(data);
}

function getFromStorage(key) {
    try {
        return window[key] ? JSON.parse(window[key]) : null;
    } catch (e) {
        return null;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.getElementById('cart-btn').addEventListener('click', openCart);
    document.getElementById('login-btn').addEventListener('click', openLogin);
    document.getElementById('register-btn').addEventListener('click', openRegister);
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Modal close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Forms
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('checkout-form').addEventListener('submit', handleCheckout);

    // Search and filter
    document.getElementById('search-input').addEventListener('input', filterProducts);
    document.getElementById('category-filter').addEventListener('change', filterProducts);

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', openCheckout);

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Product functions
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description.substring(0, 100)}...</p>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-actions">
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                <button class="view-details-btn" onclick="viewProduct(${product.id})">Details</button>
            </div>
        </div>
    `;
    return card;
}

function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const productDetail = document.getElementById('product-detail');
    productDetail.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-detail-info">
                <h2 class="product-detail-title">${product.name}</h2>
                <div class="product-detail-price">${product.price.toFixed(2)}</div>
                <p class="product-detail-description">${product.description}</p>
                <div class="quantity-selector">
                    <label for="product-quantity">Quantity:</label>
                    <input type="number" id="product-quantity" value="1" min="1" max="${product.stock}">
                </div>
                <button class="btn btn-success" onclick="addToCartWithQuantity(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;

    document.getElementById('product-modal').style.display = 'block';
}

function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;

    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Cart functions
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            quantity: quantity,
            price: product.price
        });
    }

    saveToStorage('cart', cart);
    updateCartUI();
    showNotification('Product added to cart!', 'success');
}

function addToCartWithQuantity(productId) {
    const quantity = parseInt(document.getElementById('product-quantity').value);
    addToCart(productId, quantity);
    closeModal();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveToStorage('cart', cart);
    updateCartUI();
    loadCartItems();
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.productId === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveToStorage('cart', cart);
    updateCartUI();
    loadCartItems();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function loadCartItems() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666;">Your cart is empty</p>';
        document.getElementById('cart-total').textContent = '0.00';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return;

        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-title">${product.name}</div>
                <div class="cart-item-price">${product.price.toFixed(2)} each</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateCartQuantity(${product.id}, -1)">-</button>
                <span style="margin: 0 10px;">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartQuantity(${product.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${product.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    document.getElementById('cart-total').textContent = total.toFixed(2);
}

// User authentication functions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        saveToStorage('currentUser', currentUser);
        updateUserUI();
        closeModal();
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (users.find(u => u.email === email)) {
        showNotification('Email already exists', 'error');
        return;
    }

    const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        password: password
    };

    users.push(newUser);
    saveToStorage('users', users);
    
    currentUser = newUser;
    saveToStorage('currentUser', currentUser);
    
    updateUserUI();
    closeModal();
    showNotification('Registration successful!', 'success');
}

function logout() {
    currentUser = null;
    saveToStorage('currentUser', null);
    updateUserUI();
    showNotification('Logged out successfully', 'success');
}

function updateUserUI() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userWelcome = document.getElementById('user-welcome');

    if (currentUser) {
        loginBtn.classList.add('hidden');
        registerBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        userWelcome.classList.remove('hidden');
        userWelcome.textContent = `Welcome, ${currentUser.name}!`;
    } else {
        loginBtn.classList.remove('hidden');
        registerBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        userWelcome.classList.add('hidden');
    }
}

function checkUserSession() {
    updateUserUI();
}

// Checkout functions
function openCheckout() {
    if (!currentUser) {
        showNotification('Please login to proceed with checkout', 'error');
        openLogin();
        return;
    }

    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    loadCheckoutItems();
    document.getElementById('checkout-modal').style.display = 'block';
    closeModal();
}

function loadCheckoutItems() {
    const checkoutItems = document.getElementById('checkout-items');
    checkoutItems.innerHTML = '';

    let total = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return;

        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        checkoutItem.innerHTML = `
            <span>${product.name} x${item.quantity}</span>
            <span>${itemTotal.toFixed(2)}</span>
        `;
        checkoutItems.appendChild(checkoutItem);
    });

    document.getElementById('checkout-total').textContent = total.toFixed(2);
}

function handleCheckout(e) {
    e.preventDefault();

    const orderData = {
        id: orders.length + 1,
        userId: currentUser.id,
        items: [...cart],
        total: parseFloat(document.getElementById('checkout-total').textContent),
        shippingAddress: {
            address: document.getElementById('shipping-address').value,
            city: document.getElementById('shipping-city').value,
            zip: document.getElementById('shipping-zip').value
        },
        paymentInfo: {
            cardNumber: document.getElementById('card-number').value,
            expiry: document.getElementById('card-expiry').value,
            cvv: document.getElementById('card-cvv').value
        },
        orderDate: new Date().toISOString(),
        status: 'processing'
    };

    orders.push(orderData);
    saveToStorage('orders', orders);

    // Clear cart
    cart = [];
    saveToStorage('cart', cart);
    updateCartUI();

    // Close checkout modal and show success
    closeModal();
    showSuccessMessage();
}

// Utility functions
function openCart() {
    loadCartItems();
    document.getElementById('cart-modal').style.display = 'block';
}

function openLogin() {
    document.getElementById('login-modal').style.display = 'block';
}

function openRegister() {
    document.getElementById('register-modal').style.display = 'block';
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

function showSuccessMessage() {
    document.getElementById('success-message').classList.remove('hidden');
}

function closeSuccessMessage() {
    document.getElementById('success-message').classList.add('hidden');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1003;
        animation: slideInRight 0.3s ease;
    `;

    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        default:
            notification.style.backgroundColor = '#007bff';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);