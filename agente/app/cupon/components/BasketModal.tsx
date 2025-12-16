import { Basket } from '../types';

type Props = {
  basket: Basket;
  onClose: () => void;
};

export default function BasketModal({ basket, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

        <h2 className="text-xl font-extrabold text-[#ED6A0F] mb-4">
          Detalle del Canastón
        </h2>

        <ul className="text-2sm text-gray-700 mb-4 ml-3 font-bold">
          {basket.productos.map((producto, index) => (
            <li key={index}>
              • {producto.nombre} – Bs. {producto.precio}
            </li>
          ))}
        </ul>

        <div className="font-bold text-green-600 mb-6 text-2xl">
          Total: Bs. {basket.total_gastado} <br />
          Saldo: Bs. {basket.saldo_restante}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0349AB] text-white font-bold cursor-pointer"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
