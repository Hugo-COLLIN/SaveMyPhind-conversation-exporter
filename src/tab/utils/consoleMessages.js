import appInfos from "../../infos.json";

export async function logWelcome() {
  console.log("Tab export with " + appInfos.APP_SNAME + " v" + appInfos.APP_VERSION);
}


export async function logWaitList() {
  console.log(appInfos.APP_SNAME + ": Waiting for list")
}

export async function logWaitElts() {
  console.log(appInfos.APP_SNAME + ": Waiting for adding elements")
}
