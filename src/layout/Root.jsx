import React from "react";
import { Outlet } from "react-router";
import Footer from "../pages/Footer";
import Navbar from "../pages/Navbar";

const Root = () => {
  return (
    <>
        <Navbar />
        <Outlet />
    </>
  );
};

export default Root;