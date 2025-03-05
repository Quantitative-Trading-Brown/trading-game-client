"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";

const Lobby = () => {
  const { socket } = useSocket();
  const [securities, setSecurities] = useState([
    { id: 1, name: "", bookMin: "", bookMax: "" },
  ]);

  const addSecurity = () => {
    const newSecurity = {
      id: securities.length ? securities[securities.length-1].id + 1 : 1,
      name: "",
      bookMin: "",
      bookMax: "",
    };
    setSecurities([...securities, newSecurity]);
  };
  const deleteSecurity = (id: number) => {
    const updatedSecurities = securities.filter(
      (security) => security.id !== id,
    );
    setSecurities(updatedSecurities);
  };

  const handleInputChange = (id: number, field: string, value: string) => {
    const updatedSecurities= securities.map((security) =>
      security.id === id ? { ...security, [field]: value } : security,
    );
    setSecurities(updatedSecurities);
  };

  const handleGameStart = () => {
    if (socket) {
      socket.emit("startgame", {
        "securities": securities,
      });
    }
  };

  return (
    <div className="flex flex-col h-full p-8">
      <h1 className="text-4xl font-extrabold mb-8">Trading Game Admin Setup</h1>
      <div className="flex flex-col flex-grow">
        <table className="text-l w-full">
          <thead className="bg-gray-700 border">
            <tr>
              <th className="p-2">Security Name</th>
              <th className="p-2">Book Min</th>
              <th className="p-2">Book Max</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-700 border">
            {securities.map((sec) => (
              <tr key={sec.id} className="text-center border-b">
                <td className="p-1">
                  <input
                    type="text"
                    value={sec.name}
                    onChange={(e) =>
                      handleInputChange(sec.id, "name", e.target.value)
                    }
                    className="outline-none bg-gray-700 h-8 w-full p-1"
                  />
                </td>
                <td className="p-1">
                  <input
                    type="number"
                    value={sec.bookMin}
                    onChange={(e) =>
                      handleInputChange(sec.id, "bookMin", e.target.value)
                    }
                    className="outline-none bg-gray-700 h-8 w-full p-1"
                  />
                </td>
                <td className="p-1">
                  <input
                    type="number"
                    value={sec.bookMax}
                    onChange={(e) =>
                      handleInputChange(sec.id, "bookMax", e.target.value)
                    }
                    className="outline-none bg-gray-700 h-8 w-full p-1"
                  />
                </td>
                <td className="">
                  <button
                    onClick={() => deleteSecurity(sec.id)}
                    className="bg-gray-700 border-gray-700 w-full h-10
                    active:border-l-[2px] active:border-t-[2px]
                    hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addSecurity} className="bg-gray-700 mt-4 w-full p-2">
          Add Row
        </button>
      </div>
      <div className="flex w-full h-[3em]">
        <button onClick={handleGameStart} className="w-full h-full bg-red-700">
          Start Game
        </button>
      </div>
    </div>
  );
};

export default Lobby;
