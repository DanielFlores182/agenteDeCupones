'use client';

import { useState } from 'react';
import CouponCard from './components/CuponCard';
import Preferences from './components/Preferences';
import BasketGrid from './components/BasketGrid';
import BasketModal from './components/BasketModal';

type Basket = {
  id: number;
  name: string;
  items: string[];
  total: number;
};

export default function CuponPage() {
  const [amount, setAmount] = useState<number | null>(null);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [selectedBasket, setSelectedBasket] = useState<Basket | null>(null);

  const generateBaskets = () => {
    if (!amount || amount <= 0) return;

    setBaskets([
      {
        id: 1,
        name: 'Canastón Familiar',
        items: ['Pollo', 'Panetón', 'Gaseosa'],
        total: amount,
      },
      {
        id: 2,
        name: 'Canastón Tradicional',
        items: ['Carne', 'Arroz', 'Jugo'],
        total: amount,
      },
      {
        id: 3,
        name: 'Canastón Económico',
        items: ['Arroz', 'Aceite', 'Galletas'],
        total: amount,
      },
      {
        id: 4,
        name: 'Canastón Familiar',
        items: ['Pollo', 'Panetón', 'Gaseosa'],
        total: amount,
      },
      {
        id: 5,
        name: 'Canastón Tradicional',
        items: ['Carne', 'Arroz', 'Jugo'],
        total: amount,
      },
      {
        id: 6,
        name: 'Canastón Económico',
        items: ['Arroz', 'Aceite', 'Galletas'],
        total: amount,
      },
    ]);
  };

  return (
    <main className="min-h-screen bg-[#E5E7EB] pb-20">

      <CouponCard
        amount={amount}
        setAmount={setAmount}
        onGenerate={generateBaskets}
      />

      <Preferences
        preferences={preferences}
        setPreferences={setPreferences}
      />

      {baskets.length === 0 && (
        <p className="mt-10 text-center text-gray-500 px-4">
          Ingresa el monto de tu cupón para generar canastones disponibles.
        </p>
      )}

      {baskets.length > 0 && (
        <BasketGrid
          baskets={baskets}
          onSelect={setSelectedBasket}
        />
      )}

      {selectedBasket && (
        <BasketModal
          basket={selectedBasket}
          onClose={() => setSelectedBasket(null)}
        />
      )}
    </main>
  );
}
