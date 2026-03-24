import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./features/quiz/pages/client/Login";
import Register from "./features/quiz/pages/client/Register";
import Navbar from "./components/Navbar";
import QuizPage from "./features/quiz/pages/client/QuizPage";
// import QuizTest from "./pages/client/QuizTest";
// import { AdminSidebar } from "./pages/server/AdminSidebar";
import { AdminLayout } from "./features/quiz/pages/server/AdminLayout";
import { AdminDashboard } from "./features/quiz/pages/server/AdminDashboard";
import { AdminQuizPage } from "./features/quiz/pages/server/AdminQuizPage";
import { AdminReport } from "./features/quiz/pages/server/AdminReport";
import { SettingsPage } from "./features/quiz/pages/server/SettingsPage";
import { StudentsManagement } from "./features/quiz/pages/server/StudentsManagement";
import Home from "./features/quiz/pages/client/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import QuizTest from "./features/quiz/pages/client/QuizTest";
import AdminLogin from "./features/quiz/pages/server/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import { LoadQuestions } from "./features/quiz/pages/server/LoadQuestions";
import Problems from "./features/quiz/pages/client/Problems";
import CodeEditorApp from "./features/quiz/pages/client/CodeEditorApp";
// import AdminRegister from "./features/quiz/pages/server/AdminRegister";
import EmployeeRegistration from "./features/quiz/pages/server/EmployeeRegistration";
import AdminRequests from "./features/quiz/pages/server/AdminRequests";
import Employees from "./features/quiz/pages/server/Employees";
import CRMDashboard from "./features/quiz/components/Crmdashboard";

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
                 {/* <CRMDashboard/> */}
              </AdminProtectedRoute>
            }
          />
          <Route
            path="students"
            element={
              <AdminProtectedRoute>
                <StudentsManagement />
              </AdminProtectedRoute>
            }
          />
          <Route path="quiz" element={<AdminProtectedRoute><AdminQuizPage /></AdminProtectedRoute>} />
          <Route path="loadquestions" element={<AdminProtectedRoute><LoadQuestions /></AdminProtectedRoute>} />
          <Route path="reports" element={<AdminProtectedRoute><AdminReport /></AdminProtectedRoute>} />
          <Route path="requests" element={<AdminProtectedRoute><AdminRequests /></AdminProtectedRoute>} />
          <Route path="employees" element={<AdminProtectedRoute><Employees /></AdminProtectedRoute>} />
          <Route path="settings" element={<AdminProtectedRoute><SettingsPage /></AdminProtectedRoute>} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        {/* <Route path="/admin/register123" element={<AdminRegister />} /> */}
        <Route path="/employee/register123" element={<EmployeeRegistration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/quiz/:encryptedQuizCode"
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
          <Route path="quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
          <Route path="problems" element={<Problems />} />
       
        </Route>
           <Route path="/editor" element={<CodeEditorApp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
