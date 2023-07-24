import {fetchInfos} from "../extractor/getters";

let appInfos = null;
fetchInfos().then(res => appInfos = res);


export async function logWelcome() {
  console.log("Tab export with " + appInfos.APP_SNAME + " v" + appInfos.APP_VERSION);
  // console.log("Tab exported with " + appInfos.APP_SNAME + ".\nPlease support me by donating at https://www.paypal.com/paypalme/${appInfos.APP_SNAME}");
}

export function logWaitList() {
  console.log(appInfos.APP_SNAME + ": Waiting for list")
}

export function logWaitElts() {
  console.log(appInfos.APP_SNAME + ": Waiting for adding elements")
}
