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

export default function Planificador() {
  const [ultimoCanaston, setUltimoCanaston] = useState<Canaston | null>(null);
  const [sugerencias, setSugerencias] = useState<Canaston[]>([]);
  const [productosJSON, setProductosJSON] = useState<ProductosJSON>({});
  const [pasilloSeleccionado, setPasilloSeleccionado] = useState<string | null>(null);
  const [canastonActual, setCanastonActual] = useState<Producto[]>([]);
  const [compraId, setCompraId] = useState<string | null>(null);

  // 1️⃣ Cargar último canastón y productos del supermercado
  useEffect(() => {
    fetch('http://localhost:8000/ultimo_cupon')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUltimoCanaston(data);
          setSugerencias([data]); // inicialmente la sugerencia es el último canastón
          setCanastonActual(data.productos);
        }
      });

    fetch('http://localhost:8000/productos')
      .then(res => res.json())
      .then(data => setProductosJSON(data));
  }, []);

  // Productos del pasillo seleccionado
  const productosPasillo = React.useMemo(() => {
    if (pasilloSeleccionado && productosJSON[pasilloSeleccionado]) {
      return productosJSON[pasilloSeleccionado];
    }
    return [];
  }, [pasilloSeleccionado, productosJSON]);

  // Manejo de selección de producto
  const handleSeleccionProducto = async (producto: Producto) => {
    if (!ultimoCanaston) return;

    // 2️⃣ Iniciar compra si no hay compra activa
    if (!compraId) {
      const res = await fetch('http://localhost:8000/iniciar_compra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ultimoCanaston)
      });
      const data = await res.json();
      setCompraId(data.id || data.compra_id); // backend puede devolver "id"
    }

    if (!compraId) return;

    // 3️⃣ Comprar el item seleccionado
    const res = await fetch(`http://localhost:8000/comprar_item/${compraId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });
    const data = await res.json();

    // 4️⃣ Actualizar canastón actual y sugerencias recalculadas
    setCanastonActual(data.canaston_actual.productos || []);
    setSugerencias([data.canaston_actual]); // recalculamos la sugerencia
  };

  // 5️⃣ Finalizar compra
  const handleFinalizarCompra = async () => {
    if (!compraId) return;

    await fetch(`http://localhost:8000/finalizar_compra/${compraId}`, { method: 'POST' });
    alert('Compra finalizada');
    setCompraId(null);
    setCanastonActual([]);
    setSugerencias(ultimoCanaston ? [ultimoCanaston] : []);
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      {/* Ventana de sugerencias */}
      <div style={{ flex: 1 }}>
        <h2>Sugerencias</h2>
        {sugerencias.map((c, i) => (
          <div key={i} style={{ border: '2px solid blue', padding: '10px', marginBottom: '10px' }}>
            <p><strong>{c.estrategia || 'Canastón'}</strong></p>
            <p>Total: {c.total_gastado}, Restante: {c.saldo_restante}</p>
            <ul>
              {c.productos.map((p, idx) => (
                <li key={idx}>{p.nombre} - Bs {p.precio}</li>
              ))}
            </ul>
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
