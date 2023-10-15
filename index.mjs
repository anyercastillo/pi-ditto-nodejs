import { init, Ditto } from "@dittolive/ditto";
import PropertiesReader from "properties-reader"
let properties = PropertiesReader('local.properties');

let ditto;
async function main() {
  await init()
  ditto = new Ditto({
    type: "onlinePlayground",
    appID: properties.get("DITTO_APP_ID"),
    token: properties.get("DITTO_APP_TOKEN"),
  })

  ditto.startSync()
}

main()

console.log(properties.get("DITTO_APP_ID"));