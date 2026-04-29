import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Lightweight wrapper around the browser WebSocket that mimics the
// socket.io-client `emit` / `on` / `off` API used throughout the app.
//
// Wire format (both directions):
//   { "event": "<name>", "data": <json_value> }
// ---------------------------------------------------------------------------

export interface GameSocket {
  emit: (event: string, data?: unknown) => void;
  on: (event: string, cb: (data: any) => void) => void;
  off: (event: string) => void;
}

type SocketContextType = {
  socket: GameSocket | null;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

type SocketProviderProps = {
  children: React.ReactNode;
  url: string;           // full ws:// or wss:// URL including path + query
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, url }) => {
  const [socket, setSocket] = useState<GameSocket | null>(null);
  const listenersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());
  const wsRef = useRef<WebSocket | null>(null);
  const pendingRef = useRef<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log(`[ws] Connected to ${url}`);
      // Flush any messages queued while connecting
      for (const msg of pendingRef.current) {
        ws.send(msg);
      }
      pendingRef.current = [];
    };

    ws.onclose = () => {
      console.log(`[ws] Disconnected`);
    };

    ws.onerror = () => {};

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        const { event, data } = msg;
        const cbs = listenersRef.current.get(event);
        if (cbs) {
          for (const cb of cbs) {
            cb(data);
          }
        }
      } catch (e) {
        console.error('[ws] Bad message:', ev.data, e);
      }
    };

    const gameSocket: GameSocket = {
      emit(event: string, data: unknown = null) {
        const msg = JSON.stringify({ event, data });
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(msg);
        } else if (ws.readyState === WebSocket.CONNECTING) {
          pendingRef.current.push(msg);
        }
      },
      on(event: string, cb: (data: any) => void) {
        if (!listenersRef.current.has(event)) {
          listenersRef.current.set(event, new Set());
        }
        listenersRef.current.get(event)!.add(cb);
      },
      off(event: string) {
        listenersRef.current.delete(event);
      },
    };

    setSocket(gameSocket);

    return () => {
      ws.close();
      wsRef.current = null;
      listenersRef.current.clear();
      setSocket(null);
    };
  }, [url]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Helper: convert http(s) base URL to ws(s) URL with path and query
export function buildWsUrl(serverIp: string, path: string, token: string): string {
  let base = serverIp;
  if (base.startsWith('https://')) {
    base = 'wss://' + base.slice('https://'.length);
  } else if (base.startsWith('http://')) {
    base = 'ws://' + base.slice('http://'.length);
  } else {
    base = 'ws://' + base;
  }
  // Remove trailing slash
  if (base.endsWith('/')) base = base.slice(0, -1);
  return `${base}${path}?token=${encodeURIComponent(token)}`;
}

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
