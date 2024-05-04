/* naming schema:
pIndexDescription

p = page
c = component
l = lib

Index = Page name
Description = identifier

*/

const translations = {
  pIndexDescription:
    "Este sitio web te permite controlar partes del Dwarf II utilizando la API Dwarf.",
  pIndexFeature: "Características",
  pIndexFeature1: "1. Lista de objetos con más de 850 objetos.",
  pIndexFeature2: "2. Importar listas de objetos desde Telescopius.",
  pIndexFeature3: "3. Importar listas de mosaicos desde Telescopius.",
  pIndexFeature4:
    "4. Conectar con la aplicación del planetario Stellarium para ayudar a seleccionar objetivos.",
  pIndexFeature5: "5. Tomar fotos astronómicas.",
  pIndexFeature6: "6. Binning 1x1 para fotos astronómicas.",
  pIndexClaimer:
    "Este sitio web y la API Dwarf están en fase beta. La API aún no ha sido lanzada oficialmente, y la API no tiene todas las características de la aplicación móvil, por lo tanto, esta aplicación tiene una lista de características muy limitada. Utilice esta aplicación solo si se siente cómodo siendo probadores de software beta.",
  pIndexBugsHeader: "Bugs:",
  pIndexBug1:
    "La URL de fecha interna de Dwarf II no funciona en el navegador debido a CORS (http://DWARF_IP:8092/date?date=).",
  pIndexBug2:
    "Para que funcione, necesita el complemento CORS: Access-Control-Allow-Origin en Chrome.",
  pIndexBug3:
    "Restricción: como este sitio web solo usa el modo http para comunicarse con el enano, no puede detectar su ubicación.",
  pCalendarTitle: "Calendario Astronómico de Eventos Celestiales",
  pCalendarYear: "Año del Calendario",
  pAbout: "Acerca de",
  pAboutInfo:
    "El proyecto fue iniciado por Wai-Yin Kwan con la ayuda de JC LESAINT. Este sitio web es un proyecto secundario para combinar su interés en la codificación, la astronomía y la API Dwarf II. Para informar errores o ver el código original, visite su ",
  pAboutDataCredit: "Créditos de Datos",
  pAboutDataCreditInfo:
    "Los datos de las listas de objetos provienen de varias fuentes.",
  pAboutDataCreditDSO: "Los datos sobre el DSO provienen de ",
  pAboutDataCreditDSOAuth:
    "El Dr. Michael Camilleri, Auckland Astronomical Society, Nueva Zelanda, proporcionó nombres de objetos y tamaños para el DSO que son de 15 minutos de arco o más grandes.",
  pAboutDataCreditDSOStars: "Los datos sobre las estrellas provienen de ",
  pAboutDataCreditVisual:
    "Los datos sobre la magnitud visual de los planetas y la Luna provienen de ",
  pAboutDataCreditConstellationData: "Los datos de constelación provienen de ",
  pAboutDataCreditJuypterThe: "El ",
  pAboutDataCreditJuypterText:
    "en el repositorio de GitHub muestra los pasos que tomé para transformar los datos sin procesar en las listas de objetos.",
  pAboutDataCreditCode: "Este sitio utiliza código de ",
  pAboutUserData: "Datos de Usuario",
  pAboutUserDataDesc:
    "La información ingresada por los usuarios se almacena en la base de datos del navegador (localStorage). Dado que los datos se almacenan en su navegador, otros usuarios del sitio no podrán acceder a sus datos. Esto también significa que si un usuario utiliza varios navegadores o dispositivos, los datos no pueden sincronizarse entre diferentes navegadores o dispositivos.",
  pAboutAdditional: "Fuentes de Datos Adicionales",
  pAboutAdditionalWeatherData: "Los datos meteorológicos se obtienen de ",
  pAboutAdditionalRSSData:
    "El feed RSS para objetos del cielo profundo es proporcionado por ",
  pAboutAdditionalWitmotion: "Integración del sensor Witmotion basada en ",
  cWitmotionCamera: "Cámara",
  cWitmotionAltitude: "Altitud",
  cWitmotionPolaris1:
    "Apunta el Dwarf II hacia Polaris y ajusta el ángulo para que coincida con tu altitud.",
  cWitmotionPolaris2: "Deberías ver Polaris en el centro de la cámara.",
};

export default translations;
