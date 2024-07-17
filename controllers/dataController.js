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
    mensaje: "Aquí tienes información sobre el grupo de investigación:",
    grupo: grupoInfo
  });
};

const getProyectos = (req, res) => {
  res.json({
    mensaje: "Aquí tienes información sobre los proyectos:",
    proyectos: proyectosInfo
  });
};

const getSemilleros = (req, res) => {
  res.json({
    mensaje: "Aquí tienes información sobre los semilleros:",
    semilleros: semillerosInfo
  });
};

const getFacebookData = (req, res) => {
  res.json({
    mensaje: "Aquí tienes los datos de Facebook:",
    datos_facebook: datosFacebookSimplificados
  });
};

const getNoticiasFacebook = (req, res) => {
  const response = {
    mensaje: "Estas son las noticias que tenemos para ti, por favor visita el enlace para más detalles",
    noticias: noticiasFacebook.map(item => ({
      Titulo: item['Título'],
      Descripcion: item['Descripción'],
      Fecha: item['Fecha'],
      EnlacePermanente: item['Enlace permanente']
    }))
  };
  res.json(response);
};

const getCuriosidadesFacebook = (req, res) => {
  const curiosidadAleatoria = obtenerElementoAleatorio(curiosidadesFacebook);
  const response = {
    mensaje: "Aquí tienes una curiosidad interesante:",
    curiosidad: {
      Titulo: curiosidadAleatoria['Título'],
      Descripcion: curiosidadAleatoria['Descripción'],
      Fecha: curiosidadAleatoria['Fecha'],
      EnlacePermanente: curiosidadAleatoria['Enlace permanente']
    }
  };
  res.json(response);
};

const getCuriosidadesSabias = (req, res) => {
  const curiosidadSabiaAleatoria = obtenerElementoAleatorio(curiosidadesSabias);
  const response = {
    mensaje: "Aquí tienes un dato curioso, ¿Sabías qué?",
    curiosidad_sabia: {
      Titulo: curiosidadSabiaAleatoria['Título'],
      Descripcion: curiosidadSabiaAleatoria['Descripción'],
      Fecha: curiosidadSabiaAleatoria['Fecha'],
      EnlacePermanente: curiosidadSabiaAleatoria['Enlace permanente']
    }
  };
  res.json(response);
};

const getRedesSociales = (req, res) => {
  const redesSociales = {
    mensaje: "Aquí tienes nuestros enlaces en redes sociales:",
    facebook: "https://www.facebook.com/GrupoGALASH",
    instagram: "https://www.instagram.com/grupogalash/",
    linkedin: "https://www.linkedin.com/in/galash-grupo-de-investigaci%C3%B3n/"
    // Agrega más redes sociales si es necesario
  };
  res.json(redesSociales);
};

const getInstagramData = (req, res) => {
  res.json({
    mensaje: "Aquí tienes los datos de Instagram:",
    datos_instagram: datosInstagram
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
