"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { useSocket } from "@/contexts/SocketContext";

import OrderbookCell from "@/components/orderbook";
import NewsCell from "@/components/news";
import GraphCell from "@/components/graph";
import LeaderboardCell from "@/components/leaderboard";

import LobbyCell from "./lobby";
import InventoryCell from "./inventory";
import ResolutionCell from "./resolution";

const Game = () => {
  const [orderbooks, setOrderbooks] = useState({}); // Maps sec_id to orderbook
  const [securities, setSecurities] = useState({}); // Maps sec_id to [bookMin, bookMax]
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<number>(0);
  const router = useRouter();

  const { socket } = useSocket();

  const updateProps = (props: GameProps) => {
    // Update game properties (none yet)
    return
  };

  const updateSecurities = (securities: SecurityProps) => {
    setSecurities(securities);
  };

  const updateState = (state: number) => {
    setGameState(Number(state));
    setLoading(false);
  };

  useEffect(() => {
    if (socket) {
      socket.on("snapshot", (snapshot) => {
        setUsername(snapshot.username);
        setOrderbooks(snapshot.orderbooks);
        updateState(snapshot.game_state);
        updateProps(snapshot.game_props);
        updateSecurities(snapshot.securities);
      });

      socket.on("gamestate_update", updateState);
      socket.on("gameprops_update", updateProps);

      socket.on("securities_update", updateSecurities);

      socket.emit("snapshot");

      return () => {
        socket.off("snapshot");
        socket.off("gamestate_update");
        socket.off("gameprops_update");
        socket.off("securities_update");
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
              <LobbyCell />
            </div>
          </div>
          <div className="border-white border-2 w-[30em] overflow-y-auto overscroll-contain">
            <NewsCell admin={false} />
          </div>
        </div>
      );
      break;
    case 1:
      Dash = (
        <div className="flex flex-auto justify-center min-w-full gap-2 overflow-y-auto">
          <div className="flex flex-col flex-grow gap-2">
            <div className="border-white border-2 h-full">
              <OrderbookCell admin={false} orderbooks={orderbooks} securities={securities} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-[30em] border-white border-2 overflow-y-auto">
              <NewsCell admin={false} />
            </div>
            <div className="flex-grow border-white border-2">
              <InventoryCell securities={securities} />
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
              <ResolutionCell />
            </div>
          </div>
          <div className="border-white border-2 w-[30em] overflow-scroll overscroll-contain">
            <NewsCell admin={false} />
          </div>
        </div>
      );
      break;
    case 3:
      Dash = (
        <div className="flex flex-auto justify-center min-w-full gap-2 overflow-scroll">
          <div className="flex-grow flex flex-auto justify-center gap-2 w-full">
            <div className="border-white border-2 w-full">
              <LeaderboardCell />
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
