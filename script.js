
const foods = [
    {
        id: 1,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 199,
        description: "Delicious cheese pizza",
        image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=500"
    },
    {
        id: 2,
        name: "Veg Burger",
        category: "Burger",
        price: 129,
        description: "Crispy vegetable burger",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
    },
    {
        id: 3,
        name: "French Fries",
        category: "Snacks",
        price: 89,
        description: "Crispy golden fries",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500"
    },
    {
        id: 4,
        name: "Chocolate Cake",
        category: "Dessert",
        price: 149,
        description: "Rich chocolate dessert",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500"
    },
    {
        id: 5,
        name: "Cold Coffee",
        category: "Drinks",
        price: 99,
        description: "Refreshing cold coffee",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500"
    },
    {
        id: 6,
        name: "Chicken Pizza",
        category: "Pizza",
        price: 249,
        description: "Tasty chicken pizza",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"
    },
    {
        id: 7,
        name: "Chicken Burger",
        category: "Burger",
        price: 179,
        description: "Juicy chicken burger",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=500"
    },
    {
        id: 8,
        name: "Ice Cream",
        category: "Dessert",
        price: 79,
        description: "Sweet and creamy ice cream",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500"
    }
];

// Restore cart data from Local Storage
let cart = [];

try {
    const savedCart = JSON.parse(
        localStorage.getItem("foodieCart")
    );

    if (Array.isArray(savedCart)) {
        cart = savedCart.filter(item =>
            foods.some(food => food.id === item.id) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            item.quantity <= 99
        );
    }
} catch (error) {
    cart = [];
}

// Display food menu
function displayFoods() {
    const foodList = document.getElementById("food-list");
    const searchText = document.getElementById("search")
        .value.toLowerCase().trim();
    const category = document.getElementById("category-filter").value;

    const filteredFoods = foods.filter(food => {
        const matchesSearch =
            food.name.toLowerCase().includes(searchText) ||
            food.description.toLowerCase().includes(searchText);

        const matchesCategory =
            category === "all" || food.category === category;

        return matchesSearch && matchesCategory;
    });

    if (filteredFoods.length === 0) {
        foodList.innerHTML = "<p>No food items found.</p>";
        return;
    }

    foodList.innerHTML = filteredFoods.map(food => `
        <div class="food-card">
            <img src="${food.image}"
                 alt="${food.name}"
                 loading="lazy">
            <h3>${food.name}</h3>
            <p>${food.description}</p>
            <p>Category: ${food.category}</p>
            <p class="price">₹${food.price}</p>
            <button onclick="addToCart(${food.id})">
                Add to Cart
            </button>
        </div>
    `).join("");
}

// Save cart in Local Storage
function saveCart() {
    localStorage.setItem("foodieCart", JSON.stringify(cart));
}

// Add food to cart
function addToCart(id) {
    const item = cart.find(food => food.id === id);

    if (item) {
        if (item.quantity >= 99) {
            alert("Maximum quantity reached!");
            return;
        }
        item.quantity++;
    } else {
        cart.push({ id: id, quantity: 1 });
    }

    saveCart();
    displayCart();
}

// Change quantity
function changeQuantity(id, amount) {
    const item = cart.find(food => food.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(food => food.id !== id);
    } else if (item.quantity > 99) {
        item.quantity = 99;
        alert("Maximum quantity is 99.");
    }

    saveCart();
    displayCart();
}

// Remove item from cart
function removeFromCart(id) {
    cart = cart.filter(food => food.id !== id);
    saveCart();
    displayCart();
}

// Display cart and calculate total
function displayCart() {
    const cartItems = document.getElementById("cart-items");
    const totalElement = document.getElementById("total");
    const countElement = document.getElementById("cart-count");

    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItems.textContent = "Your cart is empty.";
    } else {
        cartItems.innerHTML = cart.map(item => {
            const food = foods.find(f => f.id === item.id);

            if (!food) return "";

            const subtotal = food.price * item.quantity;
            total += subtotal;
            count += item.quantity;

            return `
                <div class="cart-item">
                    <div>
                        <strong>${food.name}</strong>
                        <p>₹${food.price} × ${item.quantity}
                           = ₹${subtotal}</p>
                    </div>
                    <div>
                        <button onclick="changeQuantity(${food.id}, -1)"
                                aria-label="Decrease quantity">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${food.id}, 1)"
                                aria-label="Increase quantity">+</button>
                        <button onclick="removeFromCart(${food.id})">
                            Remove
                        </button>
                    </div>
                </div>
            `;
        }).join("");
    }

    totalElement.textContent = total;
    countElement.textContent = count;
}

// Search and category filter
document.getElementById("search")
    .addEventListener("input", displayFoods);

document.getElementById("category-filter")
    .addEventListener("change", displayFoods);

// Customer validation and order confirmation
document.getElementById("order-form")
    .addEventListener("submit", function(event) {
        event.preventDefault();

        if (cart.length === 0) {
            alert("Please add food items to your cart first!");
            return;
        }

        const name = document.getElementById("customer-name")
            .value.trim();
        const phone = document.getElementById("customer-phone")
            .value.trim();
        const address = document.getElementById("customer-address")
            .value.trim();

        if (!name || !/^[0-9]{10}$/.test(phone) || !address) {
            alert("Please enter valid customer details.");
            return;
        }

        const total = cart.reduce((sum, item) => {
            const food = foods.find(f => f.id === item.id);
            return sum + food.price * item.quantity;
        }, 0);

        const message = document.getElementById("order-message");

        message.textContent =
            `Thank you, ${name}! Your demo order of ₹${total} ` +
            `has been placed successfully.`;

        cart = [];
        saveCart();
        displayCart();
        this.reset();

        document.getElementById("cart").scrollIntoView({
            behavior: "smooth"
        });
    });

// Initial page setup
displayFoods();
displayCart();
