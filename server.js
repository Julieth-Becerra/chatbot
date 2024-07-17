const express = require('express');
const app = express();
const port = 3000;
const routes = require('./routes');

// Middleware para parsear JSON
app.use(express.json());

// Usar rutas
app.use('/', routes);

app.listen(port, () => {
  console.log(`API funcionando en http://localhost:${port}`);
});
