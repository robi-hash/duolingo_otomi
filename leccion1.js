let preguntaActual = 0;
let respuestasCorrectas = 0;
let puntaje = 0;
let respuestaSeleccionada = false;
let progresoEnviado = false;

const preguntas = document.querySelectorAll(".pregunta");
const barraProgreso = document.getElementById("barraProgreso");
const numeroPregunta = document.getElementById("numeroPregunta");
const resultado = document.getElementById("resultado");
const puntuacion = document.getElementById("puntuacion");
const mensajeFinal = document.getElementById("mensajeFinal");

function detenerAudios() {
    document.querySelectorAll(".audio-animal").forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

function reproducirAudio(pregunta) {
    detenerAudios();

    const audio = pregunta.querySelector(".audio-animal");

    if (!audio) {
        console.error("No se encontró el audio de esta pregunta.");
        return;
    }

    audio.currentTime = 0;
    audio.load();

    const promesa = audio.play();

    if (promesa !== undefined) {
        promesa.catch(error => {
            console.error("No se pudo reproducir el audio:", error);
        });
    }
}

// Nueva función para el botón Escuchar
function escucharAudio(boton) {
    const pregunta = boton.closest(".pregunta");
    reproducirAudio(pregunta);
}

function mostrarPregunta() {
    preguntas.forEach((pregunta, indice) => {
        pregunta.classList.toggle("activa", indice === preguntaActual);
    });

    numeroPregunta.textContent =
        `Pregunta ${preguntaActual + 1} de ${preguntas.length}`;

    barraProgreso.style.width =
        `${(preguntaActual / preguntas.length) * 100}%`;
}

function seleccionar(boton, esCorrecta) {
    if (respuestaSeleccionada) return;

    respuestaSeleccionada = true;

    const pregunta = preguntas[preguntaActual];
    const opciones = pregunta.querySelectorAll(".opcion");
    const mensaje = pregunta.querySelector(".mensaje");
    const botonSiguiente = pregunta.querySelector(".siguiente");

    opciones.forEach(opcion => {
        opcion.disabled = true;

        if (opcion.getAttribute("onclick")?.includes("true")) {
            opcion.classList.add("correcta");
        }
    });

    if (esCorrecta) {
        respuestasCorrectas++;
        puntaje += 10;

        mensaje.textContent = "¡Correcto! Ganaste 10 puntos.";
        mensaje.style.color = "green";

        reproducirAudio(pregunta); // También suena al acertar
    } else {
        detenerAudios();
        boton.classList.add("incorrecta");

        mensaje.textContent = "Respuesta incorrecta. ¡Sigue intentando!";
        mensaje.style.color = "red";
    }

    botonSiguiente.disabled = false;

    barraProgreso.style.width =
        `${((preguntaActual + 1) / preguntas.length) * 100}%`;
}

function siguientePregunta() {
    if (!respuestaSeleccionada) return;

    detenerAudios();

    preguntaActual++;

    if (preguntaActual < preguntas.length) {
        respuestaSeleccionada = false;
        mostrarPregunta();
    } else {
        terminarLeccion();
    }
}

function terminarLeccion() {
    detenerAudios();

    preguntas.forEach(pregunta => {
        pregunta.classList.remove("activa");
    });

    numeroPregunta.textContent = "Lección completada";
    barraProgreso.style.width = "100%";

    resultado.style.display = "block";

    puntuacion.textContent =
        `${respuestasCorrectas} de ${preguntas.length}`;

    mensajeFinal.textContent =
        `Obtuviste ${puntaje} puntos de experiencia.`;

    if (progresoEnviado) return;

    progresoEnviado = true;

    fetch("actualizar_progreso.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            experienciaGanada: puntaje
        })
    })
    .then(async response => {
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.mensaje || "Error al guardar progreso");
        }

        mensajeFinal.textContent +=
            " ¡Tu progreso se guardó correctamente!";
    })
    .catch(error => {
        console.error(error);
        mensajeFinal.textContent +=
            " No se pudo guardar el progreso.";
        progresoEnviado = false;
    });
}

function reiniciar() {
    detenerAudios();

    preguntaActual = 0;
    respuestasCorrectas = 0;
    puntaje = 0;
    respuestaSeleccionada = false;
    progresoEnviado = false;

    resultado.style.display = "none";

    preguntas.forEach(pregunta => {
        pregunta.querySelectorAll(".opcion").forEach(opcion => {
            opcion.disabled = false;
            opcion.classList.remove("correcta", "incorrecta");
        });

        pregunta.querySelector(".mensaje").textContent = "";
        pregunta.querySelector(".siguiente").disabled = true;
    });

    mostrarPregunta();
}

// Inicia la lección
mostrarPregunta();