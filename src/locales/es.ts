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
};

export default translations;
