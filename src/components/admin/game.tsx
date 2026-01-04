"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { useSocket } from "@/contexts/SocketContext";
import { GameProps, SecurityProps } from "@/utils/Types";

import OrderbookCell from "@/components/orderbook";
import NewsCell from "@/components/news";
import LeaderboardCell from "@/components/leaderboard";
import SelectorCell from "@/components/secselector";

import LobbyCell from "@/components/admin/lobby";
import ControlsCell from "@/components/admin/controls";
import ResolutionCell from "@/components/admin/resolution";

import { Orderbooks } from "@/utils/Types";

const Game = () => {
  const [orderbooks, setOrderbooks] = useState({});

  const [securities, setSecurities] = useState({});
  const [selectedSecurity, setSelectedSecurity] = useState("");

  const [pastnews, setPastNews] = useState([]);
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<number>(0);
  const router = useRouter();

  const { socket } = useSocket();

  const updateProps = (props: GameProps) => {
    setCode(props.code);
  };

  const updateSecurities = (securities: SecurityProps) => {
    setSecurities(securities);
    setSelectedSecurity(Object.keys(securities)[0]);
  };

  const updateState = (state: string) => {
    setGameState(Number(state));
    setLoading(false);
  };

  useEffect(() => {
    if (socket) {
      socket.on("snapshot", (snapshot) => {
        setOrderbooks(snapshot.orderbooks);
        setPastNews(snapshot.past_news);
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

  const changeSelectedSecurity = (sec_id: string) =>
    setSelectedSecurity(sec_id);

  if (loading) {
    return "Loading...";
  }

  let Dash;
  switch (gameState) {
    case 0:
      Dash = (
        <div className="flex flex-auto flex-wrap justify-center min-w-full gap-2 overflow-y-auto">
          <div className="flex-grow flex flex-col flex-auto justify-center gap-2">
            <div className="p-2 border-white border-2 w-full">
              <h2 className="text-center text-2xl font-extrabold">
                Game Code: {code}
              </h2>
            </div>
            <div className="flex-grow border-white border-2 w-full">
              <LobbyCell />
            </div>
          </div>
          <div className="border-white border-2 flex-1 w-full min-w-[350px] overflow-y-auto">
            <NewsCell admin={true} news={pastnews} />
          </div>
        </div>
      );
      break;
    case 1:
      Dash = (
        <div className="flex flex-auto flex-wrap justify-center min-w-full gap-2 min-h-0">
          <div className="flex flex-auto flex-col flex-grow gap-2 h-full">
            <div className="border-white border-2">
              <SelectorCell
                securities={securities}
                onChange={changeSelectedSecurity}
              />
            </div>
            <div className="flex-grow border-white border-2 overflow-y-auto">
              <OrderbookCell
                existingOrders={orderbooks}
                selectedSecurity={selectedSecurity}
              />
            </div>
          </div>
          <div className="max-w-[500px] flex flex-col flex-1 gap-2">
            <div className=" flex-grow border-white border-2 overflow-y-auto">
              <NewsCell admin={true} news={pastnews} />
            </div>
            <div className="border-white border-2">
              <ControlsCell code={code} />
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
              <ResolutionCell securities={securities} />
            </div>
          </div>
          <div className="border-white border-2 w-[30em] overflow-y-auto">
            <NewsCell admin={true} news={pastnews} />
          </div>
        </div>
      );
      break;
    case 3:
      Dash = (
        <div className="flex flex-auto justify-center min-w-full gap-2 overflow-y-auto">
          <div className="flex-grow flex-col flex flex-auto justify-center gap-2 w-full">
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
    <div className="flex flex-col items-center h-screen gap-2 p-2 overflow-y-auto">
      {Dash}
    </div>
  );
};

export default Game;
