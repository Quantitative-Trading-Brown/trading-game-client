"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { useSocket } from "@/contexts/SocketContext";

import News from "@/components/news";
import Leaderboard from "@/components/leaderboard"
import Graph from "@/components/graph";

import Orderbook from "./orderbook";
import Lobby from "./lobby";
import Controls from "./controls"

const Game = () => {
  const [orderbook, setOrderbook] = useState({});
  const [bookLim, setBookLim] = useState([0, 0]);
  const [code, setCode] = useState(null);

  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<Number>(0);
  const router = useRouter();

  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("gamedata", (snapshot) => {
        setCode(snapshot.code);
        setOrderbook(snapshot.orderbook);
      });

      socket.on("gamestate", (state) => {
        setGameState(state);
        setLoading(false);
      });

      socket.on("gamesettings", (settings) => {
        setBookLim([settings.bookMin, settings.bookMax]);
      });

      socket.emit("settings");
      socket.emit("snapshot");

      return () => {
        socket.off("gamesettings");
        socket.off("gamedata");
        socket.off("gamestate");
      };
    }
  }, [socket]);

  if (loading) {
    return "Loading...";
  }

  let Dash;
  if (gameState == 1) {
    Dash = (
      <div className="flex flex-auto justify-center min-w-full gap-2 overflow-scroll">
        <div className="flex flex-col flex-grow gap-2">
          <div className="border-white border-2">
            <Orderbook book={orderbook} bookLim={bookLim} />
          </div>
          <div className="flex-grow border-white border-2 p-10">
            <Graph />
          </div>
        </div>
        <div className="flex flex-col flex-grow gap-2">
          <div className="flex-grow border-white border-2 overflow-scroll overscroll-contain">
            <News admin={true} />
          </div>
          <div className="border-white border-2">
            <Controls />
          </div>
        </div>
      </div>
    );
  } else if (gameState == 2) {
    Dash = (
      <div className="flex flex-auto justify-center min-w-full gap-2 overflow-scroll">
        <div className="flex-grow flex flex-auto justify-center gap-2 w-full">
          <div className="border-white border-2 w-full">
            <Leaderboard />
          </div>
        </div>
      </div>
    );
  } else {
    Dash = (
      <div className="flex flex-auto justify-center min-w-full gap-2 overflow-scroll">
        <div className="flex-grow flex flex-auto justify-center gap-2 w-full">
          <div className="border-white border-2 w-full">
            <Lobby />
          </div>
        </div>
        <div className="border-white border-2 w-[30em] overflow-scroll overscroll-contain">
          <News admin={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen gap-2 p-2">
      <div className="flex flex-none w-full h-[3em] justify-center items-center border-white border-2 p-2">
        <h1 className="text-2xl font-bold">Game Code: {code}</h1>
      </div>
      {Dash}
    </div>
  );
};

export default Game;
