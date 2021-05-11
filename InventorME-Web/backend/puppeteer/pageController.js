const pageScraper = require('./pageScraper');
async function scrapeAll(browserInstance, barcode){
    let browser;
    try{
        browser = await browserInstance;
        let scrapedData = await pageScraper.scraper(browser, barcode);
        await browser.close();
        return scrapedData;
    }
    catch(err){
        console.log("Could not resolve the browser instance2 => ", err);
    }
}

module.exports = (browserInstance, barcode) => scrapeAll(browserInstance, barcode)