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
    status: "success",
    messages: [
      {
        text: "Aquí tienes información sobre el grupo de investigación:",
        data: grupoInfo
      }
    ]
  });
};

const getProyectos = (req, res) => {
  res.json({
    status: "success",
    messages: [
      {
        text: "Aquí tienes información sobre los proyectos:",
        data: proyectosInfo
      }
    ]
  });
};

const getSemilleros = (req, res) => {
  res.json({
    status: "success",
    messages: [
      {
        text: "Aquí tienes información sobre los semilleros:",
        data: semillerosInfo
      }
    ]
  });
};

const getFacebookData = (req, res) => {
  res.json({
    status: "success",
    messages: [
      {
        text: "Aquí tienes los datos de Facebook:",
        data: datosFacebookSimplificados
      }
    ]
  });
};

const getNoticiasFacebook = (req, res) => {
  const response = {
    status: "success",
    messages: [
      {
        text: "Estas son las noticias que tenemos para ti, por favor visita el enlace para más detalles",
        data: noticiasFacebook.map(item => ({
          Titulo: item['Título'],
          Descripcion: item['Descripción'],
          Fecha: item['Fecha'],
          EnlacePermanente: item['Enlace permanente']
        }))
      }
    ]
  };
  res.json(response);
};

const getCuriosidadesFacebook = (req, res) => {
  const curiosidadAleatoria = obtenerElementoAleatorio(curiosidadesFacebook);
  const response = {
    status: "success",
    messages: [
      {
        text: "Aquí tienes una curiosidad interesante:",
        data: {
          Titulo: curiosidadAleatoria['Título'],
          Descripcion: curiosidadAleatoria['Descripción'],
          Fecha: curiosidadAleatoria['Fecha'],
          EnlacePermanente: curiosidadAleatoria['Enlace permanente'],
          Imagen: curiosidadAleatoria['Imagen'] || curiosidadAleatoria['Enlace permanente'] // Usa el enlace permanente si no hay imagen
        }
      }
    ]
  };
  res.json(response);
};

const getCuriosidadesSabias = (req, res) => {
  const curiosidadSabiaAleatoria = obtenerElementoAleatorio(curiosidadesSabias);
  const response = {
    status: "success",
    messages: [
      {
        text: "Aquí tienes un dato curioso, ¿Sabías qué?",
        data: {
          Titulo: curiosidadSabiaAleatoria['Título'],
          Descripcion: curiosidadSabiaAleatoria['Descripción'],
          Fecha: curiosidadSabiaAleatoria['Fecha'],
          EnlacePermanente: curiosidadSabiaAleatoria['Enlace permanente'],
          Imagen: curiosidadSabiaAleatoria['Imagen'] || curiosidadSabiaAleatoria['Enlace permanente'] // Usa el enlace permanente si no hay imagen
        }
      }
    ]
  };
  res.json(response);
};

const getRedesSociales = (req, res) => {
  const redesSociales = {
    status: "success",
    messages: [
      {
        text: "Aquí tienes nuestros enlaces en redes sociales:",
        data: {
          facebook: "https://www.facebook.com/GrupoGALASH",
          instagram: "https://www.instagram.com/grupogalash/",
          linkedin: "https://www.linkedin.com/in/galash-grupo-de-investigaci%C3%B3n/"
        }
      }
    ]
  };
  res.json(redesSociales);
};

const getInstagramData = (req, res) => {
  res.json({
    status: "success",
    messages: [
      {
        text: "Aquí tienes los datos de Instagram:",
        data: datosInstagram
      }
    ]
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
