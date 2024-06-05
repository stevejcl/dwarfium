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
    "Dwarfium ti permette di controllare il Dwarf II utilizzando il Dwarf API.",
  pIndexFeature: "Caratteristiche",
  pIndexFeature1: "1. Elenco di oggetti con oltre 850 oggetti.",
  pIndexFeature2: "2. Importa elenchi di oggetti da Telescopius.",
  pIndexFeature3: "3. Importa elenchi Mosaic da Telescopius.",
  pIndexFeature4:
    "4. Connettiti all'app Stellarium per aiutarti a selezionare i bersagli.",
  pIndexFeature5: "5. Scatta foto astronomiche.",
  pIndexFeature6: "6. Binning 1x1 per foto astronomiche.",
  pIndexClaimer:
    "Dwarfium e il Dwarf API sono in fase beta. Non tutte le funzionalità dell'app mobile sono ancora presenti. Usa questa app solo se ti senti a tuo agio come beta tester.",
  pIndexBugsHeader: "Bug:",
  pIndexBug1: "Puoi inviare le tue segnalazioni qui: ",
  pIndexBug2: "",
  pIndexBug3: "",
  pIndexLinkBug: `<a href="https://discord.gg/5vFWbsXDfv"> Sul nostro server Discord </a>`,
  pCalendarTitle: "Calendario Astronomico degli Eventi Celesti",
  pCalendarYear: "Anno del Calendario",
  pAbout: "Informazioni",
  pAboutInfo:
    "Il progetto è stato avviato da Wai-Yin Kwan con l'aiuto di JC LESAINT. Dwarfium è un progetto parallelo per combinare il loro interesse per la programmazione, l'astronomia e il Dwarf II API. Per segnalare bug o visualizzare il codice originale, visita il suo ",
  pAboutDataCredit: "Crediti dei Dati",
  pAboutDataCreditInfo:
    "I dati per gli elenchi di oggetti provengono da diverse fonti.",
  pAboutDataCreditDSO: "I dati sugli oggetti DSO provengono da ",
  pAboutDataCreditDSOAuth:
    "Dr. Michael Camilleri, Auckland Astronomical Society, Nuova Zelanda, ha fornito i nomi e le dimensioni degli oggetti DSO che sono più grandi di 15 minuti d'arco.",
  pAboutDataCreditDSOStars: "I dati sulle stelle provengono da ",
  pAboutDataCreditVisual:
    "I dati sulla magnitudine visuale dei pianeti e della Luna provengono da ",
  pAboutDataCreditConstellationData:
    "I dati sulle costellazioni provengono da ",
  pAboutDataCreditJuypterThe: "Il ",
  pAboutDataCreditJuypterText:
    "nel repo Github mostra i passaggi che ho seguito per trasformare i dati grezzi in elenchi di oggetti.",
  pAboutDataCreditCode: "Questo sito utilizza codice da ",
  pAboutDataCreditCodeAnd: "e ",
  pAboutDataCreditCodeAndText: "per eseguire calcoli astronomici.",
  pAboutUserData: "Dati Utente",
  pAboutUserDataDesc:
    "Le informazioni inserite dagli utenti sono memorizzate nel database del browser (localStorage). Poiché i dati sono memorizzati nel tuo browser, altri utenti del sito non saranno in grado di accedere ai tuoi dati. Ciò significa anche che se un utente utilizza più browser o dispositivi, i dati non possono essere sincronizzati tra diversi browser o dispositivi.",
  pAboutAdditional: "Fonti Dati Aggiuntive",
  pAboutAdditionalWeatherData: "I dati meteo sono estratti da ",
  pAboutAdditionalRSSData:
    "Il feed RSS per gli oggetti del cielo profondo è fornito da ",
  pAboutAdditionalWitmotion: "Integrazione del sensore Witmotion basata su ",
  cWitmotionCamera: "Fotocamera",
  cWitmotionAltitude: "Altitudine",
  cWitmotionPolaris1:
    "Punta il Dwarf II verso Polaris e regola l'angolo per adattarlo alla tua altitudine.",
  cWitmotionPolaris2: "Dovresti vedere Polaris al centro della fotocamera.",
  pFirstSteps: "Primi Passi",
  pFirstStepsContent:
    "Usa l'app mobile Dwarf II di Dwarf Labs per scattare fotogrammi scuri, mettere a fuoco il telescopio e calibrare il goto",
  pSetLocation: "Imposta Posizione",
  pSetLocationContent:
    "Affinché il goto funzioni, questo sito ha bisogno della tua latitudine, longitudine e fuso orario. La longitudine è negativa a ovest di Greenwich",
  pLatitude: "Latitudine",
  pLongitude: "Longitudine",
  pTimezone: "Fuso Orario",
  pUseCurrentLocation: "Usa Posizione Attuale",
  pEnableSTA: "Abilita Modalità STA su Dwarf II",
  pEnableSTAContent:
    "Affinché questo sito si connetta al Dwarf II, il Dwarf II deve avere la modalità STA configurata e attiva.",
  pEnableSTAContent1:
    "Quando lo usi per la prima volta, devi utilizzare l'app mobile DwarfLab per stabilire la connessione, poi senza riavviare il Dwarf, connettiti ad esso tramite il pulsante Connect Bluetooth. La configurazione verrà quindi salvata.",
  pEnableSTAContent2:
    "Poi, per i successivi avvii del Dwarf, puoi connetterti direttamente ad esso tramite Bluetooth, senza utilizzare l'app mobile.",
  pEnableSTAContent3:
    "Clicca Connetti. Questo sito tenterà di connettersi via Bluetooth al Dwarf II.",
  pBluetoothPWD: "PASSWORD Bluetooth",
  pConnect: "Connetti",
  pConnectDwarfII: "Connetti al Dwarf II",
  pConnectDwarfIIContent:
    "Affinché questo sito si connetta al Dwarf II, sia il Dwarf II che il sito web devono utilizzare la stessa rete wifi.",
  pConnectDwarfIIContent1:
    "Dopo il riavvio, devi prima connetterti al DwarfII tramite Bluetooth.",
  pConnectDwarfIIContent2:
    "Poi connettiti ad esso con il pulsante di connessione wifi. Poi non è necessario utilizzare l'app per calibrare, fare Goto e sessioni di imaging da questo sito web.",
  pConnectDwarfIIContent3:
    "Visita questo sito su un dispositivo che è connesso alla stessa rete wifi del Dwarf II.",
  pConnectDwarfIIContent4:
    "Inserisci l'IP del Dwarf II. Se stai utilizzando il wifi del Dwarf, l'IP è 192.168.88.1. Se stai utilizzando la modalità STA, utilizza l'IP per la tua rete wifi.",
  pConnectDwarfIIContent5:
    "Clicca Connetti. Questo sito tenterà di connettersi al Dwarf II.",
  pConnectDwarfIIContent6:
    "Se vedi il messaggio: => Go Live, hai una sessione di imaging completata, vai alla pagina Fotocamera e clicca sul pulsante Live.",
  pConnectStellarium: "Connetti a Stellarium",
  pConnectStellariumContent:
    "Per utilizzare Stellarium, dobbiamo configurare il plugin di controllo remoto.",
  pConnectStellariumContent1: "Avvia l'app desktop Stellarium.",
  pConnectStellariumContent2: "L'inizio di questo",
  pConnectStellariumContent2_1:
    " dimostra la configurazione del plugin di controllo remoto di Stellarium (0 a 1:40); salta la parte su NINA. Clicca 'Abilita CORS per la seguente origine' e inserisci ' * '.",
  pConnectStellariumContent3:
    "Inserisci l'IP e la porta per il plugin di controllo remoto e clicca ' Connetti '. Questo sito tenterà di connettersi a Stellarium.",
  pIPAdress: "Indirizzo IP",
  pPort: "Porta",
  cUnlockHost: "Sblocca Modalità Host",
  cLockHost: "Blocca Modalità Host",
  pConnectionSuccessFull: "Connessione riuscita.",
  pConnecting: "Connessione in corso...",
  pConnectingFailed: "Connessione fallita!",
  cAstroSettingsInfoGain: "Guadagno",
  cAstroSettingsInfoGainDesc:
    "Il guadagno è un'impostazione della fotocamera digitale che controlla l'amplificazione del segnale dal sensore della fotocamera. Va notato che questo amplifica l'intero segnale, compreso il rumore di fondo associato.",
  cAstroSettingsInfoExposure: "Esposizione",
  cAstroSettingsInfoExposureDesc:
    "Tempo durante il quale il sensore sarà esposto alla luce e catturerà informazioni (energia)",
  cAstroSettingsInfoIRPass: "IR (infrarosso) - Pass",
  cAstroSettingsInfoIRPassDesc:
    "Permette alla lunghezza d'onda infrarossa di passare, migliorando l'imaging in condizioni di scarsa illuminazione.",
  cAstroSettingsInfoIRCut: "Taglio IR (infrarossi)",
  cAstroSettingsInfoIRCutDesc:
    "Blocca la lunghezza d'onda degli infrarossi. Utile per la Luna e i pianeti.",
  cAstroSettingsInfoBin1x1: "Binning - 1x1",
  cAstroSettingsInfoBin1x1Desc:
    "La fotocamera cattura la luce su ogni singolo pixel fisico.",
  cAstroSettingsInfoBin2x2: "Binning - 2x2",
  cAstroSettingsInfoBin2x2Desc:
    "La fotocamera combina i pixel fisici in gruppi di 2x2 (4 pixel) e considera tutta la luce catturata nel gruppo come un singolo pixel. Può essere considerato un pixel 'virtuale'. Questo rende la dimensione del pixel più grande e riduce la risoluzione di un fattore pari al binning.",
  cAstroSettingsInfoFormatFITS: "Formato - FITS",
  cAstroSettingsInfoFormatFITSDesc:
    "Formato di file numerico senza perdita di qualità per l'astronomia. Può includere i metadati dell'immagine (coordinate, fotocamera, dimensione del pixel, binning, filtro, ecc.) che possono essere utilizzati dal software di elaborazione.",
  cAstroSettingsInfoFormatTIFF: "Formato - TIFF",
  cAstroSettingsInfoFormatTIFFDesc:
    "Un formato di file senza perdita di qualità, ma non specificamente orientato all'astronomia.",
  cAstroSettingsInfoCount: "Conteggio",
  cAstroSettingsInfoCountDesc: "Numero di immagini da scattare",
  cAstroSettingsInfoBack: "Indietro",
  cCameraAddOnPhoto: "Foto",
  cCameraAddOnVideo: "Video",
  cCameraAddOnPanorama: "Panorama",
  cCameraAddOnTimeLapse: "Time Lapse",
  cCameraBurstSettingsCount: "Conteggio",
  cCameraBurstSettingsinterval: "Intervallo",
  cCameraTitle: "Foto Astro",
  cCameraConnection: "Devi connetterti a Dwarf II.",
  cCameraLocation: "Devi impostare la tua posizione.",
  cCalibrationDwarfLights: "Luci",
  cCalibrationDwarfRingOn: "Anello acceso",
  cCalibrationDwarfRingOff: "Anello spento",
  cCalibrationDwarfPowerOn: "Accensione",
  cCalibrationDwarfPowerOff: "Spegnimento",
  cCalibrationDwarfTitle: "Calibra il Dwarf II",
  cCalibrationDwarfTitleDesc:
    "Per utilizzare la funzione Astro, devi prima calibrare il Dwarf II.",
  cCalibrationDwarfWarning: "AVVERTIMENTO:",
  cCalibrationDwarfWarningDesc:
    "non mettere nulla sull'obiettivo in questo momento.",
  CCalibrationDwarfCalibrate: "Calibra",
  cCalibrationDwarfStopGoto: "Ferma Goto",
  cCalibrationDwarfSavePosition: "Salva Posizione",
  cCalibrationDwarfResetPosition: "Reimposta Posizione",
  cCalibrationDwarfGoToPosition: "Vai alla Posizione",
  cCalibrationDwarfShutdown: "Spegnimento!",
  cCalibrationDwarfReboot: "Riavvio!",
  cNavHome: "Home",
  cNavSetup: "Configurazione",
  cNavObjects: "Oggetti",
  cNavCamera: "Fotocamera",
  cNavSessionData: "Dati di sessione",
  cNavWeather: "Meteo",
  cNavClouds: "Nuvole",
  cNavMoonphases: "Fasi lunari",
  cNavAstronomyCalendar: "Calendario astronomico",
  cNavPolarAlignment: "Allineamento polare",
  cNavAbout: "Informazioni",
  cStatusBarExposure: "Esposizione",
  cStatusBarIRFilter: "Filtro IR",
  cStatusBarBinning: "Binning",
  cStatusBarCounter: "Contatore",
  cStatusBarQuality: "Qualità",
  cStatusBarTaken: "Scattate:",
  cStatusBarStacked: "Stacked:",
  cStatusBarTime: "Tempo:",
  cStatusBarCurTarget: "Obiettivo attuale:",
  cThemeSettingsTitle: "Impostazioni tema",
  cThemeSettingsFontSize: "Dimensione del carattere",
  cThemeSettingsColorTheme: "Tema colore",
  cThemeSettingsLightTheme: "Tema chiaro",
  cThemeSettingsDarkTheme: "Tema scuro",
  cThemeSettingsAstroTheme: "Tema Astro",
  cThemeSettingsUnderconstruction: "in costruzione",
  cThemeSettingsLanguage: "Lingua",
  cThemeSettingsApply: "Applica",
  cWeatherInfoLastUpdate: "Ultimo aggiornamento:",
  cWeatherInfoMinTemp: "Temp min:",
  cWeatherInfoMaxTemp: "Temp max:",
  cWeatherInfoFeelsLike: "Percepita:",
  cWeatherInfoHumidity: "Umidità:",
  cWeatherInfoWind: "Vento:",
  cGoToListConnectStellarium:
    "Devi connetterti a Stellarium perché Center funzioni.",
  cGoToListConnectDwarf: "Devi connetterti a Dwarf II perché Goto funzioni.",
  cGoToListdefault: "Seleziona elenchi di oggetti",
  cGotoListplanets: "Pianeti, Luna e Sole",
  cGotoListSelectObject: "Seleziona un elenco di oggetti.",
  cGotoListDSOList: "L'elenco DSO contiene oggetti che sono:",
  cGotoListDSOList1:
    "Grandi (> 15 primi d'arco) e relativamente luminosi (sotto magnitudine 10). 119 oggetti.",
  cGotoListDSOList2:
    "Grandi (> 15 primi d'arco) e luminosità sconosciuta. 84 oggetti.",
  cGotoListDSOList3:
    "Piccoli (< 15 primi d'arco), relativamente luminosi (sotto magnitudine 10), con nomi comuni. 234 oggetti.",
  cGotoListDSOList4:
    "118 delle stelle più luminose con nomi comuni, con almeno una per costellazione.",
  cGotoListDSOList5:
    "L'elenco Pianeti, Luna e Sole contiene i pianeti del nostro sistema solare con la Luna e il Sole. Tieni presente che Dwarf II non è adatto per scattare immagini dei pianeti.",
  cGotoListinfo:
    "'Center' mostrerà l'oggetto selezionato in Stellarium. 'Goto' sposterà Dwarf II sull'oggetto selezionato.",
  cGoToStellariumConnectStellarium:
    "Devi connetterti a Stellarium perché Import Data funzioni.",
  cGoToStellariumPickObject:
    "Puoi utilizzare Stellarium per aiutarti a scegliere gli oggetti.",
  cGoToStellariumListTitle: "Seleziona un oggetto in Stellarium.",
  cGoToStellariumList1:
    "Importa ascensione retta e declinazione da Stellarium facendo clic su 'Import Data'.",
  cGoToStellariumList2: "Avvia goto facendo clic su 'Goto'",
  cGoToStellariumImportData: "Importa dati",
  cGoToStellariumImportManualData: "Importa dati manuali",
  cGoToStellariumImportModifyData: "Modifica dati",
  cGoToStellariumObject: "Oggetto",
  cGoToStellariumRightAscension: "Ascensione Retta",
  cGoToStellariumDeclination: "Declinazione",
  cGoToStellariumCenter: "Centra",
  cGoToStellariumMoveCenter: " Puoi spostare delicatamente il centro:",
  cGoToStellariumMoveCenterli1: "Clicca sui pulsanti per spostare il centro di",
  cGoToStellariumMoveCenterli2:
    "+/- 1 min per ascensione retta, +/- 0.1° per declinazione",
  cGoToStellariumMoveCenterli3: "Le coordinate verranno aggiornate",
  cGoToStellariumMoveCenterli4: "Ricalibra in Stellarium cliccando 'Centra'",
  cGoToStellariumMoveCenterli5: "Poi inizia goto cliccando 'Goto'",
  cGoToUserListNewList: "Aggiungi nuova lista",
  cGoToUserListDeleteList: "Elimina lista",
  cGoToUserListCustomObjectsListInstruction1: `
  Per aggiungere liste di oggetti personalizzate, crea una lista di oggetti su
  <a href="https://telescopius.com">Telescopius</a>, scarica
  il CSV e clicca su "Aggiungi nuova lista".
`,
  cGoToUserListCustomObjectsListInstruction2:
    "Le liste sono memorizzate nel database del browser (localStorage). Poiché i dati sono memorizzati nel tuo browser, altri utenti del sito non potranno accedere alle tue liste.",
  cGoToUserListCustomObjectsListInstruction3:
    "Se desideri condividere la tua lista con altre persone, puoi inviare loro il CSV da Telescopius.",
  cImportManualModalTitle: "Inserisci dati manuali",
  cImportManualModalObjecTName: "Nome oggetto",
  cImportObservationListModalTitle: "Aggiungi lista oggetti",
  cImportObservationListfromTelescopius:
    "Importa lista oggetti da Telescopius.",
  cImportObservationListListName: "Nome della lista",
  cImportObservationImportList: "Importa lista",
  cDeleteObservationListModalTitle: "Elimina lista oggetti",
  cDeleteObservationListConfirm: "Sei sicuro di voler eliminare",
  cDeleteObservationListButton: "Elimina lista",
  cMoonphaseCalculatorNewMoon: "Luna nuova",
  cMoonphaseCalculatorWaxingCrescent: "Crescente",
  cMoonphaseCalculatorFirstQuarter: "Primo quarto",
  cMoonphaseCalculatorWaxingGibbous: "Gibbosa crescente",
  cMoonphaseCalculatorFullMoon: "Luna piena",
  cMoonphaseCalculatorWaningGibbous: "Gibbosa calante",
  cMoonphaseCalculatorLastQuarter: "Ultimo quarto",
  cMoonphaseCalculatorWaningCrescent: "Calante",
  cMoonphaseCalculatorUnknown: "Sconosciuto",
  pImageSessionShotsStacked: "Scatti Stacked",
  pImageSessionShotsTaken: "Scatti effettuati",
  pImageSessionNoShootingInfo: "Nessuna informazione sugli scatti disponibile",
  pImageSessionNoAdditionalInfo: "Nessuna informazione aggiuntiva disponibile",
  pImageSessionData: "Dati di sessione",
  pImageSessionSortTable:
    "Puoi ordinare la tabella cliccando su Obiettivo o Data",
  pImageSessionPreview: "Anteprima",
  pImageSessionTarget: "Obiettivo",
  pImageSessionDate: "Data",
  pImageSessionShootingInfo: "Informazioni sugli scatti",
  pImageSessionAdditionalInfo: "Informazioni aggiuntive",
  pImageSessionAction: "Azione",
  pImageSessionLoading: "Caricamento...",
  pImageSessionDownload: "Scarica",
  pMoonphaseSelectMonth: "Seleziona mese:",
  pObjectsList: "Liste",
  pObjectsCustomsList: "Liste personalizzate",
  cObjectsIn: " in ",
  "always above horizon": "sempre sopra l'orizzonte",
  "always below horizon": "sempre sotto l'orizzonte",
  cObjectsSize: "Dimensione",
  cObjectsMagnitude: "Magnitudine",
  cObjectsRises: "Sorge",
  cObjectsSets: "Tramonta",
  cObjectsCenter: "Centra",
  cObjectsGoto: "Vai a",
  cObjectsSearch: "Cerca",
  cVisibleSkyLimit: "Limite di visibilità del cielo",
  cSkyLimitHelp1: "Inserisci i valori del limite di visibilità del cielo.",
  cSkyLimitHelp2:
    "Il formato è un elenco di campi separati da virgola, ogni campo è il valore dell'angolo di altitudine (può essere 0) seguito da una o più direzioni separate da un trattino.",
  cSkyLimitHelp3:
    "Gli oggetti saranno inclusi se la loro altitudine è maggiore o uguale a questo numero per la lista delle direzioni data.",
  cSkyLimitHelp4:
    "La lista dei valori possibili per le direzioni è: N-NE-E-SE-S-SW-W-NW.",
  cSkyLimitHelp5:
    "Se manca una direzione, consideriamo che non ci sia alcun limite per essa.",
  cSkyLimitHelp6: "Ecco un esempio di valori possibili: 20 N-NE, 35 S-SW",
  cSkyLimitHelp7:
    "Usa il tag Visibile per vedere solo gli oggetti che corrispondono alla tua visione del cielo",
  All: "Tutti",
  Favorites: "Preferiti",
  Visible: "Visibili",
  Clusters: "Ammassi",
  Galaxies: "Galassie",
  Nebulae: "Nebulose",
  Stars: "Stelle",
  "Large Dso": "DSO Grandi",
  "Small Dso": "DSO Piccoli",
  "Tiny Dso": "DSO Minuscoli",
  Mosaic: "Mosaico",
  Object: "Oggetto",
  Objects: "Oggetti",
  Star: "Stella",
  Galaxy: "Galassia",
  Cluster: "Ammasso",
  Nebula: "Nebulosa",
  "Dark Nebula": "Nebulosa Oscura",
  "Reflection Nebula": "Nebulosa a Riflessione",
  "Planetary Nebula": "Nebulosa Planetaria",
  "Supernova remnant": "Resto di Supernova",
  "Association of stars": "Associazione di Stelle",
  "Open Cluster": "Ammasso Aperto",
  "Globular Cluster": "Ammasso Globulare",
  "Star cluster + Nebula": "Ammasso di Stelle + Nebulosa",
  "HII Ionized region": "Regione Ionizzata HII",
  "Other classification (see object notes)": "Altra classificazione",
  cCloudsChartCloudCover: "Copertura nuvolosa (%)",
  cCloudsChartHumidity: "Umidità (%)",
  cCloudsChartWindSpeed: "Velocità del vento (km/h)",
  cCloudsChartForecast: "Previsione delle nuvole",
  cCloudsCityInput: "Inserisci una città...",
  cCloudsApiKeyInput: "Inserisci la chiave API",
  cCloudsSearch: "Cerca",
  cCloudsSaveAPIKey: "Salva chiave API",
  pWeatherLoading: "Caricamento...",
};

export default translations;
