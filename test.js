import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:5173');
  // Wait a bit to ensure it loads
  await new Promise(r => setTimeout(r, 2000));
  
  // We can evaluate JS to directly set the scene index in the context if it were exposed.
  // Since it's React state, we might just click through.
  // Click first button to start (assuming VerificationGate)
  try {
    let button = await page.$('button');
    if (button) {
      await button.click();
      await new Promise(r => setTimeout(r, 1000)); // wait for transition
    }
  } catch (e) {
    console.log(e);
  }
  
  await browser.close();
})();
