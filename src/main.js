import {autoScrapOnLoad, launchExport} from "./activeTab/scraper/scraper";
import {improveUI} from "./activeTab/uiEnhancer/uiEnhancer";
import {addListFilter} from "./activeTab/listFilter/filter";

if (window.isInjecting) {
  launchExport();
} else {
  autoScrapOnLoad();
  improveUI();
}
