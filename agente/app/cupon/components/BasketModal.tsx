type Props = {
  basket: any;
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
          {basket.items.map((item: string) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>

        <div className="font-bold text-green-600 mb-6 text-2xl">
          Total: Bs. {basket.total}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0349AB] text-white font-bold cursor-pointer"
          >
            Editar
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#ED6A0F] text-white font-bold cursor-pointer"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
