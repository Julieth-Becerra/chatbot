const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Variables para almacenar los datos
let grupoInfo = {};
let proyectosInfo = [];
let semillerosInfo = [];
let datosFacebook = [];
let datosFacebookSimplificados = [];
let datosInstagram = [];
let noticiasFacebook = [];
let curiosidades = [];
let lineasInvestigacion = [];
let planEstrategico = '';
let objetivos = '';
let retos = '';
let vision = '';
let articulosPublicados = [];

// Funciones para leer y parsear archivos CSV
const leerCSV = (ruta, separator, callback) => {
  let datos = [];
  fs.createReadStream(ruta, { encoding: 'utf-8' })
    .pipe(csv({ separator: separator }))
    .on('data', (row) => {
      datos.push(row);
    })
    .on('end', () => {
      callback(datos);
    });
};

// Cargar datos al iniciar
leerCSV(path.join(__dirname, '../grupo.csv'), ';', (datos) => {
  grupoInfo = datos[0];
});

leerCSV(path.join(__dirname, '../Proyectos.csv'), ';', (datos) => {
  proyectosInfo = datos.map(proyecto => {
    return {
      nombre_proyecto: proyecto['nombre_proyecto'],
      descripcion_proyecto: proyecto['descripcion_proyecto'],
      semillero: proyecto['semillero'],
      integrantes: proyecto['integrantes'],
      director_proyecto: proyecto['director_proyecto'],
      co_director: proyecto['co_director'],
      estado: proyecto['estado']
    };
  });
});

leerCSV(path.join(__dirname, '../Semilleros.csv'), ';', (datos) => {
  semillerosInfo = datos.map(semillero => {
    return {
      nombre_semillero: semillero['nombre_semillero'],
      docente_encargado: semillero['docente_encargado'],
      objetivo_semillero: semillero['objetivo_semillero'],
      linea_investigacion: semillero['linea_investigacion']
    };
  });
});

leerCSV(path.join(__dirname, '../datos_facebook.csv'), ',', (datos) => {
  datosFacebook = datos;
  datosFacebookSimplificados = datos.map(item => ({
    Titulo: item['Título'],
    Descripcion: item['Descripción'],
    Fecha: item['Fecha'],
    EnlacePermanente: item['Enlace permanente']
  }));
  noticiasFacebook = datos.filter(item => item['Descripción'] && item['Descripción'].includes('#UPTCInforma'));
});

leerCSV(path.join(__dirname, '../curiosidades.csv'), ',', (datos) => {
  curiosidades = datos;
});

leerCSV(path.join(__dirname, '../lineas_investigacion.csv'), ',', (datos) => {
  lineasInvestigacion = datos.map(dato => dato["Lineas de investigacion"]).filter(Boolean);
  planEstrategico = datos[0]["Plan estrategico"];
  objetivos = datos[0]["Objetivos"];
  retos = datos[0]["Retos"];
  vision = datos[0]["Vision"];
});

leerCSV(path.join(__dirname, '../articulos_publicados.csv'), ',', (datos) => {
  articulosPublicados = datos;
});

// Función para obtener un elemento aleatorio de un array
const obtenerElementoAleatorio = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Funciones para formatear los datos de manera más legible
const formatearDatos = (datos) => {
  if (Array.isArray(datos)) {
    return datos.join('\n');
  }
  if (typeof datos === 'object' && datos !== null) {
    return Object.entries(datos).map(([key, value]) => `${key}: ${value}`).join('\n');
  }
  return datos;
};

const formatearProyecto = (proyecto) => {
  return `
Nombre del Proyecto: ${proyecto['nombre_proyecto']}
Descripción: ${proyecto['descripcion_proyecto']}
Semillero: ${proyecto['semillero']}
Integrantes: ${proyecto['integrantes']}
Director del Proyecto: ${proyecto['director_proyecto']}
Co-Director: ${proyecto['co_director']}
Estado: ${proyecto['estado']}
  `;
};

const formatearSemillero = (semillero) => {
  return `
Nombre del Semillero: ${semillero['nombre_semillero']}
Docente Encargado: ${semillero['docente_encargado']}
Objetivo del Semillero: ${semillero['objetivo_semillero']}
Línea de Investigación: ${semillero['linea_investigacion']}
  `;
};

const formatearArticulo = (articulo) => {
  return `
Título: ${articulo['Título']}
País: ${articulo['País']}
Revista: ${articulo['Revista']}
ISSN: ${articulo['ISSN']}
Año: ${articulo['Año']}
Volumen: ${articulo['Volumen']}
Fascículo: ${articulo['Fascículo']}
Páginas: ${articulo['Páginas']}
DOI: ${articulo['DOI']}
Autores: ${articulo['Autores']}
  `;
};

// Controladores
const getGrupo = (req, res) => {
  res.json({
    message: `Aquí tienes información sobre el grupo de investigación:\n\n${formatearDatos(grupoInfo)}`,
    suggested_replies: ["Ver proyectos", "Ver semilleros", "Ver líneas de investigación", "Ver plan estratégico", "Ver objetivos", "Ver retos", "Ver visión", "Ver artículos publicados", "Ver noticias", "Ver datos curiosos", "Contacto"]
  });
};

const getProyectos = (req, res) => {
  res.json({
    message: `Aquí tienes información sobre los proyectos:\n\n${proyectosInfo.map(proyecto => formatearProyecto(proyecto)).join('\n\n')}`,
    suggested_replies: ["Ver grupo", "Ver semilleros", "Ver líneas de investigación", "Ver plan estratégico", "Ver objetivos", "Ver retos", "Ver visión", "Ver artículos publicados", "Ver noticias", "Ver datos curiosos", "Contacto"]
  });
};

const getSemilleros = (req, res) => {
  res.json({
    message: `Aquí tienes información sobre los semilleros:\n\n${semillerosInfo.map(semillero => formatearSemillero(semillero)).join('\n\n')}`,
    suggested_replies: ["Ver grupo", "Ver proyectos", "Ver líneas de investigación", "Ver plan estratégico", "Ver objetivos", "Ver retos", "Ver visión", "Ver artículos publicados", "Ver noticias", "Ver datos curiosos", "Contacto"]
  });
};

const getFacebookData = (req, res) => {
  res.json({
    message: `Aquí tienes los datos de Facebook:\n\n${datosFacebookSimplificados.map(dato => formatearDatos(dato)).join('\n\n')}`,
  });
};

const getNoticiasFacebook = (req, res) => {
  const noticiasSimplificadas = noticiasFacebook.map(noticia => ({
    Descripcion: noticia['Descripción'],
    EnlacePermanente: noticia['Enlace permanente']
  }));

  res.json({
    message: `Estas son las noticias que tenemos para ti, por favor visita el enlace para más detalles:\n\n${noticiasSimplificadas.map(noticia => `Descripción: ${noticia.Descripcion}\nEnlace permanente: ${noticia.EnlacePermanente}`).join('\n\n')}`,
    suggested_replies: ["Ver grupo", "Ver proyectos", "Ver semilleros", "Ver líneas de investigación", "Ver plan estratégico", "Ver objetivos", "Ver retos", "Ver visión", "Ver artículos publicados", "Ver datos curiosos", "Contacto"]
  });
};

const getCuriosidadAleatoria = (req, res) => {
  const curiosidadAleatoria = obtenerElementoAleatorio(curiosidades);
  res.json({
    message: `Aquí tienes un dato curioso:\n\n${formatearDatos(curiosidadAleatoria)}`,
    suggested_replies: ["Ver grupo", "Ver proyectos", "Ver semilleros", "Ver líneas de investigación", "Ver plan estratégico", "Ver objetivos", "Ver retos", "Ver visión", "Ver artículos publicados", "Ver noticias", "Contacto"]
  });
};

const getRedesSociales = (req, res) => {
  res.json({
    message: `Aquí tienes nuestros enlaces en redes sociales:\n\n${formatearDatos({
      facebook: "https://www.facebook.com/GrupoGALASH",
      instagram: "https://www.instagram.com/grupogalash/",
      linkedin: "https://www.linkedin.com/in/galash-grupo-de-investigaci%C3%B3n/"
    })}`,
    suggested_replies: ["Ver grupo", "Ver proyectos", "Ver semilleros", "Ver líneas de investigación", "Ver plan estratégico", "Ver objetivos", "Ver retos", "Ver visión", "Ver artículos publicados", "Ver noticias", "Ver datos curiosos", "Contacto"]
  });
};

const getInstagramData = (req, res) => {
  res.json({
    message: `Aquí tienes los datos de Instagram:\n\n${datosInstagram.map(dato => formatearDatos(dato)).join('\n\n')}`,
  });
};

const getLineasInvestigacion = (req, res) => {
  res.json({
    message: `Aquí tienes las líneas de investigación:\n\n${formatearDatos(lineasInvestigacion)}`,
    suggested_replies: ["Ver grupo", "Ver proyectos", "Ver semilleros", "Ver plan estratégico", "Ver objetivos", "Ver retos", "Ver visión", "Ver artículos publicados", "Ver noticias", "Ver datos curiosos", "Contacto"]
  });
};

const getPlanEstrategico = (req, res) => {
  res.json({
    message: `Aquí tienes el plan estratégico:\n\n${formatearDatos(planEstrategico)}`,
    suggested_replies: ["Ver grupo", "Ver proyectos", "Ver semilleros", "Ver líneas de investigación", "Ver objetivos", "Ver retos", "Ver visión", "Ver artículos publicados", "Ver noticias", "Ver datos curiosos", "Contacto"]
  });
};

const getObjetivos = (req, res) => {
  res.json({
    message: `Aquí tienes los objetivos:\n\n${formatearDatos(objetivos)}`,
    suggested_replies: ["Ver grupo", "Ver proyectos", "Ver semilleros", "Ver líneas de investigación", "Ver plan estratégico", "Ver retos", "Ver visión", "Ver artículos publicados", "Ver noticias", "Ver datos curiosos", "Contacto"]
  });
};

const getRetos = (req, res) => {
  res.json({
    message: `Aquí tienes los retos:\n\n${formatearDatos(retos)}`,
    suggested_replies: ["Ver grupo", "Ver proyectos", "Ver semilleros", "Ver líneas de investigación", "Ver plan estratégico", "Ver objetivos", "Ver visión", "Ver artículos publicados", "Ver noticias", "Ver datos curiosos", "Contacto"]
  });
};

const getVision = (req, res) => {
  res.json({
    message: `Aquí tienes la visión:\n\n${formatearDatos(vision)}`,
    suggested_replies: ["Ver grupo", "Ver proyectos", "Ver semilleros", "Ver líneas de investigación", "Ver plan estratégico", "Ver objetivos", "Ver retos", "Ver artículos publicados", "Ver noticias", "Ver datos curiosos", "Contacto"]
  });
};

const getArticulosPublicados = (req, res) => {
  res.json({
    message: `Aquí tienes la información de los artículos publicados:\n\n${articulosPublicados.map(articulo => formatearArticulo(articulo)).join('\n\n')}`,
    suggested_replies: ["Ver grupo", "Ver proyectos", "Ver semilleros", "Ver líneas de investigación", "Ver plan estratégico", "Ver objetivos", "Ver retos", "Ver visión", "Ver noticias", "Ver datos curiosos", "Contacto"]
  });
};

module.exports = {
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
  getArticulosPublicados // Nuevo controlador exportado
};
