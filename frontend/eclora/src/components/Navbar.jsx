import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";

const NavbarComponent = () => {
  const { user, logout } = useUser();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <Navbar expand="lg" className="fixed top-0 w-full bg-black text-white shadow-md">
      <Container fluid>
        <Navbar.Brand className="fs-1 font-bold text-white p-3" href="#">
          Eclora
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" className="border-none focus:outline-none" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0 w-full" navbarScroll>
            <NavDropdown 
              title={<span className="text-white font-bold fs-5 p-2">Products</span>} 
              id="productsDropdown" 
              className="custom-dropdown"
            >
              <NavDropdown.Item href="/products/mens-clothing">Men's Clothing</NavDropdown.Item>
              <NavDropdown.Item href="/products/womens-clothing">Women's Clothing</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/products">Other Products</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link className="text-lg text-white hover:text-gray-300" href="#about">
              <span className="text-white font-bold fs-5 p-2">About us</span>
            </Nav.Link>
            <Nav.Link className="text-lg text-white hover:text-gray-300" href="#contact">
              <span className="text-white font-bold fs-5 p-2">Contact us</span>
            </Nav.Link>
            <Nav.Link className="text-lg text-white hover:text-gray-300" href="/cart">
              <span className="text-white font-bold fs-5 p-2">
                My Cart {cartItemCount > 0 && `(${cartItemCount})`}
              </span>
            </Nav.Link>
          </Nav>

          {user ? (
            <div className="d-flex align-items-center gap-3 p-3">
              <FaUserCircle size={40} className="text-white cursor-pointer" />
              <Button variant="outline-light" className="p-2" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-3 p-3">
              <Button className="p-2 whitespace-nowrap font-bold bg-black border-none" href="/signup">
                Sign Up
              </Button>
              <Button className="p-2 font-bold bg-black" href="/login">
                Login
              </Button>
              <FaUserCircle size={40} className="text-white cursor-pointer" />
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
