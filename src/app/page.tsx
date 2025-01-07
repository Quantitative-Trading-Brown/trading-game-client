"use client";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";


const GameCodeSystem = () => {
  const [gameCode, setGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [status, setStatus] = useState("");

  const createGame = async () => {
    try {
      const response = await axios.post(`${API_BASE}/create-game`);
      localStorage.setItem('admin_code', response.data.code);
      localStorage.setItem('admin_token', response.data.token);

      setStatus("Game created successfully!");
      window.location.href = "/admin";
    } catch (err) {
      setStatus(`Error creating game: ${err}`);
    }
  };

  const joinGame = async () => {
    try {
      const response = await axios.post(`${API_BASE}/join-game`, {
        code: gameCode,
        playerName,
      });
      localStorage.setItem('player_code', response.data.code);
      localStorage.setItem('player_token', response.data.token);

      setStatus("Joined game successfully!");
      // window.location.href = "/lobby";
    } catch (err) {
      setStatus(err.response.data.error || "Error joining game.");
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl font-extrabold tracking-wide mb-8 text-gray-100">
        QTAB Trading Game
      </h1>
      <div className="space-y-8 w-full max-w-lg p-8 bg-gray-800 shadow-lg border border-gray-700">
        <div className="flex flex-col space-y-6">
          <button
            onClick={createGame}
            className="w-full px-4 py-2 bg-red-700 text-lg font-semibold shadow-lg 
            hover:bg-red-600 hover:shadow-xl hover:scale-105 transition-all"
          >
            Create Game
          </button>
          <hr className="border-gray-600" />

          <div className="flex flex-col space-y-6">
            <input
              type="text"
              placeholder="Enter Game Code"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 shadow-lg 
              border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="Enter Player Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 shadow-lg 
              border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={joinGame}
              className="w-full px-4 py-2 bg-green-700 text-lg font-semibold shadow-lg 
              hover:bg-green-600 hover:shadow-xl hover:scale-105 transition-all"
            >
              Join Game
            </button>
          </div>

          <p className="text-center mt-4 text-sm text-gray-400">{status}</p>
        </div>
      </div>

    </div>
  );
};

export default GameCodeSystem;
