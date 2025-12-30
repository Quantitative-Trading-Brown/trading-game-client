"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";

const Lobby = () => {
  const { socket } = useSocket();
  const [presets, setPresets] = useState([]);
  const [chosen, setChosen] = useState("");

  useEffect(() => {
    if (socket) {
      socket.on("presets", (presets) => {
        setPresets(presets);
      });

      socket.emit("querypresets");

      return () => {
        socket.off("presets");
      };
    }
  }, [socket]);

  const handleGameStart = () => {
    if (socket && chosen) {
      socket.emit("startgame", chosen);
    }
  };

  return (
    <div className="flex flex-col h-full p-5">
      <h1 className="text-4xl font-extrabold mb-8">
        Trading Game Preset Selection
      </h1>

      <div
        role="radiogroup"
        aria-label="Preset selection"
        className="grid grid-cols-3 gap-4"
      >
        {presets.map((preset) => {
          const selected = preset.id === chosen;

          return (
            <button
              key={preset.id}
              role="radio"
              aria-checked={selected}
              onClick={() => setChosen(preset.id)}
              className={[
                "text-left p-4 cursor-pointer outline-none",
                selected ? "bg-red-700" : "bg-gray-800"
              ].join(" ")}
            >
              <div>{preset.name}</div>
              <div>{preset.desc}</div>
            </button>
          );
        })}
      </div>

      <div className="flex-grow"></div>

      <div className="flex w-full py-5">
        <button
          onClick={handleGameStart}
          className="w-full h-full p-3 bg-red-700"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default Lobby;
