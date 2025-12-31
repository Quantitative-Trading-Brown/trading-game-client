"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { Orderbook, Security } from "@/utils/Types";

type OrderbookProps = {
  existingOrders: Orderbook;
  selectedSecurity: Security;
};

const OrderbookCell: React.FC<OrderbookProps> = ({
  existingOrders,
  selectedSecurity
}) => {
  const [orderbooks, setOrderbooks] = useState<Orderbooks>({});
  const { socket } = useSocket();

  const updateOrderbooks = (updates: Orderbooks) => {
    setOrderbooks((existing = {}) => {
      // Create a shallow copy of the existing orderbooks
      const newBook: Orderbooks = { ...existing };

      for (const symbol in updates) {
        const bookUpdates = updates[symbol];

        // Create a shallow copy of the specific orderbook or initialize it
        const symbolBook: Orderbook = { ...(newBook[symbol] || {}) };

        for (const priceStr in bookUpdates) {
          const price = Number(priceStr);
          const vol = bookUpdates[price];

          if (vol === 0) {
            delete symbolBook[price];
          } else {
            symbolBook[price] = vol;
          }
        }

        newBook[symbol] = symbolBook;
      }

      return newBook;
    });
  };

  // Apply incremental updates from socket
  useEffect(() => {
    if (socket) {
      socket.on("orderbook", updateOrderbooks);

      return () => {
        socket.off("orderbook");
      };
    }
  }, [socket]);

  // Apply initial orderbooks from props
  useEffect(() => {
    if (!existingOrders) return;
    setOrderbooks(existingOrders);
  }, [existingOrders]);

  // Specific to this security
  const { [selectedSecurity]: orderbook } = orderbooks;

  // Compute bids with cumulative totals
  const bids = useMemo(() => {
    if (!orderbook) return [];
    let cumulative = 0;
    return Object.entries(orderbook)
      .filter(([_, vol]) => Number(vol) > 0)
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .map(([price, vol]) => {
        cumulative += Number(vol);
        return {
          price: Number(price),
          quantity: Number(vol),
          total: cumulative
        };
      })
      .reverse();
  }, [orderbook]);

  // Compute asks with cumulative totals
  const asks = useMemo(() => {
    if (!orderbook) return [];
    let cumulative = 0;
    return Object.entries(orderbook)
      .filter(([_, vol]) => Number(vol) < 0)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([price, vol]) => {
        cumulative += -Number(vol);
        return {
          price: Number(price),
          quantity: -Number(vol),
          total: cumulative
        };
      })
      .reverse();
  }, [orderbook]);

  const maxVolume = useMemo(
    () => Math.max(...bids.map((b) => b.total), ...asks.map((a) => a.total), 1),
    [bids, asks]
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <h2 className="text-xl font-bold p-5">Orderbook</h2>
      <div className="flex flex-col h-full overflow-y-auto px-8 py-2 gap-1">
        {/* Header Row */}
        <div className="flex justify-between items-center h-6 font-semibold text-gray-300 border-b border-gray-600 mb-1">
          <div className="w-1/3 text-left">Price</div>
          <div className="w-1/3 text-center">Quantity</div>
          <div className="w-1/3 text-right">Total</div>
        </div>

        {/* Asks */}
        <div className="flex flex-col">
          {asks.map(({ price, quantity, total }) => {
            const width = (total / maxVolume) * 100;
            return (
              <div
                key={`ask-${price}`}
                className="flex justify-between items-center h-6 relative"
              >
                <div className="text-white w-1/3 text-left">{price}</div>
                <div className="text-red-200 w-1/3 text-center">{quantity}</div>
                <div className="text-red-200 w-1/3 text-right">{total}</div>
                <div
                  className="absolute left-0 top-0 h-full bg-red-700 opacity-20"
                  style={{ width: `${width}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Bids */}
        <div className="flex flex-col-reverse">
          {bids.map(({ price, quantity, total }) => {
            const width = (total / maxVolume) * 100;
            return (
              <div
                key={`bid-${price}`}
                className="flex justify-between items-center h-6 relative"
              >
                <div className="text-white w-1/3 text-left">{price}</div>
                <div className="text-green-200 w-1/3 text-center">
                  {quantity}
                </div>
                <div className="text-green-200 w-1/3 text-right">{total}</div>
                <div
                  className="absolute left-0 top-0 h-full bg-green-700 opacity-20"
                  style={{ width: `${width}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderbookCell;
