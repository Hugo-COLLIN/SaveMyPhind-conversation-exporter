import {setBtnsExport} from "../../units/page/uiEnhancer/phind/exportButtons/styleExportButtons";
import {btnBarAllInline} from "../../units/page/uiEnhancer/phind/exportButtons/changeButtons";

export function updateButtonsOnResize() {
  window.addEventListener('resize', function () {
    setBtnsExport(isExporting, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);

    btnBarAllInline(topBtnsGroup);
  });
}
