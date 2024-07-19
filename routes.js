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
  getInstagramData,
  getLineasInvestigacion,
  getPlanEstrategico,
  getObjetivos,
  getRetos,
  getVision,
  getArticulosPublicados // Importar el nuevo controlador
} = require('./controllers/dataController');

router.post('/grupo', getGrupo);
router.post('/proyectos', getProyectos);
router.post('/semilleros', getSemilleros);
router.post('/datos_facebook', getFacebookData);
router.post('/noticias_facebook', getNoticiasFacebook);
router.post('/curiosidad_aleatoria', getCuriosidadAleatoria);
router.post('/redes_sociales', getRedesSociales);
router.post('/datos_instagram', getInstagramData);
router.post('/lineas_investigacion', getLineasInvestigacion);
router.post('/plan_estrategico', getPlanEstrategico);
router.post('/objetivos', getObjetivos);
router.post('/retos', getRetos);
router.post('/vision', getVision);
router.post('/articulos_publicados', getArticulosPublicados); // Añadir la nueva ruta

module.exports = router;
