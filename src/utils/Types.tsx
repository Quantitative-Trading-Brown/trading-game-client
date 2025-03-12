type GameProps = {
  code: string;
};

type SecurityProps = {
  [key: number]: {
    name: string;
    bookMin: number;
    bookMax: number;
    scale: number;
  };
};

type Orderbook = {
  [key: number]: number;
};

type Orderbooks = {
  [key: number]: Orderbook;
};

export type { GameProps, SecurityProps, Orderbook, Orderbooks };
