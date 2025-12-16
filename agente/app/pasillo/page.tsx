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
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUltimoCanaston = async () => {
      try {
        const res = await fetch('http://localhost:8000/ultimo_canaston');
        const data = await res.json();
        
        console.log('Respuesta completa:', data);
        
        if (data.data) {
          setUltimoCanaston(data.data);
          setSugerencias([data.data]);
          setCanastonActual(data.data.productos || []);
        } else if (data.productos) {
          setUltimoCanaston(data);
          setSugerencias([data]);
          setCanastonActual(data.productos || []);
        } else {
          setError('No se encontró canastón');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar el canastón');
      } finally {
        setCargando(false);
      }
    };

    const fetchProductos = async () => {
      try {
        const res = await fetch('http://localhost:8000/productos');
        const data = await res.json();
        setProductosJSON(data);
      } catch (err) {
        console.error('Error cargando productos:', err);
      }
    };

    fetchUltimoCanaston();
    fetchProductos();
  }, []);

  const productosPasillo = React.useMemo(() => {
    if (pasilloSeleccionado && productosJSON[pasilloSeleccionado]) {
      return productosJSON[pasilloSeleccionado];
    }
    return [];
  }, [pasilloSeleccionado, productosJSON]);

  const handleSeleccionProducto = async (producto: Producto) => {
    if (!ultimoCanaston) return;

    if (!compraId) {
      try {
        const res = await fetch('http://localhost:8000/iniciar_compra', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ultimoCanaston)
        });
        const data = await res.json();
        setCompraId(data.id || data.compra_id);
      } catch (err) {
        console.error('Error iniciando compra:', err);
      }
    }

    if (!compraId) return;

    try {
      const res = await fetch(`http://localhost:8000/comprar_item/${compraId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
      });
      const data = await res.json();
      setCanastonActual(data.canaston_actual.productos || []);
      setSugerencias([data.canaston_actual]);
    } catch (err) {
      console.error('Error comprando item:', err);
    }
  };

  const handleFinalizarCompra = async () => {
    if (!compraId) return;

    try {
      await fetch(`http://localhost:8000/finalizar_compra/${compraId}`, { method: 'POST' });
      alert('Compra finalizada');
      setCompraId(null);
      setCanastonActual([]);
      setSugerencias(ultimoCanaston ? [ultimoCanaston] : []);
    } catch (err) {
      console.error('Error finalizando compra:', err);
    }
  };

  if (cargando) {
    return <div style={{ padding: '20px' }}>Cargando último canastón...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <p>Error: {error}</p>
        <p>Verifica que:</p>
        <ul>
          <li>El backend esté corriendo en http://localhost:8000</li>
          <li>La ruta /ultimo_canaston exista</li>
          <li>Hay canastones guardados en canastones_guardados.json</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="flex gap-6 p-6 bg-gradient-to-br from-gray-50 to-white">
  <div className="flex-1 bg-white rounded-xl p-4 shadow-md">
    <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-2 border-b-2 border-blue-300">Sugerencias</h2>
    {sugerencias.length > 0 ? (
      sugerencias.map((c, i) => (
        <div key={i} className="border-2 border-blue-400 p-4 mb-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm hover:shadow-md transition-shadow">
          <p className="font-bold text-lg text-blue-700 mb-2">{c.estrategia || 'Canastón'}</p>
          <p className="text-gray-700 mb-3">
            <span className="font-semibold text-red-600">Total: Bs {c.total_gastado}</span>, 
            <span className="font-semibold text-green-600 ml-4">Restante: Bs {c.saldo_restante}</span>
          </p>
          <ul className="mt-3 space-y-2">
            {(c.productos || []).map((p, idx) => (
              <li key={idx} className="text-gray-800 bg-white p-2 rounded border border-gray-200 shadow-sm flex justify-between">
                <span>{p.nombre}</span>
                <span className="font-semibold text-red-600">Bs {p.precio}</span>
              </li>
            ))}
          </ul>
        </div>
      ))
    ) : (
      <div className="text-center py-8 bg-gray-100 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">No hay sugerencias</p>
      </div>
    )}
  </div>

  <div className="flex-1 bg-white rounded-xl p-4 shadow-md">
    <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-2 border-b-2 border-orange-300">Pasillos</h2>
    <div className="flex flex-wrap gap-3 mb-6">
      {PASILLOS.map(p => (
        <button 
          key={p} 
          onClick={() => setPasilloSeleccionado(p)}
          className={`px-4 py-3 min-w-[130px] rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
            pasilloSeleccionado === p 
              ? 'bg-[#E3001B] text-white shadow-lg transform -translate-y-1' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {p}
        </button>
      ))}
    </div>

    {pasilloSeleccionado && (
      <div className="mt-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 border border-red-200 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-red-300">Productos de {pasilloSeleccionado}</h3>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {productosPasillo.map((prod, idx) => (
            <div 
              key={idx} 
              onClick={() => handleSeleccionProducto(prod)}
              className="border border-gray-300 p-3 rounded-lg bg-white cursor-pointer hover:border-[#E3001B] hover:shadow-md transition-all hover:translate-x-1"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{prod.nombre}</span>
                <span className="font-bold text-[#E3001B] bg-red-50 px-3 py-1 rounded">Bs {prod.precio}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>

  <div className="flex-1 bg-white rounded-xl p-4 shadow-md">
    <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-2 border-b-2 border-green-300">Canastón Actual</h2>
    {canastonActual.length > 0 ? (
      <>
        <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto pr-2">
          {canastonActual.map((prod, idx) => (
            <div key={idx} className="border border-gray-300 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm hover:shadow transition-shadow">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                  <span className="font-medium text-gray-800">{prod.nombre}</span>
                </div>
                <span className="font-bold text-[#E3001B]">Bs {prod.precio}</span>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={handleFinalizarCompra}
          className="w-full py-3 bg-gradient-to-r from-[#E3001B] to-red-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 cursor-pointer"
        >
          Finalizar Compra
        </button>
      </>
    ) : (
      <div className="text-center py-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border border-dashed border-gray-400">
        <p className="text-gray-600">No hay productos en el canastón actual</p>
        <p className="text-sm text-gray-500 mt-2">Selecciona productos de los pasillos</p>
      </div>
    )}
  </div>
</div>
  );
}