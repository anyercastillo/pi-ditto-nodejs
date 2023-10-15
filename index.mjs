import { init, Ditto } from "@dittolive/ditto";
import PropertiesReader from "properties-reader"
import OnOff from "onoff";

const properties = PropertiesReader('local.properties');
const DITTO_APP_ID= properties.get("DITTO_APP_ID");
const DITTO_APP_TOKEN= properties.get("DITTO_APP_TOKEN");
const LED_A = new OnOff.Gpio(4, 'out');
const BTN_A = new OnOff.Gpio(14, 'in');

var btnA = 0;

const readWriteIO = () => {
  const valueBtnA = BTN_A.readSync();

  if (valueBtnA !== btnA) {
    btnA = valueBtnA;
  }

  LED_A.writeSync(btnA);
}

const main = async () => {
  await init();

  const ditto = new Ditto({
    type: "onlinePlayground",
    appID: DITTO_APP_ID,
    token: DITTO_APP_TOKEN,
  });

  ditto.startSync();
  setInterval(readWriteIO, 100);
}

main();
