type GameProps = {
  code: string;
};

type Security = {
  name: string;
  tick: number;
};

type SecurityProps = {
  [key: number]: Security;
};

type Inventory = {
  [key: number]: number;
};

type Orderbook = {
  [key: number]: number;
};

type Orderbooks = {
  [key: number]: Orderbook;
};

type Order = {
  id: string;
  security: number;
  side: "bid" | "ask";
  price: number;
  quantity: number;
};

type Orders = [order: Order];

export type { GameProps, SecurityProps, Orderbook, Orderbooks, Inventory };
