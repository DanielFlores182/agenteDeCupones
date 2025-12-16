export type Producto = {
  nombre: string;
  precio: number;
};

export type Basket = {
  estrategia: string;
  productos: Producto[];
  total_gastado: number;
  saldo_restante: number;
};