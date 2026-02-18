// AdminLayout.jsx
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { SettingsPage } from "./SettingsPage";

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex">
      <AdminSidebar />
      <main className="flex-1 lg:w-[80vw]  p-4  ">
        <SettingsPage/>
        {/* <Outlet /> */}
      </main>
    </div>
  );
};
