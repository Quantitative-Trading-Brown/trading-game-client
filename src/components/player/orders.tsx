import React, { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { SecurityProps, Order, Orders, OrderUpdates } from "@/utils/Types";

type OrderProps = {
  securities: SecurityProps;
  existingOrders: Orders;
};

const OrdersCell: React.FC<OrderProps> = ({ securities, existingOrders }) => {
  const { socket } = useSocket();
  const [orders, setOrders] = useState<Orders>(existingOrders);

  const CancelAllOrders = () => socket?.emit("cancel_all");

  useEffect(() => {
    if (!socket) return;

    // Listen for order updates
    socket.on("order_update", (updates: OrderUpdates) => {
      setOrders((prev: Orders) => {
        const next = { ...prev, ...updates.new };

        for (const [orderId, qtyInfo] of Object.entries(
          updates.modified ?? {}
        )) {
          if (next[orderId]) {
            next[orderId] = {
              ...next[orderId],
              quantity: qtyInfo[1]
            };
          }
        }

        for (const orderId of updates.deleted ?? []) {
          delete next[orderId];
        }

        return next;
      });
    });

    return () => {
      socket.off("orders");
    };
  }, [socket]);

  const cancelOrder = (order_id: string) => {
    if (!socket) return;
    socket.emit("cancel", order_id);
  };

  return (
    <div className="p-4 text-white rounded-lg flex flex-col gap-2 overflow-y-auto h-full">
      <h2 className="font-bold text-xl">My Orders</h2>
      <div className="flex-grow overflow-y-auto">
        <div className="overflow-y-auto font-mono text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="h-6 font-semibold text-gray-300 border-b border-gray-600">
                <th className="w-1/5 text-left">Security</th>
                <th className="w-1/5 text-center">Side</th>
                <th className="w-1/5 text-center">Price</th>
                <th className="w-1/5 text-center">Quantity</th>
                <th className="w-1/5 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(orders).map(([oid, data]: [string, Order]) => (
                <tr key={oid} className="">
                  <td className="text-left">{data.security}</td>

                  <td
                    className={`text-center ${
                      data.side === "bids" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {data.side === "bids" ? "BUY" : "SELL"}
                  </td>

                  <td className="text-center">{data.price}</td>

                  <td className="text-center">{data.quantity}</td>

                  <td className="text-right">
                    <button
                      onClick={() => cancelOrder(oid)}
                      className="px-2 py-1 bg-gray-600 rounded hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button
        onClick={CancelAllOrders}
        className="px-2 py-1 bg-gray-500 text-white shadow border-black active:border-l-[2px] active:border-t-[2px] hover:bg-red-600"
      >
        Cancel All Orders
      </button>
    </div>
  );
};

export default OrdersCell;
