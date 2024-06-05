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
    "Dwarfium y la API Dwarf están en fase beta. No todas las funciones de la aplicación móvil están presentes todavía. Utilice esta aplicación sólo si se siente cómodo como probador de software beta.",
  pIndexBugsHeader: "Bugs:",
  pIndexBug1: "Puedes enviar tus hallazgos aquí: ",
  pIndexBug2: "",
  pIndexBug3: "",
  pIndexLinkBug: `<a href="https://discord.gg/5vFWbsXDfv"> En nuestro servidor de Discord </a>`,
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
  pAboutDataCreditCodeAnd: "y ",
  pAboutDataCreditCodeAndText: "para realizar cálculos astronómicos.",
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
  pFirstSteps: "Primeros pasos",
  pFirstStepsContent:
    "Utilice la aplicación móvil Dwarf II de Dwarf Labs para tomar fotogramas oscuros, enfocar el telescopio y calibrar ir a",
  pSetLocation: "Escoger localización",
  pSetLocationContent:
    "Para que goto funcione, este sitio necesita su latitud, longitud y zona horaria. La longitud es negativa al oeste de Greenwich",
  pLatitude: "Latitud",
  pLongitude: "Longitud",
  pTimezone: "Zona horaria",
  pUseCurrentLocation: "Usar ubicación actual",
  pEnableSTA: "Habilitar el modo STA en Dwarf II",
  pEnableSTAContent:
    "Para que este sitio se conecte al Dwarf II, el Dwarf II debe tener el modo STA configurado y activado.",
  pEnableSTAContent1:
    "Cuando lo use por primera vez, necesita la aplicación móvil DwarfLab para establecer la conexión, luego, sin reiniciar el enano, conéctese a través del botón Conectar Bluetooth. Luego se guardará la configuración.",
  pEnableSTAContent2:
    "Luego, para los próximos lanzamientos del Dwarf, podrás conectarte directamente a él vía Bluetooth, sin necesidad de utilizar la aplicación móvil.",
  pEnableSTAContent3:
    "Haga clic en Conectar. Este sitio intentará conectarse vía Bluetooth a Dwarf II.",
  pBluetoothPWD: "CONTRASEÑA Bluetooth",
  pConnect: "Conectar",
  pConnectDwarfII: "Conéctate a Dwarf II",
  pConnectDwarfIIContent:
    "Para que este sitio se conecte al Dwarf II, tanto el Dwarf II como el sitio web deben utilizar la misma red wifi.",
  pConnectDwarfIIContent1:
    "Después de reiniciar, primero debes conectarte al DwarfII a través de Bluetooth.",
  pConnectDwarfIIContent2:
    "Luego conéctese con el botón de conexión wifi. Entonces no es necesario utilizar la aplicación para calibrar, realizar Goto y sesión de imágenes desde este sitio web.",
  pConnectDwarfIIContent3:
    "Visite este sitio en un dispositivo que esté conectado a la misma red wifi que el Dwarf II.",
  pConnectDwarfIIContent4:
    "Ingrese IP para el Enano II. Si está utilizando wifi enano, la IP es 192.168.88.1. Si está utilizando el modo STA, utilice la IP de su red wifi.",
  pConnectDwarfIIContent5:
    "Haga clic en Conectar. Este sitio intentará conectarse con Dwarf II.",
  pConnectDwarfIIContent6:
    "Si ve el mensaje: => Transmitir en vivo, ha completado una sesión de imágenes, vaya a la página de la cámara y haga clic en el botón En vivo.",
  pConnectStellarium: "Conéctate a Stellarium",
  pConnectStellariumContent:
    "Para utilizar Stellarium, necesitamos configurar el complemento de control remoto.",
  pConnectStellariumContent1: "Inicie la aplicación de escritorio Stellarium.",
  pConnectStellariumContent2: "El comienzo de este",
  pConnectStellariumContent2_1:
    " demuestra la configuración del complemento de control remoto de Stellarium (0 a 1:40); Sáltate la parte sobre NINA. Haga clic en 'Habilitar CORS para el siguiente origen' e ingrese ' * '.",
  pConnectStellariumContent3:
    "Ingrese la IP y el puerto para el complemento de control remoto y haga clic en 'Conectar'. Este sitio intentará conectarse a Stellarium.",
  pIPAdress: "dirección IP",
  pPort: "Puerto",
  cUnlockHost: "Desbloquear modo anfitrión",
  cLockHost: "Bloquear modo de host",
  pConnectionSuccessFull: "Conexión exitosa.",
  pConnecting: "Conectando...",
  pConnectingFailed: "La conexión falló!",
  cAstroSettingsInfoGain: "Ganancia",
  cAstroSettingsInfoGainDesc:
    "La ganancia es una configuración de la cámara digital que controla la amplificación de la señal del sensor de la cámara. Se debe tener en cuenta que esto amplifica toda la señal, incluido cualquier ruido de fondo asociado.",
  cAstroSettingsInfoExposure: "Exposición",
  cAstroSettingsInfoExposureDesc:
    "Tiempo durante el cual el sensor estará expuesto a la luz y capturará información (energía)",
  cAstroSettingsInfoIRPass: "IR (infrarrojo) - Paso",
  cAstroSettingsInfoIRPassDesc:
    "Permite que la longitud de onda infrarroja llegue al sensor. Varios objetos astronómicos emiten en esta longitud de onda.",
  cAstroSettingsInfoIRCut: "IR (infrarrojo) - Corte",
  cAstroSettingsInfoIRCutDesc:
    "Bloquea la longitud de onda infrarroja. Útil para tomas lunares y planetarias.",
  cAstroSettingsInfoBin1x1: "Binning - 1x1",
  cAstroSettingsInfoBin1x1Desc:
    "La cámara captura luz en cada píxel físico individual.",
  cAstroSettingsInfoBin2x2: "Binning - 2x2",
  cAstroSettingsInfoBin2x2Desc:
    "La cámara combina píxeles físicos en grupos de 2x2 (4 píxeles) y considera toda la luz capturada en el grupo como un solo píxel. Se puede considerar un píxel 'virtual'. Esto hace que el tamaño del píxel sea más grande y reduce la resolución en un factor igual al binning.",
  cAstroSettingsInfoFormatFITS: "Formato - FITS",
  cAstroSettingsInfoFormatFITSDesc:
    "Formato de archivo numérico sin pérdidas para astronomía. Puede incluir metadatos de la imagen (coordenadas, cámara, tamaño del píxel binning, filtro, etc.) que pueden ser utilizados por software de procesamiento.",
  cAstroSettingsInfoFormatTIFF: "Formato - TIFF",
  cAstroSettingsInfoFormatTIFFDesc:
    "Un formato de archivo sin pérdidas, pero no específicamente orientado hacia la astronomía.",
  cAstroSettingsInfoCount: "Contar",
  cAstroSettingsInfoCountDesc: "Número de imágenes a tomar",
  cAstroSettingsInfoBack: "Volver",
  cCameraAddOnPhoto: "Foto",
  cCameraAddOnVideo: "Video",
  cCameraAddOnPanorama: "Panorama",
  cCameraAddOnTimeLapse: "Lapso de tiempo",
  cCameraBurstSettingsCount: "Contar",
  cCameraBurstSettingsinterval: "Intervalo",
  cCameraTitle: "Astro Photos",
  cCameraConnection: "Debes conectar al Dwarf II.",
  cCameraLocation: "Debes establecer tu ubicación.",
  cCalibrationDwarfLights: "Luces",
  cCalibrationDwarfRingOn: "Anillo Encendido",
  cCalibrationDwarfRingOff: "Anillo Apagado",
  cCalibrationDwarfPowerOn: "Encender",
  cCalibrationDwarfPowerOff: "Apagar",
  cCalibrationDwarfTitle: "Calibrar el Dwarf II",
  cCalibrationDwarfTitleDesc:
    "Para usar la función Astro, primero debes calibrar el dwarf II.",
  cCalibrationDwarfWarning: "ADVERTENCIA:",
  cCalibrationDwarfWarningDesc: "No coloques nada en la lente en este momento.",
  CCalibrationDwarfCalibrate: "Calibrar",
  cCalibrationDwarfStopGoto: "Detener Goto",
  cCalibrationDwarfSavePosition: "Guardar Posición",
  cCalibrationDwarfResetPosition: "Reiniciar Posición",
  cCalibrationDwarfGoToPosition: "Ir a la Posición",
  cCalibrationDwarfShutdown: "¡Apagar!",
  cCalibrationDwarfReboot: "¡Reiniciar!",
  cNavHome: "Inicio",
  cNavSetup: "Configuración",
  cNavObjects: "Objetos",
  cNavCamera: "Cámara",
  cNavSessionData: "Datos de Sesión",
  cNavWeather: "Clima",
  cNavClouds: "Nubes",
  cNavMoonphases: "Fases Lunares",
  cNavAstronomyCalendar: "Calendario Astronómico",
  cNavPolarAlignment: "Alineación Polar",
  cNavAbout: "Acerca de",
  cStatusBarExposure: "Exposición",
  cStatusBarIRFilter: "Filtro IR",
  cStatusBarBinning: "Binning",
  cStatusBarCounter: "Contador",
  cStatusBarQuality: "Calidad",
  cStatusBarTaken: "Tomadas:",
  cStatusBarStacked: "Apiladas:",
  cStatusBarTime: "Tiempo:",
  cStatusBarCurTarget: "Objetivo Actual:",
  cThemeSettingsTitle: "Configuración del Tema",
  cThemeSettingsFontSize: "Tamaño de Fuente",
  cThemeSettingsColorTheme: "Tema de Color",
  cThemeSettingsLightTheme: "Tema Claro",
  cThemeSettingsDarkTheme: "Tema Oscuro",
  cThemeSettingsAstroTheme: "Tema Astronómico",
  cThemeSettingsUnderconstruction: "en construcción",
  cThemeSettingsLanguage: "Idioma",
  cThemeSettingsApply: "Aplicar",
  cWeatherInfoLastUpdate: "Última actualización:",
  cWeatherInfoMinTemp: "Temperatura Mínima:",
  cWeatherInfoMaxTemp: "Temperatura Máxima:",
  cWeatherInfoFeelsLike: "Sensación Térmica:",
  cWeatherInfoHumidity: "Humedad:",
  cWeatherInfoWind: "Viento:",
  cGoToListConnectStellarium:
    "Debe conectarse a Stellarium para que el Centro funcione.",
  cGoToListConnectDwarf: "Debe conectarse a Dwarf II para que Goto funcione.",
  cGoToListdefault: "Seleccione listas de objetos",
  cGotoListplanets: "Planetas, Luna y Sol",
  cGotoListSelectObject: "Por favor, seleccione una lista de objetos.",
  cGotoListDSOList: "La lista de DSO tiene objetos que son:",
  cGotoListDSOList1:
    "Grandes (> 15 minutos de arco) y relativamente brillantes (menos de 10 magnitudes). 119 objetos.",
  cGotoListDSOList2:
    "Grandes (> 15 minutos de arco) y brillo desconocido. 84 objetos.",
  cGotoListDSOList3:
    "Pequeños (< 15 minutos de arco), relativamente brillantes (menos de 10 magnitudes), con nombres comunes. 234 objetos.",
  cGotoListDSOList4:
    "118 de las estrellas más brillantes con nombres comunes, con al menos una por constelación.",
  cGotoListDSOList5:
    "La lista de Planetas, Luna y Sol tiene los planetas de nuestro sistema solar con la Luna y el Sol. Tenga en cuenta que Dwarf II no es adecuado para tomar imágenes de los planetas.",
  cGotoListinfo:
    "'Centrar' mostrará el objeto seleccionado en Stellarium. 'Goto' moverá Dwarf II al objeto seleccionado.",
  cGoToStellariumConnectStellarium:
    "Debe conectarse a Stellarium para que Importar datos funcione.",
  cGoToStellariumPickObject:
    "Puede usar Stellarium para ayudar a seleccionar objetos.",
  cGoToStellariumListTitle: "Seleccione un objeto en Stellarium.",
  cGoToStellariumList1:
    "Importe ascensión recta y declinación desde Stellarium haciendo clic en 'Importar datos'.",
  cGoToStellariumList2: "Inicie goto haciendo clic en 'Goto'.",
  cGoToStellariumImportData: "Importar datos",
  cGoToStellariumImportManualData: "Importar datos manuales",
  cGoToStellariumImportModifyData: "Modificar datos",
  cGoToStellariumObject: "Objeto",
  cGoToStellariumRightAscension: "Ascensión recta",
  cGoToStellariumDeclination: "Declinación",
  cGoToStellariumCenter: "Centrar",
  cGoToStellariumMoveCenter: " Puede mover el centro suavemente:",
  cGoToStellariumMoveCenterli1:
    "Haga clic en los botones para mover el centro a",
  cGoToStellariumMoveCenterli2:
    "+/- 1 minuto para ascensión recta, +/- 0.1° para declinación",
  cGoToStellariumMoveCenterli3: "Las coordenadas se actualizarán",
  cGoToStellariumMoveCenterli4:
    "Vuelva a centrar en Stellarium haciendo clic en 'Centrar'",
  cGoToStellariumMoveCenterli5: "Luego inicie goto haciendo clic en 'Goto'",
  cGoToUserListNewList: "Agregar nueva lista",
  cGoToUserListDeleteList: "Eliminar lista",
  cGoToUserListCustomObjectsListInstruction1: `
    Para agregar listas de objetos personalizadas, cree una lista de objetos en 
    <a href="https://telescopius.com">Telescopius</a>, descargue 
    el archivo CSV y haga clic en "Agregar nueva lista".
  `,
  cGoToUserListCustomObjectsListInstruction2:
    "Las listas se almacenan en la base de datos del navegador (localStorage). Dado que los datos se almacenan en su navegador, otros usuarios del sitio no podrán acceder a sus listas.",
  cGoToUserListCustomObjectsListInstruction3:
    "Si desea compartir su lista con otras personas, puede enviarles el archivo CSV de Telescopius.",
  cImportManualModalTitle: "Introducir datos manualmente",
  cImportManualModalObjecTName: "Nombre del objeto",
  cImportObservationListModalTitle: "Agregar lista de objetos",
  cImportObservationListfromTelescopius:
    "Importar lista de objetos desde Telescopius.",
  cImportObservationListListName: "Nombre de la lista",
  cImportObservationImportList: "Importar lista",
  cDeleteObservationListModalTitle: "Eliminar Lista de Objetos",
  cDeleteObservationListConfirm: "¿Estás seguro de que deseas eliminar",
  cDeleteObservationListButton: "Eliminar Lista",
  cMoonphaseCalculatorNewMoon: "Luna Nueva",
  cMoonphaseCalculatorWaxingCrescent: "Luna Creciente",
  cMoonphaseCalculatorFirstQuarter: "Primer Cuarto",
  cMoonphaseCalculatorWaxingGibbous: "Luna Gibosa Creciente",
  cMoonphaseCalculatorFullMoon: "Luna Llena",
  cMoonphaseCalculatorWaningGibbous: "Luna Gibosa Menguante",
  cMoonphaseCalculatorLastQuarter: "Último Cuarto",
  cMoonphaseCalculatorWaningCrescent: "Luna Menguante",
  cMoonphaseCalculatorUnknown: "Desconocido",
  pImageSessionShotsStacked: "Fotos apiladas",
  pImageSessionShotsTaken: "Fotos tomadas",
  pImageSessionNoShootingInfo: "No hay información de disparo disponible",
  pImageSessionNoAdditionalInfo: "No hay información adicional disponible",
  pImageSessionData: "Datos de la sesión",
  pImageSessionSortTable:
    "Puede ordenar la tabla haciendo clic en Objetivo o Fecha",
  pImageSessionPreview: "Vista previa",
  pImageSessionTarget: "Objetivo",
  pImageSessionDate: "Fecha",
  pImageSessionShootingInfo: "Información de disparo",
  pImageSessionAdditionalInfo: "Información adicional",
  pImageSessionAction: "Acción",
  pImageSessionLoading: "Cargando...",
  pImageSessionDownload: "Descargar",
  pMoonphaseSelectMonth: "Selecciona el mes:",
  pObjectsList: "Lists",
  pObjectsCustomsList: "Custom Lists",
  cObjectsIn: " in ",
  "always above horizon": "always above horizon",
  "always below horizon": "always below horizon",
  cObjectsSize: "Size",
  cObjectsMagnitude: "Magnitude",
  cObjectsRises: "Rises",
  cObjectsSets: "Sets",
  cObjectsCenter: "Centrer",
  cObjectsGoto: "Goto",
  cObjectsSearch: "Search",
  cVisibleSkyLimit: "Sky View Limit",
  cSkyLimitHelp1: "Enter the sky view limit values.",
  cSkyLimitHelp2:
    "The format is a comma separated list of fields, each field is the altitude angle value (can be 0) followed by one or more directions separated by a hyphen.",
  cSkyLimitHelp3:
    "Objects will be included if their altitude is greater than or equal to this number for the given list of directions.",
  cSkyLimitHelp4:
    "The list of possible values for the directions is: N-NE-E-SE-S-SW-W-NW.",
  cSkyLimitHelp5:
    "If a direction is missing then we consider that there is no limit for it.",
  cSkyLimitHelp6: "Here is an example of possible values: 20 N-NE, 35 S-SW",
  cSkyLimitHelp7:
    "Use the Visible Tag, to see only the matching objects to your sky view",
  All: "All",
  Favorites: "Favorites",
  Visible: "Visible",
  Clusters: "Clusters",
  Galaxies: "Galaxies",
  Nebulae: "Nebulae",
  Stars: "Stars",
  "Large Dso": "Large Dso",
  "Small Dso": "Small Dso",
  "Tiny Dso": "Tiny Dso",
  Mosaic: "Mosaic",
  Object: "Object",
  Objects: "Objects",
  Star: "Star",
  Galaxy: "Galaxy",
  Cluster: "Cluster",
  Nebula: "Nebula",
  "Dark Nebula": "Dark Nebula",
  "Reflection Nebula": "Reflection Nebula",
  "Planetary Nebula": "Planetary Nebula",
  "Supernova remnant": "Supernova remnant",
  "Association of stars": "Association of stars",
  "Open Cluster": "Open Cluster",
  "Globular Cluster": "Globular Cluster",
  "Star cluster + Nebula": "Star cluster + Nebula",
  "HII Ionized region": "HII Ionized region",
  "Other classification (see object notes)": "Other classification",
  cCloudsChartCloudCover: "Cobertura de nubes (%)",
  cCloudsChartHumidity: "Humedad (%)",
  cCloudsChartWindSpeed: "Velocidad del viento (km/hr)",
  cCloudsChartForecast: "Pronóstico de nubes",
  cCloudsCityInput: "Introduce una ciudad...",
  cCloudsApiKeyInput: "Introduce la clave API",
  cCloudsSearch: "Buscar",
  cCloudsSaveAPIKey: "Guardar clave API",
  pWeatherLoading: "Cargando...",
};

export default translations;
