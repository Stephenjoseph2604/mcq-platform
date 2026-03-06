import React from "react";

const FloatingParticles = () => {
  return (
    <div className="fixed  inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-20 -right-10 w-80 h-80 bg-[var(--color-primary)]/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-1/4 left-5 w-64 h-64 bg-[var(--color-secondary)]/20 rounded-full blur-3xl blob-delay-2"></div>
      <div className="absolute bottom-1/4 -left-10 w-96 h-96 bg-[var(--color-primary)]/15 rounded-full blur-3xl blob-delay-4"></div>
      <div className="absolute top-1/2 right-5 w-72 h-72 bg-[var(--color-secondary)]/15 rounded-full blur-3xl blob-delay-6"></div>
    </div>
  );
};

export default FloatingParticles;
