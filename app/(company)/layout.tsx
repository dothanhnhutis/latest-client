import React from "react";

const CompanyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <p>CompanyLayout</p>
      {children}
    </div>
  );
};

export default CompanyLayout;
