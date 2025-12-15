const OPTIONS = [
  'Todo',
  'Carnes',
  'Abarrotes',
  'Golosinas',
  'Bebidas',
  'Panadería',
  'Congelados',
  'Cuidado del hogar',
  'Cuidado personal'
];

type Props = {
  preferences: string[];
  setPreferences: (v: string[]) => void;
};

export default function Preferences({ preferences, setPreferences }: Props) {
  const toggle = (opt: string) => {
    setPreferences(
      preferences.includes(opt)
        ? preferences.filter(p => p !== opt)
        : [...preferences, opt]
    );
  };

  return (
    <section className="flex justify-center mt-10 px-4">
      <div className="w-full max-w-2xl bg-white border border-[#0349AB] rounded-2xl p-6 shadow-sm">

        <h2 className="text-[#0349AB] font-bold mb-4 sm:text-2xl">
          Preferencias de productos
        </h2>

        <div className="flex flex-wrap gap-1">
          {OPTIONS.map(opt => {
            const active = preferences.includes(opt);

            return (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className={`px-5 py-2 rounded-full border-2 text-2sm font-medium transition cursor-pointer
                  ${
                    active
                      ? 'bg-[#0349AB] text-white border-[#0349AB]'
                      : 'bg-[#E5E7EB] text-[#0349AB] border-[#0349AB]'
                  }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
