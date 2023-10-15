import { init, Ditto } from "@dittolive/ditto";
import PropertiesReader from "properties-reader"
import OnOff from "onoff";

const properties = PropertiesReader('local.properties');
const DITTO_APP_ID= properties.get("DITTO_APP_ID");
const DITTO_APP_TOKEN= properties.get("DITTO_APP_TOKEN");
const LED = new OnOff.Gpio(4, 'out');

let ditto;

async function main() {
  await init()

  ditto = new Ditto({
    type: "onlinePlayground",
    appID: DITTO_APP_ID,
    token: DITTO_APP_TOKEN,
  });

  ditto.startSync();

  LED.writeSync(1);
}

main()
