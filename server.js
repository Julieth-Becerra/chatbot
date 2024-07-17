const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const routes = require('./routes');

// Middleware para parsear JSON
app.use(express.json());

// Usar rutas
app.use('/', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`API funcionando en http://localhost:${port}`);
});
