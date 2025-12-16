import BasketCard from './BasketCard';

type Props = {
  baskets: any[];
  onSelect: (b: any) => void;
};

export default function BasketGrid({ baskets, onSelect }: Props) {
  return (
    <section className="flex justify-center mt-10 px-4">
      <div className="w-full max-w-6xl">

        <h3 className="font-bold text-[#ED6A0F] mb-6 text-center text-3xl ">
          Canastones sugeridos para ti
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {baskets.map((basket, index) => (
            <BasketCard
              key={index}
              basket={basket}
              onClick={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
