const express = require('express');
const router = express.Router();
const {
  getGrupo,
  getProyectos,
  getSemilleros,
  getFacebookData,
  getNoticiasFacebook,
  getCuriosidadAleatoria,
  getRedesSociales,
  getInstagramData
} = require('./controllers/dataController');

router.post('/grupo', getGrupo);
router.post('/proyectos', getProyectos);
router.post('/semilleros', getSemilleros);
router.post('/datos_facebook', getFacebookData);
router.post('/noticias_facebook', getNoticiasFacebook);
router.post('/curiosidad_aleatoria', getCuriosidadAleatoria);
router.post('/redes_sociales', getRedesSociales);
router.post('/datos_instagram', getInstagramData);

module.exports = router;
