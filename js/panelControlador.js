// variables harcodeadas
let password = "operador1";
const maxAvionesEntrantes = 20;
const maxAvionesSalientes = 10;
const logoAerolineas = "../assets/img/aerolineas/Aerolineas_Argentinas.png";
const logoDelta = "../assets/img/aerolineas/Delta_Airlines.png";
const logoUnited = "../assets/img/aerolineas/United_Airlines.png";
const logoAlitalia = "../assets/img/aerolineas/Alitalia.png";
const logoAlerta = "../assets/img/varios/emergencia.png"

// declaracion de politicas
let polIntentos = 3;

// array de aviones entrantes
let avionesEntrantes = [];
let avionesEnTierra = [];
let avionesSalientes = [];

//declaracion de permisos
const permisoDeclararEmergencia = (localStorage.getItem("declararEmergencia") == "true") ? true : false
const permisoAterrizarAeronave = (localStorage.getItem("aterrizarAeronave") == "true") ? true : false
const permisoRecibirAeronave = (localStorage.getItem("recibirAeronave") == "true") ? true : false
const permisoLiberarAeronave = (localStorage.getItem("liberarAeronave") == "true") ? true : false
const permisoDespegarAeronave = (localStorage.getItem("despegarAeronave") == "true") ? true : false

// genera un listado del estado actual del espacio aereo
function verEspacioAereo() {
  listarAviones(avionesEntrantes.concat(avionesSalientes), "espacio aereo actual");
  mostrarEstadisticas()
}

function verAvionesEnTierra() {
  listarAviones(avionesEnTierra, "aviones en tierra");
}

// agregamos un item al array pasado como parametro
function agregarAvion(array, matric, comp, est, logo) {
  array.push({ matricula: matric, compania: comp, estado: est, logo: logo });
}

// lista los aviones contenidos el el array recibido como parametro
function listarAviones(array, titulo) {

  let espacioAereo = document.getElementById("panel-visualizacion");
  espacioAereo.innerHTML = "";

  let tituloPanelVisualizacion = document.createElement("h4")
  tituloPanelVisualizacion.classList = "tituloPanelVisualizacion"
  tituloPanelVisualizacion.innerHTML = titulo
  espacioAereo.appendChild(tituloPanelVisualizacion)


  array.forEach((element) => {
    console.log(
      `${array.indexOf(element) + 1} - ${element.matricula} ( ${element.compania
      }) - ${element.estado}`
    );
    let aeronaveEnEspacioAereo = document.createElement("div");
    aeronaveEnEspacioAereo.draggable = true
    aeronaveEnEspacioAereo.className = "aeronave";
    aeronaveEnEspacioAereo.innerHTML = `<div class="elementoTarjeta" ><img id="imagenTarjeta" class=""imagenTarjeta" src="${element.logo}" alt="logo compania"></div>
      <div class="elementoTarjetaDetalle"><h6>matricula</h6><p>${element.matricula}</p></div>
      <div class="elementoTarjetaDetalle"><h6>baliza</h6><p>${array.indexOf(element) + 1}</p></div>
      <div class="elementoTarjetaDetalle"><h6>estado</h6><p class="estado">${element.estado}</p></div>
      <div class="areaBotonesTarjeta" id="${element.matricula}"></div>`;
    espacioAereo.appendChild(aeronaveEnEspacioAereo);

    let espacioAereoBotones = document.getElementById(element.matricula)
    if (element.estado === "saliente") {
      let botonEmergencia = document.createElement("button")
      botonEmergencia.className = "botonAeronave"
      botonEmergencia.id = "botonEmergencia"
      botonEmergencia.addEventListener("click", () => declararEmergencia(element.matricula))
      botonEmergencia.innerText = "declarar emergencia"
      espacioAereoBotones.appendChild(botonEmergencia)

      let botonLiberar = document.createElement("button")
      botonLiberar.className = "botonAeronave"
      botonLiberar.id = "btnLiberarAeronave"
      botonLiberar.addEventListener("click", () => liberarAvion(element.matricula))
      botonLiberar.innerText = "liberar aeronave"
      espacioAereoBotones.appendChild(botonLiberar)

    } else if (element.estado === "aterrizado") {
      let botonAutorizarDespegue = document.createElement("button")
      botonAutorizarDespegue.className = "botonAeronave"
      botonAutorizarDespegue.id = "btnAutorizarDespegue"
      botonAutorizarDespegue.addEventListener("click", () => despegarAvion(element.matricula))
      botonAutorizarDespegue.innerText = "autorizar despegue"
      espacioAereoBotones.appendChild(botonAutorizarDespegue)

    } else if (element.estado === "entrante") {
      let botonEmergencia = document.createElement("button")
      botonEmergencia.className = "botonAeronave"
      botonEmergencia.id = "botonEmergencia"
      botonEmergencia.addEventListener("click", () => declararEmergencia(element.matricula))
      botonEmergencia.innerText = "declarar emergencia"
      espacioAereoBotones.appendChild(botonEmergencia)

    }
  });
}

// recibimos un avion entrante al area de control
// parametros: matric (matricula de la aeronave)
//             comp (compania aerea)
function recibirAvion(matric, comp) {
  if (permisoRecibirAeronave) {
    // valida formato de la matricula
    if (!validarMatricula(matric.toUpperCase())) {

      mostrarAlerta(`MATRICULA NO VALIDA !!!
   .......................................
    El formato debe ser ###000 (ej: ABC123)`)

      // valida existencia de la matricula
    } else if (validarExistenciaMatricula(matric.toUpperCase())) {
      alert("INFORMACION (ERROR) - matricula existente");
      mostrarAlerta(`MATRICULA EXISTENTE !!!
    .......................................
    El identificador es unico a nivel global`)
    } else {
      let logo = "";
      switch (comp.toUpperCase()) {
        case "AEROLINEAS ARGENTINAS":
          logo = logoAerolineas;
          break;
        case "ALITALIA":
          logo = logoAlitalia;
          break;
        case "UNITED AIRLINES":
          logo = logoUnited;
          break;
        case "DELTA AIRLINES":
          logo = logoDelta;
          break;
        default:
          logo = "";
      }
      avionesEntrantes.push({
        matricula: matric.toUpperCase(),
        compania: comp,
        estado: "entrante",
        logo: logo,
      });

      mostrarAlerta(`la aeronave ${matric.toUpperCase()} de la compania ${comp} 
                   ha sido recibido en el espacio aereo`)
      verEspacioAereo()
    }
  } else {
    mostrarAlerta("no posee permisos para recibir aviones al espacio aereo")
  }


}

// libera un avion del espacio aereo dejando de estar bajo el control de la torre
function liberarAvion(matric) {
  if (permisoLiberarAeronave) {
    const indiceLiberacion = avionesSalientes.indexOf(
      avionesSalientes.find((avion) => avion.matricula === matric)
    );
    if (indiceLiberacion >= 0) {
      avionesSalientes.splice(indiceLiberacion, 1);
      // alert(
      //   `INFORMACION - la aeronave con matricula ${matric} ha sido liberada del espacio aereo`
      // );
      mostrarMensaje(`INFORMACION - la aeronave con matricula ${matric} ha sido liberada del espacio aereo`)
    } else {
      // alert(`>>> ALERTA <<< ( error de comunicacion con la aeronave ${matric} )`);
      mostrarAlerta(`>>> ALERTA <<< ( error de comunicacion con la aeronave ${matric} )`)
    }
    verEspacioAereo();
  } else {
    mostrarAlerta("no posee permisos para liberar aviones del espacio aereo")
  }

}

// al declarar una declararEmergencia
// si es avion entrante pasa a tener ID = 0
// si es avion saliente se saca del array de avionesSalientes y se ingresa al array de avionesEntrantes con ID = 0
function declararEmergencia(matric) {
  if (permisoDeclararEmergencia) {
    // verificar existencia de emergencia sin resolver
    if (localStorage.getItem("emergenciaHora")) {
      mostrarAlerta(`debe resolverse la emergencia en curso aterrizando la aeronave antes de poder declarar otra 
    ...........................................................................................
    matricula en emergencia: ${localStorage.getItem("emergenciaMatricula")} 
    emergencia hora: ${localStorage.getItem("emergenciaHora")}`)
      return;
    }

    mostrarMensaje("alerta", `emergencia declarada para la matricula ${matric}`, logoAlerta)
    document.getElementById("aterrizarAeronave").style.backgroundColor = "#FF0000"

    const resultadoBusquedaEntrantes = avionesEntrantes.find(
      (avion) => avion.matricula === matric
    );
    if (resultadoBusquedaEntrantes) {
      // logica para asignar prioridad de aterrizaje
      let indice = avionesEntrantes.indexOf(resultadoBusquedaEntrantes);
      // elimino el objeto de la posicion original
      avionesEntrantes.splice(indice, 1);
      // agrego el avion al inicio del array para darle prioridad de aterrizaje
      avionesEntrantes.unshift(resultadoBusquedaEntrantes);
      avionesEntrantes[0].estado =
        "EN EMERGENCIA";
    } else {
      // busco el avion en el listado de aviones salientes
      const resultadoBusquedaSalientes = avionesSalientes.find(
        (avion) => avion.matricula === matric
      );
      if (resultadoBusquedaSalientes) {
        // logica para transferir a aviones entrantes y darle prioridad de aterrizaje
        let indice = avionesSalientes.indexOf(resultadoBusquedaSalientes);
        // saco el avion del listado de aviones salientes
        avionesSalientes.splice(indice, 1);
        // agrego el avion al inicio del array de aviones entrantes para darle prioridad de aterrizaje
        avionesEntrantes.unshift(resultadoBusquedaSalientes);
        avionesEntrantes[0].estado =
          "EN EMERGENCIA (con prioridad para aterrizaje)";
      }
    }
    // almaceno el log de emergencias en el localstorage
    localStorage.setItem("emergenciaMatricula", matric);
    let fecha = new Date();
    localStorage.setItem("emergenciaHora", fecha);

    let mensaje = document.getElementById("mensaje");
    mensaje.className = "mensajeAlerta";
    mensaje.innerHTML =
      ">>> EMERGENCIA EN PROCESO <<< matricula: " +
      localStorage.getItem("emergenciaMatricula") +
      " ( " +
      localStorage.getItem("emergenciaHora") +
      " )";
    verEspacioAereo();
  } else {
    mostrarAlerta("no posee permisos para liberar aviones del espacio aereo")
  }
}

// aterriza el avion con indice 0
function aterrizarAvion() {
  if (permisoAterrizarAeronave) {
    if (localStorage.getItem("emergenciaMatricula")) {
      // elimino las claves referentes a emergencias del localStorage
      localStorage.removeItem("emergenciaHora");
      localStorage.removeItem("emergenciaMatricula");
      // elimino el mensaje de alerta
      let mensaje = document.getElementById("mensaje")
      mensaje.innerText = ""
    }
    document.getElementById("aterrizarAeronave").style.backgroundColor = "#7a5e93"
    avionesEntrantes.shift();
    verEspacioAereo();
  } else {
    mostrarAlerta("no posee permisos para autorizar aterrizajes")
  }
}

// autoriza el despegue de una avion en base a la matricula recibida como parametro
// saca el avion del grupo de aviones en tierra y lo agrega al grupo aviones salientes
function despegarAvion(matric) {
  if(permisoDespegarAeronave) {
    const indiceDespegue = avionesEnTierra.indexOf(
      avionesEnTierra.find((avion) => avion.matricula === matric)
    );
    if (indiceDespegue >= 0) {
      const companiaAerea = avionesEnTierra[indiceDespegue].compania;
      let logo = "";
      switch (companiaAerea) {
        case "AEROLINEAS ARGENTINAS":
          logo = logoAerolineas;
          break;
        case "ALITALIA":
          logo = logoAlitalia;
          break;
        case "UNITED AIRLINES":
          logo = logoUnited;
          break;
        case "DELTA AIRLINES":
          logo = logoDelta;
          break;
        default:
          logo = "";
      }
      avionesEnTierra.splice(indiceDespegue, 1);
      agregarAvion(avionesSalientes, matric, companiaAerea, "saliente", logo);
      alert(
        `INFORMACION (la aeronave con matricula ${matric} ha sido autorizado para el despegue)`
      );
    } else {
      alert(
        ">>> ALERTA <<< (se produjo un error de comunicacion al autorizar el despegue)"
      );
    }
    verEspacioAereo();
  } else {
    mostrarAlerta("no posee permisos para autorizar despegues")
  }
}

// busca por compania aerea entre los aviones entrantes, salientes y aterrizados
function buscarCompania(busqueda) {
  const resultadoEntrantes = avionesEntrantes.filter((avion) =>
    avion.compania.includes(busqueda)
  );
  const resultadoSalientes = avionesSalientes.filter((avion) =>
    avion.compania.includes(busqueda)
  );
  const resultadoAterrizados = avionesEnTierra.filter((avion) =>
    avion.compania.includes(busqueda)
  );
  const resultado = resultadoEntrantes.concat(
    resultadoSalientes.concat(resultadoAterrizados)
  );

  // FUNCION MARCADA COMO OBSOLETA EN EL PROYECTO
  // ordeno el resultado de la concatenacion de arrays por matricula
  resultado.sort((aeroNave1, aeroNave2) => {
    if (aeroNave1.matricula === aeroNave2.matricula) {
      return 0;
    }
    if (aeroNave1.matricula > aeroNave2.matricula) {
      return 1;
    }
    if (aeroNave1.matricula < aeroNave2.matricula) {
      return -1;
    }
  });
  listarAviones(resultado, "aeronaves por linea aerea");
}

// valida el formato de la matricula
// debe tener longitud de 6
// tres caracteres del tipo string
// tres caracteres del tipo numerico
function validarMatricula(valor) {
  let matriculaValidada = true;
  if (valor.length != 6) {
    matriculaValidada = false;
  } else if (!isNaN(valor.substring(0, 3))) {
    matriculaValidada = false;
  } else if (isNaN(valor.substring(3, 6))) {
    matriculaValidada = false;
  }
  return matriculaValidada;
}

// verifica que no exista la matricula que se quiere ingresar
function validarExistenciaMatricula(valor) {
  if (avionesEnTierra.find((avion) => avion.matricula === valor)) {
    return true;
  } else if (avionesEntrantes.find((avion) => avion.matricula === valor)) {
    return true;
  } else if (avionesSalientes.find((avion) => avion.matricula === valor)) {
    return true;
  }
  return false;
}

// se cargan los datos de una situacion de espacio aereo existente al momento
function cargarArrays() {
  fetch("../assets/json/avionesEntrantes.json")
    .then((response) => response.json())
    .then((response) => {
      response.forEach((avion) => {
        avionesEntrantes.push(avion);
      });
    })
    .catch((error) => console.log("error cargando datos de aviones entrantes"));

  fetch("../assets/json/avionesSalientes.json")
    .then((response) => response.json())
    .then((response) => {
      response.forEach((avion) => {
        avionesSalientes.push(avion);
      });
    })
    .catch((error) => console.log("error cargando datos de aviones salientes"));

  fetch("../assets/json/avionesAterrizados.json")
    .then((response) => response.json())
    .then((response) => {
      response.forEach((avion) => {
        avionesEnTierra.push(avion);
      });
    })
    .catch((error) => console.log("error cargando datos de aviones en tierra"));
}

// muestra un mensaje personalizado
function mostrarMensaje(title, text, imageUrl) {
  Swal.fire({
    title: title,
    text: text,
    imageUrl: imageUrl,
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: "logo aerolinea",
  });
}

// muestra un mensaje de alerta personalizado
function mostrarAlerta(texto) {
  Toastify({
    text: texto,
    duration: 6000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: false, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function () { } // Callback after click
  }).showToast();
}

// muestra las estadisticas generales
function mostrarEstadisticas() {
  let estadistica_01 = document.getElementById("estadistica_01")
  estadistica_01.innerHTML = avionesEntrantes.length
  let estadistica_02 = document.getElementById("estadistica_02")
  estadistica_02.innerHTML = avionesSalientes.length
  let estadistica_03 = document.getElementById("estadistica_03")
  estadistica_03.innerHTML = avionesEnTierra.length
}




const login = () => {
  // let loginSuccessfull = false;
  // for (let a = polIntentos; a > 0; a--) {
  //     let inputPassword = prompt("ingrese password: ")
  //     if (inputPassword === password) {
  //         loginSuccessfull = true
  //         break
  //     } else {
  //         alert(`password incorrecto, tiene ${a} intentos restantes`)
  //     }
  // }
  // return loginSuccessfull
  return true;
};

// consulto el clima de Buenos Aires
const chequearClima = () => {
  fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/buenos%20aires%2C%20argentina?unitGroup=metric&key=4UA8K4ZX2USFRGHKDXLGMUQ5Q&contentType=json", {
    "method": "GET",
    "headers": {
    }
  })
    .then(response => response.json())
    .then(data => {

      let clima = document.getElementById("detalle-clima")
      let climaHumedad = document.createElement("p")
      climaHumedad.className = "detalleClima"
      let climaTemperatura = document.createElement("p")
      climaTemperatura.className = "detalleClima"
      let climaCondicion = document.createElement("p")
      climaCondicion.className = "detalleClima"
      climaHumedad.innerHTML = `humedad: ${data.days[0].humidity} %`
      climaTemperatura.innerHTML = `temperatura: ${data.days[0].temp} grados`
      climaCondicion.innerHTML = `condicion: ${data.days[0].conditions}`

      switch (data.days[0].icon) {
        case "rain":
          document.getElementById("logo").src = "../assets/img/iconos/lluvia.jpg"
          break
        case "cloudy":
          document.getElementById("logo").src = "../assets/img/iconos/cloudy.png"
          break
        case "partly-cloudy-day":
          document.getElementById("logo").src = "../assets/img/iconos/partly-cloudy-day.png"
          break
        case "clear-day":
          document.getElementById("logo").src = "../assets/img/iconos/clear-day.png"
          break
        case "wind":
          document.getElementById("logo").src = "../assets/img/iconos/wind.png"
          break
        default:
          alert("entre al default")
          document.getElementById("logo").src = "../assets/img/iconos/weather.jpg"
          break
      }

      clima.appendChild(climaHumedad)
      clima.appendChild(climaTemperatura)
      clima.appendChild(climaCondicion)
    })
    .catch(err => {
      console.error(err);
    });

}

// leo los permisos desde el localstorgage
const leerPermisos = () => {



}

if (login()) {

  chequearClima()

  // lista en pantalla el espacio aereo
  let btnVerEspacioAereo = document.getElementById("verEspacioAereo")
  btnVerEspacioAereo.onclick = () => {
    verEspacioAereo();
  };

  // autoriza el aterrizaje al avion con id = 0
  let btnAutorizarAterrizaje = document.getElementById("aterrizarAeronave");
  btnAutorizarAterrizaje.onclick = () => {
    if (avionesEntrantes.length > 0) {
      const matric = avionesEntrantes[0].matricula;
      const aerolinea = avionesEntrantes[0].compania;
      let logo = "";
      switch (aerolinea) {
        case "AEROLINEAS ARGENTINAS":
          logo = logoAerolineas;
          break;
        case "ALITALIA":
          logo = logoAlitalia;
          break;
        case "UNITED AIRLINES":
          logo = logoUnited;
          break;
        case "DELTA AIRLINES":
          logo = logoDelta;
          break;
        default:
          logo = "";
      }
      agregarAvion(avionesEnTierra, matric, aerolinea, "aterrizado", logo)
      aterrizarAvion()
      mostrarMensaje(
        "aterrizaje",
        `la aeronave con matricula ${matric} a completado el procedimiento de aterrizaje`,
        logo
      );
    } else {
      alert("INFORMACION (no hay aviones en espera para el aterrizaje)")
    }
  }

  // buscar y listar aviones de una aerolinea
  let busqueda = document.getElementById("nombreAerolinea")
  let btnBuscarAerolinea = document.getElementById("btnBuscarAerolinea")
  btnBuscarAerolinea.addEventListener("click", () => {
    buscarCompania(busqueda.value.toUpperCase())
    busqueda.value = ""
  })

  //recibir avion al espacio aereo
  let matricula = document.getElementById("matricula")
  let companiaAerea = document.getElementById("companiaAerea")
  btnRecibirAeronave = document.getElementById("recibirAeronave")
  btnRecibirAeronave.addEventListener("click", () => {
    recibirAvion(matricula.value, companiaAerea.value)
    matricula.value = ""
    companiaAerea.value = ""
  });

  // ver aviones en tierra
  let btnVerAvionesEnTierra = document.getElementById("avionesEnTierra");
  btnVerAvionesEnTierra.addEventListener("click", () => {
    verAvionesEnTierra();
  });

  // verificar alerta existente
  let mensaje = document.getElementById("mensaje");
  mensaje.className = "mensajeAlerta";
  mensaje.innerHTML = ""
  if (localStorage.getItem("emergenciaMatricula")) {
    mensaje.innerHTML =
      ">>> EMERGENCIA EN PROCESO <<< matricula: " +
      localStorage.getItem("emergenciaMatricula") +
      " ( " +
      localStorage.getItem("emergenciaHora") +
      " )";
  }

  cargarArrays();
  Swal.fire("bienvenido !!!", "espacio aereo actual cargado", "info");

} else {
  console.log("el usuario ha sido bloqueado");
}
