import React from "react";
import Landing from "./Components/Pages/Landing/Landing";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Cart from "./Components/Pages/Cart/Cart";
import Auth from "./Components/Pages/Auth/Auth";
import Order from "./Components/Pages/Order/Order";
import Payment from "./Components/Pages/Payment/Payment";
import Result from "./Components/Pages/Result/Result";
import ProductDetail from "./Components/Pages/ProductDetail/ProductDetail";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedRoute from "../src/Components/ProtectedRoute/ProtectedRoute";
const stripePromise = loadStripe(
  "pk_test_51Pg7wuRpaToRYVUAsB0yEldKfdaOYlzoMSJlRq0J9ZFOCg4p1KBwUdsVZk7R1Yh2YqtoUnkez7Am4RTRuOSkOy8D00aOoQnKKb"
);
function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/order"
          element={
            <ProtectedRoute
              msg={"You must log in to access your order"}
              redirect={"/Order"} >
              <Elements stripe={stripePromise}>
                <Order />
              </Elements>
            </ProtectedRoute>
          }
        />
        <Route path="/catagory/:catagoryName" element={<Result />} />
        <Route path="/products/:productID" element={<ProductDetail />} />
        <Route
          path="/payment"
          element={
            <ProtectedRoute
              msg={"You must log in to pay"}
              redirect={"/payment"}>
              <Elements stripe={stripePromise}>
                <Payment />
              </Elements>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default Routing;
