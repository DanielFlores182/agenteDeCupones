import { Basket } from '../types';
import { useRouter } from 'next/navigation';

type Props = {
  basket: Basket;
  onClose: () => void;
};

export default function BasketModal({ basket, onClose }: Props) {
   const router = useRouter();

  const handleAceptar = async () => {
    try {
      const response = await fetch('http://localhost:8000/guardar_canaston', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(basket),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el canastón');
      }

      const data = await response.json();
      console.log('Guardado con éxito:', data);

      onClose();
      router.push('/pasillo');
    } catch (error) {
      console.error(error);
      alert('No se pudo guardar el canastón');
    }
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

        <h2 className="text-xl font-extrabold text-[#ED6A0F] mb-4">
          Detalle del Canastón
        </h2>

        <ul className="mb-4 ml-3 font-bold text-gray-700 text-2sm max-h-60 overflow-y-auto">
          {basket.productos.map((producto, index) => (
            <li key={index}>
              • {producto.nombre} – Bs. {producto.precio}
            </li>
          ))}
        </ul>

        <div className="font-bold text-green-600  text-2xl mt-8">
          Total: Bs. {basket.total_gastado} <br />
          Saldo: Bs. {basket.saldo_restante}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#ED6A0F] text-white font-bold cursor-pointer"
          >
            Cerrar
          </button>
          <button
            onClick={handleAceptar}
            className="px-4 py-2 rounded-lg bg-[#0349AB] text-white font-bold cursor-pointer"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
