/* naming schema:
pIndexDescription

p = page
c = component
l = lib

Index = Page name
Description = identifier

*/

const translationsNL = {
  pIndexDescription:
    "Deze website stelt u in staat delen van de Dwarf II te bedienen met behulp van de Dwarf API.",
  pIndexFeature: "Kenmerken",
  pIndexFeature1: "1. Objectenlijst met meer dan 850 objecten.",
  pIndexFeature2: "2. Importeer objectenlijsten van Telescopius.",
  pIndexFeature3: "3. Importeer mozaïeklijsten van Telescopius.",
  pIndexFeature4:
    "4. Verbind met de Stellarium planetarium app om doelen te selecteren.",
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
    "Beperking: omdat deze website alleen de http-modus gebruikt om te communiceren met de dwerg, kan het uw locatie niet detecteren.",
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
  pAboutUserData: "Gebruikersgegevens",
  pAboutUserDataDesc:
    "De door gebruikers ingevoerde informatie wordt opgeslagen in de database van de browser (localStorage). Omdat de gegevens in uw browser zijn opgeslagen, kunnen andere gebruikers van de site uw gegevens niet openen. Dit betekent ook dat als een gebruiker meerdere browsers of apparaten gebruikt, de gegevens niet kunnen worden gesynchroniseerd tussen verschillende browsers of apparaten.",
  pAboutAdditional: "Extra Gegevensbronnen",
  pAboutAdditionalWeatherData: "Weergegevens worden opgehaald van ",
  pAboutAdditionalRSSData:
    "De RSS-feed voor deep sky-objecten wordt verzorgd door ",
  pAboutAdditionalWitmotion: "Witmotion Sensor integratie gebaseerd op ",
};

export default translationsNL;
