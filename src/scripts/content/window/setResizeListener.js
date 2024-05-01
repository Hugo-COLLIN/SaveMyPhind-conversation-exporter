import {setBtnsExport} from "../uiEnhancer/phind/exportButtons/styleExportButtons";
import {btnBarAllInline} from "../uiEnhancer/phind/exportButtons/changeButtons";
import {initVars} from "../uiEnhancer/phind/improvePhindUI";

export function setResizeListener() {
  window.addEventListener('resize', function () {
    const {topBtnsGroup} = initVars();
    setBtnsExport(isExporting, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);

    btnBarAllInline(topBtnsGroup);
  });
}
