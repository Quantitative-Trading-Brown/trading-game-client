"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SocketProvider } from "@/contexts/SocketContext";
import Graph from "@/components/graph";
import axios from "axios";

import Lobby from "./lobby";
import Game from "./game";
import News from "./news";

const GamePage = () => {
  const [code, setCode] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<string | null>(false);
  const [orderbook, setOrderbook] = useState({});
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  const setup = async (token) => {
    if (!token) {
      router.push("/");
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/snapshot`,
        {
          token: token,
        },
      );

      if (response.status == 201) {
        setUsername(response.data.name);
        setOrderbook(response.data.orderbook);
        setAuthenticated(true);
      } else {
        router.push("/");
      }
    } catch {
      console.log("Something went wrong server side");
      router.push("/");
    }
  };

  useEffect(() => {
    const storedCode = localStorage.getItem("player_code");
    const storedToken = localStorage.getItem("player_token");
    setCode(storedCode);
    setup(storedToken);
  }, []);

  if (!authenticated) {
    return "Loading...";
  }

  return (
    <SocketProvider
      namespace="player"
      query={{ token: localStorage.getItem("player_token") }}
    >
      <div className="flex flex-col items-center h-screen gap-2 p-2">
        <div className="flex flex-none h-[3em] w-full justify-center border-white border-2 p-2">
          <h1 className="text-2xl font-bold">Username: {username}</h1>
        </div>
        <div className="flex flex-auto justify-center min-w-full gap-2">
          <div className="flex flex-col flex-grow gap-2">
            <div className="border-white border-2 overflow-scroll">
              <Game book={orderbook} />
            </div>
            <div className="flex-grow border-white border-2 p-10">
              <Graph />
            </div>
          </div>

          <div className="border-white border-2 overflow-scroll">
            <News />
          </div>
        </div>
      </div>
    </SocketProvider>
  );
};

export default GamePage;
