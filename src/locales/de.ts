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
    "Diese Website ermöglicht es euch, Teile des Dwarf II mithilfe der Dwarf-API zu steuern.",
  pIndexFeature: "Funktionen",
  pIndexFeature1: "1. Objektliste mit über 850 Objekten.",
  pIndexFeature2: "2. Importieren von Objektlisten aus Telescopius.",
  pIndexFeature3: "3. Importieren von Mosaiklisten aus Telescopius.",
  pIndexFeature4:
    "4. Verbinden mit der Stellarium-Planetarium-App, um Ziele auszuwählen.",
  pIndexFeature5: "5. Astrofotos machen.",
  pIndexFeature6: "6. 1x1 Binning für Astrofotos.",
  pIndexClaimer:
    "Diese Website und die Dwarf-API befinden sich in der Beta-Phase. Die API wurde noch nicht offiziell veröffentlicht, und die API verfügt nicht über alle Funktionen der mobilen App. Daher verfügt diese App über eine sehr begrenzte Liste von Funktionen. Verwenden Sie diese App nur, wenn Sie sich mit dem Testen von Beta-Software wohl fühlen.",
  pIndexBugsHeader: "Fehler:",
  pIndexBug1:
    "Die interne Datums-URL von Dwarf II funktioniert im Browser aufgrund von CORS nicht (http://DWARF_IP:8092/date?date=).",
  pIndexBug2:
    "Hierfür wird CORS: Access-Control-Allow-Origin Plugin in Chrome benötigt.",
  pIndexBug3:
    "Einschränkung: Da diese Website nur den HTTP-Modus zur Kommunikation mit dem DWARF II verwendet, kann sie Ihren Standort nicht erkennen.",
  pCalendarTitle: "Astronomischer Kalender der Himmelsereignisse",
  pCalendarYear: "Kalenderjahr",
  pAbout: "Über",
  pAboutInfo:
    "Das Projekt wurde von Wai-Yin Kwan mit Hilfe von JC LESAINT gestartet. Diese App ist ein Nebenprojekt, um ihr Interesse an Programmierung, Astronomie und der Dwarf-II-API zu vereinen. Um Fehler zu melden oder den Originalcode einzusehen, besuchen Sie sein ",
  pAboutDataCredit: "Datenquellen",
  pAboutDataCreditInfo:
    "Die Daten für die Objektlisten stammen aus verschiedenen Quellen.",
  pAboutDataCreditDSO: "Die Daten zu den DSO stammen von ",
  pAboutDataCreditDSOAuth:
    "Dr. Michael Camilleri, Auckland Astronomical Society, Neuseeland, hat Objektnamen und -größen für DSO bereitgestellt, die 15 Bogenminuten oder größer sind.",
  pAboutDataCreditDSOStars: "Die Daten zu den Sternen stammen von ",
  pAboutDataCreditVisual:
    "Die Daten zur visuellen Helligkeit von Planeten und Mond stammen von ",
  pAboutDataCreditConstellationData: "Die Konstellationsdaten stammen von ",
  pAboutDataCreditJuypterThe: "Das ",
  pAboutDataCreditJuypterText:
    "im GitHub-Repository zeigt die Schritte, die ich unternommen habe, um die Rohdaten in die Objektlisten zu transformieren.",
  pAboutDataCreditCode: "Diese Website verwendet Code von ",
  pAboutDataCreditCodeAnd: "Und",
  pAboutDataCreditCodeAndText: "astronomische Berechnungen durchzuführen.",
  pAboutUserData: "Benutzerdaten",
  pAboutUserDataDesc:
    "Die von Benutzern eingegebenen Informationen werden in der Datenbank des Browsers (localStorage) gespeichert. Da die Daten in Ihrem Browser gespeichert sind, können andere Benutzer der Website nicht auf Ihre Daten zugreifen. Dies bedeutet auch, dass die Daten nicht zwischen verschiedenen Browsern oder Geräten synchronisiert werden können, wenn ein Benutzer mehrere Browser oder Geräte verwendet.",
  pAboutAdditional: "Zusätzliche Datenquellen",
  pAboutAdditionalWeatherData: "Wetterdaten werden von ",
  pAboutAdditionalRSSData: "Der RSS-Feed für Deep-Sky-Objekte wird von ",
  pAboutAdditionalWitmotion:
    "Die Integration des Witmotion-Sensors basiert auf ",
  cWitmotionCamera: "Kamera",
  cWitmotionAltitude: "Altitude",
  cWitmotionPolaris1:
    "Richten Sie den Dwarf II auf Polaris und passen Sie den Winkel an.",
  cWitmotionPolaris2: "Sie sollten Polaris in der Sensormitte sehen.",
  pFirstSteps: "Erste Schritte",
  pFirstStepsContent:
    "Verwenden Sie die mobile Dwarf II-App von Dwarf Labs, um Dunkelbilder aufzunehmen, das Zielfernrohr zu fokussieren und Goto zu kalibrieren.",
  pSetLocation: "Ort festlegen",
  pSetLocationContent:
    "Damit goto funktioniert, benötigt diese Seite Ihren Breitengrad, Längengrad und Ihre Zeitzone. Westlich von Greenwich ist der Längengrad negativ",
  pLatitude: "Breite",
  pLongitude: "Längengrad",
  pTimezone: "Zeitzone",
  pUseCurrentLocation: "Aktuellen Standort",
  pEnableSTA: "Aktivieren Sie den STA-Modus auf Dwarf II",
  pEnableSTAContent:
    "Damit dieser Standort eine Verbindung zum Dwarf II herstellen kann, muss auf dem Dwarf II der STA-Modus konfiguriert und aktiviert sein.",
  pEnableSTAContent1:
    "Bei der ersten Verwendung benötigen Sie die mobile DwarfLab-App, um die Verbindung herzustellen. Anschließend können Sie, ohne den Zwerg neu zu starten, über die Schaltfläche „Bluetooth verbinden“ eine Verbindung herstellen. Die Konfiguration wird dann gespeichert.",
  pEnableSTAContent2:
    "Bei den nächsten Starts des Dwarf können Sie sich dann direkt über Bluetooth mit ihm verbinden, ohne die mobile Anwendung zu verwenden.",
  pEnableSTAContent3:
    "Klicken Sie auf „Verbinden“. Diese Seite wird versuchen, über Bluetooth eine Verbindung zu Dwarf II herzustellen.",
  pBluetoothPWD: "Bluetooth-PASSWORT",
  pConnect: "Verbinden",
  pConnectDwarfII: "Verbinde dich mit Dwarf II",
  pConnectDwarfIIContent:
    "Damit diese Site eine Verbindung zum Dwarf II herstellen kann, müssen sowohl der Dwarf II als auch die Website dasselbe WLAN-Netzwerk verwenden.",
  pConnectDwarfIIContent1:
    "Nach dem Neustart müssen Sie zunächst über Bluetooth eine Verbindung zum DwarfII herstellen.",
  pConnectDwarfIIContent2:
    "Stellen Sie dann mit der WLAN-Verbindungstaste eine Verbindung her. Dann brauchen Sie die App nicht mehr zu verwenden, um von dieser Website aus zu kalibrieren, zu Goto zu wechseln und eine Bildbearbeitungssitzung durchzuführen.",
  pConnectDwarfIIContent3:
    "Besuchen Sie diese Website auf einem Gerät, das mit demselben WLAN-Netzwerk wie der Dwarf II verbunden ist.",
  pConnectDwarfIIContent4:
    "Geben Sie die IP für den Dwarf II ein. Wenn Sie Dwarf-WLAN verwenden, lautet die IP 192.168.88.1. Wenn Sie den STA-Modus verwenden, verwenden Sie die IP für Ihr WLAN-Netzwerk.",
  pConnectDwarfIIContent5:
    "Klicken Sie auf „Verbinden“. Diese Seite wird versuchen, eine Verbindung zu Dwarf II herzustellen.",
  pConnectDwarfIIContent6:
    "Wenn Sie die Meldung sehen: => Live gehen, haben Sie eine Bildgebungssitzung abgeschlossen, gehen Sie zur Kameraseite und klicken Sie auf die Schaltfläche „Live“.",
  pConnectStellarium: "Stellen Sie eine Verbindung zu Stellarium her",
  pConnectStellariumContent:
    "Um Stellarium nutzen zu können, müssen wir das Remote Control-Plugin einrichten.",
  pConnectStellariumContent1: "Starten Sie die Stellarium-Desktop-App.",
  pConnectStellariumContent2: "Der Anfang davon",
  pConnectStellariumContent2_1:
    " demonstriert die Einrichtung des Remote Control-Plugins von Stellarium (0 bis 1:40); Überspringen Sie den Teil über NINA. Klicken Sie auf „ CORS für folgenden Ursprung aktivieren “ und geben Sie „ * “ ein.",
  pConnectStellariumContent3:
    "Geben Sie IP und Port für das Remote Control-Plugin ein und klicken Sie auf „Verbinden“. Diese Seite wird versuchen, eine Verbindung zu Stellarium herzustellen.",
  pIPAdress: "IP Adresse",
  pPort: "Port",
  cUnlockHost: "Schalten Sie den Host-Modus frei",
  cLockHost: "Hostmodus sperren",
  pConnectionSuccessFull: "Verbindung erfolgreich.",
  pConnecting: "Verbinden...",
  pConnectingFailed: "Verbindung fehlgeschlagen!",
  cAstroSettingsInfoGain: "Gain",
  cAstroSettingsInfoGainDesc:
    "Gain ist eine Einstellung der Digitalkamera, die die Verstärkung des Signals vom Kameradetektor steuert. Es sollte beachtet werden, dass dies das gesamte Signal einschließlich aller damit verbundenen Hintergrundgeräusche verstärkt.",
  cAstroSettingsInfoExposure: "Belichtung",
  cAstroSettingsInfoExposureDesc:
    "Zeit, während der der Sensor Licht ausgesetzt und Informationen (Energie) aufzeichnet",
  cAstroSettingsInfoIRPass: "IR (Infrarot) - Pass",
  cAstroSettingsInfoIRPassDesc:
    "Ermöglicht es der Infrarotwellenlänge, den Sensor zu erreichen. Mehrere astronomische Objekte senden in dieser Wellenlänge aus.",
  cAstroSettingsInfoIRCut: "IR (Infrarot) - Abschneiden",
  cAstroSettingsInfoIRCutDesc:
    "Blockiert die Infrarotwellenlänge. Nützlich für Mond- und Planetenaufnahmen.",
  cAstroSettingsInfoBin1x1: "Binning - 1x1",
  cAstroSettingsInfoBin1x1Desc:
    "Die Kamera erfasst Licht auf jedem einzelnen physischen Pixel.",
  cAstroSettingsInfoBin2x2: "Binning - 2x2",
  cAstroSettingsInfoBin2x2Desc:
    "Die Kamera kombiniert physische Pixel in Gruppen von 2x2 (4 Pixeln) und betrachtet das gesamte im Gruppen erfasste Licht als einen einzigen Pixel. Kann als 'virtueller' Pixel betrachtet werden. Dies macht die Pixelgröße größer und reduziert die Auflösung um einen Faktor, der dem Binning entspricht.",
  cAstroSettingsInfoFormatFITS: "Format - FITS",
  cAstroSettingsInfoFormatFITSDesc:
    "Astronomisches verlustfreies numerisches Dateiformat. Kann Metadaten des Bildes enthalten (Koordinaten, Kamera, Pixelgröße Binning, Filter usw.), die von Verarbeitungssoftware verwendet werden können.",
  cAstroSettingsInfoFormatTIFF: "Format - TIFF",
  cAstroSettingsInfoFormatTIFFDesc:
    "Ein verlustfreies Dateiformat, das jedoch nicht speziell auf die Astronomie ausgerichtet ist.",
  cAstroSettingsInfoCount: "Anzahl",
  cAstroSettingsInfoCountDesc: "Anzahl der aufzunehmenden Bilder",
  cAstroSettingsInfoBack: "Zurück",
  cCameraAddOnPhoto: "Foto",
  cCameraAddOnVideo: "Video",
  cCameraAddOnPanorama: "Panorama",
  cCameraAddonTimeLapse: "Zeitraffer",
  cCameraBurstSettingsCount: "Anzahl",
  cCameraBurstSettingsinterval: "Intervall",
  cCameraTitle: "Astro Photos",
  cCameraConnection: "Sie müssen eine Verbindung zum Dwarf II herstellen.",
  cCameraLocation: "Sie müssen Ihren Standort festlegen.",
  cCalibrationDwarfLights: "Lichter",
  cCalibrationDwarfRingOn: "Ring An",
  cCalibrationDwarfRingOff: "Ring Aus",
  cCalibrationDwarfPowerOn: "Strom An",
  cCalibrationDwarfPowerOff: "Strom Aus",
  cCalibrationDwarfTitle: "Kalibrieren des Dwarf II",
  cCalibrationDwarfTitleDesc:
    "Um die Astrofunktion zu nutzen, müssen Sie zuerst den Dwarf II kalibrieren.",
  cCalibrationDwarfWarning: "WARNUNG:",
  cCalibrationDwarfWarningDesc: "Setzen Sie jetzt nichts auf das Objektiv.",
  CCalibrationDwarfCalibrate: "Kalibrieren",
  cCalibrationDwarfStopGoto: "Goto anhalten",
  cCalibrationDwarfSavePosition: "Position speichern",
  cCalibrationDwarfResetPosition: "Position zurücksetzen",
  cCalibrationDwarfGoToPosition: "Zur Position gehen",
  cCalibrationDwarfShutdown: "Ausschalten!",
  cCalibrationDwarfReboot: "Neustarten!",
  cNavHome: "Startseite",
  cNavSetup: "Einrichtung",
  cNavObjects: "Objekte",
  cNavCamera: "Kamera",
  cNavSessionData: "Sitzungsdaten",
  cNavWeather: "Wetter",
  cNavClouds: "Wolken",
  cNavMoonphases: "Mondphasen",
  cNavAstronomyCalendar: "Astronomischer Kalender",
  cNavPolarAlignment: "Polarausrichtung",
  cNavAbout: "Über",
  cStatusBarExposure: "Belichtung",
  cStatusBarIRFilter: "IR-Filter",
  cStatusBarBinning: "Binning",
  cStatusBarCounter: "Zähler",
  cStatusBarQuality: "Qualität",
  cStatusBarTaken: "Aufgenommen:",
  cStatusBarStacked: "Gestapelt:",
  cStatusBarTime: "Zeit:",
  cStatusBarCurTarget: "Aktuelles Ziel:",
  cThemeSettingsTitle: "Theme-Einstellungen",
  cThemeSettingsFontSize: "Schriftgröße",
  cThemeSettingsColorTheme: "Farbthema",
  cThemeSettingsLightTheme: "Helles Thema",
  cThemeSettingsDarkTheme: "Dunkles Thema",
  cThemeSettingsAstroTheme: "Astro Thema",
  cThemeSettingsUnderconstruction: "in Bearbeitung",
  cThemeSettingsLanguage: "Sprache",
  cThemeSettingsApply: "Anwenden",
  cWeatherInfoLastUpdate: "Letztes Update:",
  cWeatherInfoMinTemp: "Min. Temperatur:",
  cWeatherInfoMaxTemp: "Max. Temperatur:",
  cWeatherInfoFeelsLike: "Gefühlt wie:",
  cWeatherInfoHumidity: "Luftfeuchtigkeit:",
  cWeatherInfoWind: "Wind:",
  cGoToListConnectStellarium:
    "Sie müssen sich mit Stellarium verbinden, damit das Zentrum funktioniert.",
  cGoToListConnectDwarf:
    "Sie müssen sich mit Dwarf II verbinden, damit Goto funktioniert.",
  cGoToListdefault: "Wählen Sie Objektlisten aus",
  cGotoListplanets: "Planeten, Mond und Sonne",
  cGotoListSelectObject: "Bitte wählen Sie eine Objektliste aus.",
  cGotoListDSOList: "Die DSO-Liste enthält Objekte, die:",
  cGotoListDSOList1:
    "Groß (> 15 Bogenminuten) und relativ hell (unter 10 Magnituden) sind. 119 Objekte.",
  cGotoListDSOList2:
    "Groß (> 15 Bogenminuten) und unbekannte Helligkeit haben. 84 Objekte.",
  cGotoListDSOList3:
    "Klein (< 15 Bogenminuten), relativ hell (unter 10 Magnituden), mit gebräuchlichen Namen. 234 Objekte.",
  cGotoListDSOList4:
    "118 der hellsten Sterne mit gebräuchlichen Namen, mindestens einer pro Sternbild.",
  cGotoListDSOList5:
    "Die Liste der Planeten, Mond und Sonne enthält die Planeten unseres Sonnensystems mit dem Mond und der Sonne. Beachten Sie, dass Dwarf II nicht gut geeignet ist, um Bilder von den Planeten aufzunehmen.",
  cGotoListinfo:
    "'Zentrieren' zeigt das ausgewählte Objekt in Stellarium an. 'Goto' bewegt Dwarf II zum ausgewählten Objekt.",
  cGoToStellariumConnectStellarium:
    "Sie müssen sich mit Stellarium verbinden, damit Importdaten funktioniert.",
  cGoToStellariumPickObject:
    "Sie können Stellarium verwenden, um Objekte auszuwählen.",
  cGoToStellariumListTitle: "Wählen Sie ein Objekt in Stellarium aus.",
  cGoToStellariumList1:
    "Importieren Sie Rektaszension und Deklination aus Stellarium, indem Sie auf 'Daten importieren' klicken.",
  cGoToStellariumList2:
    "Starten Sie den Goto-Vorgang, indem Sie auf 'Goto' klicken.",
  cGoToStellariumImportData: "Daten importieren",
  cGoToStellariumImportManualData: "Manuelle Daten importieren",
  cGoToStellariumObject: "Objekt",
  cGoToStellariumRightAscension: "Rektaszension",
  cGoToStellariumDeclination: "Deklination",
  cGoToStellariumCenter: "Zentrieren",
  cGoToStellariumMoveCenter: " Sie können das Zentrum sanft bewegen:",
  cGoToStellariumMoveCenterli1:
    "Klicken Sie auf die Schaltflächen, um das Zentrum zu bewegen",
  cGoToStellariumMoveCenterli2:
    "+/- 1 min für Rektaszension, +/- 0.1° für Deklination",
  cGoToStellariumMoveCenterli3: "Die Koordinaten werden aktualisiert",
  cGoToStellariumMoveCenterli4:
    "Zentrieren Sie erneut in Stellarium, indem Sie auf 'Zentrieren' klicken",
  cGoToStellariumMoveCenterli5:
    "Starten Sie dann den Goto-Vorgang, indem Sie auf 'Goto' klicken",
  cGoToUserListNewList: "Neue Liste hinzufügen",
  cGoToUserListDeleteList: "Liste löschen",
  cGoToUserListCustomObjectsListInstruction1: `
    Um benutzerdefinierte Objektlisten hinzuzufügen, erstellen Sie eine Objektliste auf 
    <a href="https://telescopius.com">Telescopius</a>, laden Sie 
    die CSV-Datei herunter und klicken Sie auf "Neue Liste hinzufügen".
  `,
  cGoToUserListCustomObjectsListInstruction2:
    "Die Listen werden im Browser-Datenbankspeicher (localStorage) gespeichert. Da die Daten im Browser gespeichert sind, können andere Benutzer der Website nicht auf Ihre Listen zugreifen.",
  cGoToUserListCustomObjectsListInstruction3:
    "Wenn Sie Ihre Liste mit anderen Personen teilen möchten, können Sie anderen Personen die CSV-Datei von Telescopius senden.",
  cImportManualModalTitle: "Manuelle Daten eingeben",
  cImportManualModalObjecTName: "Objektname",
  cImportObservationListModalTitle: "Objektliste hinzufügen",
  cImportObservationListfromTelescopius:
    "Importieren Sie die Objektliste von Telescopius.",
  cImportObservationListListName: "Listenname",
  cImportObservationImportList: "Liste importieren",
  cMoonphaseCalculatorNewMoon: "Neumond",
  cMoonphaseCalculatorWaxingCrescent: "Zunehmende Mondsichel",
  cMoonphaseCalculatorFirstQuarter: "Erstes Viertel",
  cMoonphaseCalculatorWaxingGibbous: "Zunehmender Mond",
  cMoonphaseCalculatorFullMoon: "Vollmond",
  cMoonphaseCalculatorWaningGibbous: "Abnehmender Mond",
  cMoonphaseCalculatorLastQuarter: "Letztes Viertel",
  cMoonphaseCalculatorWaningCrescent: "Abnehmende Mondsichel",
  cMoonphaseCalculatorUnknown: "Unbekannt",
  pImageSessionShotsStacked: "Aufnahmen gestapelt",
  pImageSessionShotsTaken: "Aufnahmen gemacht",
  pImageSessionNoShootingInfo: "Keine Aufnahmendaten verfügbar",
  pImageSessionNoAdditionalInfo: "Keine zusätzlichen Informationen verfügbar",
  pImageSessionData: "Sitzungsdaten",
  pImageSessionSortTable:
    "Sie können die Tabelle durch Klicken auf Ziel oder Datum sortieren",
  pImageSessionPreview: "Vorschau",
  pImageSessionTarget: "Ziel",
  pImageSessionDate: "Datum",
  pImageSessionShootingInfo: "Aufnahmedaten",
  pImageSessionAdditionalInfo: "Zusätzliche Informationen",
  pImageSessionAction: "Aktion",
  pImageSessionLoading: "Laden...",
  pImageSessionDownload: "Herunterladen",
};

export default translations;
