// const { Builder, By, Key, until } = require('selenium-webdriver');
// const chrome = require('selenium-webdriver/chrome');
// const chromeRemoteInterface = require('chrome-remote-interface');
//
// describe('Extension Test', () => {
//   let driver;
//
//   beforeAll(async () => {
//     driver = new Builder().forBrowser('chrome').build();
//     await driver.get('chrome://extensions/');
//     await driver.findElement(By.id('load-unpacked')).click();
//     await driver.findElement(By.id('pack-extension-dialog')).sendKeys('/path/to/your/extension');
//     await driver.findElement(By.id('pack-extension-commit')).click();
//   });
//
//   afterAll(async () => {
//     await driver.quit();
//   });
//
//   it('should check if extension is injecting', async () => {
//     const chromeProtocol = await chromeRemoteInterface({
//       port: 9222, // port number Chrome is listening on
//     });
//
//     const { Runtime } = chromeProtocol;
//     await Runtime.enable();
//
//     const result = await Runtime.evaluate({
//       expression: 'chrome.storage.local.get(["isInjecting"], function(result) { return result.isInjecting; })',
//     });
//
//     expect(result.result.value).toBe(false);
//   });
// });
