import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./index.css"
import AuthProvider from "./context/Auth";
import ProductProvider from "./context/Product";
import CartProvider from "./context/Cart";
import WishlistProvider from "./context/Wishlist";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <ProductProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
