import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center items-center">
      <div>{children}</div>
    </div>
  );
};

export default layout;
