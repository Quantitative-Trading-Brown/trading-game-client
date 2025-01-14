"use client";
import React from "react";

const Lobby = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-mono">
      <h1 className="text-5xl font-extrabold tracking-wide text-center mb-8">
      {user}, Welcome to the QTAB Lobby
      </h1>
      <p className="text-lg">Players are gathering. Get ready to trade!</p>
    </div>
  );
};

export default Lobby;
