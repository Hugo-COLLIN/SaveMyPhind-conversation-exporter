export function setBtnsExport(exporting, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn) {
  if (exporting) {
    exportAllThreadsSideBtn.style.display = 'none';
    exportAllThreadsTopBtn.style.display = 'none';
    stopExportAllThreadsSideBtn.style.display = '';
    stopExportAllThreadsTopBtn.style.display = window.innerWidth < 1025 ? 'inline-block' : 'none';
  } else {
    exportAllThreadsSideBtn.style.display = '';
    exportAllThreadsTopBtn.style.display = window.innerWidth < 1025 ? 'inline-block' : 'none';
    stopExportAllThreadsSideBtn.style.display = 'none';
    stopExportAllThreadsTopBtn.style.display = 'none';
  }
}