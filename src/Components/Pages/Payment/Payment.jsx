
import React, { useContext, useState } from "react";
import classes from "./Payment.module.css";
import LayOut from "../../LayOut/LayOut";
import { DataContext } from "../../DataProvider/DataProvider";
import ProductCard from "../../Product/ProductCard";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../CurrencyFormate/CurrenyFormate";
import { axiosInstance } from "../../../API/axios";
import { BeatLoader } from "react-spinners";
import { db } from "../../Utility/firebase";
import { useNavigate } from "react-router-dom";
import { Type } from "../../Utility/action.type";

function Payment() {
  const [{ user, basket }, dispatch] = useContext(DataContext);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [cardErr, setCardErr] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Calculate total amount and selected item count
  const total = basket.reduce(
    (amount, item) => amount + item.price * item.amount,
    0
  );
  const selectedItemTotal = basket.reduce(
    (amount, item) => amount + item.amount,
    0
  );

  // Handle card element changes
  const handleChange = (e) => {
    setCardErr(e.error ? e.error.message : "");
  };

  // Handle payment process
  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // 1. Request a client secret from backend
      const { data } = await axiosInstance.post(
        `/payment/create?total=${total * 100}`
      );
      const clientSecret = data?.client_secret;

      // 2. Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card: elements.getElement(CardElement) },
        }
      );

      if (error) {
        setCardErr(error.message);
        setProcessing(false);
        return;
      }

      // 3. Save payment details to Firestore and clear basket
      await db
        .collection("users")
        .doc(user.uid)
        .collection("orders")
        .doc(paymentIntent.id)
        .set({
          basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
        });

      dispatch({ type: Type.EMPTY_BASKET });
      navigate("/order", { state: { msg: "You have placed a new order" } });
    } catch (error) {
      console.error("Payment error: ", error);
      setCardErr("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <LayOut>
      {/* Header */}
      <div className={classes.Payment_header}>
        Checkout ({selectedItemTotal}) items
      </div>

      {/* Payment Method */}
      <section className={classes.Payment}>
        {/* Address */}
        <div className={classes.flex}>
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email}</div>
            <div>Arada woreda 01 House No223/802/01</div>
            <div>Addis Ababa, Ethiopia</div>
          </div>
        </div>
        <hr />

        {/* Product Review */}
        <div className={classes.flex}>
          <h3>Review Items and Delivery</h3>
          <div>
            {basket.map((item, index) => (
              <ProductCard key={index} product={item} flex={true} />
            ))}
          </div>
        </div>
        <hr />

        {/* Payment Form */}
        <div className={classes.flex}>
          <h3>Payment Methods</h3>
          <div className={classes.payment_card_container}>
            <form onSubmit={handlePayment}>
              {cardErr && <small style={{ color: "red" }}>{cardErr}</small>}
              <CardElement onChange={handleChange} />
              <div className={classes.payment_price}>
                <div>
                  <span>
                    Total Order | <CurrencyFormat amount={total} />
                  </span>
                </div>
                <button type="submit" disabled={processing}>
                  {processing ? (
                    <div className={classes.processing}>
                      <BeatLoader color="#000" size={10} />
                      <p>Please wait...</p>
                    </div>
                  ) : (
                    "Pay Now"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </LayOut>
  );
}

export default Payment;



// import React, { useContext, useState } from "react";
// import classes from "./Payment.module.css";
// import LayOut from "../../LayOut/LayOut";
// import { DataContext } from "../../DataProvider/DataProvider";
// import ProductCard from "../../Product/ProductCard";
// import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// import CurrencyFormat from "../../CurrencyFormate/CurrenyFormate";
// import { axiosInstance } from "../../../API/axios";
// import { BeatLoader } from "react-spinners";
// import { db } from "../../Utility/firebase";
// import { useNavigate } from "react-router-dom";

// function Payment() {
//   const [{ user, basket }, dispatch] = useContext(DataContext);
//   const selectedItemTotal = basket.reduce((amount, item) => {
//     return amount + item.amount;
//   }, 0);
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const [cardErr, setCardErr] = useState(null);
//   const [processing, setProcessing] = useState(false);

//   const handleChange = (e) => {
//     setCardErr(e.error ? e.error.message : "");
//   };
//   const total = basket.reduce((amount, item) => {
//     return amount + item.price * item.amount;
//   }, 0);

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     setProcessing(true);
//     try {
//       //1 Backend || function call to get a clientSecret
//       const response = await axiosInstance({
//         method: "POST",
//         url: `/payment/create?total=${total * 100}`,
//       });
//       const clientSecret = response.data?.client_secret;

//       //2 client side payment confirmation(on react side confirming the payment with Stripe)
//       const confirmation = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: { card: elements.getElement(CardElement) },
//       });
//       setProcessing(false);
//       if (confirmation.error) {
//         setCardErr(confirmation.error.message);
//       } else {
//         // 3 after confirmation ---> store payment information in a Firestore database and clear basket
//         // console.log(confirmation);
//         const paymentIntent = confirmation.paymentIntent;
//         await db
//           .collection("users")
//           .doc(user.uid)
//           .collection("orders")
//           .doc(paymentIntent.id)
//           .set({
//             basket: basket,
//             amount: paymentIntent.amount,
//             created: paymentIntent.created,
//           });
     
//       //  empty the basket

//       dispatch({type: Type.EMPTY_BASKET });

//       navigate("/order", { state: { msg: "you have placed new order" } });
//     } catch (error) {
//       console.log(error);
//       setProcessing(false);
//       setCardErr("Payment failed. Please try again.");
//     }
//   };

//   return (
//     <LayOut>
//       {/* header */}
//       <div className={classes.Payment_header}>
//         Checkout({selectedItemTotal}) items
//       </div>
//       {/* payment method */}
//       <section className={classes.Payment}>
//         {/* adress */}
//         <div className={classes.flex}>
//           <h3>Delivery Address</h3>
//           <div>
//             <div>{user?.email}</div>
//             <div>Arada woreda 01 House No223/802/01</div>
//             <div>Addis Ababa,Ethiopia</div>
//           </div>
//         </div>
//         <hr />
//         {/* product */}
//         <div className={classes.flex}>
//           <h3>Review items and Delivery</h3>
//           <div>
//             {basket?.map((item, index) => (
//               <ProductCard key={index} product={item} flex={true} />
//             ))}
//           </div>
//         </div>
//         <hr />
//         {/* card form */}
//         <div className={classes.flex}>
//           <h3>Payment Methods</h3>
//           <div className={classes.payment_card_container}>
//             <div>
//               <form onSubmit={handlePayment}>
//                 {/* Manages the entire payment process, including making a request
//                 to the backend to get a clientSecret, confirming the payment with Stripe, and saving the payment information to Firestore */}
//                 {cardErr && <small style={{ color: "red" }}>{cardErr}</small>}
//                 <CardElement onChange={handleChange} />{" "}
//                 {/* Updates the error state if there’s an issue with the card
//                 element. */}
//                 {/* price */}
//                 <div className={classes.payment_price}>
//                   <div>
//                     <span>
//                       Total Order | <CurrencyFormat amount={total} />
//                     </span>
//                   </div>
//                   <button type="submit">
//                     {processing ? (
//                       <div className={classes.processing}>
//                         <BeatLoader color="#000" size={10} />
//                         <p>Please wait ... </p>
//                       </div>
//                     ) : (
//                       "Pay Now"
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>
//     </LayOut>
//   );
// }

// export default Payment;