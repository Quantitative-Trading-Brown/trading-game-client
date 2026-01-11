"use client";
import React from "react";

export const MarginCall = ({ hide }: { hide: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-white w-11/12 max-w-md p-8 relative">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold text-center">MARGIN CALL</h2>

          <p className="text-center text-lg">
            Your margin requirement has exceeded your equity for more than the
            allowed amount of time. As a result, your positions have been
            liquidated.
          </p>

          <div className="w-full space-y-4">
            <button
              onClick={hide}
              className="w-full px-6 py-2 bg-gray-700 hover:bg-gray-600 font-bold border-2 border-gray-500"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Bankruptcy = ({
  remaining,
  hide
}: {
  remaining: number;
  hide: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-white w-11/12 max-w-md p-8 relative">
        <div className="flex flex-col text-center text-lg items-center gap-6">
          <h2 className="text-3xl font-bold text-center">BANKRUPTCPY</h2>

          <p>
            Your margin requirement has exceeded your equity for more than the
            allowed amount of time. As a result, your positions have been
            liquidated. {"\n"}
          </p>
          <p>Post-liquidation, your equity was negative. Emergency funds have been deposited.</p>
          <p>Deposits remaining: {remaining}</p>

          <div className="w-full space-y-4">
            <button
              onClick={hide}
              className="w-full px-6 bg-gray-700 hover:bg-gray-600 font-bold border-2 border-gray-500"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
