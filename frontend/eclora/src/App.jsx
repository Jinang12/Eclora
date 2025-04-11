import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import NavbarComponent from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Products from './components/Products';
import Cart from './components/Cart';
import Carousel from './components/Carousel';

function App() {
  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-100">
            <NavbarComponent />
            <Routes>
              <Route path="/" element={
                <>
                  <Carousel />
                  <Products />
                </>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </div>
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
