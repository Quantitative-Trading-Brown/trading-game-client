"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";

const News = ({ admin }) => {
  const [messages, setMessages] = useState([]);
  const [buffer, setBuffer] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("news", (msg : string) => {
        var d = new Date();
        var n = d.toLocaleTimeString();
        setMessages((prevMessages) => [[msg, n], ...prevMessages])
      });

      return () => {
        socket.off("news");
      };
    }
  }, [socket]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (buffer.trim()) {
        socket.emit("news", buffer);
        setBuffer("");
      }
    }
  };

  return (
    <div className="flex flex-col text-white p-4 max-w-lg h-full mx-auto rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4">Market News</h2>
      <div className="flex-grow space-y-2 overflow-y-auto">
        {messages.map((data, index) => (
          <div key={index} className="flex justify-between items-center gaps-5">
            <p className="text-sm text-gray-300">{data[0]}</p>
            <span className="text-xs text-gray-500">{data[1]}</span>
          </div>
        ))}
      </div>
      {admin ? (<div className="w-full">
        <input
          type="text"
          value={buffer}
          onKeyPress={handleKeyPress}
          onChange={(e) => setBuffer(e.target.value)}
          placeholder="Make some news..."
          className="w-full bg-gray-700 p-1"
        />
      </div>) : null}
    </div>
  );
};

export default News;
