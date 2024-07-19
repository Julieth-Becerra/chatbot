const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const routes = require('./routes');

// Configuración de CORS para permitir solicitudes desde cualquier origen
app.use(cors({
  origin: '*'
}));

app.use(express.json());

// Middleware para mostrar por consola cada petición
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  console.log('Request body:', req.body);
  next();
});

// Usar las rutas definidas
app.use('/', routes);

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
