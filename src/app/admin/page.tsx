"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { SocketProvider } from "@/contexts/SocketContext";
import Game from "./game";

const AdminPage = () => {
  const [code, setCode] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<string | null>(false);
  const router = useRouter();

  const setup = async (token) => {
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
    const storedCode = localStorage.getItem("admin_code");
    const storedToken = localStorage.getItem("admin_token");
    setCode(storedCode);
    setup(storedToken);
  }, []);

  if (!authenticated) {
    return "Loading...";
  }

  return (
    <SocketProvider
      namespace="admin"
      query={{ token: localStorage.getItem("admin_token") }}
    >
      <Game />
    </SocketProvider>
  );
};

export default AdminPage;
