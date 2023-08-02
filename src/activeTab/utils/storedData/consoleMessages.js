// import {appInfos, fetchInfos} from "../../../common/utils";

// let appInfos = null;
// fetchInfos().then(res => appInfos = res);

// import {appInfos} from "../../../common/utils";
//
// export async function logWelcome() {
//   // let appInfos = await fetchInfos(); // Solve bug appInfos is null when clicking on the icon
//   console.log("Tab export with " + appInfos.APP_SNAME + " v" + appInfos.APP_VERSION);
//   // console.log("Tab exported with " + appInfos.APP_SNAME + ".\nPlease support me by donating at https://www.paypal.com/paypalme/${appInfos.APP_SNAME}");
// }

import {getAppInfos} from "../../../common/utils";

export async function logWelcome() {
  const appInfos = await getAppInfos();
  console.log("Tab export with " + appInfos.APP_SNAME + " v" + appInfos.APP_VERSION);
}


export async function logWaitList() {
  const appInfos = await getAppInfos();
  console.log(appInfos.APP_SNAME + ": Waiting for list")
}

export async function logWaitElts() {
  const appInfos = await getAppInfos();
  console.log(appInfos.APP_SNAME + ": Waiting for adding elements")
}
