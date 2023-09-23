let operador = {"nombre": "coderhouse", "apellido": "coderhouse"}

let botonPermisos = document.getElementById("btnSetearPermisos")
botonPermisos.addEventListener("click", () => setearPermisos(operador))

// seteo los permisos definidos en el formulario
function setearPermisos(operador) {
    operador.declararEmergencia = document.getElementById("declararEmergencia").checked
    operador.aterrizarAeronave = document.getElementById("aterrizarAeronave").checked
    operador.recibirAeronave = document.getElementById("recibirAeronave").checked
    operador.liberarAeronave = document.getElementById("liberarAeronave").checked
    operador.despegarAeronave = document.getElementById("despegarAeronave").checked
    localStorage.setItem("operador", JSON.stringify(operador))
}