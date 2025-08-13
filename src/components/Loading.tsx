import { CircularProgress } from "@mui/material";
import React from "react";

const Loading = () => {
  return (
    <div
      className="w-full h-full absolute block top-0 left-0 bg-white opacity-75"
      style={{ zIndex: 99 }}
    >
      <span
        className="text-green-500 opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0"
        style={{ top: "50%" }}
      >
        <CircularProgress />
      </span>
    </div>
  );
};

export default Loading;
