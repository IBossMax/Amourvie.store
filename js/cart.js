// Variabile pentru coș
let cart = [];
let cartCount = document.getElementById("cart-count");
let cartTotal = document.getElementById("cart-total");
let cartItems = document.getElementById("cart-items");
let cartDropdown = document.getElementById("cart-dropdown");
let clearCartButton = document.getElementById("clear-cart");

// Funcție pentru adăugarea unui produs în coș
function addToCart(productId, productName, productPrice, size) {
    let existingProduct = cart.find(item => item.id === productId && item.size === size);

    if (existingProduct) {
        existingProduct.quantity += 1; // Dacă produsul există, creștem cantitatea
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            size: size,
            quantity: 1
        });
    }

    updateCart();
}

// Funcție pentru actualizarea coșului
function updateCart() {
    // Actualizăm numărul de produse din coș
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Calculăm totalul
    let total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);

    // Actualizăm lista de produse din coș
    cartItems.innerHTML = "";
    cart.forEach(item => {
        let cartItem = document.createElement("li");
        cartItem.innerHTML = `
            ${item.name} (${item.size}) x${item.quantity} - ${item.price * item.quantity} Lei
            <button class="adjust-quantity" data-id="${item.id}" data-size="${item.size}" data-action="minus">-</button>
            <button class="adjust-quantity" data-id="${item.id}" data-size="${item.size}" data-action="plus">+</button>
        `;
        cartItems.appendChild(cartItem);
    });

    // Adăugăm evenimentele pentru butoanele de plus și minus
    document.querySelectorAll('.adjust-quantity').forEach(button => {
        button.addEventListener('click', (event) => {
            let action = event.target.getAttribute('data-action');
            let productId = event.target.getAttribute('data-id');
            let size = event.target.getAttribute('data-size');
            adjustQuantity(productId, size, action);
        });
    });
}

// Funcție pentru ajustarea cantității unui produs din coș
function adjustQuantity(productId, size, action) {
    let product = cart.find(item => item.id === productId && item.size === size);

    if (product) {
        if (action === "plus") {
            product.quantity += 1;
        } else if (action === "minus" && product.quantity > 1) {
            product.quantity -= 1;
        }
    }

    updateCart();
}

// Funcție pentru a deschide și închide dropdown-ul coșului
function toggleCart() {
    cartDropdown.style.display = cartDropdown.style.display === "block" ? "none" : "block";
}

// Funcție pentru a șterge coșul
clearCartButton.addEventListener("click", () => {
    cart = [];
    updateCart();
});

// Eveniment pentru a deschide coșul când apesi pe icoana de coș
document.getElementById("cart-icon").addEventListener("click", toggleCart);

// Eveniment pentru butoanele de adăugare în coș
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        let productId = button.getAttribute('data-product');
        let productName = button.getAttribute('data-name');
        let productPrice = button.getAttribute('data-price');
        let size = button.closest('.box').querySelector('.size.active')?.dataset.size;

        if (!size) {
            alert("Alegeți o mărime!");
            return;
        }

        addToCart(productId, productName, productPrice, size);
    });
});



// Eveniment pentru selecția mărimii
document.querySelectorAll('.size').forEach(sizeElement => {
    sizeElement.addEventListener('click', () => {
        // Îndepărtăm clasa "active" de la celelalte elemente
        sizeElement.parentElement.querySelectorAll('.size').forEach(s => s.classList.remove('active'));

        // Adăugăm clasa "active" la mărimea selectată
        sizeElement.classList.add('active');
    });
});
// Încarcă coșul din localStorage când pagina se încarcă
window.onload = () => {
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCart();
    }
};

// Modifică funcția de adăugare a produselor în coș pentru a salva în localStorage
function addToCart(productId, productName, productPrice, size) {
    let existingProduct = cart.find(item => item.id === productId && item.size === size);

    if (existingProduct) {
        existingProduct.quantity += 1; // Dacă produsul există, creștem cantitatea
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            size: size,
            quantity: 1
        });
    }

    // Salvăm cart-ul în localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Modifică funcția de ajustare a cantității pentru a actualiza localStorage
function adjustQuantity(productId, size, action) {
    let product = cart.find(item => item.id === productId && item.size === size);

    if (product) {
        if (action === "plus") {
            product.quantity += 1;
        } else if (action === "minus" && product.quantity > 1) {
            product.quantity -= 1;
        }

        // Salvăm cart-ul în localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    updateCart();
}

// Funcție pentru a șterge coșul
clearCartButton.addEventListener("click", () => {
    cart = [];
    // Ștergem cart-ul din localStorage
    localStorage.removeItem('cart');
    updateCart();
});
