"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { SocketProvider } from "@/contexts/SocketContext";
import Game from "./game";

const PlayerPage = () => {
  const [code, setCode] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const router = useRouter();

  const setup = async (token: string) => {
    if (!token) {
      router.push("/");
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth`,
        {
          token: token,
        },
      );

      if (response.status == 201) {
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
    const storedToken = localStorage.getItem("player_token") || "";
    setup(storedToken);
  }, []);

  if (!authenticated) {
    return "Loading...";
  }

  return (
    <SocketProvider
      namespace="player"
      query={{ token: localStorage.getItem("player_token") || "" }}
    >
      <Game />
    </SocketProvider>
  );
};

export default PlayerPage;
