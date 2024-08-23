import React, { useContext, useState } from "react";
import classes from "./Auth.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { auth } from "../../Utility/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { DataContext } from "../../../Components/DataProvider/DataProvider";
import { Type } from "../../Utility/action.type";
function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [{ user }, dispatch] = useContext(DataContext);

  const [Loading, setLoading] = useState({
    signIn: false,
    creatUser: false,
  });
  const navigate = useNavigate();
  const navStateData = useLocation();
  // console.log(navStateData);

  const authHandler = async (e) => {
    e.preventDefault();
    if (e.target.name === "signIn") {
      setLoading({ ...Loading, signIn: true });
      try {
        const userInfo = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        dispatch({
          type: Type.SET_USER,
          user: userInfo.user,
        });
        setLoading({ ...Loading, signIn: false });
        navigate(navStateData?.state?.redirect || "/");
      } catch (error) {
        setErr(error.message);
        setLoading({ ...Loading, signIn: false });
      }
    } else {
      setLoading({ ...Loading, creatUser: true });
      try {
        const userInfo = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        dispatch({
          type: Type.SET_USER,
          user: userInfo.user,
        });
        setLoading({ ...Loading, creatUser: false });
        navigate(navStateData?.state?.redirect || "/");
      } catch (error) {
        setErr(error.message);
        setLoading({ ...Loading, creatUser: false });
      }
    }
  };

  return (
    <section className={classes.login}>
      {/* log */}
      <Link to="/">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
          alt="Amazon Logo"
        />
      </Link>
      {/* form */}
      <div className={classes.login_container}>
        <h1>Sign In</h1>
        {navStateData?.state?.msg && (
          <small
            style={{
              padding: "2px",
              color: "red",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {navStateData?.state?.msg}
          </small>
        )}
        <form action="">
          <div>
            <label htmlFor="email">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              placeholder="e-mail"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              placeholder="******"
            />
          </div>
          <button
            type="submit"
            name="signIn"
            onClick={authHandler}
            className={classes.signIn_btn}
          >
            {Loading.signIn ? <BeatLoader color="#000" size={10} /> : "Sign-In"}
          </button>
        </form>
        <p>
          By signing-in you agree to the AMAZON FAKE CLONE conditions of use &
          sale.Please see our privacy notice,our cookies notice and our
          interest-based ads notice.
        </p>
        <button
          type="submit"
          name="creatUser"
          onClick={authHandler}
          className={classes.createAccount_btn}
        >
          {Loading.creatUser ? (
            <BeatLoader color="#000" size={10} />
          ) : (
            "Creat Your Amazon Acount"
          )}
        </button>
        {err && (
          <small style={{ paddingTop: "6px", color: "red" }}>{err}</small>
        )}
      </div>
    </section>
  );
}

export default Auth;
