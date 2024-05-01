import {setBtnsExport} from "../uiEnhancer/phind/units/exportButtons/styleExportButtons";
import {btnBarAllInline} from "../uiEnhancer/phind/units/exportButtons/changeButtons";
import {initVars} from "../uiEnhancer/phind/actions/improvePhindUITransmitter.tab";

export function setResizeListener() {
  window.addEventListener('resize', function () {
    const {topBtnsGroup, isStopGenBasic, isHomepage} = initVars();
    setBtnsExport(isExporting, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);

    btnBarAllInline(topBtnsGroup);
  });
}
