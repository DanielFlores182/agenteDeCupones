from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.obtener_sugerencias import agente_cupon
from services.guardar_canaston import guardar_canaston, leer_canastones
from services.agente_compras import (
    iniciar_compra,
    comprar_item,
    finalizar_compra
)
from services.reporte import generar_reporte, obtener_reportes


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],)


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
