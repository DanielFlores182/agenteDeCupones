def obtener_cupon(data: dict):
    usuario = data.get("usuario")
    compra = data.get("monto")

    if compra >= 100:
        cupon = "DESCUENTO10"
    else:
        cupon = "SIN_DESCUENTO"

    return {
        "usuario": usuario,
        "cupon": cupon,
        "valido": True
    }
