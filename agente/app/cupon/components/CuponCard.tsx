type Props = {
  amount: number | null;
  setAmount: (v: number) => void;
  onGenerate: () => void;
};

export default function CouponCard({ amount, setAmount, onGenerate }: Props) {
  return (
    <section className="flex justify-center mt-10 px-4">
      <div className="relative w-full max-w-2xl bg-white border-2 border-[#ED6A0F] rounded-2xl  px-6 py-6 sm:px-8 sm:py-7 text-center">
        <span className="absolute -top-3 -left-3 w-10 h-10 bg-[#E5E7EB] rounded-full" />
        <span className="absolute -top-3 -right-3 w-10 h-10 bg-[#E5E7EB] rounded-full" />
        <span className="absolute -bottom-3 -left-3 w-10 h-10 bg-[#E5E7EB] rounded-full" />
        <span className="absolute -bottom-3 -right-3 w-10 h-10 bg-[#E5E7EB] rounded-full" />

        <h1 className="text-lg sm:text-3xl font-bold text-[#ED6A0F]">
          Genera tu Canastón Navideño
        </h1>

        <p className="text-sm text-gray-600 mt-1 font-bold ">
          Usa tu vale y obtén productos por el monto exacto
        </p>

        <div className="mt-5">
          <input
            type="number"
            min="0"
            placeholder="Monto del cupón (Bs.)"
            className="w-full max-w-xs mx-auto h-11 border-2 border-[#0349AB] rounded-lg px-4 text-center
                       placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-[#0349AB] font-bold"
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <button
          onClick={onGenerate}
          className="mt-5 w-full sm:w-auto bg-[#ED6A0F] hover:bg-[#d95f0e] text-white px-7 py-2.5 rounded-xl font-semibold transition  cursor-pointer text-xl"
        >
          Generar canastones
        </button>
      </div>
    </section>
  );
}
