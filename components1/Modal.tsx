"use client";
import { cn } from "@/lib/utils";
import React from "react";

const Modal = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bottom-0">
      <style jsx global>{`
        body {
          overflow: hidden !important;
          overscroll-behavior: contain;
          position: relative !important;
          padding-left: 0px;
          padding-top: 0px;
          padding-right: 0px;
          margin-left: 0;
          margin-top: 0;
          margin-right: 4px !important;
        }
      `}</style>
      <div className="absolute top-0 left-0 bottom-0 right-0 backdrop-blur-sm z-[1]" />
      <div className="absolute top-0 left-0 right-0 h-screen overflow-y-scroll z-[2]">
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-screen overscroll-y-auto w-full max-w-lg md:w-full lg:max-w-screen-lg",
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
