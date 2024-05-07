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
  pPort: "Hafen",
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
};

export default translations;
