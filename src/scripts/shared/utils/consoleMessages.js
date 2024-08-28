import appInfos from "../../../data/infos.json";

export function logWelcome() {
  console.log("Tab export with " + appInfos.APP_SNAME + " v" + APP_VERSION);
}


export function logWaitList() {
  console.log(appInfos.APP_SNAME + ": Waiting for list")
}

export function logWaitElts() {
  console.log(appInfos.APP_SNAME + ": Waiting for adding elements")
}

export function logUpdateModal() {
  console.log("Last update modal will not be displayed until the next update");
}
