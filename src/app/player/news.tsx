"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";

const News = () => {
  const [messages, setMessages] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("message", (msg : string) => {
        var d = new Date();
        var n = d.toLocaleTimeString();
        setMessages((prevMessages) => [[msg, n], ...prevMessages])
        console.log("Game update:", n);
      });

      return () => {
        socket.off("message");
      };
    }
  }, [socket]);

  return (
    <div className="text-white p-4 max-w-lg w-[30em] mx-auto rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4">Market News</h2>
      <div className="space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {messages.map((data, index) => (
          <div key={index} className="flex justify-between items-center gaps-5">
            <p className="text-sm text-gray-300">{data[0]}</p>
            <span className="text-xs text-gray-500">{data[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
