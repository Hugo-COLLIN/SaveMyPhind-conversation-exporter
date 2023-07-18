import {fetchInfos} from "../utils/utils";

export async function welcome() {
  const appInfos = await fetchInfos();
  console.log("Tab export with " + appInfos.APP_SNAME + " v" + appInfos.APP_VERSION);
  // console.log("Tab exported with " + appInfos.APP_SNAME + ".\nPlease support me by donating at https://www.paypal.com/paypalme/${appInfos.APP_SNAME}");
}

