"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

import { collection, getDocs } from "firebase/firestore";
import db from "@/scripts/firestore";
import { Server } from "@/utils/Types";

async function attemptConnect(ip: string) {
  try {
    const response = await axios.get(ip, {
      timeout: 5000, // 5 second timeout
    });
    return response.status === 204;
  } catch (error) {
    return false;
  }
}

async function fetchServers() {
  try {
    const querySnapshot = await getDocs(collection(db, "servers"));
    const documents = querySnapshot.docs;
    const data = Object.fromEntries(
      documents.map((doc) => [doc.id, doc.data()])
    );

    // Return servers immediately with unknown status
    const servers = Object.fromEntries(
      Object.entries(data).map(([server_id, info]) => [
        server_id,
        {
          name: info.name,
          ip: info.ip,
          up: null // null means checking
        }
      ])
    );

    return servers;
  } catch (error) {
    console.error("Error fetching Firestore data:", error);
    return {};
  }
}

type Props = {
  onSelect: (value: Server) => void;
};

const ServerModal: React.FC<Props> = ({ onSelect }) => {
  const [servers, setServers] = useState<Record<string, Server>>({});
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);

  const checkServerStatus = async (serverId: string, ip: string) => {
    const up = await attemptConnect(ip);
    setServers((prev) => ({
      ...prev,
      [serverId]: {
        ...prev[serverId],
        up
      }
    }));
  };

  const reloadServers = async () => {
    const servers = await fetchServers();
    setServers(servers);

    // Start checking all servers in parallel
    Object.entries(servers).forEach(([serverId, server]) => {
      checkServerStatus(serverId, server.ip);
    });
  };

  useEffect(() => {
    reloadServers();
  }, []);

  const hasAutoSelected = useRef(false);
  useEffect(() => {
    if (hasAutoSelected.current) return;
    if (!servers || Object.keys(servers).length === 0) return;

    const firstUpServer = Object.keys(servers).find((key) => servers[key].up === true);

    if (firstUpServer) {
      hasAutoSelected.current = true;
      handleServerSelect(firstUpServer);
    }
  }, [servers]);

  const handleServerSelect = (key: string) => {
    setSelected(key);
    onSelect(servers[key]);
    setOpen(false);
  };

  return (
    <div>
      {/* Button to open the modal */}

      <div className="flex px-4 items-center justify-between">
        <div>
          Selected Server: {selected ? `${servers[selected].name}` : "None"}
        </div>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 border hover:bg-gray-700"
        >
          Change Server
        </button>
      </div>

      {/* Full-screen modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 w-11/12 max-w-2xl p-6 relative max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Select a Server</h2>
            <div className="absolute top-3 right-3 flex gap-4">
              <button
                onClick={() => reloadServers()}
                className="text-xl text-gray-600 hover:text-gray-700"
              >
                🗘
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-4xl text-gray-600 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {Object.entries(servers).map(([key, server]: [string, any]) => (
                <div
                  key={key}
                  onClick={() => handleServerSelect(key)}
                  className="flex p-4 border hover:bg-gray-700 cursor-pointer justify-between"
                >
                  <div className="">
                    <div className="font-medium">{server.name}</div>
                    <div className="text-sm text-gray-500">{server.ip}</div>
                  </div>
                  <div>
                    {server.up === null ? (
                      <span className="text-yellow-500">CHECKING...</span>
                    ) : server.up ? (
                      <span className="text-green-500">UP</span>
                    ) : (
                      <span className="text-red-500">DOWN</span>
                    )}
                  </div>
                </div>
              ))}

              {Object.keys(servers).length === 0 && (
                <div className="text-gray-400">No servers available</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerModal;
