import {launchExport} from "./activeTab/scraper/scraper";
import {autoScrapOnLoad} from "./activeTab/orchestrator";
import {improveUI} from "./activeTab/webpageUI/webpageUI";

if (window.isInjecting) {
  launchExport();
} else {
  autoScrapOnLoad();
  improveUI();
}
