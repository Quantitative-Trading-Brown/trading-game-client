type Server = {
  name: string;
  ip: string;
  up: boolean;
};

type GameProps = {
  state: number;
  code: string;
};

type Security = {
  name: string;
  tick: number;
};

type SecurityProps = {
  [key: string]: Security;
};

type Inventory = {
  [key: string]: number;
};

type Orderbook = {
  [key: number]: number;
};

type Orderbooks = {
  [key: string]: Orderbook;
};

type Order = {
  id: string;
  security: number;
  side: "bids" | "asks";
  price: number;
  quantity: number;
};

type Orders = {
  [key: string]: Order;
};

type OrderUpdates = {
  new: Orders;
  modified: {
    [key: string]: [number, number];
  };
  deleted: string[];
};

type Preset = {
  id: string;
  name: string;
  desc: string;
};


export type {
  Server,
  GameProps,
  SecurityProps,
  Security,
  Orderbook,
  Orderbooks,
  OrderUpdates,
  Orders,
  Order,
  Inventory,
  Preset
};
