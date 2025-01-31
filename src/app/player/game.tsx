"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { useSocket } from "@/contexts/SocketContext";

import News from "@/components/news";
import Graph from "@/components/graph";
import Leaderboard from "@/components/leaderboard";

import Orderbook from "./orderbook";
import Lobby from "./lobby";
import Inventory from "./inventory";
import Resolution from "./resolution";

const Game = () => {
  const [orderbook, setOrderbook] = useState({});
  const [bookLim, setBookLim] = useState([0, 0]);
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<number>(0);
  const router = useRouter();

  const { socket } = useSocket();

  const updateProps = (props) => {
    setBookLim([Number(props.bookMin), Number(props.bookMax)]);
  };

  const updateState = (state) => {
    setGameState(Number(state));
    setLoading(false);
  };

  useEffect(() => {
    if (socket) {
      socket.on("snapshot", (snapshot) => {
        setUsername(snapshot.username);
        setOrderbook(snapshot.orderbook);
        updateProps(snapshot.game_props);
        updateState(Number(snapshot.game_state));
      });

      socket.on("gamestate_update", updateState);
      socket.on("gameprops_update", updateProps);

      socket.emit("snapshot");

      return () => {
        socket.off("snapshot");
        socket.off("gamestate_update");
        socket.off("gameprops_update");
      };
    }
  }, [socket]);

  if (loading) {
    return "Loading...";
  }

  let Dash;
  switch (gameState) {
    case 0:
      Dash = (
        <div className="flex flex-auto justify-center min-w-full gap-2 overflow-scroll">
          <div className="flex-grow flex flex-auto justify-center gap-2 w-full">
            <div className="border-white border-2 w-full">
              <Lobby />
            </div>
          </div>
          <div className="border-white border-2 w-[30em] overflow-scroll overscroll-contain">
            <News admin={false} />
          </div>
        </div>
      );
      break;
    case 1:
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
            <div className="h-[30em] border-white border-2 overflow-scroll">
              <News admin={false} />
            </div>
            <div className="flex-grow border-white border-2">
              <Inventory />
            </div>
          </div>
        </div>
      );
      break;
    case 2:
      Dash = (
        <div className="flex flex-auto justify-center min-w-full gap-2 overflow-scroll">
          <div className="flex-grow flex flex-auto justify-center gap-2 w-full">
            <div className="border-white border-2 w-full">
              <Resolution />
            </div>
          </div>
          <div className="border-white border-2 w-[30em] overflow-scroll overscroll-contain">
            <News admin={false} />
          </div>
        </div>
      );
      break;
    case 3:
      Dash = (
        <div className="flex flex-auto justify-center min-w-full gap-2 overflow-scroll">
          <div className="flex-grow flex flex-auto justify-center gap-2 w-full">
            <div className="border-white border-2 w-full">
              <Leaderboard />
            </div>
          </div>
        </div>
      );
      break;
  }

  return (
    <div className="flex flex-col items-center h-screen gap-2 p-2">
      <div className="flex flex-none w-full h-[3em] justify-center items-center border-white border-2 p-2">
        <h1 className="text-2xl font-bold">Username: {username}</h1>
      </div>
      {Dash}
    </div>
  );
};

export default Game;
