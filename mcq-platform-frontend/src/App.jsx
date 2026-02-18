import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/client/Login";
import Register from "./pages/client/Register";
import Navbar from "./components/Navbar";
import QuizPage from "./pages/client/QuizPage";
import QuizTest from "./pages/client/QuizTest";
import { AdminSidebar } from "./pages/server/AdminSidebar";
import { AdminLayout } from "./pages/server/AdminLayout";

const App = () => {
  return (
    <>

      {/* <Navbar />
      <QuizPage />
      <QuizTest/> */}
      <AdminLayout/>
      {/* <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes> */}
    </>
  );
};

export default App;
