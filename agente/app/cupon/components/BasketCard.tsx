import { Basket } from '../types';

type Props = {
  basket: Basket;
  onClick: (b: Basket) => void;
};

export default function BasketCard({ basket, onClick }: Props) {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer flex flex-col"
      onClick={() => onClick(basket)}
    >
      <div className="bg-[#ED6A0F] text-white rounded-t-2xl px-4 py-3 font-semibold text-center text-lg capitalize">
        Canastón · {basket.estrategia.replace('_', ' ')}
      </div>

      <div className="flex justify-center mt-4">
        <img
          src="/carrito-de-supermercado.png"
          alt="Canastón"
          className="w-30 h-30 object-contain mt-5"
        />
      </div>

      <div className="flex justify-between items-start p-10 text-gray-700 text-sm">
        <div className="flex-1 space-y-1 font-bold">
          {basket.productos.map((producto, index) => (
            <p key={index}>
              • {producto.nombre}
            </p>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick(basket);
          }}
          className="ml-6 mt-40 bg-[#0349AB] text-white text-xl px-4 py-2 rounded-full whitespace-nowrap cursor-pointer"
        >
          Ver detalle
        </button>
      </div>

      <div className="px-6 pb-4 text-2xs font-semibold text-green-700 text-center">
        Total: Bs. {basket.total_gastado} · Saldo: Bs. {basket.saldo_restante}
      </div>
    </div>
  );
}
