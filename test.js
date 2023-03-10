const express = require("express");
const fs = require("fs");
const axios = require("axios");
const cron = require("node-cron");
const cors = require("cors");

const app = express();
const PORT = 3002;

const nombreArchivo = "datos.json";

// Verificamos si el archivo JSON existe, y si no existe lo creamos
if (!fs.existsSync(nombreArchivo)) {
  fs.writeFileSync(nombreArchivo, JSON.stringify({}));
}

// Creamos una función para obtener los datos de la API y guardarlos en el archivo JSON
const obtenerDatosAPI = async () => {
  try {
    const response = await axios.get(
      "https://api.apis.net.pe/v1/tipo-cambio-sunat"
    );
    const datosAPI = response.data;

    // Leemos los datos anteriores del archivo JSON
    const datosAnteriores = JSON.parse(fs.readFileSync(nombreArchivo));

    // Comparamos los datos anteriores con los nuevos datos obtenidos de la API
    if (JSON.stringify(datosAPI) !== JSON.stringify(datosAnteriores)) {
      // Si hay cambios, reescribimos el archivo JSON
      fs.writeFileSync(nombreArchivo, JSON.stringify(datosAPI));
      console.log("Datos actualizados");
    } else {
      console.log("No hay cambios en los datos");
    }
  } catch (error) {
    console.error(error);
  }
};

// Ejecutamos la función por primera vez al levantar el servidor
obtenerDatosAPI();

// Configuramos una tarea programada para que se ejecute todos los días a las 6:00 am
cron.schedule("0 6 * * *", obtenerDatosAPI);
app.use(cors());

// Creamos una ruta en Express para mostrar los datos del archivo JSON
app.get("/", (req, res) => {
  const datos = fs.readFileSync(nombreArchivo, "utf-8");
  res.json(JSON.parse(datos));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
