from fastapi import FastAPI
from pydantic import BaseModel
from services.obtener_ruta import planificar_ruta
from fastapi.middleware.cors import CORSMiddleware
from services.obtener_sugerencias import agente_cupon
from services.guardar_canaston import guardar_canaston, leer_canastones
from services.agente_compras import (
    iniciar_compra,
    comprar_item,
    finalizar_compra
)
from services.reporte import generar_reporte, obtener_reportes
from services.cargar_productos import cargar_productos
from services.cargar_canaston import cargar_ultimo_cupon

class SolicitudRuta(BaseModel):
    destino: str
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],)


@app.post("/obtener_ruta") # Nueva ruta y endpoint
def planificar_ruta_endpoint(data: SolicitudRuta):
    """
    Endpoint para que el Frontend solicite un plan de ruta.
    """
    # Llama al agente planificador con el destino proporcionado por el frontend
    resultado = planificar_ruta(data.destino)
    return resultado
@app.post("/recomendar_canastones")
def recomendar_canastones(data: dict):
    monto = data.get("monto")
    preferencia = data.get("preferencia")

    if monto is None:
        return { "error": "El monto del cupón es requerido" }

    return agente_cupon(monto, preferencia)

@app.post("/guardar_canaston")
def guardar_canaston_endpoint(data: dict):
    if not data:
        return { "error": "No se recibió canastón" }

    return guardar_canaston(data)


@app.get("/canastones_guardados")
def obtener_canastones_guardados():
    return leer_canastones()

@app.post("/iniciar_compra")
def iniciar_compra_endpoint(data: dict):
    return iniciar_compra(data)


@app.post("/comprar_item/{compra_id}")
def comprar_item_endpoint(compra_id: str, data: dict):
    return comprar_item(compra_id, data)


@app.post("/finalizar_compra/{compra_id}")
def finalizar_compra_endpoint(compra_id: str):
    return finalizar_compra(compra_id)

@app.post("/reporte_compra")
def reporte_compra_endpoint(data: dict):
    compra = data.get("compra")
    monto_inicial = data.get("monto_inicial")

    if not compra or monto_inicial is None:
        return { "error": "Datos incompletos para generar reporte" }

    return generar_reporte(compra, monto_inicial)


@app.get("/reportes")
def obtener_reportes_endpoint():
    return obtener_reportes()

@app.get("/productos")
def productos_endpoint():
    """
    Devuelve toda la lista de productos del supermercado
    """
    return cargar_productos()


@app.get("/ultimo_cupon")
def ultimo_cupon_endpoint():
    """
    Devuelve el último canastón guardado
    """
    return cargar_ultimo_cupon()

@app.get("/ultimo_canaston")  
def obtener_ultimo_canaston_endpoint():
    try:
        canastones = leer_canastones()
        
        if not canastones:
            return { "error": "No hay canastones guardados", "data": None }
        
        ultimo_canaston = canastones[-1]
        
        return {
            "success": True,
            "data": ultimo_canaston,
            "total_canastones": len(canastones)
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Error al obtener el último canastón: {str(e)}",
            "data": None
        }

# ejemplo de llamada

# fetch("http://localhost:4000/RUTASERVICIO")
#   .then(res => res.json())
#   .then(data => {
#     console.log(data); // Muestra todas las categorías y productos
#   });
