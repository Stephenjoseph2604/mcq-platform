import React from "react";

const AdminHeader = ({title,des}) => {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
           {title}
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            {des}
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminHeader;
