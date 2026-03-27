import React from "react";
import { Outlet } from "react-router";
import Footer from "../pages/Footer";
import Navbar from "../pages/Navbar";
import InspirationalPopup from "../pages/InspoPopUp";

const Root = () => {
  return (
    <>
        <Navbar />
        <Outlet />
        <InspirationalPopup />
    </>
  );
};

export default Root;