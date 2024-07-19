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

// Funciones para leer y parsear archivos CSV y XLSX
const leerCSV = (ruta, separator, callback) => {
  let datos = [];
  fs.createReadStream(ruta)
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
  proyectosInfo = datos;
});

leerCSV(path.join(__dirname, '../Semilleros.csv'), ';', (datos) => {
  semillerosInfo = datos;
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

// Función para obtener un elemento aleatorio de un array
const obtenerElementoAleatorio = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Función para formatear los datos de manera más legible
const formatearDatos = (datos) => {
  return Object.entries(datos).map(([key, value]) => {
    return `${key}: ${value}`;
  }).join('\n');
};

// Controladores
const getGrupo = (req, res) => {
  res.json({
    message: `Aquí tienes información sobre el grupo de investigación:\n\n${formatearDatos(grupoInfo)}`,
    suggested_replies: ["Más información", "Ver proyectos"]
  });
};

const getProyectos = (req, res) => {
  res.json({
    message: `Aquí tienes información sobre los proyectos:\n\n${proyectosInfo.map(proyecto => formatearDatos(proyecto)).join('\n\n')}`,
    suggested_replies: ["Más información", "Ver semilleros"]
  });
};

const getSemilleros = (req, res) => {
  res.json({
    message: `Aquí tienes información sobre los semilleros:\n\n${semillerosInfo.map(semillero => formatearDatos(semillero)).join('\n\n')}`,
    suggested_replies: ["Más información", "Ver datos de Facebook"]
  });
};

const getFacebookData = (req, res) => {
  res.json({
    message: `Aquí tienes los datos de Facebook:\n\n${datosFacebookSimplificados.map(dato => formatearDatos(dato)).join('\n\n')}`,
    suggested_replies: ["Más información", "Ver noticias de Facebook"]
  });
};

const getNoticiasFacebook = (req, res) => {
  res.json({
    message: `Estas son las noticias que tenemos para ti, por favor visita el enlace para más detalles:\n\n${noticiasFacebook.map(noticia => formatearDatos(noticia)).join('\n\n')}`,
    suggested_replies: ["Más noticias", "Ver curiosidades"]
  });
};

const getCuriosidadAleatoria = (req, res) => {
  const curiosidadAleatoria = obtenerElementoAleatorio(curiosidades);
  res.json({
    message: `Aquí tienes un dato curioso:\n\n${formatearDatos(curiosidadAleatoria)}`,
    suggested_replies: ["Otra curiosidad", "Ver datos de Facebook"]
  });
};

const getRedesSociales = (req, res) => {
  res.json({
    message: `Aquí tienes nuestros enlaces en redes sociales:\n\n${formatearDatos({
      facebook: "https://www.facebook.com/GrupoGALASH",
      instagram: "https://www.instagram.com/grupogalash/",
      linkedin: "https://www.linkedin.com/in/galash-grupo-de-investigaci%C3%B3n/"
    })}`,
    suggested_replies: ["Ver datos de Instagram", "Ver proyectos"]
  });
};

const getInstagramData = (req, res) => {
  res.json({
    message: `Aquí tienes los datos de Instagram:\n\n${datosInstagram.map(dato => formatearDatos(dato)).join('\n\n')}`,
    suggested_replies: ["Más información", "Ver grupo"]
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
  getInstagramData
};
