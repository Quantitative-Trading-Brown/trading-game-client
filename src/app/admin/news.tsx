"use client";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:5000");

const News = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Listen for messages from the server
    socket.on("message", (msg: string) => {
      setMessages((prevMessages) => [msg, ...prevMessages]);
    });

    // Cleanup when component unmounts
    return () => {
      socket.off("message");
    };
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    if (message.trim()) {
      socket.send(message);
      setMessage('');
    }
    }
  }

  return (
    <div className="flex flex-col h-full p-4 max-w-lg w-[30em] mx-auto">
      <h2 className="text-lg font-bold mb-4">Market News</h2>
      <div className="flex flex-col-reverse gap-2 flex-grow mb-4 w-full
      overflow-scroll overscroll-contain">
        {messages.map((msg, index) => (
          <div key={index} className="flex justify-between items-center gaps-5">
            <p className="text-sm text-gray-300">{msg}</p>
            <span className="text-xs text-gray-500">1 hour ago</span>
          </div>
        ))}
      </div>
      <div className="w-full">
        <input
          type="text"
          value={message}
          onKeyPress={handleKeyPress}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full bg-gray-700 p-1"
        />
      </div>
    </div>
  );
};

export default News;
