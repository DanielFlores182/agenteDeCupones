import networkx as nx

# --- 1. CONFIGURACIÓN DEL ENTORNO (El "Conocimiento del Agente") ---

# Crear el Grafo
G = nx.Graph()

# Diccionario de Mapeo (Nombres Cortos -> Nombres Largos)
NODE_MAP = {
    'Casa': 'Casa',
    
    'A1': 'Av.Suecia entre C. Montero',
    'A2': 'C. Montero entre Av. Republica',
    'A3': 'Av. Republica entre Mataral',
    'A4': 'Mataral entre Av. Panamericana',
    'H_Panamericana': 'Hipermaxi Panamericana, Cochabamba',

    'B1': 'C. Libertad entre Av. Los Andes',
    'B2': 'Av. Los Andes entre C. Villa Montes',
    'B3': 'C. Villa Montes entre C. Andes',
    'B4': 'C. Andes entre C. Guayaramerin',
    'B5': 'C. Guayaramerin entre Av. 6 de Agosto',
    'B6': 'Av. 6 de Agosto entre C. Juana Azurduy',
    'B7': 'C. Juana Azurduy entre C. Cañada Cochabamba',
    'B8': 'C. Cañada Cochabamba entre Av. D. Campos',
    'B9': 'Av. D. Campos entre C. R. C. Marzana',
    'B10': 'C. R. C. Marzana entre Av. Melchor Peréz de Olguin',
    'B11': 'Av. Melchor Peréz de Olguin entre Av. Capitan Victor Ustariz',
    'B12': 'Av. Capitan Victor Ustariz entre C. A.Borda',
    'H_BlancoGalindo': 'Hipermaxi Blanco Galindo',

    'C1': 'C. Andes entre Av. 6 de Agosto',
    'C2': 'Av. 6 de Agosto entre Cto Bolivia',
    'C3': 'Cto Bolivia entre Av. Oquendo',
    'H_TorresSofer': 'Hipermaxi, Torres Sofer, Av Oquendo 630, Cochabamba',

    'D1': 'Av. Panamericana entre Av. Aycacucho',
    'D2': 'Av. Aycacucho hacia el coliseo de la coronilla ',
    'D3': 'Coliseo de la coronilla hacia la Av. Aroma',
    'D4': 'Av. Aroma entre Av. Huayna Kapac',
    'D5': 'Av. Huayna Kapac entre Av. Rafael Urquidi',
    'D6': 'Av. Rafael Urquidi entre Av. Pedro Domingo Murillo',
    'D7': 'Av. Pedro Domingo Murillo entre Av. Del Ejercito',
    'D8': 'Av. Del Ejercito entre Via de las Banderas',
    'D9': 'Via de las Banderas entre Av. Jose Ballivian',
    'H_ElPrado': 'Hipermaxi El Prado, Av. José Ballivian #753, Cochabamba',

    'E1': 'Av. Rafael Urquidi entre C. mexico',
    'E2': 'C. mexico entre C. Tumusla',
    'E3': 'C. tumusla entre C. Jose de la Rosa',
    'E4': 'C. Jose de la Rosa entre Av. Tadeo Haenke',
    'E5': 'Av. Tadeo Haenke entre Av. Grabriel Rene Moreno',
    'E6': 'Av. Grabriel Rene Moreno entre Av. Juan de la Rosa',
    
    'H_JuanDeLaRosa': 'Hipermaxi Juan de la Rosa, AREA Cochabamba, 207033, Av. Juan de La Rosa, NRO',

    'F1': 'Av. Los Andes entre C. Chuquiaco',
    'F2': 'C. Chuquiaco entre C. Sariri',
    'F3': 'C. Sariri entre C. El molino',
    'F4': 'C. El molino entre Av. Cto Bolivia',
    'F5': 'Av. Cto Bolivia entre Av. Ruben Diario',
    'F6': 'Av. Ruben Diario entre Rotonda Muyurina',
    'F7': ' Rotonda Muyurina entre Av. Avenue gral Galindo',
    'F8': ' Avenue gral Galindo entre Av. Circunvalacion',
    
    'H_Circunbalacion': 'Hipermaxi - Circunvalación, Avenida Circunvalacion S/N, A.Uzeda y, Cochabamba',
    
    
    'G1': 'Av. Ruben Diario entre Av. 23 de Marzo',
    'G2': 'Av. 23 de Marzo entre Eliodoro Villazon',
    'H_Sacaba': 'Hipermaxi Av. Villazon - Sacaba, Av. Villazón Km 3, Cochabamba',

    

}

# Agregar Nodos y Aristas con Pesos
nodos_cortos = list(NODE_MAP.keys())
G.add_nodes_from(nodos_cortos)

G.add_weighted_edges_from([
    ('Casa', 'A1', 0.950),
    ('A1', 'A2', 0.200), 
    ('A2', 'A3', 0.800), 
    ('A3', 'A4', 0.100), 
    ('A4', 'H_Panamericana', 0.200),

    ('Casa', 'B1', 0.200), 
    ('B1', 'B2', 0.700), 
    ('B2', 'B3', 0.250), 
    ('B3', 'B4', 0.800), 
    ('B4', 'B5', 0.1), 
    ('B5', 'B6', 2.0), 
    ('B6', 'B7', 0.700), 
    ('B7', 'B8', 0.580), 
    ('B8', 'B9', 0.100), 
    ('B9', 'B10', 0.500), 
    ('B10', 'B11', 0.450), 
    ('B11', 'B12', 0.150), 
    ('B12', 'H_BlancoGalindo', 0.230),

    ('B3', 'C1', 1.6), 
    ('C1', 'C2', 0.600), 
    ('C2', 'C3', 0.900), 
    ('C3', 'H_TorresSofer', 1.9),

   

    ('A4', 'D1', 0.200),
    ('D1', 'D2', 1.60),
    ('D2', 'D3', 0.740),
    ('D3', 'D4', 0.200),
    ('D4', 'D5', 0.500),
    ('D5', 'D6', 1.200),
    ('D6', 'D7', 0.950),
    ('D7', 'D8', 0.200),
    ('D8', 'D9', 0.200),
    ('D9', 'H_ElPrado', 0.255),

    ('D5', 'E1', 1.200),
    ('E1', 'E2', 0.200),
    ('E2', 'E3', 0.190),
    ('E3', 'E4', 0.300),
    ('E4', 'E5', 1.500),
    ('E5', 'E6', 700),
    ('E6', 'H_JuanDeLaRosa', 0.150),


    ('B1', 'F1', 0.900),
    ('F1', 'F2', 0.200),
    ('F2', 'F3', 0.300),
    ('F3', 'F4', 0.200),
    ('F4', 'F5', 2.900),
    ('F5', 'F6', 2.600),
    ('F6', 'F7', 0.950),
    ('F7', 'F8', 0.200),
    ('F8', 'H_Circunbalacion', 3.100),

    ('F6', 'G1', 2.60),
    ('G1', 'G2', 1.400),
    ('G2', 'H_Sacaba', 1.300),

])

# Lista de destinos válidos (los Hipermaxis)
DESTINOS_VALIDOS = ['H_Panamericana', 'H_BlancoGalindo', 'H_TorresSofer']


# --- 2. FUNCIÓN PRINCIPAL DE LA API (El Agente Planificador) ---

def planificar_ruta(destino_corto: str, origen_corto: str = 'Casa'):
    """
    Calcula el plan (ruta óptima) y el costo total desde el origen al destino
    utilizando el Algoritmo de Dijkstra.

    Args:
        destino_corto (str): El ID corto del nodo de destino (e.g., 'H_BlancoGalindo').
        origen_corto (str): El ID corto del nodo de origen (siempre 'Casa' por defecto).

    Returns:
        dict: Un diccionario con el 'status', 'plan', y 'costo' o un mensaje de error.
    """
    if destino_corto not in NODE_MAP:
        return {
            "status": "error",
            "message": f"Destino '{destino_corto}' no válido. Destinos aceptados: {DESTINOS_VALIDOS}"
        }

    try:
        # El AGENTE DE PLANIFICACIÓN ejecuta la búsqueda (Dijkstra/Uniform Cost Search)
        plan_nodos = nx.dijkstra_path(G, origen_corto, destino_corto, weight='weight')
        costo_total = nx.dijkstra_path_length(G, origen_corto, destino_corto, weight='weight')

        # Formatear el plan para la respuesta de la API
        plan_detallado = []
        for i, nodo_id in enumerate(plan_nodos):
            paso = {
                "orden": i + 1,
                "nodo_id": nodo_id,
                "nombre_largo": NODE_MAP[nodo_id]
            }
            # Agregar la acción y el costo del paso anterior
            if i > 0:
                nodo_prev = plan_nodos[i - 1]
                distancia = G[nodo_prev][nodo_id]['weight']
                paso['accion'] = f"Mover desde {nodo_prev} ({NODE_MAP[nodo_prev]})"
                paso['costo_paso'] = f"{distancia:.3f} km"
            
            plan_detallado.append(paso)

        return {
            "status": "success",
            "origen": NODE_MAP[origen_corto],
            "destino": NODE_MAP[destino_corto],
            "costo_total_km": f"{costo_total:.3f}",
            "plan_ruta": plan_detallado
        }

    except nx.NetworkXNoPath:
        return {
            "status": "error",
            "message": f"No se encontró una ruta de {origen_corto} a {destino_corto}."
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error interno en la planificación: {str(e)}"
        }