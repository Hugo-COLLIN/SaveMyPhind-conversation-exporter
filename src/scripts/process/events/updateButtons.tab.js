import {setBtnsExport} from "../../units/interface/uiEnhancer/phind/exportButtons/styleExportButtons";
import {btnBarAllInline} from "../../units/interface/uiEnhancer/phind/exportButtons/changeButtons";

export function updateButtonsOnResize() {
  window.addEventListener('resize', function () {
    setBtnsExport(isExporting, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);

    btnBarAllInline(topBtnsGroup);
  });
}
