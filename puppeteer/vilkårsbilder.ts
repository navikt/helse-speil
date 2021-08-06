import { sleep } from 'deasync';
import puppeteer, { Page } from 'puppeteer';

const clickPeriodButton = async (page: Page, index: number) =>
    page
        .$$('.tidslinjerad')
        .then((rader) => rader.shift())
        .then((rad) => rad!.$$('button'))
        .then((buttons) => buttons[index]?.click());

const bodyHeight = (page: Page) =>
    page
        .$('body')
        .then((body) => body?.boundingBox())
        .then((boundingBox) => boundingBox?.height);

const takeScreenshot = async (page: Page, index: number, screenshotName: string | number = `${index}`) => {
    await clickPeriodButton(page, index);
    const pageHeight = (await bodyHeight(page)) ?? 0;
    await page.setViewport({ width: 1920, height: Math.max(1080, Math.ceil(pageHeight)) });
    await page.screenshot({ path: `puppeteer/screenshots/${screenshotName}.png` });
};

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:1234/person/1672157246605/inngangsvilkår');
    await sleep(200);

    await takeScreenshot(page, 0, 'infotrygdforlengelse-behandlet');
    await takeScreenshot(page, 1, 'infotrygdforlengelse-ubehandlet');
    await takeScreenshot(page, 2, 'førstegangssak-ubehandlet');
    await takeScreenshot(page, 3, 'forlengelse-behandlet');
    await takeScreenshot(page, 4, 'førstegangssak-behandlet');

    await page.goto('http://localhost:1234/person/87654321962124/inngangsvilkår');
    await sleep(200);
    await takeScreenshot(page, 0, 'forlengelse-ubehandlet');

    await browser.close();
})();
