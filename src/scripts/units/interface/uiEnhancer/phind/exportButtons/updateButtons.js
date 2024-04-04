export function updateButtonsOnResize() {
  window.addEventListener('resize', function () {
    setBtnsExport(isExporting, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);

    btnBarAllInline(topBtnsGroup);
  });
}