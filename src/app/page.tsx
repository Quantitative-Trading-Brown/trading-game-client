"use client";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import axios from "axios";

import db from "@/scripts/firestore";
import { gameProps } from "@/utils/Types";

const Home = () => {
  const [backend, setBackend] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [status, setStatus] = useState("");
  const [sponsors, setSponsors] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "images"));
        const documents = querySnapshot.docs;
        const data = Object.fromEntries(
          documents.map((doc) => [doc.id, doc.data()]),
        );
        setSponsors(data.banner.link);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };

    setBackend(localStorage.getItem("backend_ip") || "");
    fetchData();
  }, []);

  const createGame = async () => {
    localStorage.setItem("backend_ip", backend);
    try {
      const response = await axios.post(
        `${localStorage.getItem("backend_ip")}/create-game`,
      );
      localStorage.setItem("admin_code", response.data.code);
      localStorage.setItem("admin_token", response.data.token);
      setStatus("Game created successfully!");
      window.location.href = "/admin";
    } catch (err: any) {
      if (err.response) {
        setStatus(`Error creating game: ${err.response}`);
      } else {
        setStatus(`Error creating game: ${err}`);
      }
    }
  };

  const joinGame = async () => {
    localStorage.setItem("backend_ip", backend);
    if (!playerName) {
      setStatus("Username must be non-empty");
      return;
    }
    try {
      const response = await axios.post(
        `${localStorage.getItem("backend_ip")}/join-game`,
        {
          code: gameCode,
          playerName,
        },
      );
      localStorage.setItem("player_code", gameCode);
      localStorage.setItem("player_token", response.data.token);
      setStatus("Joined game successfully!");
      window.location.href = "/player";
    } catch (err: any) {
      if (err.response) {
        setStatus(`Error creating game: ${err.response.data.error}`);
      } else {
        setStatus(`Error creating game: ${err}`);
      }
    }
  };

  return (
    <div
      className="h-screen flex flex-col justify-center items-start 
    bg-[url(/images/home-bg.jpg)] bg-cover"
    >
      <div
        className="space-y-8 max-w-[35em] w-full ml-8 p-8 
        bg-gray-800 shadow-lg border border-l-0 border-gray-700"
      >
        <h1 className="text-4xl font-semibold pl-4">QTAB Trading Simulator</h1>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-6">
            <input
              type="text"
              placeholder="Enter backend IP address"
              value={backend}
              onChange={(e) => setBackend(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 shadow-lg 
              border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <hr className="border-gray-600" />
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
      {sponsors ? (
        <div className="absolute bottom-[1em]">
          <div className="overflow-hidden whitespace-nowrap justify-center flex relative py-[2em]">
            <div className="flex animate-marquee">
              <img src={sponsors} />
              <img src={sponsors} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Home;
