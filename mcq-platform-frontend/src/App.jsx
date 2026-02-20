import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/client/Login";
import Register from "./pages/client/Register";
import Navbar from "./components/Navbar";
import QuizPage from "./pages/client/QuizPage";
// import QuizTest from "./pages/client/QuizTest";
// import { AdminSidebar } from "./pages/server/AdminSidebar";
import { AdminLayout } from "./pages/server/AdminLayout";
import { AdminDashboard } from "./pages/server/AdminDashboard";
import { AdminQuizPage } from "./pages/server/AdminQuizPage";
import { AdminReport } from "./pages/server/AdminReport";
import { SettingsPage } from "./pages/server/SettingsPage";
import { StudentsManagement } from "./pages/server/StudentsManagement";
import Home from "./pages/client/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import QuizTest from "./pages/client/QuizTest";
import AdminLogin from "./pages/server/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import { LoadQuestions } from "./pages/server/LoadQuestions";

const App = () => {
  return (
    <>
      {/* <Navbar />
      <QuizPage />
      <QuizTest/> */}
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route
            path="dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
               </AdminProtectedRoute>
            }
          />
          <Route path="students" element={<StudentsManagement />} />
          <Route path="quiz" element={<AdminQuizPage />} />
          <Route path="loadquestions" element={<LoadQuestions />} />
          <Route path="reports" element={<AdminReport />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/quiz/:encryptedQuizId"
          element={
            <ProtectedRoute>
              <QuizTest />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navbar />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="quiz" element={<QuizPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
