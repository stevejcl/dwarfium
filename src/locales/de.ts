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
    cWitmotionPolaris1: "Richten Sie den Dwarf II auf Polaris und passen Sie den Winkel an.",
    cWitmotionPolaris2: "Sie sollten Polaris in der Sensormitte sehen."
};

export default translations;
