import { useEffect, useState } from "react";
import db from "../data_base/data_base.json";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

function App() {
  const { mensClothes: products } = db;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("Medium");

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.dec.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setIsLoading(true);
    const delay = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    document.body.style.overflow = isCartOpen ? "auto" : "hidden";
  };

  const addToCart = () => {
    if (!selectedProduct) return;

    const cartItem = {
      ...selectedProduct,
      size: selectedSize,
      quantity: 1,
      id: `${selectedProduct.title}-${selectedSize}-${Date.now()}`,
    };

    setCart((prevCart) => {
      // Check if item with same title and size already exists
      const existingItemIndex = prevCart.findIndex(
        (item) => item.title === cartItem.title && item.size === cartItem.size
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        return [...prevCart, cartItem];
      }
    });

    closeModal();
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <h1 className="logo">FashionHub</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="search-icon" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button className="cart-button" onClick={toggleCart}>
            <svg className="cart-icon" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {isLoading ? (
          <div className="loading-spinner-container">
            <div className="loading-spinner" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="products-grid">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.title + index}
                  className="product-card"
                  onClick={() => openModal(product)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="product-image-container">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="product-image"
                      loading="lazy"
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-description">{product.dec}</p>
                    <p className="product-price">{product.price} $</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="empty-title">No products found</h3>
            <p className="empty-message">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        )}
      </main>

      {/* Product Modal */}
      {isModalOpen && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-backdrop" onClick={closeModal}></div>
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="modal-header">
                <h3 className="modal-title">{selectedProduct.title}</h3>
                <button onClick={closeModal} className="modal-close-button">
                  <svg className="close-icon" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-image-container">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    className="modal-image"
                  />
                </div>
                <div className="modal-details">
                  <p className="modal-description">{selectedProduct.dec}</p>
                  <p className="modal-price">{selectedProduct.price} $</p>
                  <div className="size-selector">
                    <label htmlFor="size" className="size-label">
                      Size
                    </label>
                    <select
                      id="size"
                      className="size-select custom-select"
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                    >
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                      <option value="XL">XL</option>
                    </select>
                  </div>
                  <button className="add-to-cart-button" onClick={addToCart}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="cart-overlay">
          <div className="cart-container">
            <div className="cart-backdrop" onClick={toggleCart}></div>
            <motion.div
              className="cart-content"
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3 }}
            >
              <div className="cart-header">
                <h3 className="cart-title">Your Cart ({totalItems})</h3>
                <button onClick={toggleCart} className="cart-close-button">
                  <svg className="close-icon" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="cart-body">
                {cart.length > 0 ? (
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-image">
                          <img src={item.image} alt={item.title} />
                        </div>
                        <div className="cart-item-details">
                          <h4 className="cart-item-title">{item.title}</h4>
                          <p className="cart-item-size">Size: {item.size}</p>
                          <p className="cart-item-price">{item.price} $</p>
                          <div className="cart-item-quantity">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="quantity-button"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="quantity-button"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="cart-item-remove"
                        >
                          <svg viewBox="0 0 24 24" width="20" height="20">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="cart-empty">
                    <svg className="cart-empty-icon" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="cart-empty-message">Your cart is empty</p>
                  </div>
                )}
                {cart.length > 0 && (
                  <div className="cart-summary">
                    <div className="cart-total">
                      <span>Total:</span>
                      <span>
                        {cart.reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        )}{" "}
                        $
                      </span>
                    </div>
                    <button className="checkout-button">
                      Proceed to Checkout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
