import { init, Ditto } from "@dittolive/ditto";
import PropertiesReader from "properties-reader"
import OnOff from "onoff";


const properties = PropertiesReader('local.properties');
const PIN_OUT_LED_GREEN = properties.get("PIN_OUT_LED_GREEN");
const PIN_IN_BUTTON_GREEN = properties.get("PIN_IN_BUTTON_GREEN");
const LED_GREEN = new OnOff.Gpio(PIN_OUT_LED_GREEN, 'out');
const BUTTON_GREEN = new OnOff.Gpio(PIN_IN_BUTTON_GREEN, 'in');

const DITTO_APP_ID = properties.get("DITTO_APP_ID");
const DITTO_APP_TOKEN = properties.get("DITTO_APP_TOKEN");
const DEMO_DOC_ID = "ditto-demo-pi";
const COLLECTION_NAME = "lights"

let ditto;
let subscription;
let liveQuery;

var green = 0;

const main = async () => {
  await init();

  ditto = new Ditto({
    type: "onlinePlayground",
    appID: DITTO_APP_ID,
    token: DITTO_APP_TOKEN,
  });

  ditto.startSync();

  const collection = ditto.store.collection(COLLECTION_NAME);
  subscription = collection.findByID(DEMO_DOC_ID).subscribe();

  liveQuery = collection.findByID(DEMO_DOC_ID).observeLocal((doc, event) => {    
    if (doc === null) return;
    console.log(doc.value);
    green = doc.value["green"];
    LED_GREEN.writeSync(green);
  });

  collection.upsert({
    _id: DEMO_DOC_ID,
    green,
  });

  const readWriteIO = () => {
    const buttonGreenState = BUTTON_GREEN.readSync();

    if (buttonGreenState === 1) {
      green = 1 - green;

      collection.upsert({
        _id: DEMO_DOC_ID,
        green,
      });
    }
  };

  setInterval(readWriteIO, 1000);
}

main();
