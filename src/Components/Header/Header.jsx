import React, { useContext } from "react";
import classes from "./Header.module.css";
import { IoLocationOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import LowerHead from "./LowerHead";
import {Link} from "react-router-dom"
import { DataContext } from "../DataProvider/DataProvider";
import {auth} from "../Utility/firebase";


function Header() {
  const [{ user,basket },dispatch] = useContext(DataContext);
    const selectedItemTotal= basket.reduce((amount, item) => {
      return amount + item.amount;
    }, 0);
  return (
    <section className={classes.fixed}>
      <section>
        <div className={classes.header_container}>
          {/* logo */}
          <div className={classes.logo_container}>
            <Link to="/">
              <img
                src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
                alt="amazon logo"
              />
              <span>.com.et</span>
            </Link>
          </div>
          {/* Delivery */}
          <div className={classes.delivery}>
            <span>
              <IoLocationOutline size={20} />
            </span>
            <div>
              <span>Delivery to Addis Ababa,Ethiopia</span>
              <p>Update location</p>
            </div>
          </div>

          {/* search section*/}
          <div className={classes.search}>
            <select name="" id="">
              <option value="">All</option>
            </select>
            <input
              type="text"
              name=""
              id=""
              placeholder="Search Amazon.com.et"
            />
            <IoIosSearch size={25} />
          </div>
          {/* right side link */}
          <div className={classes.order_container}>
            {/* flag */}
            <Link to="#" className={classes.language}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/71/Flag_of_Ethiopia.svg"
                alt="flag"
              />
              <select name="" id="">
                <option value="">EN</option>
              </select>
            </Link>
            {/* signin */}
            <Link to={!user && "/auth"} className={classes.Account}>
              <div >
                {user ? (
                  <>
                    <p>Hello,{user?.email?.split("@")[0]}</p>
                    <span onClick={()=>auth.signOut()}>Sign Out</span>
                  </>
                ) : (
                  <>
                    <p>Hello, Sign In</p>
                    <span>Account & Lists</span>
                    <select>
                      <option value=""></option>
                    </select>
                  </>
                )}
              </div>
            </Link>
            {/* Order */}
            <Link to="/order">
              <p>Return</p>
              <span>& Orders</span>
            </Link>
            {/* cart */}
            <Link to="/cart" className={classes.cart}>
              <FiShoppingCart size={35} />
              <span>{selectedItemTotal}</span>
              <p>Basket</p>
            </Link>
          </div>
        </div>
      </section>
      <LowerHead />
    </section>
  );
}
export default Header;
