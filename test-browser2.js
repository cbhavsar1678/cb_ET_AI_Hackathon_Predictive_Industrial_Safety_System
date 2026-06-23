
import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('http://localhost:3000', {waitUntil: 'networkidle0'});
  const html = await page.content();
  if (html.includes('Application Crashed')) {
     console.log('CRASHED_HTML:', html.substring(html.indexOf('Application Crashed'), html.indexOf('Application Crashed') + 500));
  } else {
     console.log('NOT_CRASHED');
  }
  await browser.close();
})();
