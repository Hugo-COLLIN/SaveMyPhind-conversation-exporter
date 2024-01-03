import appInfos from "../../infos.json";

export function logWelcome() {
  console.log("Tab export with " + appInfos.APP_SNAME + " v" + appInfos.APP_VERSION);
}


export function logWaitList() {
  console.log(appInfos.APP_SNAME + ": Waiting for list")
}

export function logWaitElts() {
  console.log(appInfos.APP_SNAME + ": Waiting for adding elements")
}
