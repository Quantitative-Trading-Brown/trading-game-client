"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { Orderbook, Orderbooks, SecurityProps } from "@/utils/Types";
import GraphCell from "@/components/graph";

const generateBooks = (securities: SecurityProps) => {
  const bookLimits = Object.entries(securities).reduce(
    (acc, [key, value]) => {
      const bookLim = [value.bookMin, value.bookMax];

      // Generate the object for this security
      const bookObject = Array.from(
        { length: bookLim[1] - bookLim[0] + 1 },
        (_, i) => ({
          [bookLim[1] - i]: 0,
        }),
      ).reduce((acc, curr) => Object.assign(acc, curr), {});

      // Assign the generated object under the security key
      acc[Number(key)] = bookObject;
      return acc;
    },
    {} as { [key: number]: { [bookValue: number]: number } },
  );
  return bookLimits;
};

type OrderbookProps = {
  admin: boolean;
  orderbooks: Orderbooks;
  securities: SecurityProps;
};

const OrderbookCell = (props: OrderbookProps) => {
  const [selectedSecurity, setSelectedSecurity] = useState(1);
  const [bidAskQuantity, setBidAskQuantity] = useState(1);
  const [orderbooks, setOrderbooks] = useState<Orderbooks>({});
  const { socket } = useSocket();

  useEffect(() => {
    setOrderbooks((existing: Orderbooks) => generateBooks(props.securities));
  }, [props.securities]);

  useEffect(() => {
    if (socket) {
      socket.on("orderbook", (security: number, updates: Orderbook) => {
        setOrderbooks((existing: Orderbooks) => {
          return {
            ...existing,
            [security]: { ...existing[security], ...updates },
          };
        });
      });

      return () => {
        socket.off("orderbook");
      };
    }
  }, [socket]);

  // On refresh, load the starting state of the orderbook
  useEffect(() => {
    if (props.orderbooks) {
      setOrderbooks((existing: Orderbooks) => {
        const updatedOrderbooks = { ...existing };

        // Merge each security's updates into the existing orderbook
        for (const security in props.orderbooks) {
          updatedOrderbooks[security] = {
            ...existing[security],
            ...props.orderbooks[security],
          };
        }

        return updatedOrderbooks;
      });
    }
  }, []);

  const handleSecurityChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedSecurity(Number(event.target.value));
  };

  const handleBidAskQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBidAskQuantity(Math.max(1, Math.min(1e3, Number(event.target.value))));
  };
  const handleOrder = (order_type: string, price: string) => {
    // Handle bid and ask orders
    // console.log(`${order_type} ${bidAskQuantity} at ${price}`);
    if (socket) {
      socket.emit(
        "order",
        selectedSecurity,
        order_type,
        Number(price),
        bidAskQuantity,
      );
    }
  };
  const handleCancelOrder = (price: number) => {
    // Handle cancel requests
    // console.log(`Cancel orders at ${price}`);
    if (socket) {
      socket.emit("cancel", selectedSecurity, price);
    }
  };
  const handleCancelAllOrders = () => {
    // Handle cancel everything requests
    // console.log("Cancel all orders");
    if (socket) {
      socket.emit("cancel_all", selectedSecurity);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-10 justify-center items-center px-8 py-5">
        <div className="flex flex-1 items-center">
          <label htmlFor="security-select" className="mr-2">
            Select Security:{" "}
          </label>
          <select
            id="security-select"
            value={selectedSecurity}
            onChange={handleSecurityChange}
            className="px-4 py-2 bg-gray-700 flex-grow"
          >
            {Object.entries(props.securities).map(([key, value]) => (
              <option key={key} value={key}>
                {value["name"]}
              </option>
            ))}
          </select>
        </div>
        {!props.admin ? (
          <div className="">
            <span className="mr-2">Bid/Ask Quantity: </span>
            <input
              id="bid-ask-quantity"
              type="number"
              onChange={handleBidAskQuantityChange}
              className="px-2 py-1 bg-gray-700 w-[5em]"
            />
          </div>
        ) : null}
        {!props.admin ? (
          <button
            onClick={handleCancelAllOrders}
            className="w-[15em] px-2 py-1 h-10 bg-gray-500 text-white shadow 
          border-black active:border-l-[2px] active:border-t-[2px]
          hover:bg-red-600"
          >
            Cancel All Orders
          </button>
        ) : null}
      </div>
      <div className="overflow-y-auto h-[20em]">
        <table className="table-auto border-collapse w-full">
          <thead className="outline outline-1 outline-offset-0 outline-red sticky top-0">
            <tr className="bg-black">
              <th className="text-left px-4 py-2">Price</th>
              <th className="text-left px-4 py-2">Bid Vol</th>
              <th className="text-left px-4 py-2">Ask Vol</th>
              {!props.admin ? (
                <th colSpan={3} className="text-center px-4 py-2">
                  Actions
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className="border-collapse">
            {orderbooks[selectedSecurity]
              ? Object.entries(orderbooks[selectedSecurity])
                  .toReversed()
                  .map(([price, vol]: [any, any]) => (
                    <tr key={price} className="border-b border-gray-300 h-10">
                      <td className="px-4">{price}</td>
                      <td className={"px-4" + (vol > 0 ? " bg-green-700" : "")}>
                        {Math.max(vol, 0)}
                      </td>
                      <td className={"px-4" + (vol < 0 ? " bg-red-700" : "")}>
                        {-Math.min(vol, 0)}
                      </td>
                      {!props.admin ? (
                        <td className="h-10 p-0 border-x-white border-x w-[10em]">
                          <button
                            onClick={() => handleOrder("BUY", price)}
                            className="bg-gray-500 w-full h-full
                    border-blue-600 active:border-l-[2px] active:border-t-[2px]
                    hover:bg-blue-600 truncate"
                          >
                            Buy {bidAskQuantity}
                          </button>
                        </td>
                      ) : null}
                      {!props.admin ? (
                        <td className="h-10 p-0 border-x-white border-x w-[10em]">
                          <button
                            onClick={() => handleOrder("SELL", price)}
                            className="bg-gray-500 w-full h-full 
                    border-blue-600 active:border-l-[2px] active:border-t-[2px]
                    hover:bg-blue-600 truncate"
                          >
                            Sell {bidAskQuantity}
                          </button>
                        </td>
                      ) : null}
                      {!props.admin ? (
                        <td className="h-10 p-0 border-x-white border-x w-[10em]">
                          <button
                            onClick={() => handleCancelOrder(price)}
                            className="bg-gray-500 w-full h-full 
                    border-blue-600 active:border-l-[2px] active:border-t-[2px]
                    hover:bg-blue-600"
                          >
                            Cancel
                          </button>
                        </td>
                      ) : null}
                    </tr>
                  ))
              : null}
          </tbody>
        </table>
      </div>
      <div className="flex-grow p-5">
        <GraphCell selected={selectedSecurity} />
      </div>
    </div>
  );
};

export default OrderbookCell;
