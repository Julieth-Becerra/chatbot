const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const path = require('path');

// Variables para almacenar los datos
let grupoInfo = {};
let proyectosInfo = [];
let semillerosInfo = [];
let datosFacebook = [];
let datosFacebookSimplificados = [];
let datosInstagram = [];
let noticiasFacebook = [];
let curiosidadesFacebook = [];
let curiosidadesSabias = [];

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

const leerXLSX = (ruta, callback) => {
  const workbook = xlsx.readFile(ruta);
  const sheet_name_list = workbook.SheetNames;
  const datos = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  callback(datos);
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
  curiosidadesFacebook = datos.filter(item => item['Descripción'] && item['Descripción'].includes('Curiosidades'));
  curiosidadesSabias = datos.filter(item => item['Descripción'] && item['Descripción'].includes('¿Sabías qué?'));
});

leerXLSX(path.join(__dirname, '../datos_instagram.xlsx'), (datos) => {
  datosInstagram = datos;
});

// Función para obtener un elemento aleatorio de un array
const obtenerElementoAleatorio = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Controladores
const getGrupo = (req, res) => {
  res.json({
    message: "Aquí tienes información sobre el grupo de investigación:",
    data: grupoInfo,
    suggested_replies: ["Más información", "Ver proyectos"]
  });
};

const getProyectos = (req, res) => {
  res.json({
    message: "Aquí tienes información sobre los proyectos:",
    data: proyectosInfo,
    suggested_replies: ["Más información", "Ver semilleros"]
  });
};

const getSemilleros = (req, res) => {
  res.json({
    message: "Aquí tienes información sobre los semilleros:",
    data: semillerosInfo,
    suggested_replies: ["Más información", "Ver datos de Facebook"]
  });
};

const getFacebookData = (req, res) => {
  res.json({
    message: "Aquí tienes los datos de Facebook:",
    data: datosFacebookSimplificados,
    suggested_replies: ["Más información", "Ver noticias de Facebook"]
  });
};

const getNoticiasFacebook = (req, res) => {
  res.json({
    message: "Estas son las noticias que tenemos para ti, por favor visita el enlace para más detalles",
    data: noticiasFacebook.map(item => ({
      Titulo: item['Título'],
      Descripcion: item['Descripción'],
      Fecha: item['Fecha'],
      EnlacePermanente: item['Enlace permanente']
    })),
    suggested_replies: ["Más noticias", "Ver curiosidades"]
  });
};

const getCuriosidadesFacebook = (req, res) => {
  const curiosidadAleatoria = obtenerElementoAleatorio(curiosidadesFacebook);
  res.json({
    message: "Aquí tienes una curiosidad interesante:",
    data: {
      Titulo: curiosidadAleatoria['Título'],
      Descripcion: curiosidadAleatoria['Descripción'],
      Fecha: curiosidadAleatoria['Fecha'],
      EnlacePermanente: curiosidadAleatoria['Enlace permanente'],
      Imagen: curiosidadAleatoria['Imagen'] || curiosidadAleatoria['Enlace permanente']
    },
    suggested_replies: ["Otra curiosidad", "Ver curiosidades sabias"]
  });
};

const getCuriosidadesSabias = (req, res) => {
  const curiosidadSabiaAleatoria = obtenerElementoAleatorio(curiosidadesSabias);
  res.json({
    message: "Aquí tienes un dato curioso, ¿Sabías qué?",
    data: {
      Titulo: curiosidadSabiaAleatoria['Título'],
      Descripcion: curiosidadSabiaAleatoria['Descripción'],
      Fecha: curiosidadSabiaAleatoria['Fecha'],
      EnlacePermanente: curiosidadSabiaAleatoria['Enlace permanente'],
      Imagen: curiosidadSabiaAleatoria['Imagen'] || curiosidadSabiaAleatoria['Enlace permanente']
    },
    suggested_replies: ["Otra curiosidad sabia", "Ver redes sociales"]
  });
};

const getRedesSociales = (req, res) => {
  res.json({
    message: "Aquí tienes nuestros enlaces en redes sociales:",
    data: {
      facebook: "https://www.facebook.com/GrupoGALASH",
      instagram: "https://www.instagram.com/grupogalash/",
      linkedin: "https://www.linkedin.com/in/galash-grupo-de-investigaci%C3%B3n/"
    },
    suggested_replies: ["Ver datos de Instagram", "Ver proyectos"]
  });
};

const getInstagramData = (req, res) => {
  res.json({
    message: "Aquí tienes los datos de Instagram:",
    data: datosInstagram,
    suggested_replies: ["Más información", "Ver grupo"]
  });
};

module.exports = {
  getGrupo,
  getProyectos,
  getSemilleros,
  getFacebookData,
  getNoticiasFacebook,
  getCuriosidadesFacebook,
  getCuriosidadesSabias,
  getRedesSociales,
  getInstagramData
};
