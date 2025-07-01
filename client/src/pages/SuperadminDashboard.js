import React from "react";
import DefaultLayout from "../components/DefaultLayout";
import CreateAdminForm from "../screens/superadmin/CreateAdminForm";
import SubscriptionsScreen from "../screens/superadmin/Subscriptions";
import PackagesScreen from "../screens/superadmin/PackagesScreen";
import { Route, Routes } from "react-router-dom";
import NewRequestsScreen from "../screens/superadmin/NewRequests";
const SuperadminDashboard = () => {
  return (
    <DefaultLayout superadmin>
      <Routes>
              <Route
              path="" element={<NewRequestsScreen/>}/>
            <Route
                  path="create-admins"
                  element={
                      <CreateAdminForm />
                  }
                />
                <Route
                  path="subscriptions"
                  element={
                      <SubscriptionsScreen />
                  }
                />
                <Route
                  path="packages"
                  element={
                      <PackagesScreen />
                  }
                />
            </Routes>
    </DefaultLayout>
  );
};

export default SuperadminDashboard; 