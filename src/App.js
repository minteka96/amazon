import "./App.css";
import React from "react";
import Routing from "./Routing";
import {auth} from "./Components/Utility/firebase";
import {Type} from "./Components/Utility/action.type";
import { useContext, useEffect } from "react";
import { DataContext } from "./Components/DataProvider/DataProvider";

function App() {
  const [{user},dispatch]=useContext(DataContext);

useEffect(() => {
  auth.onAuthStateChanged((authUser) => {
    if (authUser) {
      dispatch({
        type: Type.SET_USER,
        user: authUser,
      });
    } else {
      dispatch({
        type: Type.SET_USER,
        user: null,
      });
    }
  });
}, [dispatch]);
  return (
    <div>
      <Routing />
    </div>
  );
}
export default App;
