const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 3001;

async function getTipoCambio() {
  const response = await axios.get("https://api.apis.net.pe/v1/tipo-cambio-sunat");
  return response.data;
}
let preciod;
const dolarprecio = async () => {
  try {
    const precio = await getTipoCambio();
    return precio;
  } catch (error) {
    console.error(error);
  }
};
async function obtenerTipoDeCambio() {
  try {
    const precio = await dolarprecio();
    preciod = precio;
    console.log(`El precio del dólar es: ${precio}`);
    // aquí puedes hacer algo con el precio obtenido
  } catch (error) {
    console.error(error);
  }
}


obtenerTipoDeCambio()


dolarprecio()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/", async (req, res) => {
  res.json({preciod});
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
