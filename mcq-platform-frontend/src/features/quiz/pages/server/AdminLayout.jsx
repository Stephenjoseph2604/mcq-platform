// AdminLayout.jsx
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import DotGrid from "../../../../components/DotGrid";
import FloatingParticles from "../../../../components/FloatingParticles";
// import { SettingsPage } from "./SettingsPage";
// import { AdminQuizPage } from "./AdminQuizPage";
// import { LoadQuestions } from "./LoadQuestions";
// import { AdminReport } from "./AdminReport";
// import { AdminDashboard } from "./AdminDashboard";

export const AdminLayout = () => {
  return (
    <div className="min-h-screen  bg-bg flex">
      <AdminSidebar />
      <main className="flex-1 lg:w-[80vw]    ">
        <DotGrid />
        <FloatingParticles/>
        {/* <SettingsPage/>
        <AdminQuizPage/>
        <LoadQuestions/>
        <AdminReport/>
        <AdminDashboard/> */}
        <Outlet />
      </main>
    </div>
  );
};
