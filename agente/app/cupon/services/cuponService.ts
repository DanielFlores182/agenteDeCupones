import { Basket } from '../types';

const API_URL = 'http://localhost:8000/recomendar_canastones';

export async function recomendarCanastones(
  monto: number,
  preferencia: string | null
): Promise<Basket[]> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      monto,
      preferencia,
    }),
  });

  if (!res.ok) {
    throw new Error('Error al obtener canastones');
  }

  const data = await res.json();
  return data.canastones;
}
