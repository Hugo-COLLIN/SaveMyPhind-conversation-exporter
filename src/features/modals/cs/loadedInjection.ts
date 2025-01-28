import {domainChecker} from "../../../core/services/domainChecker/domainChecker";
import {LOAD_DOMAINS} from "../../../data/allowedDomains.json";
import {getHostAndPath} from "../../../core/utils/cs/getters";
import {detectPageLoad} from "./detectPageLoad";
import {setLoadListener} from "./launchModalIntegration";

export async function loadedInjection() {
  const domain = domainChecker(LOAD_DOMAINS, getHostAndPath());
  if (domain === null) return;
  const htmlCheck = detectPageLoad(domain);
  if (!htmlCheck) return;
  // scrapOnLoadListener();
  await setLoadListener(domain);
}
