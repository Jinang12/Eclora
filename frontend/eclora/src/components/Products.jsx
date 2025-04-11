import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "./UserContext"; // Ensure correct import
import { useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext';

const Products = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); // ✅ Added cart state
  const { isLoggedIn, fetchUser, loading: authLoading } = useAuth(); // Get logged-in user's details
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        const data = await response.json();
        const filteredData = category ? data.filter((item) => item.category === category) : data;
        setProducts(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  const handleAddToCart = async (item) => {
    if (!isLoggedIn) {
      alert("Please log in to add items to the cart.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // First check if we're authenticated
      if (!isLoggedIn) {
        const authSuccess = await fetchUser();
        if (!authSuccess) {
          navigate("/login");
          return;
        }
      }
      
      const response = await fetch("http://192.168.29.216:5000/cart/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item }),
      });

      if (response.status === 401) {
        // Token expired or invalid
        const authSuccess = await fetchUser(); // Try to refresh user data
        if (!authSuccess) {
          navigate("/login");
          return;
        }
        // Retry the request
        const retryResponse = await fetch("http://192.168.29.216:5000/cart/add", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item }),
        });
        
        if (retryResponse.ok) {
          const data = await retryResponse.json();
          alert("Item added to cart successfully");
          setCart((prevCart) => [...prevCart, item]); // ✅ Update local cart state
        } else {
          const data = await retryResponse.json();
          setError(data.error || "Error adding item to cart");
          alert("Error adding item to cart");
        }
      } else if (response.ok) {
        const data = await response.json();
        alert("Item added to cart successfully");
        setCart((prevCart) => [...prevCart, item]); // ✅ Update local cart state
      } else {
        const data = await response.json();
        setError(data.error || "Error adding item to cart");
        alert("Error adding item to cart");
      }
    } catch (error) {
      console.error("Failed to add item:", error);
      setError("Error connecting to server");
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black mx-auto"></div>
        <p className="mt-3">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Button onClick={() => window.location.reload()} className="mt-3">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <Row xs={1} md={2} lg={3} className="g-4 p-3">
      {products.map((e) => (
        <Col key={e.id}>
          <Card className="h-100 card-custom">
            <Card.Img variant="top" src={e.image} alt={e.title} className="object-cover w-100" />
            <Card.Body className="d-flex flex-column justify-content-between">
              <Card.Title>{e.title}</Card.Title>
              <Card.Text className="text-muted small overflow-hidden">{e.description}</Card.Text>
              <div className="d-flex justify-content-between">
                <h5 className="text-primary mt-auto text-black">${e.price}</h5>
                <Button
                  className={`d-flex align-items-center gap-2 ${cart.some(i => i.id === e.id) ? 'bg-secondary' : 'bg-black'} border-0`}
                  onClick={() => handleAddToCart(e)}
                  disabled={cart.some(i => i.id === e.id) || loading}
                >
                  {cart.some(i => i.id === e.id) ? "In Cart" : "Add to Cart"} <FaShoppingCart size={20} />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default Products;
