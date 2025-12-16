'use client';

import { useState } from 'react';
import CouponCard from './components/CuponCard';
import Preferences from './components/Preferences';
import BasketGrid from './components/BasketGrid';
import BasketModal from './components/BasketModal';
import { recomendarCanastones } from './services/cuponService';


type Producto = {
  nombre: string;
  precio: number;
};

type Basket = {
  estrategia: string;
  productos: Producto[];
  total_gastado: number;
  saldo_restante: number;
};

export default function CuponPage() {
  const [amount, setAmount] = useState<number | null>(null);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [selectedBasket, setSelectedBasket] = useState<Basket | null>(null);
  const [loading, setLoading] = useState(false);

  const generateBaskets = async () => {
  if (!amount || amount <= 0) return;
  
  let preferenciaBackend = null;
  
  // Si hay "Todo" seleccionado o ninguna preferencia → null
  if (preferences.includes('Todo') || preferences.length === 0) {
    preferenciaBackend = null;
  } 
  // Si hay exactamente UNA preferencia (y no es "Todo")
  else if (preferences.length === 1 && preferences[0] !== 'Todo') {
    preferenciaBackend = preferences[0];
  }
  // Si hay múltiples preferencias (sin "Todo")
  else {
    // Aquí decides: ¿null o enviar array? Depende del backend
    preferenciaBackend = null; // o preferences.join(',')
  }
  
  const canastones = await recomendarCanastones(amount, preferenciaBackend);
  setBaskets(canastones);
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

      {loading && (
        <p className="mt-10 text-center text-[#0349AB] font-medium">
          Generando canastones...
        </p>
      )}

      {!loading && baskets.length === 0 && (
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
