const express = require('express');
const router = express.Router();
const {
  getGrupo,
  getProyectos,
  getSemilleros,
  getFacebookData,
  getNoticiasFacebook,
  getCuriosidadesFacebook,
  getCuriosidadesSabias,
  getRedesSociales,
  getInstagramData
} = require('./controllers/dataController');

router.get('/grupo', getGrupo);
router.get('/proyectos', getProyectos);
router.get('/semilleros', getSemilleros);
router.get('/datos_facebook', getFacebookData);
router.get('/noticias_facebook', getNoticiasFacebook);
router.get('/curiosidades_facebook', getCuriosidadesFacebook);
router.get('/curiosidades_sabias', getCuriosidadesSabias);
router.get('/redes_sociales', getRedesSociales);
router.get('/datos_instagram', getInstagramData);

module.exports = router;
