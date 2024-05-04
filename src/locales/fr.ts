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
    "Ce site web vous permet de contrôler des parties du Dwarf II en utilisant l'API Dwarf.",
  pIndexFeature: "Caractéristiques",
  pIndexFeature1: "1. Liste d'objets avec plus de 850 objets.",
  pIndexFeature2: "2. Importer des listes d'objets depuis Telescopius.",
  pIndexFeature3: "3. Importer des listes de mosaïques depuis Telescopius.",
  pIndexFeature4:
    "4. Se connecter à l'application de planétarium Stellarium pour aider à sélectionner des cibles.",
  pIndexFeature5: "5. Prendre des photos astronomiques.",
  pIndexFeature6: "6. Binning 1x1 pour les photos astronomiques.",
  pIndexClaimer:
    "Ce site web et l'API Dwarf sont en phase bêta. L'API n'a pas encore été officiellement publiée et n'a pas toutes les fonctionnalités de l'application mobile. Par conséquent, cette application a une liste de fonctionnalités très limitée. Utilisez cette application uniquement si vous êtes à l'aise en tant que testeur de logiciels bêta.",
  pIndexBugsHeader: "Bugs :",
  pIndexBug1:
    "L'URL de date interne de Dwarf II ne fonctionne pas dans le navigateur en raison de CORS (http://DWARF_IP:8092/date?date=).",
  pIndexBug2:
    "Pour que cela fonctionne, vous avez besoin du plugin CORS : Access-Control-Allow-Origin sur Chrome.",
  pIndexBug3:
    "Restriction : comme ce site web utilise uniquement le mode http pour communiquer avec le nain, il ne peut pas détecter votre emplacement.",
  pCalendarTitle: "Calendrier Astronomique des Événements Célestes",
  pCalendarYear: "Année Calendaire",
  pAbout: "À propos",
  pAboutInfo:
    "Le projet a été lancé par Wai-Yin Kwan avec l'aide de JC LESAINT. Ce site web est un projet secondaire visant à combiner leur intérêt pour la codification, l'astronomie et l'API Dwarf II. Pour signaler des bugs ou consulter le code source original, visitez son ",
  pAboutDataCredit: "Crédits de Données",
  pAboutDataCreditInfo:
    "Les données des listes d'objets proviennent de plusieurs sources.",
  pAboutDataCreditDSO: "Les données sur le DSO proviennent de ",
  pAboutDataCreditDSOAuth:
    "Le Dr Michael Camilleri, Auckland Astronomical Society, Nouvelle-Zélande, a fourni les noms et tailles d'objets pour le DSO qui sont de 15 minutes d'arc ou plus grands.",
  pAboutDataCreditDSOStars: "Les données sur les étoiles proviennent de ",
  pAboutDataCreditVisual:
    "Les données sur la magnitude visuelle des planètes et de la Lune proviennent de ",
  pAboutDataCreditConstellationData:
    "Les données de constellation proviennent de ",
  pAboutDataCreditJuypterThe: "Le ",
  pAboutDataCreditJuypterText:
    "dans le référentiel GitHub montre les étapes que j'ai prises pour transformer les données brutes en listes d'objets.",
  pAboutDataCreditCode: "Ce site utilise du code provenant de ",
  pAboutUserData: "Données Utilisateur",
  pAboutUserDataDesc:
    "Les informations saisies par les utilisateurs sont stockées dans la base de données du navigateur (localStorage). Comme les données sont stockées dans votre navigateur, les autres utilisateurs du site ne pourront pas accéder à vos données. Cela signifie également que si un utilisateur utilise plusieurs navigateurs ou appareils, les données ne peuvent pas être synchronisées entre différents navigateurs ou appareils.",
  pAboutAdditional: "Sources de Données Supplémentaires",
  pAboutAdditionalWeatherData: "Les données météorologiques sont extraites de ",
  pAboutAdditionalRSSData:
    "Le flux RSS pour les objets du ciel profond est fourni par ",
  pAboutAdditionalWitmotion: "Intégration du capteur Witmotion basée sur ",
  cWitmotionCamera: "Caméra",
  cWitmotionAltitude: "Altitude",
  cWitmotionPolaris1:
    "Pointez le Dwarf II vers Polaris et ajustez l'angle pour correspondre à votre altitude.",
  cWitmotionPolaris2: "Vous devriez voir Polaris au centre de la caméra.",
};

export default translations;
