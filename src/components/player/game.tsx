"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { useSocket } from "@/contexts/SocketContext";
import { SecurityProps, GameProps } from "@/utils/Types";

import OrderbookCell from "@/components/orderbook";
import NewsCell from "@/components/news";
import LeaderboardCell from "@/components/leaderboard";
import SelectorCell from "@/components/secselector";

import LobbyCell from "@/components/player/lobby";
import InventoryCell from "@/components/player/inventory";
import ResolutionCell from "@/components/player/resolution";
import OrdersCell from "@/components/player/orders";
import TradeCell from "@/components/player/trade";

const Game = () => {
  const [orderbooks, setOrderbooks] = useState({}); // Maps sec_id to orderbook
  const [orders, setOrders] = useState({}); // List of orders

  const [securities, setSecurities] = useState({}); // Maps sec_id to [bookMin, bookMax]
  const [selectedSecurity, setSelectedSecurity] = useState("");

  const [pastnews, setPastNews] = useState([]);
  const [inventory, setInventory] = useState({});
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<number>(0);
  const router = useRouter();

  const { socket } = useSocket();

  const updateSecurities = (securities: SecurityProps) => {
    setSecurities(securities);
    setSelectedSecurity(Object.keys(securities)[0]);
  };

  const updateState = (state: string) => {
    setGameState(Number(state));
  };

  const updateSnapshot = (snapshot) => {
    setUsername(snapshot.username);
    setOrderbooks(snapshot.orderbooks);
    setOrders(snapshot.orders);
    setPastNews(snapshot.past_news);
    setInventory(snapshot.inventory);

    updateState(snapshot.game_props.state);
    updateSecurities(snapshot.securities);

    setLoading(false);
  };

  useEffect(() => {
    if (socket) {
      socket.on("snapshot", updateSnapshot);

      socket.on("gamestate_update", updateState);
      socket.on("securities_update", updateSecurities);

      socket.emit("snapshot");

      return () => {
        socket.off("snapshot");
        socket.off("gamestate_update");
        socket.off("securities_update");
      };
    }
  }, [socket]);

  const changeSelectedSecurity = (sec_id: string) =>
    setSelectedSecurity(sec_id);

  if (loading) {
    return "Loading...";
  }

  let Dash;
  switch (gameState) {
    case 0:
      Dash = (
        <div className="flex flex-auto flex-wrap justify-center min-w-full gap-2 overflow-scroll">
          <div className="flex-grow flex flex-auto justify-center gap-2">
            <div className="border-white border-2 w-full">
              <LobbyCell />
            </div>
          </div>
          <div className="flex-1 border-white border-2 overflow-y-auto overscroll-contain">
            <NewsCell admin={false} news={pastnews} />
          </div>
        </div>
      );
      break;
    case 1:
      Dash = (
        <div className="flex flex-auto flex-wrap justify-center gap-2 w-full min-h-0">
          <div className="flex flex-1 flex-col gap-2 w-full min-w-[400px]">
            <div className="border-white border-2">
              <InventoryCell
                securities={securities}
                existing_inventory={inventory}
              />
            </div>
            <div className="flex-grow border-white border-2 overflow-y-auto">
              <NewsCell admin={false} news={pastnews} />
            </div>
          </div>
          <div className="flex flex-grow gap-2 overflow-x-auto h-full">
            <div className="flex flex-col gap-2 min-w-[650px]">
              <div className="border-white border-2">
                <SelectorCell
                  securities={securities}
                  onChange={changeSelectedSecurity}
                />
              </div>
              <div className="border-white border-2">
                <TradeCell selectedSecurity={selectedSecurity} />
              </div>
              <div className="flex-grow border-white border-2 overflow-y-auto">
                <OrdersCell securities={securities} existingOrders={orders} />
              </div>
            </div>
            <div className="flex flex-col flex-grow h-full">
              <div className="flex-grow border-white border-2 overflow-y-auto">
                <OrderbookCell
                  existingOrders={orderbooks}
                  selectedSecurity={selectedSecurity}
                />
              </div>
            </div>
          </div>
        </div>
      );
      break;
    case 2:
      Dash = (
        <div className="flex flex-auto flex-wrap justify-center min-w-full gap-2 overflow-scroll">
          <div className="flex-grow flex flex-col flex-auto gap-2">
            <div className="border-white border-2 w-full h-full">
              <ResolutionCell />
            </div>
          </div>
          <div className="flex-1 min-w-[350px] border-white border-2 overflow-y-auto overscroll-contain">
            <NewsCell admin={false} news={pastnews} />
          </div>
        </div>
      );
      break;
    case 3:
      Dash = (
        <div className="flex flex-auto justify-center min-w-full gap-2 overflow-scroll">
          <div className="flex-col flex-grow flex flex-auto justify-center gap-2 w-full">
            <div className="flex-grow border-white border-2 w-full">
              <LeaderboardCell />
            </div>
            <div
              className="flex justify-center items-center border-white border-2 w-full min-h-[5em] cursor-pointer"
              onClick={() => {
                document.location.href = "/";
              }}
            >
              <h1 className="text-xl">Back to Home</h1>
            </div>
          </div>
        </div>
      );
      break;
  }

  return (
    <div className="flex flex-col items-center h-screen gap-2 p-2">{Dash}</div>
  );
};

export default Game;
