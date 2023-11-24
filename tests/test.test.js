// const { Builder, By, Key, until } = require('selenium-webdriver');
//
// describe('Google Search', () => {
//   let driver;
//
//   beforeAll(async () => {
//     // driver = new Builder().forBrowser('firefox').build();
//     driver = new Builder().forBrowser('chrome').build();
//   });
//
//   afterAll(async () => {
//     await driver.quit();
//   });
//
//   it('should open google search', async () => {
//     await driver.get('https://phind.com');
//
//     await driver.wait(until.titleContains("Phind"), 1000);
//     await driver.sleep(1000);
//     await driver.findElement(By.id('login')).click();
//     await driver.sleep(1000);
//     await driver.findElement(By.id('login')).sendKeys('test');
//     await driver.sleep(1000);
//
//
//
//     // await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
//     // await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
//   }, 20000);
// });
