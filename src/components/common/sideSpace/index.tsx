import React, { ReactNode } from "react";

interface SideSpaceContainerProps {
  children: ReactNode;
  className?: string;
}

const SideSpaceContainer: React.FC<SideSpaceContainerProps> = ({
  className,
  children,
}) => {
  return (
    <div
      className={`px-4 sm:px-5 md:px-8 lg:px-10 big:px-[80px] xBig:px-[112px] ${className && className}`}
    >
      {children}
    </div>
  );
};

export default SideSpaceContainer;
