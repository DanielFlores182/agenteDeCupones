type Props = {
  basket: any;
  onClick: (b: any) => void;
  icon: string;
};

export default function BasketCard({ basket, onClick, icon }: Props) {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer flex flex-col"
    >

      <div className="bg-[#ED6A0F] text-white rounded-t-2xl px-4 py-3 font-semibold text-center text-xl">
        {basket.name}
      </div>

      <div className="flex justify-center mt-4">
        <img src="/carrito-de-supermercado.png" alt="icon" className="w-30 h-30 object-contain mt-2" />
      </div>

      <div className="flex justify-between items-start p-8 text-gray-700 text-xl font-bold">
        <div className="flex-1 space-y-1 ml-2">
          {basket.items.map((item: string) => (
            <p key={item}>• {item}</p>
          ))}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClick(basket); }}
          className="ml-7 mt-10 bg-[#0349AB] text-white text-xl px-5 py-2 rounded-full whitespace-nowrap cursor-pointer"
        >
          ✔ Ver detalle
        </button>
      </div>
    </div>
  );
}
