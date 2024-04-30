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
    "Este sitio web te permite controlar partes del Dwarf II utilizando la API de Dwarf.",
  pIndexFeature: "Características",
  pIndexFeature1: "1. Lista de objetos con más de 850 objetos.",
  pIndexFeature2: "2. Importar listas de objetos desde Telescopius.",
  pIndexFeature3: "3. Importar listas de mosaicos desde Telescopius.",
  pIndexFeature4:
    "4. Conectar con la aplicación del planetario Stellarium para ayudar a seleccionar objetivos.",
  pIndexFeature5: "5. Tomar fotos astronómicas.",
  pIndexFeature6: "6. Binning 1x1 para fotos astronómicas.",
  pIndexClaimer:
    "Este sitio web y la API de Dwarf están en fase beta. La API no ha sido lanzada oficialmente y no tiene todas las características de la aplicación móvil. Por lo tanto, esta aplicación tiene una lista de características muy limitada. Utilice esta aplicación solo si se siente cómodo siendo probador de software beta.",
  pIndexBugsHeader: "Errores:",
  pIndexBug1:
    "La URL interna de fecha del Dwarf II no funciona en el navegador debido a CORS (http://DWARF_IP:8092/date?date=).",
  pIndexBug2:
    "Para hacerlo funcionar, necesitas CORS: Plugin Access-Control-Allow-Origin en Chrome.",
  pIndexBug3:
    "Restricción: como este sitio web utiliza solo el modo http para comunicarse con el enano, no puede detectar su ubicación.",
  pCalendarTitle: "Calendario Astronómico de Eventos Celestiales",
  pCalendarYear: "Año del Calendario",
  pAbout: "Acerca de",
  pAboutInfo:
    "El proyecto fue iniciado por Wai-Yin Kwan con la ayuda de JC LESAINT. Este sitio web es un proyecto secundario para combinar su interés en la codificación, la astronomía y la API de Dwarf II. Para informar errores o ver el código original, visite su ",
  pAboutDataCredit: "Créditos de Datos",
  pAboutDataCreditInfo:
    "Los datos de las listas de objetos provienen de varias fuentes.",
  pAboutDataCreditDSO: "Los datos sobre el DSO provienen de ",
  pAboutDataCreditDSOAuth:
    "El Dr. Michael Camilleri, de la Sociedad Astronómica de Auckland, Nueva Zelanda, proporcionó nombres de objetos y tamaños para el DSO que tienen 15 minutos de arco o más.",
  pAboutDataCreditDSOStars: "Los datos sobre las estrellas provienen de ",
  pAboutDataCreditVisual:
    "Los datos sobre la magnitud visual de los planetas y la Luna provienen de ",
  pAboutDataCreditConstellationData:
    "Los datos de las constelaciones provienen de ",
  pAboutDataCreditJuypterThe: "El ",
  pAboutDataCreditJuypterText:
    "en el repositorio de Github muestra los pasos que tomé para transformar los datos sin procesar en las listas de objetos.",
  pAboutDataCreditCode: "Este sitio utiliza código de ",
  pAboutUserData: "Datos de Usuario",
  pAboutUserDataDesc:
    "La información ingresada por los usuarios se almacena en la base de datos del navegador (localStorage). Dado que los datos se almacenan en su navegador, otros usuarios del sitio no podrán acceder a sus datos. Esto también significa que si un usuario utiliza varios navegadores o dispositivos, los datos no se pueden sincronizar entre diferentes navegadores o dispositivos.",
  pAboutAdditional: "Fuentes de Datos Adicionales",
  pAboutAdditionalWeatherData: "Los datos meteorológicos se obtienen de ",
  pAboutAdditionalRSSData:
    "La fuente RSS para los objetos de cielo profundo es proporcionada por ",
  pAboutAdditionalWitmotion: "Integración del sensor Witmotion basada en ",
};

export default translations;
