let botonPermisos = document.getElementById("setearPermisos")
botonPermisos.addEventListener("click", () => setearPermisos())

// seteo los permisos definidos en el formulario
function setearPermisos() {
    let declararEmergencia = document.getElementById("declararEmergencia").checked
    let aterrizarAeronave = document.getElementById("aterrizarAeronave").checked
    let recibirAeronave = document.getElementById("recibirAeronave").checked
    let liberarAeronave = document.getElementById("liberarAeronave").checked
    let despegarAeronave = document.getElementById("despegarAeronave").checked
    localStorage.setItem("declararEmergencia", declararEmergencia)
    localStorage.setItem("aterrizarAeronave", aterrizarAeronave)
    localStorage.setItem("recibirAeronave", recibirAeronave)
    localStorage.setItem("liberarAeronave", liberarAeronave)
    localStorage.setItem("despegarAeronave", despegarAeronave)
}