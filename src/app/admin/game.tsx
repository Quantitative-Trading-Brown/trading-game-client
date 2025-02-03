"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { useSocket } from "@/contexts/SocketContext";
import { gameProps } from "@/utils/Types"

import Orderbook from "@/components/orderbook";
import News from "@/components/news";
import Leaderboard from "@/components/leaderboard";
import Graph from "@/components/graph";

import Lobby from "./lobby";
import Controls from "./controls";
import Resolution from "./resolution";

const Game = () => {
  const [orderbook, setOrderbook] = useState({});
  const [bookLim, setBookLim] = useState([0, 0]);
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<number>(0);
  const router = useRouter();

  const { socket } = useSocket();

  const updateProps = (props: gameProps) => {
    setBookLim([Number(props.bookMin), Number(props.bookMax)]);
    setCode(props.code)
  };

  const updateState = (state: string) => {
    setGameState(Number(state));
    setLoading(false);
  };

  useEffect(() => {
    if (socket) {
      socket.on("snapshot", (snapshot) => {
        setOrderbook(snapshot.orderbook);
        updateProps(snapshot.game_props);
        updateState(snapshot.game_state);
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
        <div className="flex flex-auto justify-center min-w-full gap-2 overflow-y-auto">
          <div className="flex-grow flex flex-auto justify-center gap-2 w-full">
            <div className="border-white border-2 w-full">
              <Lobby />
            </div>
          </div>
          <div className="border-white border-2 w-[40em] overflow-y-auto">
            <News admin={true} />
          </div>
        </div>
      );
      break;
    case 1:
      Dash = (
        <div className="flex flex-auto justify-center min-w-full gap-2 overflow-y-auto">
          <div className="flex flex-col flex-grow gap-2">
            <div className="border-white border-2">
              <Orderbook admin={true} book={orderbook} bookLim={bookLim} />
            </div>
            <div className="flex-grow border-white border-2 p-10">
              <Graph />
            </div>
          </div>
          <div className="flex flex-col flex-grow gap-2">
            <div className="flex-grow border-white border-2 overflow-y-auto">
              <News admin={true} />
            </div>
            <div className="border-white border-2">
              <Controls />
            </div>
          </div>
        </div>
      );
      break;
    case 2:
      Dash = (
        <div className="flex flex-auto justify-center min-w-full gap-2 overflow-y-auto">
          <div className="flex-grow flex flex-auto justify-center gap-2 w-full">
            <div className="border-white border-2 w-full">
              <Resolution />
            </div>
          </div>
          <div className="border-white border-2 w-[30em] overflow-y-auto">
            <News admin={true} />
          </div>
        </div>
      );
      break;
    case 3:
      Dash = (
        <div className="flex flex-auto justify-center min-w-full gap-2 overflow-y-auto">
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
        <h1 className="text-2xl font-bold">Game Code: {code}</h1>
      </div>
      {Dash}
    </div>
  );
};

export default Game;
