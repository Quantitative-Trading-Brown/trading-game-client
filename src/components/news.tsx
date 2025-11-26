"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";

type NewsProps = {
  admin: boolean;
  news: [string, string][];
};


const News = (props : NewsProps) => {
  const [messages, setMessages] = useState<[string, string][]>([]);
  const [buffer, setBuffer] = useState("");
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("news", (msg_entry : [string, string]) => {
        setMessages((prevMessages) => [...prevMessages, msg_entry])
      });

      return () => {
        socket.off("news");
      };
    }
  }, [socket]);

  // On refresh, load the past news from the snapshot in props
  useEffect(() => {
    if (props.news) {
      setMessages(props.news);
    }
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (buffer.trim() && socket) {
        socket.emit("news", buffer);
        setBuffer("");
      }
    }
  };

  return (
    <div className="flex flex-col text-white p-4 h-full shadow-lg">
      <h2 className="text-xl font-bold">News</h2>
      <div className="flex-grow space-y-2 overflow-y-auto w-full pt-4">
        {messages.map((data, index) => (
          <div key={index} className="flex justify-between items-center">
            <p className="whitespace-normal text-sm text-gray-300 w-[70%]">{data[1]}</p>
            <span className="whitespace-normal text-xs text-gray-500 w-[20%]">{data[0]}</span>
          </div>
        ))}
      </div>
      {props.admin ? (<div className="w-full">
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
