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
  pAboutDataCreditCodeAnd: "et ",
  pAboutDataCreditCodeAndText: "pour effectuer des calculs astronomiques",
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
  pFirstSteps: "Premiers pas",
  pFirstStepsContent:
    "Utilisez l'application mobile Dwarf II de Dwarf Labs pour prendre des images sombres, focaliser la lunette et calibrer Goto.",
  pSetLocation: "Définir l'emplacement",
  pSetLocationContent:
    "Pour que goto fonctionne, ce site a besoin de votre latitude, longitude et fuseau horaire. La longitude est négative à l’ouest de Greenwich",
  pLatitude: "Latitude",
  pLongitude: "Longitude",
  pTimezone: "Fuseau horaire",
  pUseCurrentLocation: "l'emplacement Actuel",
  pEnableSTA: "Activer le mode STA sur Dwarf II",
  pEnableSTAContent:
    "Pour que ce site se connecte au Dwarf II, le Dwarf II doit avoir le mode STA configuré et activé.",
  pEnableSTAContent1:
    "Lors de la première utilisation, vous avez besoin de l'application mobile DwarfLab pour établir la connexion, puis sans redémarrer le nain, connectez-vous à celui-ci via le bouton Connecter Bluetooth. La configuration sera alors enregistrée.",
  pEnableSTAContent2:
    "Ensuite, pour les prochains démarrages du Dwarf, vous pourrez vous y connecter directement via Bluetooth, sans utiliser l'application mobile.",
  pEnableSTAContent3:
    "Cliquez sur Connecter. Ce site tentera de se connecter via Bluetooth au Dwarf II.",
  pBluetoothPWD: "MOT DE PASSE Bluetooth",
  pConnect: "Connecter",
  pConnectDwarfII: "Connectez-vous à Dwarf II",
  pConnectDwarfIIContent:
    "Pour que ce site se connecte au Dwarf II, le Dwarf II et le site Web doivent utiliser le même réseau wifi.",
  pConnectDwarfIIContent1:
    "Après le redémarrage, vous devez d'abord vous connecter au DwarfII via Bluetooth.",
  pConnectDwarfIIContent2:
    "Connectez-vous ensuite à celui-ci grâce au bouton de connexion wifi. Alors pas besoin d'utiliser l'application pour calibrer, créer Goto et Imaging Session à partir de ce site Web.",
  pConnectDwarfIIContent3:
    "Visitez ce site sur un appareil connecté au même réseau wifi que le Dwarf II.",
  pConnectDwarfIIContent4:
    "Entrez en IP pour le Dwarf II. Si vous utilisez le wifi Dwarf, l'adresse IP est 192.168.88.1. Si vous utilisez le mode STA, utilisez l'IP de votre réseau wifi.",
  pConnectDwarfIIContent5:
    "Cliquez sur Connecter. Ce site va essayer de se connecter à Dwarf II.",
  pConnectDwarfIIContent6:
    "Si vous voyez le message : => Go Live, vous avez terminé une session d'imagerie, accédez à la page Caméra et cliquez sur le bouton Live.",
  pConnectStellarium: "Connectez-vous à Stellarium",
  pConnectStellariumContent:
    "Pour utiliser Stellarium, nous devons configurer le plugin Remote Control.",
  pConnectStellariumContent1: "Démarrez l'application de bureau Stellarium.",
  pConnectStellariumContent2: "Le début de ceci",
  pConnectStellariumContent2_1:
    " montre la configuration du plugin Remote Control de Stellarium (0 à 1:40) ; sautez la partie sur NINA. Cliquez sur « Activer CORS pour l'origine suivante » et saisissez « * ».",
  pConnectStellariumContent3:
    "Entrez l'IP et le port du plugin Remote Control, puis cliquez sur « Connecter ». Ce site tentera de se connecter à Stellarium.",
  pIPAdress: "adresse IP",
  pPort: "Port",
  cUnlockHost: "Déverrouiller le mode hôte",
  cLockHost: "Verrouiller le mode hôte",
  pConnectionSuccessFull: "Connexion réussie.",
  pConnecting: "De liaison...",
  pConnectingFailed: "La connexion a échoué!",
  cAstroSettingsInfoGain: "Gain",
  cAstroSettingsInfoGainDesc:
    "Le gain est un paramètre de l'appareil photo numérique qui contrôle l'amplification du signal provenant du capteur de l'appareil photo. Il convient de noter que cela amplifie l'ensemble du signal, y compris tout bruit de fond associé.",
  cAstroSettingsInfoExposure: "Exposition",
  cAstroSettingsInfoExposureDesc:
    "Temps pendant lequel le capteur sera exposé à la lumière et capturera des informations (énergie)",
  cAstroSettingsInfoIRPass: "IR (infrarouge) - Passer",
  cAstroSettingsInfoIRPassDesc:
    "Permet à la longueur d'onde infrarouge d'atteindre le capteur. Plusieurs objets astronomiques émettent dans cette longueur d'onde.",
  cAstroSettingsInfoIRCut: "IR (infrarouge) - Couper",
  cAstroSettingsInfoIRCutDesc:
    "Bloque la longueur d'onde infrarouge. Utile pour les prises de vue lunaires et planétaires.",
  cAstroSettingsInfoBin1x1: "Binning - 1x1",
  cAstroSettingsInfoBin1x1Desc:
    "L'appareil photo capture la lumière sur chaque pixel physique individuel.",
  cAstroSettingsInfoBin2x2: "Binning - 2x2",
  cAstroSettingsInfoBin2x2Desc:
    "L'appareil photo combine des pixels physiques en groupes de 2x2 (4 pixels) et considère toute la lumière capturée dans le groupe comme un seul pixel. Peut être considéré comme un pixel 'virtuel'. Cela rend la taille des pixels plus grande et réduit la résolution d'un facteur égal au binning.",
  cAstroSettingsInfoFormatFITS: "Format - FITS",
  cAstroSettingsInfoFormatFITSDesc:
    "Format de fichier numérique astronomique sans perte. Peut inclure des métadonnées de l'image (coordonnées, appareil photo, taille de pixel binning, filtre, etc.) pouvant être utilisées par un logiciel de traitement.",
  cAstroSettingsInfoFormatTIFF: "Format - TIFF",
  cAstroSettingsInfoFormatTIFFDesc:
    "Un format de fichier sans perte, mais pas spécifiquement orienté vers l'astronomie.",
  cAstroSettingsInfoCount: "Compter",
  cAstroSettingsInfoCountDesc: "Nombre d'images à prendre",
  cAstroSettingsInfoBack: "Retour",
  cCameraAddOnPhoto: "Photo",
  cCameraAddOnVideo: "Vidéo",
  cCameraAddOnPanorama: "Panorama",
  cCameraAddonTimeLapse: "Time-lapse",
  cCameraBurstSettingsCount: "Compter",
  cCameraBurstSettingsinterval: "Intervalle",
  cCameraTitle: "Astro Photos",
  cCameraConnection: "Vous devez vous connecter au Dwarf II.",
  cCameraLocation: "Vous devez définir votre emplacement.",
  cCalibrationDwarfLights: "Lumières",
  cCalibrationDwarfRingOn: "Anneau Allumé",
  cCalibrationDwarfRingOff: "Anneau Éteint",
  cCalibrationDwarfPowerOn: "Allumer",
  cCalibrationDwarfPowerOff: "Éteindre",
  cCalibrationDwarfTitle: "Calibrer le Dwarf II",
  cCalibrationDwarfTitleDesc:
    "Pour utiliser la fonction Astro, vous devez d'abord calibrer le Dwarf II.",
  cCalibrationDwarfWarning: "AVERTISSEMENT:",
  cCalibrationDwarfWarningDesc: "Ne mettez rien sur l'objectif à ce moment.",
  CCalibrationDwarfCalibrate: "Calibrer",
  cCalibrationDwarfStopGoto: "Arrêter Goto",
  cCalibrationDwarfSavePosition: "Enregistrer la Position",
  cCalibrationDwarfResetPosition: "Réinitialiser la Position",
  cCalibrationDwarfGoToPosition: "Aller à la Position",
  cCalibrationDwarfShutdown: "Arrêt!",
  cCalibrationDwarfReboot: "Redémarrer!",
  cNavHome: "Accueil",
  cNavSetup: "Configuration",
  cNavObjects: "Objets",
  cNavCamera: "Caméra",
  cNavSessionData: "Données de Session",
  cNavWeather: "Météo",
  cNavClouds: "Nuages",
  cNavMoonphases: "Phases Lunaires",
  cNavAstronomyCalendar: "Calendrier Astronomique",
  cNavPolarAlignment: "Alignement Polaire",
  cNavAbout: "À Propos",
  cStatusBarExposure: "Exposition",
  cStatusBarIRFilter: "Filtre IR",
  cStatusBarBinning: "Groupement",
  cStatusBarCounter: "Compteur",
  cStatusBarQuality: "Qualité",
  cStatusBarTaken: "Prises:",
  cStatusBarStacked: "Empilées:",
  cStatusBarTime: "Temps:",
  cStatusBarCurTarget: "Cible Actuelle:",
  cThemeSettingsTitle: "Paramètres du Thème",
  cThemeSettingsFontSize: "Taille de Police",
  cThemeSettingsColorTheme: "Thème de Couleur",
  cThemeSettingsLightTheme: "Thème Clair",
  cThemeSettingsDarkTheme: "Thème Sombre",
  cThemeSettingsAstroTheme: "Thème Astronomique",
  cThemeSettingsUnderconstruction: "en construction",
  cThemeSettingsLanguage: "Langue",
  cThemeSettingsApply: "Appliquer",
  cWeatherInfoLastUpdate: "Dernière mise à jour :",
  cWeatherInfoMinTemp: "Température Min. :",
  cWeatherInfoMaxTemp: "Température Max. :",
  cWeatherInfoFeelsLike: "Ressenti :",
  cWeatherInfoHumidity: "Humidité :",
  cWeatherInfoWind: "Vent :",
  cGoToListConnectStellarium:
    "Vous devez vous connecter à Stellarium pour que le Centre fonctionne.",
  cGoToListConnectDwarf:
    "Vous devez vous connecter à Dwarf II pour que Goto fonctionne.",
  cGoToListdefault: "Sélectionner des listes d'objets",
  cGotoListplanets: "Planètes, Lune et Soleil",
  cGotoListSelectObject: "Veuillez sélectionner une liste d'objets.",
  cGotoListDSOList: "La liste des DSO contient des objets qui sont :",
  cGotoListDSOList1:
    "Grands (> 15 minutes d'arc) et relativement lumineux (moins de 10 magnitudes). 119 objets.",
  cGotoListDSOList2:
    "Grands (> 15 minutes d'arc) et de luminosité inconnue. 84 objets.",
  cGotoListDSOList3:
    "Petits (< 15 minutes d'arc), relativement lumineux (moins de 10 magnitudes), avec des noms courants. 234 objets.",
  cGotoListDSOList4:
    "118 des étoiles les plus brillantes avec des noms courants, avec au moins une par constellation.",
  cGotoListDSOList5:
    "La liste des Planètes, Lune et Soleil contient les planètes de notre système solaire avec la Lune et le Soleil. Notez que Dwarf II n'est pas adapté pour prendre des images des planètes.",
  cGotoListinfo:
    "'Centrer' affichera l'objet sélectionné dans Stellarium. 'Goto' déplacera Dwarf II vers l'objet sélectionné.",
  cGoToStellariumConnectStellarium:
    "Vous devez vous connecter à Stellarium pour que l'importation de données fonctionne.",
  cGoToStellariumPickObject:
    "Vous pouvez utiliser Stellarium pour aider à sélectionner des objets.",
  cGoToStellariumListTitle: "Sélectionnez un objet dans Stellarium.",
  cGoToStellariumList1:
    "Importez l'ascension droite et la déclinaison depuis Stellarium en cliquant sur 'Importer des données'.",
  cGoToStellariumList2: "Démarrez le goto en cliquant sur 'Goto'.",
  cGoToStellariumImportData: "Importer des données",
  cGoToStellariumImportManualData: "Importer des données manuelles",
  cGoToStellariumObject: "Objet",
  cGoToStellariumRightAscension: "Ascension droite",
  cGoToStellariumDeclination: "Déclinaison",
  cGoToStellariumCenter: "Centrer",
  cGoToStellariumMoveCenter: " Vous pouvez déplacer le centre en douceur :",
  cGoToStellariumMoveCenterli1:
    "Cliquez sur les boutons pour déplacer le centre vers",
  cGoToStellariumMoveCenterli2:
    "+/- 1 minute pour l'ascension droite, +/- 0.1° pour la déclinaison",
  cGoToStellariumMoveCenterli3: "Les coordonnées seront mises à jour",
  cGoToStellariumMoveCenterli4:
    "Re-centrez dans Stellarium en cliquant sur 'Centrer'",
  cGoToStellariumMoveCenterli5: "Puis démarrez goto en cliquant sur 'Goto'",
  cGoToUserListNewList: "Ajouter une nouvelle liste",
  cGoToUserListDeleteList: "Supprimer la liste",
  cGoToUserListCustomObjectsListInstruction1: `
    Pour ajouter des listes d'objets personnalisées, créez une liste d'objets sur 
    <a href="https://telescopius.com">Telescopius</a>, téléchargez 
    le fichier CSV et cliquez sur "Ajouter une nouvelle liste".
  `,
  cGoToUserListCustomObjectsListInstruction2:
    "Les listes sont stockées dans la base de données du navigateur (localStorage). Étant donné que les données sont stockées dans votre navigateur, les autres utilisateurs du site ne pourront pas accéder à vos listes.",
  cGoToUserListCustomObjectsListInstruction3:
    "Si vous souhaitez partager votre liste avec d'autres personnes, vous pouvez leur envoyer le fichier CSV de Telescopius.",
  cImportManualModalTitle: "Entrer des données manuellement",
  cImportManualModalObjecTName: "Nom de l'objet",
  cImportObservationListModalTitle: "Agregar lista de objetos",
  cImportObservationListfromTelescopius:
    "Importar lista de objetos desde Telescopius.",
  cImportObservationListListName: "Nombre de la lista",
  cImportObservationImportList: "Importar lista",
  cMoonphaseCalculatorNewMoon: "Nouvelle Lune",
  cMoonphaseCalculatorWaxingCrescent: "Croissant de Lune",
  cMoonphaseCalculatorFirstQuarter: "Premier Quartier",
  cMoonphaseCalculatorWaxingGibbous: "Lune Gibbeuse Croissante",
  cMoonphaseCalculatorFullMoon: "Pleine Lune",
  cMoonphaseCalculatorWaningGibbous: "Lune Gibbeuse Décroissante",
  cMoonphaseCalculatorLastQuarter: "Dernier Quartier",
  cMoonphaseCalculatorWaningCrescent: "Croissant de Lune",
  cMoonphaseCalculatorUnknown: "Inconnu",
  pImageSessionShotsStacked: "Prises empilées",
  pImageSessionShotsTaken: "Prises de vue",
  pImageSessionNoShootingInfo: "Aucune information de prise de vue disponible",
  pImageSessionNoAdditionalInfo: "Aucune information supplémentaire disponible",
  pImageSessionData: "Données de session",
  pImageSessionSortTable:
    "Vous pouvez trier le tableau en cliquant sur Cible ou Date",
  pImageSessionPreview: "Aperçu",
  pImageSessionTarget: "Cible",
  pImageSessionDate: "Date",
  pImageSessionShootingInfo: "Informations de prise de vue",
  pImageSessionAdditionalInfo: "Informations supplémentaires",
  pImageSessionAction: "Action",
  pImageSessionLoading: "Chargement...",
  pImageSessionDownload: "Télécharger",
  pMoonphaseSelectMonth: "Sélectionnez le mois :",
  
};

export default translations;
