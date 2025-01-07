"use client";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:5000");

const News = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Listen for messages from the server
    socket.on("message", (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Cleanup when component unmounts
    return () => {
      socket.off("message");
    };
  }, []);

  return (
    <div className="text-white p-4 max-w-lg w-[30em] mx-auto rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4">Market News</h2>
      <div className="space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {messages.map((msg, index) => (
          <div key={index} className="flex justify-between items-center gaps-5">
            <p className="text-sm text-gray-300">{msg}</p>
            <span className="text-xs text-gray-500">1 hour ago</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
