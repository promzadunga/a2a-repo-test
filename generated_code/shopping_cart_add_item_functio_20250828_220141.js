```javascript
// Cart Item class
class CartItem {
    constructor(id, name, price, quantity = 1) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }
}

// Shopping Cart class
class ShoppingCart {
    constructor() {
        this.items = new Map();
        this.totalItems = 0;
        this.totalPrice = 0;
    }

    addItem(item) {
        if (this.items.has(item.id)) {
            // If item exists, increase quantity
            const existingItem = this.items.get(item.id);
            existingItem.quantity += item.quantity;
            this.items.set(item.id, existingItem);
        } else {
            // Add new item
            this.items.set(item.id, item);
        }

        this.calculateTotals();
        this.emitChangeEvent();
    }

    calculateTotals() {
        this.totalItems = 0;
        this.totalPrice = 0;

        for (const item of this.items.values()) {
            this.totalItems += item.quantity;
            this.totalPrice += item.price * item.quantity;
        }
    }

    emitChangeEvent() {
        // Dispatch custom event when cart changes
        const event = new CustomEvent('cartChanged', {
            detail: {
                items: Array.from(this.items.values()),
                totalItems: this.totalItems,
                totalPrice: this.totalPrice
            }
        });
        document.dispatchEvent(event);
    }
}

// Usage example
const cart = new ShoppingCart();

// Add item button click handler
function handleAddToCart(productId, productName, productPrice) {
    const newItem = new CartItem(productId, productName, productPrice);
    cart.addItem(newItem);
}

// Listen for cart changes
document.addEventListener('cartChanged', (event) => {
    const { items, totalItems, totalPrice } = event.detail;
    
    // Update UI with new cart data
    updateCartUI(items, totalItems, totalPrice);
});

// Update UI helper function
function updateCartUI(items, totalItems, totalPrice) {
    // Example UI update
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');

    // Clear existing items
    cartItemsContainer.innerHTML = '';

    // Add each item to the UI
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            <span>${item.name}</span>
            <span>Quantity: ${item.quantity}</span>
            <span>Price: $${(item.price * item.quantity).toFixed(2)}</span>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    // Update totals
    cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;
    cartCount.textContent = `Items: ${totalItems}`;
}
```