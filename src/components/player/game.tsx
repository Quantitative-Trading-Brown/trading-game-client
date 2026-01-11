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
import GraphCell from "@/components/graph";

import LobbyCell from "@/components/player/lobby";
import InventoryCell from "@/components/player/inventory";
import ResolutionCell from "@/components/player/resolution";
import OrdersCell from "@/components/player/orders";
import TradeCell from "@/components/player/trade";
import { MarginCall, Bankruptcy } from "@/components/player/warnings";

const Game = () => {
  const [username, setUsername] = useState("");
  const [pastnews, setPastNews] = useState([]);

  const [orderbooks, setOrderbooks] = useState({}); // Maps sec_id to orderbook
  const [orders, setOrders] = useState({}); // List of orders

  const [securities, setSecurities] = useState({}); // Maps sec_id to [bookMin, bookMax]
  const [selectedSecurity, setSelectedSecurity] = useState("");

  const [inventory, setInventory] = useState({});
  const [cash, setCash] = useState(0);
  const [positionValue, setPositionValue] = useState(0);
  const [margin, setMargin] = useState(0);
  const [showMarginCall, setShowMarginCall] = useState(false);
  const [showBankruptcy, setShowBankruptcy] = useState(false);
  const [bankruptciesRemaining, setBankruptciesRemaining] = useState(0);

  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<number>(0);
  const [playerActive, setPlayerActive] = useState<number>(1);

  const router = useRouter();

  const { socket } = useSocket();

  const updateSecurities = (securities: SecurityProps) => {
    setSecurities(securities);
    setSelectedSecurity(Object.keys(securities)[0]);
  };

  const updateState = (state: string) => {
    setGameState(Number(state));
  };

  const updateSnapshot = (snapshot: any) => {
    setUsername(snapshot.username);
    setPlayerActive(Number(snapshot.active));
    setPastNews(snapshot.past_news);

    setOrderbooks(snapshot.orderbooks);
    setOrders(snapshot.orders);

    setInventory(snapshot.inventory);
    setCash(snapshot.cash);
    setPositionValue(Math.round(snapshot.position_value));
    setMargin(Math.round(snapshot.margin));

    updateState(snapshot.game_props.state);
    updateSecurities(snapshot.securities);

    setLoading(false);
  };

  useEffect(() => {
    if (socket) {
      socket.on("snapshot", updateSnapshot);
      socket.on("gamestate_update", updateState);
      socket.on("margin_call", () => {
        setShowMarginCall(true);
      });
      socket.on("bankruptcy", (remaining) => {
        setShowBankruptcy(true);
        setBankruptciesRemaining(remaining);
      });
      socket.on("elimination", () => {
        setPlayerActive(0);
      });

      socket.emit("snapshot");

      return () => {
        socket.off("snapshot");
        socket.off("gamestate_update");
        socket.off("margin_call");
        socket.off("bankruptcy");
        socket.off("elimination");
      };
    }
  }, [socket]);

  const changeSelectedSecurity = (sec_id: string) =>
    setSelectedSecurity(sec_id);

  if (loading) {
    return "Loading...";
  }

  const renderDash = () => {
    switch (gameState) {
      case 0:
        return (
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
        return (
          <div className="flex flex-auto flex-wrap justify-center gap-2 w-full h-full">
            <div className="flex flex-1 flex-col gap-2 w-full min-w-[400px] h-full">
              {playerActive == 1 && (
                <div className="border-white border-2">
                  <InventoryCell
                    securities={securities}
                    existing_inventory={inventory}
                    existing_cash={cash}
                    existing_position_value={positionValue}
                    existing_margin={margin}
                  />
                </div>
              )}
              <div className="flex-grow border-white border-2 min-h-0">
                <NewsCell admin={false} news={pastnews} />
              </div>
            </div>
            <div className="flex flex-grow gap-2 overflow-x-auto h-full">
              {playerActive === 1 && (
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
                    <OrdersCell
                      securities={securities}
                      existingOrders={orders}
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-col flex-grow gap-2 h-full">
                <div className="border-white border-2 overflow-y-auto resize-y min-h-[300px]">
                  <OrderbookCell
                    existingOrders={orderbooks}
                    selectedSecurity={selectedSecurity}
                  />
                </div>
                <div className="border-white border-2 overflow-y-auto flex-1">
                  <GraphCell selectedSecurity={selectedSecurity} />
                </div>
              </div>
            </div>
          </div>
        );
        break;
      case 2:
        return (
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
        return (
          <div className="flex flex-auto justify-center min-w-full gap-2 overflow-scroll">
            <div className="flex-col flex-grow flex flex-auto justify-center gap-2 w-full">
              <div className="flex-grow border-white border-2 w-full">
                <LeaderboardCell />
              </div>
              <div
                className="flex justify-center items-center border-white border-2 w-full min-h-[5em] cursor-pointer"
                onClick={() => {
                  router.push("/");
                }}
              >
                <h1 className="text-xl">Back to Home</h1>
              </div>
            </div>
          </div>
        );
        break;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center h-screen gap-2 p-2">
      {renderDash()}
      {/* Margin Call Modal */}
      {showMarginCall && <MarginCall hide={() => setShowMarginCall(false)} />}
      {showBankruptcy && (
        <Bankruptcy
          remaining={bankruptciesRemaining}
          hide={() => setShowBankruptcy(false)}
        />
      )}
    </div>
  );
};

export default Game;
