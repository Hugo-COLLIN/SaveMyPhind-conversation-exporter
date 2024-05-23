import appInfos from "../../../infos.json";

export function EXTRACTOR_FALLBACK_ACTION() {
  return (error) => {
    alert(`${appInfos.APP_SNAME}: Error while extracting page content.\n\nPlease contact me at ${appInfos.CONTACT_EMAIL} with these information if the problem persists:\n≫ The steps to reproduce the problem\n≫ The URL of this page\n≫ The app version: ${appInfos.APP_VERSION}\n≫ Screenshots illustrating the problem\n\nThank you!`);
    throw new Error("Error while extracting page content:\n" + error.stack);
  };
}

export function EXPORTER_FALLBACK_ACTION() {
  return (error) => {
    alert(`${appInfos.APP_SNAME}: File conversion error.\n\nPlease contact me at ${appInfos.CONTACT_EMAIL} with these information if the problem persists:\n≫ The steps to reproduce the problem\n≫ The URL of this page\n≫ The app version: ${appInfos.APP_VERSION}\n≫ Screenshots illustrating the problem\n\nThank you!`);
    throw new Error("File conversion error:\n" + error.stack);
  };
}
