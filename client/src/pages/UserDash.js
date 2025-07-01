import React from "react";

import UserMain from "./UserMain";
import DefaultLayout from "../components/DefaultLayout";
import { Route, Routes } from "react-router-dom";
import CartPage from "./CartPage";
import BillsPage from "./BillsPage";
import UserStockScreen from "./UserStockScreen";



const UserDash = () => {

  return (
    <DefaultLayout>
      <Routes>
        <Route
        path="" element={<UserMain/>}/>
      <Route
            path="cart"
            element={
                <CartPage />
            }
          />
          <Route
            path="bills"
            element={
                <BillsPage />
            }
          />
          <Route
            path="mystock"
            element={
                <UserStockScreen />
            }
          />
      </Routes>
    </DefaultLayout>
  );
};

export default UserDash;