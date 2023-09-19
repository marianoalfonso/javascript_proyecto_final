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

// genera un listado del estado actual del espacio aereo
function verEspacioAereo() {
  listarAviones(avionesEntrantes.concat(avionesSalientes));
  mostrarEstadisticas()
}

function verAvionesEnTierra() {
  listarAviones(avionesEnTierra);
}

// agregamos un item al array pasado como parametro
function agregarAvion(array, matric, comp, est, logo) {
  array.push({ matricula: matric, compania: comp, estado: est, logo: logo });
}

// define y devuelve un elemento para se agregado al dom
// function agregarElemento(
//   tipo,
//   claseName,
//   idName,
//   accion,
//   funcion,
//   parametro,
//   texto
// ) {
//   let elemento = document.createElement(tipo)
//   elemento.className = claseName
//   elemento.id = idName
//   elemento.addEventListener(accion, funcion(parametro))
// //   elemento.accion = () => funcion(parametro);
//   elemento.innerText = texto
//   return elemento
// }

// lista los aviones contenidos el el array recibido como parametro
function listarAviones(array) {

  let espacioAereo = document.getElementById("panel-visualizacion");
  espacioAereo.innerHTML = "";

  let tituloPanelVisualizacion = document.createElement("h4")
  tituloPanelVisualizacion.classList = "tituloPanelVisualizacion"
  tituloPanelVisualizacion.innerHTML = "espacio aereo generado dinamicamente"
  espacioAereo.appendChild(tituloPanelVisualizacion)


  array.forEach((element) => {
    console.log(
      `${array.indexOf(element) + 1} - ${element.matricula} ( ${element.compania
      }) - ${element.estado}`
    );
    let aeronaveEnEspacioAereo = document.createElement("div");
    aeronaveEnEspacioAereo.draggable = true
    aeronaveEnEspacioAereo.className = "aeronave";
    aeronaveEnEspacioAereo.innerHTML = `<div class="elementoTarjeta" ><img id="imagenTarjeta" src="${element.logo
      }" alt="logo compania"></div>
                                            <div class="elementoTarjeta"><p>${element.compania
      }</p></div>                                    
                                            <div class="elementoTarjeta"><p>${element.matricula
      }</p></div>
                                            <div class="elementoTarjeta"><p>baliza: ${array.indexOf(element) + 1
      }</p></div>
                                            <div class="elementoTarjeta"><p>${element.estado
      }</p></div>`;

    espacioAereo.appendChild(aeronaveEnEspacioAereo);

    if (element.estado === "saliente") {
      let botonEmergencia = document.createElement("button")
      botonEmergencia.className = "botonAeronave"
      botonEmergencia.id = "botonEmergencia"
      botonEmergencia.addEventListener("click", () => declararEmergencia(element.matricula))
      botonEmergencia.innerText = "declarar emergencia"
      espacioAereo.appendChild(botonEmergencia)

      let botonLiberar = document.createElement("button")
      botonLiberar.className = "botonAeronave"
      botonLiberar.id = "btnLiberarAeronave"
      botonLiberar.addEventListener("click", () => liberarAvion(element.matricula))
      botonLiberar.innerText = "liberar aeronave"
      espacioAereo.appendChild(botonLiberar)

    } else if (element.estado === "aterrizado") {
      let botonAutorizarDespegue = document.createElement("button")
      botonAutorizarDespegue.className = "botonAeronave"
      botonAutorizarDespegue.id = "btnAutorizarDespegue"
      botonAutorizarDespegue.addEventListener("click", () => despegarAvion(element.matricula))
      botonAutorizarDespegue.innerText = "autorizar despegue"
      espacioAereo.appendChild(botonAutorizarDespegue)

    } else if (element.estado === "entrante") {
      let botonEmergencia = document.createElement("button")
      botonEmergencia.className = "botonAeronave"
      botonEmergencia.id = "botonEmergencia"
      botonEmergencia.addEventListener("click", () => declararEmergencia(element.matricula))
      botonEmergencia.innerText = "declarar emergencia"
      espacioAereo.appendChild(botonEmergencia)

    }

  });
}

// recibimos un avion entrante al area de control
// parametros: matric (matricula de la aeronave)
//             comp (compania aerea)
function recibirAvion(matric, comp) {
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
    switch (comp) {
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

    // actualizo la informacion de aviones entrantes en el localStorage
    localStorage.removeItem("avionesEntrantes");
    localStorage.setItem(
      "aeronavesEntrantes",
      JSON.stringify(avionesEntrantes)
    );
    mostrarAlerta(`la aeronave ${matric.toUpperCase()} de la compania ${comp} 
                   ha sido recibido en el espacio aereo`)
    verEspacioAereo()
  }
}

// libera un avion del espacio aereo dejando de estar bajo el control de la torre
function liberarAvion(matric) {
  const indiceLiberacion = avionesSalientes.indexOf(
    avionesSalientes.find((avion) => avion.matricula === matric)
  );
  if (indiceLiberacion >= 0) {
    avionesSalientes.splice(indiceLiberacion, 1);
    alert(
      `INFORMACION - la aeronave con matricula ${matric} ha sido liberada del espacio aereo`
    );
  } else {
    alert(`>>> ALERTA <<< ( error de comunicacion con la aeronave ${matric} )`);
  }

  // actualizo la informacion de aviones salientes en el localStorage
  localStorage.removeItem("avionesSalientes");
  localStorage.setItem("aeronavesSalientes", JSON.stringify(avionesSalientes));

  verEspacioAereo();
}

// al declarar una declararEmergencia
// si es avion entrante pasa a tener ID = 0
// si es avion saliente se saca del array de avionesSalientes y se ingresa al array de avionesEntrantes con ID = 0
function declararEmergencia(matric) {
  // verificar existencia de emergencia sin resolver
  if (localStorage.getItem("emergenciaHora")) {
    mostrarAlerta(`debe resolverse la emergencia en curso aterrizando la aeronave antes de poder declarar otra 
      ...........................................................................................
      matricula en emergencia: ${localStorage.getItem("emergenciaMatricula")} 
      emergencia hora: ${localStorage.getItem("emergenciaHora")}`)

    return;
  }

  // si no existen emergencias sin resolver, permite declarar una nueva emergencia
  // alert(
  //   ">>> ALERTA <<< (emergencia declarada para la matricula: " + matric + ")"
  // );
  mostrarMensaje("alerta", `emergencia declarada para la matricula ${matric}`, logoAlerta)

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
      "EN EMERGENCIA (con prioridad para aterrizaje)";
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
}

// aterriza el avion con indice 0
function aterrizarAvion() {
  if (localStorage.getItem("emergenciaMatricula")) {
    // elimino las claves referentes a emergencias del localStorage
    localStorage.removeItem("emergenciaHora");
    localStorage.removeItem("emergenciaMatricula");

    // elimino el mensaje de alerta
    // let contenedor = document.querySelector(".panel-informacion");
    // console.log(contenedor)
    // let item = contenedor.querySelector(".panel-informacion:nth-child(1)");
    // console.log(item)
    // contenedor.removeChild(item); // Desconecta el segundo .item

    // elimino el mensaje de alerta
    let mensaje = document.getElementById("mensaje")
    mensaje.innerText = ""

  }

  avionesEntrantes.shift();
  verEspacioAereo();
}

// autoriza el despegue de una avion en base a la matricula recibida como parametro
// saca el avion del grupo de aviones en tierra y lo agrega al grupo aviones salientes
function despegarAvion(matric) {
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

  // actualizo la informacion de aviones salientes en el localStorage
  localStorage.removeItem("avionesSalientes");
  localStorage.setItem("aeronavesSalientes", JSON.stringify(avionesSalientes));

  verEspacioAereo();
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
  listarAviones(resultado);
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

// datos precargados para facilitar el testeo
function cargarArrays() {
  //   avionesEnTierra.push({ matricula: 'AAA111', compania: 'AEROLINEAS ARGENTINAS', estado: 'aterrizado', logo: logoAerolineas })
  //   avionesEnTierra.push({ matricula: 'BBB222', compania: 'DELTA AIRLINES', estado: 'aterrizado', logo: logoDelta })
  //   avionesEnTierra.push({ matricula: 'CCC333', compania: 'UNITED AIRLINES', estado: 'aterrizado', logo: logoUnited })
  //   avionesEnTierra.push({ matricula: 'DDD444', compania: 'ALITALIA', estado: 'aterrizado', logo: logoAlitalia })
  //   avionesEnTierra.push({ matricula: 'EEE555', compania: 'AEROLINEAS ARGENTINAS', estado: 'aterrizado', logo: logoAerolineas })
  //   avionesEntrantes.push({ matricula: 'FFF666', compania: 'ALITALIA', estado: 'entrante', logo: logoAlitalia })
  //   avionesEntrantes.push({ matricula: 'GGG777', compania: 'AEROLINEAS ARGENTINAS', estado: 'entrante', logo: logoAerolineas })
  //   avionesEntrantes.push({ matricula: 'MDF222', compania: 'AEROLINEAS ARGENTINAS', estado: 'entrante', logo: logoAerolineas })
  //   avionesEntrantes.push({ matricula: 'RJT566', compania: 'UNITED AIRLINES', estado: 'entrante', logo: logoUnited })
  //   avionesEntrantes.push({ matricula: 'MDF222', compania: 'UNITED AIRLINES', estado: 'entrante', logo: logoUnited })
  //   avionesSalientes.push({ matricula: 'HHH888', compania: 'UNITED AIRLINES', estado: 'saliente', logo: logoUnited })
  //   avionesSalientes.push({ matricula: 'III999', compania: 'AEROLINEAS ARGENTINAS', estado: 'saliente', logo: logoAerolineas })
  //   avionesSalientes.push({ matricula: 'ADS123', compania: 'DELTA AIRLINES', estado: 'saliente', logo: logoDelta })
  //   avionesSalientes.push({ matricula: 'ODF222', compania: 'DELTA AIRLINES', estado: 'saliente', logo: logoDelta })
  //   avionesSalientes.push({ matricula: 'DLF234', compania: 'AEROLINEAS ARGENTINAS', estado: 'saliente', logo: logoAerolineas })
  //   avionesSalientes.push({ matricula: 'CDS977', compania: 'AEROLINEAS ARGENTINAS', estado: 'saliente', logo: logoAerolineas })

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
  let panelEstadisticas = document.getElementById("panel-estadisticas")
  panelEstadisticas.innerHTML = ""
 
  let cantidadAvionesEntrantes = document.createElement("h5")
  cantidadAvionesEntrantes.className = "mensajeEstadisticas"
  cantidadAvionesEntrantes.id = "cantidadAvionesEntrantes"
  cantidadAvionesEntrantes.innerHTML = `aviones en espera de autorizacion para el aterrizaje: ${avionesEntrantes.length}`

  let cantidadAvionesSalientes = document.createElement("h5")
  cantidadAvionesSalientes.className = "mensajeEstadisticas"
  cantidadAvionesSalientes.id = "cantidadAvionesSalientes"
  cantidadAvionesSalientes.innerHTML = `aviones en salida del espacio aereo: ${avionesSalientes.length}`
 
  let cantidadAvionesEnTierra = document.createElement("h5")
  cantidadAvionesEnTierra.className = "mensajeEstadisticas"
  cantidadAvionesEnTierra.id = "cantidadAvionesEnTierra"
  cantidadAvionesEnTierra.innerHTML = `aviones en tierra: ${avionesEnTierra.length}`
  panelEstadisticas.appendChild(cantidadAvionesEntrantes)
  panelEstadisticas.appendChild(cantidadAvionesSalientes)
  panelEstadisticas.appendChild(cantidadAvionesEnTierra)
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

if (login()) {

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

  // verifica actividad existente en el espacio aereo
  // if (!localStorage.getItem("aeronavesEntrantes")) {
  //     avionesEntrantes = JSON.parse(localStorage.getItem("aeronavesEntrantes"))
  //     console.log(avionesEntrantes)
  // } else {
  //     alert("existe")
  // }

    cargarArrays();
    Swal.fire("bienvenido !!!", "espacio aereo actual cargado", "info");

} else {
  console.log("el usuario ha sido bloqueado");
}
