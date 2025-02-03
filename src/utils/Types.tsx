type gameProps = {
  bookMin: number,
  bookMax: number,
  code: string,
}

type orderbook = {
  [key: number]: number
}

export type {gameProps, orderbook};
