/* naming schema:
pIndexDescription

p = page
c = component
l = lib

Index = Page name
Description = identifier

*/

const translationsNL = {
  pIndexDescription: "Deze website stelt u in staat om de Dwarf II te bedienen met behulp van de Dwarf API",
  pIndexFeature: "Kenmerken",
  pIndexFeature1: "1. Objectenlijst met meer dan 850 objecten.",
  pIndexFeature2: "2. Importeer objectenlijsten van Telescopius.",
  pIndexFeature3: "3. Importeer mozaïeklijsten van Telescopius.",
  pIndexFeature4: "4. Verbind met de Stellarium planetarium app om doelen te selecteren.",
  pIndexFeature5: "5. Maak astrofoto's.",
  pIndexFeature6: "6. 1x1 binning voor astrofoto's.",
  pIndexClaimer:
    "Deze website en de Dwarf API bevinden zich in de bètafase. De API is nog niet officieel uitgebracht en heeft niet alle functies van de mobiele app. Daarom heeft deze app een zeer beperkte lijst met functies. Gebruik deze app alleen als u comfortabel bent met het testen van bètasoftware.",
  pIndexBugsHeader: "Bugs:",
  pIndexBug1:
    "De interne datum-URL van Dwarf II werkt niet in de browser vanwege CORS (http://DWARF_IP:8092/date?date=).",
  pIndexBug2:
    "Om het werkend te krijgen, heb je CORS: Access-Control-Allow-Origin Plugin in Chrome nodig.",
  pIndexBug3:
    "Beperking: omdat deze website alleen de http-modus gebruikt om te communiceren met de DwarfII, kan het uw locatie niet detecteren.",
  pCalendarTitle: "Astronomische kalender van hemelse gebeurtenissen",
  pCalendarYear: "Kalenderjaar",
  pAbout: "Over",
  pAboutInfo:
    "Het project is gestart door Wai-Yin Kwan met hulp van JC LESAINT. Deze website is een nevenproject om hun interesse in codering, astronomie en de Dwarf II API te combineren. Om bugs te melden of de originele code te bekijken, bezoek zijn ",
  pAboutDataCredit: "Gegevenscredits",
  pAboutDataCreditInfo:
    "De gegevens voor de objectenlijsten komen uit verschillende bronnen.",
  pAboutDataCreditDSO: "De gegevens over de DSO komen van ",
  pAboutDataCreditDSOAuth:
    "Dr. Michael Camilleri, Auckland Astronomical Society, Nieuw-Zeeland, heeft objectnamen en -maten verstrekt voor de DSO die 15 boogminuten of groter zijn.",
  pAboutDataCreditDSOStars: "De gegevens over de sterren komen van ",
  pAboutDataCreditVisual:
    "De gegevens over de visuele magnitude van planeten en de Maan komen van ",
  pAboutDataCreditConstellationData:
    "De gegevens over de sterrenbeelden komen van ",
  pAboutDataCreditJuypterThe: "De ",
  pAboutDataCreditJuypterText:
    "in het Github-repository toont de stappen die ik heb genomen om de ruwe gegevens om te zetten in de objectenlijsten.",
  pAboutDataCreditCode: "Deze site maakt gebruik van code van ",
  pAboutDataCreditCodeAnd: "en",
  pAboutDataCreditCodeAndText: "om astronomische berekeningen uit te voeren.",
  pAboutUserData: "Gebruikersgegevens",
  pAboutUserDataDesc:
    "De door gebruikers ingevoerde informatie wordt opgeslagen in de database van de browser (localStorage). Omdat de gegevens in uw browser zijn opgeslagen, kunnen andere gebruikers van de site uw gegevens niet openen. Dit betekent ook dat als een gebruiker meerdere browsers of apparaten gebruikt, de gegevens niet kunnen worden gesynchroniseerd tussen verschillende browsers of apparaten.",
  pAboutAdditional: "Extra Gegevensbronnen",
  pAboutAdditionalWeatherData: "Weergegevens worden opgehaald van ",
  pAboutAdditionalRSSData:
    "De RSS-feed voor deep sky-objecten wordt aangeleverd door ",
  pAboutAdditionalWitmotion: "Witmotion Sensor integratie gebaseerd op ",
  cWitmotionCamera: "Camera",
  cWitmotionAltitude: "Hoogte",
  cWitmotionPolaris1:
    "Richt de Dwarf II naar Polaris en pas de hoek aan om overeen te komen met je hoogte.",
  cWitmotionPolaris2: "Je zou Polaris in het midden van de camera moeten zien.",
  pFirstSteps: "Eerste Stap",
  pFirstStepsContent: "Gebruik de DwarfII mobiele app van Dwarf Labs om donkere frames te maken, de focus scherp te stellen en Goto te kalibreren.",
  pSetLocation: "Locatie instellen",
  pSetLocationContent: "Om Goto te laten werken, heeft deze site uw breedtegraad, lengtegraad en tijdzone nodig. De lengtegraad is negatief ten westen van Greenwich",
  pLatitude: "Breedtegraad",
  pLongitude: "Lengtegraad",
  pTimezone: "Tijdzone",
  pUseCurrentLocation: "Huidige Locatie",
  pEnableSTA: "Schakel STA-modus in op Dwarf II",
  pEnableSTAContent: "Om deze site verbinding te laten maken met de Dwarf II, moet de STA-modus op de Dwarf II zijn geconfigureerd en ingeschakeld.",
  pEnableSTAContent1: "Wanneer u de Dwarf voor het eerst gebruikt, heeft u de mobiele DwarfLab-app nodig om de verbinding tot stand te brengen. Vervolgens kunt u, zonder de Dwarf opnieuw op te starten, verbinding maken via de knop Bluetooth verbinden. De configuratie wordt vervolgens opgeslagen.",
  pEnableSTAContent2: "Vervolgens kunt u voor de volgende start van de Dwarf er rechtstreeks verbinding mee maken via Bluetooth, zonder de mobiele applicatie te gebruiken.",
  pEnableSTAContent3: "Klik op Verbinden. Deze site probeert via Bluetooth verbinding te maken met Dwarf II.",
  pBluetoothPWD: "Bluetooth PASWOORD",
  pConnect: "Verbinden",
  pConnectDwarfII: "Connecteer met de Dwarf II",
  pConnectDwarfIIContent: "Om deze site verbinding te laten maken met de Dwarf II, moeten zowel de Dwarf II als de website hetzelfde wifi-netwerk gebruiken.",
  pConnectDwarfIIContent1: "Na het opnieuw opstarten moet u eerst via Bluetooth verbinding maken met de DwarfII.",
  pConnectDwarfIIContent2: "Maak er vervolgens verbinding mee met de wifi-verbindingsknop. Dan hoeft u de app niet te gebruiken om te kalibreren, Goto te maken en een beeldsessie vanaf deze website te maken.",
  pConnectDwarfIIContent3: "Bezoek deze site op een apparaat dat is verbonden met hetzelfde wifi-netwerk als de Dwarf II.",
  pConnectDwarfIIContent4: "Voer het IP-adres in voor de Dwarf II. Als je Dwarf wifi gebruikt, is het IP-adres 192.168.88.1. Als u de STA-modus gebruikt, gebruik dan het IP-adres van uw wifi-netwerk.",
  pConnectDwarfIIContent5: "Klik op Verbinden. Deze site zal proberen verbinding te maken met Dwarf II.",
  pConnectDwarfIIContent6: "Als u het bericht ziet: => Go Live, heeft u een beeldsessie voltooid, ga naar de Camerapagina en klik op de Live-knop.",
  pConnectStellarium: "Maak verbinding met Stellarium",
  pConnectStellariumContent: "Om Stellarium te kunnen gebruiken, moeten we de Remote Control-plug-in instellen.",
  pConnectStellariumContent1: "Start Stellarium desktop app.",
  pConnectStellariumContent2: "Het begin van deze",
  pConnectStellariumContent2_1: " demonstreert het instellen van Stellarium's Remote Control-plug-in (0 tot 1:40); sla het gedeelte over NINA over. Klik op ' CORS inschakelen voor de volgende herkomst ' en typ ' * '.",
  pConnectStellariumContent3: "Voer het IP-adres en de poort in voor de Remote Control-plug-in en klik op ' Verbinden '. Deze site zal proberen verbinding te maken met Stellarium.",
  pIPAdress: "Ip-Adres",
  pPort: "Poort",
};

export default translationsNL;
