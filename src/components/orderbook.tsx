"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { Orderbook, Orderbooks, Security } from "@/utils/Types";

type OrderbookProps = {
  existingOrders: Orderbooks;
  selectedSecurity: string;
};

const OrderbookCell: React.FC<OrderbookProps> = ({
  existingOrders,
  selectedSecurity
}) => {
  const [orderbooks, setOrderbooks] = useState<Orderbooks>({});
  const [showFullBook, setShowFullBook] = useState(true);
  const { socket } = useSocket();

  const updateOrderbooks = (updates: Orderbooks) => {
    setOrderbooks((existing = {}) => {
      const newBook: Orderbooks = { ...existing };

      for (const symbol in updates) {
        const bookUpdates = updates[symbol];
        const symbolBook: Orderbook = { ...(newBook[symbol] || {}) };

        for (const price in bookUpdates) {
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

  useEffect(() => {
    if (socket) {
      socket.on("orderbook", updateOrderbooks);

      return () => {
        socket.off("orderbook");
      };
    }
  }, [socket]);

  useEffect(() => {
    if (!existingOrders) return;
    setOrderbooks(existingOrders);
  }, [existingOrders]);

  const { [selectedSecurity]: orderbook } = orderbooks;

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

  const bestBid = bids[bids.length - 1];
  const bestAsk = asks[asks.length - 1];

  const displayedAsks = showFullBook ? asks : (bestAsk ? [bestAsk] : []);
  const displayedBids = showFullBook ? bids : (bestBid ? [bestBid] : []);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex justify-between items-center p-5">
        <h2 className="text-xl font-bold">Orderbook</h2>
        <button
          onClick={() => setShowFullBook(!showFullBook)}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
        >
          {showFullBook ? "Show All Securities" : `Show ${selectedSecurity} Only`}
        </button>
      </div>

      {showFullBook ? (
        <div className="flex flex-col h-full overflow-y-auto px-8 py-2 gap-1">
          {/* Header Row */}
          <div className="flex justify-between items-center h-6 font-semibold text-gray-300 border-b border-gray-600 mb-1">
            <div className="w-1/3 text-left">Price</div>
            <div className="w-1/3 text-center">Quantity</div>
            <div className="w-1/3 text-right">Total</div>
          </div>

          {/* Asks */}
          <div className="flex flex-col">
            {displayedAsks.map(({ price, quantity, total }) => {
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
            {displayedBids.map(({ price, quantity, total }) => {
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
      ) : (
        <div className="px-8 py-4 overflow-y-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-2 font-semibold text-gray-300">Security</th>
                <th className="text-right py-2 font-semibold text-gray-300">Bid</th>
                <th className="text-right py-2 font-semibold text-gray-300">Bid Qty</th>
                <th className="text-right py-2 font-semibold text-gray-300">Ask</th>
                <th className="text-right py-2 font-semibold text-gray-300">Ask Qty</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(orderbooks).sort().map((symbol) => {
                const symbolOrderbook = orderbooks[symbol];
                if (!symbolOrderbook) return null;

                // Calculate best bid
                const symbolBids = Object.entries(symbolOrderbook)
                  .filter(([_, vol]) => Number(vol) > 0)
                  .sort((a, b) => Number(b[0]) - Number(a[0]));
                const symbolBestBid = symbolBids.length > 0 ? {
                  price: Number(symbolBids[0][0]),
                  quantity: Number(symbolBids[0][1])
                } : null;

                // Calculate best ask
                const symbolAsks = Object.entries(symbolOrderbook)
                  .filter(([_, vol]) => Number(vol) < 0)
                  .sort((a, b) => Number(a[0]) - Number(b[0]));
                const symbolBestAsk = symbolAsks.length > 0 ? {
                  price: Number(symbolAsks[0][0]),
                  quantity: -Number(symbolAsks[0][1])
                } : null;

                return (
                  <tr key={symbol} className="border-b border-gray-700">
                    <td className="py-3 text-white font-medium">{symbol}</td>
                    <td className="py-3 text-right text-green-200">
                      {symbolBestBid ? symbolBestBid.price : '-'}
                    </td>
                    <td className="py-3 text-right text-green-200">
                      {symbolBestBid ? symbolBestBid.quantity : '-'}
                    </td>
                    <td className="py-3 text-right text-red-200">
                      {symbolBestAsk ? symbolBestAsk.price : '-'}
                    </td>
                    <td className="py-3 text-right text-red-200">
                      {symbolBestAsk ? symbolBestAsk.quantity : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderbookCell;
