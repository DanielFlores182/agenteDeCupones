from fastapi import FastAPI
from services.obtener_cupon import obtener_cupon
from fastapi.middleware.cors import CORSMiddleware
from services.obtener_sugerencias import agente_cupon
from services.guardar_canaston import guardar_canaston, leer_canastones


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],)


@app.post("/obtener_cupon")
def obtener_cupon_endpoint(data: dict):
    resultado = obtener_cupon(data)
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
