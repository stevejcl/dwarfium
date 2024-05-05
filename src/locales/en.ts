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
    "This website allows you to control parts of the Dwarf II using the Dwarf API.",
  pIndexFeature: "Features",
  pIndexFeature1: "1. Object list with over 850 objects.",
  pIndexFeature2: "2. Import objects lists from Telescopius.",
  pIndexFeature3: "3. Import Mosaic lists from Telescopius.",
  pIndexFeature4:
    "4. Connect to Stellarium planeterium app to help select targets.",
  pIndexFeature5: "5. Take Astro photos.",
  pIndexFeature6: "6. 1x1 binning for astro photos.",
  pIndexClaimer:
    "This website and the Dwarf API are in beta phase. The API hasn't been officially released, and the API doesn't have all the features of the mobile app, therefore this app has a very limited list of features. Only use this app if you are comfortable with being testers for beta software.",
  pIndexBugsHeader: "Bugs:",
  pIndexBug1:
    "Dwarf II's internal date url does not work in the browser because of CORS (http://DWARF_IP:8092/date?date=).",
  pIndexBug2:
    "To get it working, you need CORS: Access-Control-Allow-Origin Plugin on Chrome",
  pIndexBug3:
    "Restriction : as this website use only http mode to communicate with the dwarf, it can not detect your location.",
  pCalendarTitle: "Astronomy Calendar of Celestial Events",
  pCalendarYear: "Calendar Year",
  pAbout: "About",
  pAboutInfo:
    "The project was started by Wai-Yin Kwan with the help of JC LESAINT. This website is a side project to combine their interest in coding, astronomy, and the Dwarf II API. To report bugs or view the original code, visit his ",
  pAboutDataCredit: "Data Credits",
  pAboutDataCreditInfo:
    "The data for the objects lists comes from several sources.",
  pAboutDataCreditDSO: "The data about the DSO comes from ",
  pAboutDataCreditDSOAuth:
    "Dr. Michael Camilleri, Auckland Astronomical Society, New Zealand, provided object names and sizes for the DSO that are 15 arc minutes or larger.",
  pAboutDataCreditDSOStars: "The data about the stars comes from ",
  pAboutDataCreditVisual:
    "The data about the visual magnitude of planets and Moon comes from ",
  pAboutDataCreditConstellationData: "The constellation data comes from ",
  pAboutDataCreditJuypterThe: "The ",
  pAboutDataCreditJuypterText:
    "in the Github repo show the steps I took to transform the raw data into the objects lists.",
  pAboutDataCreditCode: "This site uses code from ",
  pAboutDataCreditCodeAnd: "and ",
  pAboutDataCreditCodeAndText: "to perform astronomical calculations.",
  pAboutUserData: "User Data",
  pAboutUserDataDesc:
    "The information entered by users is stored in the browser's database (localStorage). Since the data is stored in your browser, other users of the site will not be able to access your data. This also means if a user uses multiple browsers or devices, the data cannot be synced between different browsers or devices.",
  pAboutAdditional: "Additional Data Sources",
  pAboutAdditionalWeatherData: "Weather data is pulled from ",
  pAboutAdditionalRSSData: "RSS feed for deep sky objects is provided by ",
  pAboutAdditionalWitmotion: "Witmotion Sensor integration based on ",
  cWitmotionCamera: "Camera",
  cWitmotionAltitude: "Altitude",
  cWitmotionPolaris1:
    "Point the Dwarf II towards Polaris and adjust the angle to match your altitude.",
  cWitmotionPolaris2: "You should see Polaris in the Center of the Camera.",
};

export default translations;
