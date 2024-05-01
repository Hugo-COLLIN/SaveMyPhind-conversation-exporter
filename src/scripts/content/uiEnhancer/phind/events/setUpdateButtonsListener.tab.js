import {setBtnsExport} from "../units/exportButtons/styleExportButtons";
import {btnBarAllInline} from "../units/exportButtons/changeButtons";

export function updateButtonsOnResize() {
  window.addEventListener('resize', function () {
    setBtnsExport(isExporting, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);

    btnBarAllInline(topBtnsGroup);
  });
}
