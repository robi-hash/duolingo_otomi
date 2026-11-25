
fetch("obtener_datos.php")
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al consultar el servidor");
        }

        return response.json();
    })
    .then(data => {

        if (!data.success) {
            document.getElementById("datosPerfil").innerHTML =
                `<div class="mensaje">${data.mensaje}</div>`;

            document.getElementById("estadisticas").innerHTML = "";
            return;
        }

        const usuario = data.datos;

        const seguro = valor => String(valor ?? "").replace(
            /[&<>"']/g,
            caracter => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[caracter]
        );

        document.getElementById("datosPerfil").innerHTML = `
            <h1>${seguro(usuario.nombre)}</h1>

            <p><strong>Nombre:</strong> ${seguro(usuario.nombre)}</p>
            <p><strong>Email:</strong> ${seguro(usuario.email)}</p>
            <p><strong>País:</strong> ${seguro(usuario.pais || "No registrado")}</p>
            <p><strong>Fecha de ingreso:</strong> ${seguro(usuario.fecha_ingreso || "No disponible")}</p>
        `;

        document.getElementById("estadisticas").innerHTML = `

            <div class="tarjeta">
                <h3>🔥 Racha</h3>
                <div class="valor">${seguro(usuario.racha)} días</div>
            </div>

            <div class="tarjeta">
                <h3>⭐ Experiencia</h3>
                <div class="valor">${seguro(usuario.experiencia)} EXP</div>
            </div>

            <div class="tarjeta">
                <h3>📊 Porcentaje</h3>
                <div class="valor">${seguro(usuario.porcentaje)}%</div>
            </div>

            <div class="tarjeta">
                <h3>🏅 Nivel</h3>
                <div class="valor">${seguro(usuario.nivel)}</div>
            </div>

        `;

    })
    .catch(error => {

        console.error("Error:", error);

        document.getElementById("datosPerfil").innerHTML = `
            <div class="mensaje">
                No se pudo cargar la información del perfil.
            </div>
        `;

    });
