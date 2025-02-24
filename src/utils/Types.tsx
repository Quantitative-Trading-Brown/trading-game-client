type GameProps = {
  code: string;
};

type SecurityProps = {
  [key: number]: {
    name: string;
    bookMin: number;
    bookMax: number;
  };
};

type Orderbook = {
  [key: number]: number;
};

export type { gameProps, securityProps, orderbook };
