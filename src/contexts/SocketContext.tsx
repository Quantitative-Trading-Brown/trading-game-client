import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

type SocketProviderProps = {
  children: React.ReactNode;
  namespace: string;
  query?: Record<string, string>;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, namespace, query = {} }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize the socket with the specified namespace and query parameters
    const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${namespace}`, { query });

    newSocket.on('connect', () => {
      console.log(`[${namespace}] Connected with SID:`, newSocket.id);
    });

    // Handle disconnection
    newSocket.on('disconnect', () => {
      console.log(`[${namespace}] Disconnected`);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [namespace, query]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
