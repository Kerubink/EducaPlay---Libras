import React from "react";

const MainContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-1 p-6 bg-gray-100">
      {children}
    </main>
  );
};

export default MainContent;
