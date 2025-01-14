"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";

const News = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("message", (msg: string) => {
        var d = new Date();
        var n = d.toLocaleTimeString();
        setMessages((prevMessages) => [[msg, n], ...prevMessages]);
        console.log("Game update:", n);
      });

      return () => {
        socket.off("message");
      };
    }
  }, [socket]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (message.trim()) {
        socket.send(message);
        setMessage("");
      }
    }
  };

  return (
    <div className="flex flex-col h-full p-4 max-w-lg w-[30em] mx-auto">
      <h2 className="text-lg font-bold mb-4">Market News</h2>
      <div
        className="flex flex-col-reverse flex-grow gap-2 mb-4 w-full overflow-scroll"
      >
        {messages.map((data, index) => (
          <div key={index} className="flex justify-between items-center gaps-5">
            <p className="text-sm text-gray-300">{data[0]}</p>
            <span className="text-xs text-gray-500">{data[1]}</span>
          </div>
        ))}
      </div>
      <div className="w-full">
        <input
          type="text"
          value={message}
          onKeyPress={handleKeyPress}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Make some news..."
          className="w-full bg-gray-700 p-1"
        />
      </div>
    </div>
  );
};

export default News;
