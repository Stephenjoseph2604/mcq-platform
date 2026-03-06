import React from "react";

const AdminHeader = ({title, des}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
          {title}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-primary)]/50 to-[var(--color-secondary)]/50 rounded-full"></div>
        <p className="text-[var(--color-text-muted)] text-sm font-medium">
          {des}
        </p>
      </div>
    </div>
  );
};


export default AdminHeader;
