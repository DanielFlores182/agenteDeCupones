'use client';

import React, { useState, useEffect } from 'react';

export type Producto = { nombre: string; precio: number };
export type Canaston = { productos: Producto[]; total_gastado: number; saldo_restante: number; estrategia?: string };
export type ProductosJSON = Record<string, Producto[]>;

const PASILLOS = [
  "carnes", "lacteos", "verduras", "frutas", "limpieza",
  "dulces", "galletas_y_cereales", "panaderia", "refrescos",
  "bebidas_alcoholicas", "fideos", "condimentos", "reposteria",
  "productos_de_aseo", "snacks", "chocolates", "juguetes",
  "electrodomesticos", "utensilios", "embutidos", "congelados",
  "mascotas", "pasillo_navideno"
];

export default function Planificador({ monto, preferencia }: { monto: number; preferencia?: string }) {
  const [canastones, setCanastones] = useState<Canaston[]>([]);
  const [selectedCanaston, setSelectedCanaston] = useState<number | null>(null);
  const [productosJSON, setProductosJSON] = useState<ProductosJSON>({});
  const [pasilloSeleccionado, setPasilloSeleccionado] = useState<string | null>(null);
  const [canastonActual, setCanastonActual] = useState<Producto[]>([]);
  const [compraId, setCompraId] = useState<string | null>(null);

  // Cargar sugerencias de canastones
  useEffect(() => {
    fetch('http://localhost:8000/recomendar_canastones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monto, preferencia })
    })
      .then(res => res.json())
      .then(data => setCanastones(data.canastones || []));
    
    fetch('http://localhost:8000/productos')
      .then(res => res.json())
      .then(data => setProductosJSON(data));
  }, [monto, preferencia]);

  // Cambiar productos al seleccionar pasillo
    const productosPasillo = React.useMemo(() => {
     if (pasilloSeleccionado && productosJSON[pasilloSeleccionado]) {
       return productosJSON[pasilloSeleccionado];
      }
     return [];
   }, [pasilloSeleccionado, productosJSON]);

  // Selección de canastón
  const handleSeleccionCanaston = async (index: number) => {
    setSelectedCanaston(index);
    const canaston = canastones[index];
    setCanastonActual(canaston.productos);

    // Iniciar compra en backend
    const res = await fetch('http://localhost:8000/iniciar_compra', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productos: canaston.productos })
    });
    const data = await res.json();
    setCompraId(data.compra_id); // backend debe devolver compra_id
  };

  // Selección de producto en pasillo
  const handleSeleccionProducto = async (producto: Producto) => {
    if (!compraId) return;

    const res = await fetch(`http://localhost:8000/comprar_item/${compraId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ producto })
    });
    const data = await res.json();
    setCanastonActual(data.canaston_actual); // backend devuelve estado actualizado
  };

  // Finalizar compra
  const handleFinalizarCompra = async () => {
    if (!compraId) return;

    await fetch(`http://localhost:8000/finalizar_compra/${compraId}`, { method: 'POST' });
    alert('Compra finalizada');
    setCompraId(null);
    setCanastonActual([]);
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      {/* Sugerencias */}
      <div style={{ flex: 1 }}>
        <h2>Sugerencias de Canastones</h2>
        {canastones.map((c, i) => (
          <div key={i} onClick={() => handleSeleccionCanaston(i)}
               style={{ border: selectedCanaston === i ? '2px solid blue' : '1px solid gray', padding: '10px', marginBottom: '10px', cursor: 'pointer' }}>
            <p><strong>{c.estrategia || `Canastón ${i+1}`}</strong></p>
            <p>Total: {c.total_gastado}, Restante: {c.saldo_restante}</p>
          </div>
        ))}
      </div>

      {/* Pasillos y productos */}
      <div style={{ flex: 1 }}>
        <h2>Pasillos</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {PASILLOS.map(p => (
            <button key={p} onClick={() => setPasilloSeleccionado(p)}
                    style={{ padding: '10px', minWidth: '120px', backgroundColor: pasilloSeleccionado === p ? '#E3001B' : '#ccc', color: pasilloSeleccionado === p ? '#fff' : '#000', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              {p}
            </button>
          ))}
        </div>

        {pasilloSeleccionado && (
          <div style={{ marginTop: '20px' }}>
            <h3>Productos de {pasilloSeleccionado}</h3>
            {productosPasillo.map((prod, idx) => (
              <div key={idx} style={{ border: '1px solid gray', padding: '8px', marginBottom: '5px', cursor: 'pointer' }} onClick={() => handleSeleccionProducto(prod)}>
                {prod.nombre} - Bs {prod.precio}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Canastón actual */}
      <div style={{ flex: 1 }}>
        <h2>Canastón Actual</h2>
        {canastonActual.map((prod, idx) => (
          <div key={idx} style={{ border: '1px solid gray', padding: '8px', marginBottom: '5px' }}>
            {prod.nombre} - Bs {prod.precio}
          </div>
        ))}
        {canastonActual.length > 0 && (
          <button onClick={handleFinalizarCompra} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#E3001B', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Finalizar Compra
          </button>
        )}
      </div>
    </div>
  );    
}
