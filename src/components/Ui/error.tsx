import React from "react";

const ErrorPopup: React.FC = () => {
  return (
    <div className="relative">
      <div
        className="fixed top-0 left-0 flex justify-center items-center h-screen w-full bg-white"
        style={{ zIndex: 999 }}
      >
        <div
          className="bg-white p-8 rounded-[8px] w-[787px]"
          style={{
            boxShadow:
              "0px 8px 8px -4px rgba(16, 24, 40, 0.031), 0px 20px 24px -4px rgba(16, 24, 40, 0.078)",
          }}
        >
          <h1 className="text-center text-primary text-[32px] mb-4 font-bold">
            Oops !
          </h1>
          <h2 className="text-black text-[24px] font-semibold text-center">
            Something Went Wrong!
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;
