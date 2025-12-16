'use client'; 
import Link from 'next/link';
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


// --- CONFIGURACIÓN DEL GRAFO Y POSICIONES ABSTRACTAS (Igual) ---
const NODOS_MAPEO: NodeMapType = {
    // ... (Mantener la configuración original de NODOS_MAPEO)
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
    'H_Circunbalacion': [60, 98, 'H_Circunbalacion'], 

    // Rama 7: Sacaba (Far-East) - Se bifurca de F6
    'G1': [50, 80], 'G2': [55, 75],
    'H_Sacaba': [60, 70, 'H_Sacaba'],

    
    'I_R1': [25, 50, 'I_R1 (República / Los Andes)'],
    
    'I_C1': [50, 60, 'I_C1 (Villa Montes / Guayaramerín)'],

    'I_D1': [75, 10, 'I_D1 (Ayacucho / Huayna Kapac)'],
    
    'I_E1': [90, 35, 'I_E1 (Tadeo Haenke / Melchor Pérez)'],

    'I_F1': [55, 60, 'I_F1 (6 de Agosto / Circunvalación)'],
};

const ARISTAS_POSIBLES: [string, string][] = [
    // ... (Mantener la configuración original de ARISTAS_POSIBLES)
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

    ['A2', 'I_R1'], 
    ['I_R1', 'B2'],
    ['I_R1', 'F1'],
    
    ['B3', 'I_C1'],
    ['I_C1', 'C1'],
    ['I_C1', 'B4'],
    
    ['D2', 'I_D1'],
    ['I_D1', 'E1'],
    ['I_D1', 'D4'], 
    
    ['E4', 'I_E1'],
    ['I_E1', 'B10'],
    ['I_E1', 'F5'], 

    ['C2', 'I_F1'],
    ['F5', 'I_F1'],
    ['I_F1', 'B6'],
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


// --- PALETA DE COLORES HIPERMAXI REFINADA ---
const COLOR_ROJO_HIPERMAXI = '#E3001B'; // Rojo principal
const COLOR_ROJO_HOVER = '#CC0018'; // Rojo más oscuro para hover
const COLOR_GRIS_BASE = '#333333'; // Gris oscuro para texto/bordes
const COLOR_GRIS_CLARO = '#F5F5F5'; // Fondo claro
const COLOR_AMARILLO_DESTACADO = '#FFC107'; // Amarillo para resaltar selección
const COLOR_AZUL_RUTA = '#007BFF'; // Azul para nodos intermedios de la ruta

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
    
    // Las aristas del plan se obtienen de forma secuencial y ordenada.
    const planEdgesMap: Map<string, boolean> = new Map();
    const planRouteCoordinates: [number, number, number, number][] = [];

    if (plan) {
        for (let i = 0; i < plan.plan_ruta.length - 1; i++) {
            const nodoA = plan.plan_ruta[i].nodo_id;
            const nodoB = plan.plan_ruta[i + 1].nodo_id;
            
            // Usamos un key ordenado para la verificación general (como antes)
            const edgeKey = [nodoA, nodoB].sort().join('-');
            planEdgesMap.set(edgeKey, true);

            // Guardamos las coordenadas en orden para dibujar la línea direccional
            const coordsA = NODOS_MAPEO[nodoA];
            const coordsB = NODOS_MAPEO[nodoB];
            if (coordsA && coordsB) {
                planRouteCoordinates.push([coordsA[0], coordsA[1], coordsB[0], coordsB[1]]);
            }
        }
    }


    const destinoNombre = selectedDestinoId 
        ? NODOS_MAPEO[selectedDestinoId]?.[2] || selectedDestinoId 
        : 'Ninguno';

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🛒 Planificador de Ruta Hipermaxi Abstracto</h1>
            <p style={styles.subtitle}>Origen fijo: Casa. Haga click en un Hipermaxi para seleccionar el destino.</p>

            {/* --- Controles y Estado --- */}
            <div style={styles.mapControls}>
                <div style={styles.infoBox}>
                    <p style={{ margin: '0 0 5px 0' }}>Origen: <span style={{ color: COLOR_AZUL_RUTA, fontWeight: 'bold' }}>{NODOS_MAPEO.Casa[2]}</span></p>
                    <p style={{ margin: 0 }}>Destino Seleccionado: <span style={{ color: selectedDestinoId ? COLOR_AMARILLO_DESTACADO : COLOR_GRIS_BASE, fontWeight: 'bold' }}>{destinoNombre}</span></p>
                </div>

                <button 
                    onClick={handleBuscarRuta} 
                    disabled={loading || !selectedDestinoId}
                    style={{...styles.button, ...(loading || !selectedDestinoId ? styles.buttonDisabled : {})}}
                >
                    {loading ? ' Planificando Ruta...' : ` Calcular Plan a ${destinoNombre.split(' (')[0]}`}
                </button>
            </div>
            
            {/* --- SVG - Representación Abstracta del Grafo --- */}
            <svg viewBox="0 0 100 100" style={styles.svgMap}>
                {/* Definición de la flecha para la ruta */}
                <defs>
                    <marker 
                        id="arrowhead" 
                        markerWidth="3" 
                        markerHeight="3" 
                        refX="2" 
                        refY="1.5" 
                        orient="auto"
                    >
                        <polygon points="0 0, 3 1.5, 0 3" fill={COLOR_ROJO_HIPERMAXI} />
                    </marker>
                </defs>

                {/* 1. Dibujar todas las Aristas Posibles (Fondo Gris Punteado) */}
                {ARISTAS_POSIBLES.map(([nodoA, nodoB], index) => {
                    const coordsA = NODOS_MAPEO[nodoA];
                    const coordsB = NODOS_MAPEO[nodoB];
                    if (!coordsA || !coordsB) return null; 
                    
                    const [xA, yA] = coordsA;
                    const [xB, yB] = coordsB;
                    
                    const edgeKey = [nodoA, nodoB].sort().join('-');
                    const isPlanEdge = planEdgesMap.has(edgeKey);

                    return (
                        <line 
                            key={`bg-${index}`}
                            x1={xA} y1={yA} x2={xB} y2={yB} 
                            stroke={isPlanEdge ? '#DDAAAA' : '#AAAAAA'} // Un gris más claro o rojo tenue si está en la ruta
                            strokeWidth={0.3} 
                            strokeDasharray={isPlanEdge ? '' : '1, 1'} 
                        />
                    );
                })}

                {/* 1.5. Dibujar la Ruta Planeada (Flechas) */}
                {planRouteCoordinates.map(([xA, yA, xB, yB], index) => (
                    <line 
                        key={`plan-${index}`}
                        x1={xA} y1={yA} x2={xB} y2={yB} 
                        stroke={COLOR_ROJO_HIPERMAXI} 
                        strokeWidth={0.8} 
                        markerEnd="url(#arrowhead)" // Se usa la flecha
                    />
                ))}

                {/* 2. Dibujar todos los Nodos (Círculos) */}
                {Object.entries(NODOS_MAPEO).map(([id, [x, y, nombre]]) => {
                    const isCasa = id === 'Casa';
                    const isDestino = DESTINOS_VALIDOS.includes(id);
                    const isSelected = id === selectedDestinoId;
                    const isInPlan = planNodosSet.has(id);

                    // Lógica de color y radio
                    let fillColor = isCasa ? COLOR_AZUL_RUTA : (isDestino ? COLOR_ROJO_HIPERMAXI : '#777777'); 
                    let strokeColor = isSelected ? COLOR_AMARILLO_DESTACADO : 'none';
                    let strokeWidth = isSelected ? 0.6 : 0;
                    let radius = isCasa || isDestino ? 1.8 : 0.8;
                    
                    if (isInPlan && !isCasa && !isDestino) {
                        fillColor = COLOR_AZUL_RUTA; // Nodos intermedios de la ruta
                        radius = 1.2;
                    }
                    if (isSelected) {
                        strokeColor = COLOR_AMARILLO_DESTACADO;
                        strokeWidth = 1;
                        fillColor = COLOR_ROJO_HOVER; // El centro sigue siendo rojo, el borde es amarillo
                    }


                    return (
                        <g 
                            key={id} 
                            onClick={() => handleNodeClick(id)} 
                            style={{ cursor: isDestino || isCasa ? 'pointer' : 'default', transition: 'all 0.1s ease-out' }}
                            title={nombre || id}
                        >
                            <circle 
                                cx={x} cy={y} r={radius} 
                                fill={fillColor} 
                                stroke={strokeColor} 
                                strokeWidth={strokeWidth}
                            />
                            {/* Etiqueta del nodo */}
                            {(isCasa || isDestino || isSelected) && (
                                <text 
                                    x={x} y={y - 2} 
                                    fontSize="3.5" 
                                    textAnchor="middle" 
                                    fill={COLOR_GRIS_BASE}
                                    fontWeight={'bold'}
                                >
                                    {isCasa ? '🏠 CASA' : (nombre?.split('H_')[1] || id)}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
            
            {/* --- 3. Resultados del Plan --- */}
            <div style={styles.results}>
                {loading && <p style={styles.loading}>Buscando el mejor plan...</p>}
                {error && <p style={styles.error}>Error: {error}</p>}
                
                {plan && (
                    <div style={styles.planContainer}>
                        <h2 style={{ color: COLOR_ROJO_HIPERMAXI, marginTop: 0 }}> Plan Óptimo Encontrado</h2>
                        <p style={{ color: COLOR_GRIS_BASE, borderBottom: '1px solid #EEE', paddingBottom: '10px' }}>
                            De: {plan.origen} a: {plan.destino}
                        </p>
                        <h3 style={{ color: COLOR_GRIS_BASE }}>Distancia Total: <span style={styles.costo}>{plan.costo_total_km} km</span></h3>

                        <ol style={styles.ol}>
                            {plan.plan_ruta.map((paso, index) => (
                                <li key={index} style={styles.li}>
                                    <strong style={{ color: index === plan.plan_ruta.length - 1 ? COLOR_ROJO_HIPERMAXI : COLOR_GRIS_BASE }}>
                                        {paso.orden}. {paso.nombre_largo}
                                    </strong> 
                                    {paso.accion && (
                                        <span style={styles.pasoDetalle}>
                                            <span style={styles.accion}>
                                                {paso.accion.split('Mover desde ')[1]}
                                                <span style={styles.costoPaso}> (Costo paso: {paso.costo_paso})</span>
                                            </span>
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ol>
                        <Link href="/cupon" passHref legacyBehavior>
                            <button style={{ 
                            padding: '10px 20px', 
                            fontSize: '16px', 
                            cursor: 'pointer',
                            backgroundColor: '#0070f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px'
                            }}>
                            Siguiente: Generar Cupones 🎟️
                            </button>
                        </Link>
                        
                    </div>
                )}
            </div>
        </div>
    );
}

// Estilos básicos (Actualizados con paleta Hipermaxi y mejor presentación)
const styles: any = {
    container: { 
        fontFamily: 'Roboto, sans-serif', // Usando una fuente más común/moderna
        padding: '25px', 
        maxWidth: '900px', 
        margin: '20px auto', 
        border: `1px solid ${COLOR_GRIS_CLARO}`, 
        borderRadius: '10px',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)'
    },
    title: {
        color: COLOR_ROJO_HIPERMAXI,
        textAlign: 'center',
        marginBottom: '10px',
        borderBottom: `2px solid ${COLOR_GRIS_CLARO}`,
        paddingBottom: '10px'
    },
    subtitle: {
        marginBottom: '20px', 
        fontSize: '1em', 
        color: COLOR_GRIS_BASE,
        textAlign: 'center'
    },
    svgMap: { 
        border: `1px solid ${COLOR_GRIS_CLARO}`, 
        width: '100%', 
        height: '550px', // Un poco más alto
        marginBottom: '20px', 
        backgroundColor: '#FCFCFC', // Fondo blanco suave
        borderRadius: '6px'
    },
    mapControls: { 
        marginBottom: '25px', 
        padding: '15px', 
        border: `2px solid ${COLOR_ROJO_HIPERMAXI}`, 
        borderRadius: '6px', 
        backgroundColor: '#FFF0F0', // Rojo muy claro
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: '20px'
    },
    infoBox: { 
        fontSize: '1em', 
        color: COLOR_GRIS_BASE,
        flexGrow: 1
    },
    button: { 
        padding: '12px 20px', 
        backgroundColor: COLOR_ROJO_HIPERMAXI, 
        color: 'white', 
        border: 'none', 
        borderRadius: '6px', 
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1em',
        transition: 'background-color 0.3s ease, transform 0.1s ease',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        ':hover': {
            backgroundColor: COLOR_ROJO_HOVER,
            transform: 'translateY(-1px)'
        }
    },
    buttonDisabled: {
        backgroundColor: '#AAAAAA',
        cursor: 'not-allowed',
        boxShadow: 'none',
        ':hover': {
            backgroundColor: '#AAAAAA',
            transform: 'none'
        }
    },
    loading: {
        textAlign: 'center',
        color: COLOR_AZUL_RUTA,
        fontWeight: 'bold'
    },
    results: { marginTop: '20px' },
    error: { 
        color: COLOR_ROJO_HIPERMAXI, 
        fontWeight: 'bold', 
        padding: '10px', 
        backgroundColor: '#FFEEEE', 
        border: `1px solid ${COLOR_ROJO_HIPERMAXI}`,
        borderRadius: '4px'
    },
    planContainer: { 
        backgroundColor: COLOR_GRIS_CLARO, 
        padding: '20px', 
        borderRadius: '8px',
        border: `1px solid ${COLOR_ROJO_HOVER}`
    },
    costo: { 
        color: COLOR_ROJO_HIPERMAXI, 
        fontWeight: 'bolder',
        fontSize: '1.2em'
    },
    ol: { 
        listStyleType: 'none', // Quitamos los números por defecto para mayor control
        paddingLeft: '0', 
        marginTop: '15px', 
        color: COLOR_GRIS_BASE 
    },
    li: { 
        marginBottom: '12px', 
        borderLeft: `4px solid ${COLOR_ROJO_HIPERMAXI}`, 
        paddingLeft: '15px',
        backgroundColor: '#FFFFFF',
        padding: '10px 15px',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    },
    pasoDetalle: { display: 'block', fontSize: '0.9em', marginTop: '5px' },
    accion: { color: COLOR_GRIS_BASE, marginRight: '10px', fontStyle: 'italic' },
    costoPaso: { color: '#666', fontWeight: 'normal', fontStyle: 'normal' }
};