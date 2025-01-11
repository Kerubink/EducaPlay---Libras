import React from "react";
import Sidebar from "../../components/Dashboard_components/Sidebar/sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Dashboard;
