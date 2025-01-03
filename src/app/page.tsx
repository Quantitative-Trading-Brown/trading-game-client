"use client"
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = "http://127.0.0.1:5000";

const GameCodeSystem = () => {
  const [gameCode, setGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState([]);
  const [status, setStatus] = useState("");

  const createGame = async () => {
    try {
      const response = await axios.post(`${API_BASE}/create_game`);
      setGameCode(response.data.code);
      setPlayers([]);
      setStatus("Game created successfully!");
    } catch (err) {
      setStatus("Error creating game.");
    }
  };

  const joinGame = async () => {
    try {
      const response = await axios.post(`${API_BASE}/join_game`, {
        code: gameCode,
        playerName,
      });
      setPlayers(response.data.players);
      setStatus("Joined game successfully!");
    } catch (err) {
      setStatus(err.response.data.error || "Error joining game.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Game Join Code System</h1>
      <div className="space-y-4">
        <button
          onClick={createGame}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          Create Game
        </button>

        {gameCode && (
          <p className="text-lg font-semibold">
            Your Game Code: <span className="text-blue-500">{gameCode}</span>
          </p>
        )}

        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Game Code"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
            className="px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="px-4 py-2 border rounded"
          />
          <button
            onClick={joinGame}
            className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
          >
            Join Game
          </button>
        </div>

        <p className="text-gray-700">{status}</p>

        {players.length > 0 && (
          <div>
            <h2 className="text-lg font-bold">Players in Game:</h2>
            <ul className="list-disc ml-6">
              {players.map((player, index) => (
                <li key={index}>{player}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCodeSystem;
