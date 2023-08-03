import {getAppInfos} from "../../../common/appInfos";

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
