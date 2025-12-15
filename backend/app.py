from fastapi import FastAPI
from services.obtener_cupon import obtener_cupon
from fastapi.middleware.cors import CORSMiddleware

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
