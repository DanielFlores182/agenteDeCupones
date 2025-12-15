// components/MapaAbstracto.tsx
'use client'; 

import React, { useState } from 'react';

// --- INTERFACES DE TIPOS ---

interface PasoRuta {
    orden: number;
    nodo_id: string;
    nombre_largo: string;
    accion?: string;
    costo_paso?: string;
    costo_acumulado_km?: string;
}

interface PlanRuta {
    status: 'success' | 'error';
    origen: string;
    destino: string;
    costo_total_km: string;
    plan_ruta: PasoRuta[];
}

type NodeMapType = {
    [key: string]: [number, number, string?]; // [X, Y, Nombre Largo (opcional)]
};


// --- CONFIGURACIÓN DEL GRAFO Y POSICIONES ABSTRACTAS (Actualizado) ---

// Usaremos un sistema de coordenadas 0-100 para dibujar
const NODOS_MAPEO: NodeMapType = {
    // ID Corto: [X, Y, Nombre Largo]

    // Origen Fijo
    'Casa': [5, 50, 'Casa (Origen Fijo)'],

    // Rama 1: Panamericana (Norte-Oeste)
    'A1': [15, 45], 'A2': [30, 40], 'A3': [45, 35], 'A4': [60, 30],
    'H_Panamericana': [75, 25, 'H_Panamericana'],

    // Rama 2: Blanco Galindo (Sur-Oeste)
    'B1': [15, 55], 'B2': [30, 60], 'B3': [45, 65], 'B4': [50, 70], 'B5': [55, 75], 'B6': [60, 80],
    'B7': [65, 85], 'B8': [70, 88], 'B9': [75, 90], 'B10': [80, 92], 'B11': [85, 94], 'B12': [90, 96],
    'H_BlancoGalindo': [95, 98, 'H_BlancoGalindo'],

    // Rama 3: Torres Sofer (Sur-Centro) - Se bifurca de B3
    'C1': [50, 55], 'C2': [55, 48], 'C3': [60, 40],
    'H_TorresSofer': [75, 40, 'H_TorresSofer'],

    // Rama 4: El Prado (Centro-Norte) - Se bifurca de A4
    'D1': [65, 25], 'D2': [70, 20], 'D3': [75, 15], 'D4': [80, 10], 'D5': [75, 5], 'D6': [70, 2],
    'D7': [65, 0], 'D8': [60, 0], 'D9': [55, 0],
    'H_ElPrado': [50, 2, 'H_ElPrado'],

    // Rama 5: Juan De La Rosa (Centro-Este) - Se bifurca de D5
    'E1': [80, 15], 'E2': [85, 20], 'E3': [90, 25], 'E4': [95, 30], 'E5': [95, 40], 'E6': [95, 50],
    'H_JuanDeLaRosa': [95, 60, 'H_JuanDeLaRosa'],

    // Rama 6: Circunvalación (Norte-Este) - Se bifurca de B1
    'F1': [20, 65], 'F2': [25, 70], 'F3': [30, 75], 'F4': [35, 80], 'F5': [40, 85], 'F6': [45, 90],
    'F7': [50, 95], 'F8': [55, 98],
    'H_Circunbalacion': [60, 98, 'H_Circunbalacion'], // Tenga cuidado con el error de tipeo en el backend: Circunvalacion vs Circunbalacion

    // Rama 7: Sacaba (Far-East) - Se bifurca de F6
    'G1': [50, 80], 'G2': [55, 75],
    'H_Sacaba': [60, 70, 'H_Sacaba'],
};

// Las conexiones deben coincidir con su backend para dibujar las rutas posibles
const ARISTAS_POSIBLES: [string, string][] = [
    // Panamericana
    ['Casa', 'A1'], ['A1', 'A2'], ['A2', 'A3'], ['A3', 'A4'], ['A4', 'H_Panamericana'],
    // Blanco Galindo
    ['Casa', 'B1'], ['B1', 'B2'], ['B2', 'B3'], ['B3', 'B4'], ['B4', 'B5'], ['B5', 'B6'], 
    ['B6', 'B7'], ['B7', 'B8'], ['B8', 'B9'], ['B9', 'B10'], ['B10', 'B11'], ['B11', 'B12'], 
    ['B12', 'H_BlancoGalindo'],
    // Torres Sofer (de B3)
    ['B3', 'C1'], ['C1', 'C2'], ['C2', 'C3'], ['C3', 'H_TorresSofer'],
    // El Prado (de A4)
    ['A4', 'D1'], ['D1', 'D2'], ['D2', 'D3'], ['D3', 'D4'], ['D4', 'D5'], ['D5', 'D6'],
    ['D6', 'D7'], ['D7', 'D8'], ['D8', 'D9'], ['D9', 'H_ElPrado'],
    // Juan De La Rosa (de D5)
    ['D5', 'E1'], ['E1', 'E2'], ['E2', 'E3'], ['E3', 'E4'], ['E4', 'E5'], ['E5', 'E6'],
    ['E6', 'H_JuanDeLaRosa'],
    // Circunvalación (de B1)
    ['B1', 'F1'], ['F1', 'F2'], ['F2', 'F3'], ['F3', 'F4'], ['F4', 'F5'], ['F5', 'F6'],
    ['F6', 'F7'], ['F7', 'F8'], ['F8', 'H_Circunbalacion'],
    // Sacaba (de F6)
    ['F6', 'G1'], ['G1', 'G2'], ['G2', 'H_Sacaba'],
];

const DESTINOS_VALIDOS: string[] = [
    'H_Panamericana', 
    'H_BlancoGalindo', 
    'H_TorresSofer',
    'H_ElPrado',
    'H_JuanDeLaRosa',
    'H_Circunbalacion', 
    'H_Sacaba',
];


// --- COLORES HIPERMAXI ---
const COLOR_ROJO_HIPERMAXI = '#E3001B';
const COLOR_GRIS_BASE = '#444444'; // Gris oscuro para texto/bordes
const COLOR_AMARILLO_DESTACADO = '#FFC107'; // Amarillo para resaltar selección

// --- COMPONENTE PRINCIPAL ---

export default function MapaAbstracto() {
    const [selectedDestinoId, setSelectedDestinoId] = useState<string | null>(null);
    const [plan, setPlan] = useState<PlanRuta | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const API_URL = 'http://localhost:8000/obtener_ruta'; 
    
    const handleNodeClick = (id: string) => {
        if (DESTINOS_VALIDOS.includes(id)) {
            setSelectedDestinoId(id);
            setPlan(null); // Limpiar plan anterior
            setError(null);
        } else if (id === 'Casa') {
            alert('Casa es el origen fijo. Seleccione un Hipermaxi.');
        }
    };

    const handleBuscarRuta = async () => {
        if (!selectedDestinoId) {
            setError('Por favor, seleccione una sucursal (círculo rojo) en el mapa.');
            return;
        }

        setLoading(true);
        setError(null);
        setPlan(null);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destino: selectedDestinoId })
            });

            const data = await response.json();

            if (data.status === 'success') {
                setPlan(data);
            } else {
                setError(data.message || 'Error desconocido al obtener el plan.');
            }

        } catch (err) {
            console.error('Error de conexión:', err);
            setError('Error de conexión con el servidor. ¿Está activo el backend (uvicorn)?');
        } finally {
            setLoading(false);
        }
    };

    const planNodosSet = plan ? new Set(plan.plan_ruta.map(p => p.nodo_id)) : new Set<string>();
    
    const planAristas = plan 
        ? plan.plan_ruta.slice(0, -1).map((paso, index) => {
            const nodoA = paso.nodo_id;
            const nodoB = plan.plan_ruta[index + 1].nodo_id;
            return [nodoA, nodoB].sort().join('-');
        })
        : [];
        
    const planAristasSet = new Set(planAristas);

    const destinoNombre = selectedDestinoId 
        ? NODOS_MAPEO[selectedDestinoId]?.[2] || selectedDestinoId 
        : 'Ninguno';

    return (
        <div style={styles.container}>
            <p style={{marginBottom: '20px', fontSize: '0.9em', color: COLOR_GRIS_BASE}}>Haga click en un Hipermaxi (círculo rojo) para seleccionarlo.</p>

            <div style={styles.mapControls}>
                <div style={styles.infoBox}>
                    <p>Origen Fijo: <strong>{NODOS_MAPEO.Casa[2]}</strong></p>
                    <p>Destino Seleccionado: <strong>{destinoNombre}</strong></p>
                </div>

                <button 
                    onClick={handleBuscarRuta} 
                    disabled={loading || !selectedDestinoId}
                    style={styles.button}
                >
                    {loading ? 'Planificando Ruta...' : `🛒 Calcular Plan a ${destinoNombre.split(' ')[1]}`}
                </button>
            </div>
            
            {/* --- SVG - Representación Abstracta del Grafo --- */}
            <svg viewBox="0 0 100 100" style={styles.svgMap}>
                {/* 1. Dibujar todas las Aristas Posibles */}
                {ARISTAS_POSIBLES.map(([nodoA, nodoB], index) => {
                    const coordsA = NODOS_MAPEO[nodoA];
                    const coordsB = NODOS_MAPEO[nodoB];
                    if (!coordsA || !coordsB) return null; // Previene errores si el nodo no existe en el mapeo
                    
                    const [xA, yA] = coordsA;
                    const [xB, yB] = coordsB;
                    
                    const edgeKey = [nodoA, nodoB].sort().join('-');
                    const isPlanEdge = planAristasSet.has(edgeKey);

                    return (
                        <line 
                            key={index}
                            x1={xA} y1={yA} x2={xB} y2={yB} 
                            stroke={isPlanEdge ? COLOR_ROJO_HIPERMAXI : '#999'} // Rojo para la ruta, Gris más oscuro para las otras
                            strokeWidth={isPlanEdge ? 0.8 : 0.4} 
                            strokeDasharray={isPlanEdge ? '' : '1, 1'} // Líneas punteadas para rutas no seleccionadas
                        />
                    );
                })}

                {/* 2. Dibujar todos los Nodos (Círculos) */}
                {Object.entries(NODOS_MAPEO).map(([id, [x, y, nombre]]) => {
                    const isCasa = id === 'Casa';
                    const isDestino = DESTINOS_VALIDOS.includes(id);
                    const isSelected = id === selectedDestinoId;
                    const isInPlan = planNodosSet.has(id);

                    // Lógica de color con la nueva paleta
                    let color = isCasa ? '#007BFF' : (isDestino ? COLOR_ROJO_HIPERMAXI : '#777777'); // Azul para casa, Rojo Hipermaxi para destinos, Gris para intermedios.
                    let radius = isCasa || isDestino ? 1.5 : 0.8;
                    
                    if (isSelected) color = COLOR_AMARILLO_DESTACADO; // Amarillo destacado al seleccionar
                    if (isInPlan && !isSelected && !isCasa) color = '#007BFF'; // Azul para nodos intermedios de la ruta
                    if (isInPlan && isCasa) color = '#007BFF'; // Mantener Casa azul

                    return (
                        <g key={id} onClick={() => handleNodeClick(id)} style={{ cursor: isDestino || isCasa ? 'pointer' : 'default' }}>
                            <circle 
                                cx={x} cy={y} r={radius} 
                                fill={color} 
                                stroke={isInPlan ? COLOR_GRIS_BASE : 'none'} // Borde Gris Oscuro si está en el plan
                                strokeWidth={isInPlan ? 0.4 : 0}
                            />
                            {/* Etiqueta del nodo */}
                            {(isCasa || isDestino || isSelected) && (
                                <text 
                                    x={x} y={y - 2} 
                                    fontSize="3" 
                                    textAnchor="middle" 
                                    fill={COLOR_GRIS_BASE}
                                    fontWeight={isCasa || isDestino ? 'bold' : 'normal'}
                                >
                                    {isCasa ? '🏠 CASA' : (nombre?.split(' ')[1] || id)}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
            


            {/* --- 3. Resultados del Plan --- */}
            <div style={styles.results}>
                {loading && <p>Buscando el mejor plan...</p>}
                {error && <p style={styles.error}>Error: {error}</p>}
                
                {plan && (
                    <div style={styles.pasoDetalle}>
                        <h2> Plan Óptimo Encontrado</h2>
                        <p>De: {plan.origen} a: {plan.destino}</p>
                        <h3>Distancia Total: <span style={styles.costo}>{plan.costo_total_km} km</span></h3>

                        <ol style={styles.ol}>
                            {plan.plan_ruta.map((paso, index) => (
                                <li key={index} style={styles.li}>
                                    <strong>{paso.orden}. {paso.nombre_largo}</strong> 
                                    {paso.accion && (
                                        <span style={styles.pasoDetalle}>
                                            <span style={styles.accion}>
                                                → {paso.accion.split('Mover desde ')[1]} 
                                                (Costo paso: {paso.costo_paso})
                                            </span>
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>
        </div>
    );
}

// Estilos básicos (Actualizados con paleta Hipermaxi)
const styles: any = {
    container: { 
        fontFamily: 'Arial, sans-serif', 
        padding: '20px', 
        maxWidth: '800px', 
        margin: '0 auto', 
        border: `1px solid ${COLOR_GRIS_BASE}`, 
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    },
    svgMap: { 
        border: `1px solid ${COLOR_GRIS_BASE}`, 
        width: '100%', 
        height: '500px', 
        marginBottom: '15px', 
        backgroundColor: '#FFFFFF' // Fondo blanco limpio
    },
    mapControls: { 
        marginBottom: '20px', 
        padding: '10px', 
        border: `1px solid ${COLOR_ROJO_HIPERMAXI}`, 
        borderRadius: '4px', 
        backgroundColor: '#FFF8F8', // Rojo muy claro
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    infoBox: { fontSize: '1.1em', color: COLOR_GRIS_BASE },
    button: { 
        padding: '10px 15px', 
        backgroundColor: COLOR_ROJO_HIPERMAXI, 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
    },
    results: { marginTop: '20px', padding: '15px', borderTop: `2px solid ${COLOR_ROJO_HIPERMAXI}` },
    error: { color: COLOR_ROJO_HIPERMAXI, fontWeight: 'bold' },
    planContainer: { 
        backgroundColor: '#f9f9f9', 
        padding: '15px', 
        borderRadius: '6px',
        border: '1px dashed #ccc'
    },
    costo: { color: COLOR_ROJO_HIPERMAXI, fontWeight: 'bold' },
    ol: { listStyleType: 'decimal', paddingLeft: '20px', marginTop: '10px', color: COLOR_GRIS_BASE },
    li: { marginBottom: '8px', borderLeft: `3px solid ${COLOR_ROJO_HIPERMAXI}`, paddingLeft: '10px' },
    pasoDetalle: { display: 'block', fontSize: '0.9em', marginTop: '3px' },
    accion: { color: COLOR_GRIS_BASE, marginRight: '10px' },
    costoPaso: { color: '#888' }
};