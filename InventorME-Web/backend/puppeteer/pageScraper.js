const scraperObject = {
    async scraper(browser, barcode){
        const url = 'https://www.barcodelookup.com/' + barcode;
        let page = await browser.newPage();
        await page.setDefaultTimeout(4000);
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
        
        try {
            await page.goto(url);
        } catch(e){
            console.log('Page Timeout.')
        }
        
        let object = []
      
        const error = await page.$('#body-container > section.mid-inner.content-pages > div > div > div > div > center > h2');
        const error2 = await page.$('#body-container > section.jumbotron.top.short-banner.inner > div > h1');
        const error3 = await page.$('#body-container > section.mid-inner > div > div:nth-child(2) > div')
            
        if(!error&&!error2&&!error3) {
            await page.waitForSelector('#body-container > section.mid-inner > div > div > div.col-md-6.product-details > h4')
            let element = await page.$('#body-container > section.mid-inner > div > div > div.col-md-6.product-details > h4')
            let name = await page.evaluate(el => el.textContent, element)

            await page.waitForSelector('#body-container > section.mid-inner > div > div > div.col-md-6.product-details > div:nth-child(5) > div > div:nth-child(2) > div > div > span');
            element = await page.$('#body-container > section.mid-inner > div > div > div.col-md-6.product-details > div:nth-child(5) > div > div:nth-child(2) > div > div > span');
            let categories = await page.evaluate(el => el.textContent, element)

            await page.waitForSelector('#img_preview')
            element = await page.$('#img_preview')
            let imageURL = await page.evaluate(el => el.getAttribute('src'), element)

            let onlineUrl = "";
            try {
                onlineUrl = await page.evaluate(
                    () => Array.from(
                    document.querySelectorAll('#product-body > div.container > div > div.col-md-6.col-md-push-6.online-stores > div.store-list > ol > li:nth-child(1) > a'),
                    a => a.getAttribute('href')
                    )
                );
            } catch (e){}

            let price = "";
            try {
                await page.waitForSelector('#product-body > div.container > div > div.col-md-6.col-md-push-6.online-stores > div.store-list > ol > li:nth-child(1) > a > span.store-link');
                element = await page.$('#product-body > div.container > div > div.col-md-6.col-md-push-6.online-stores > div.store-list > ol > li:nth-child(1) > a > span.store-link');
                price = await page.evaluate(el => el.textContent, element)
                price =  price.replace(/\$/g, '');
            } catch (e){}
            
            let category = '';
            let tags = [];
            let categoryArr = categories.split(/[>]+/);
            for(let i = 0; i < categoryArr.length; ++i){
                if(i === 0)
                    category = categoryArr[i].trim();
                else   
                    tags.push(categoryArr[i].trim())
            }
            if(name)
                name = name.trim()
            if(price)
                price = price.trim()
            if(onlineUrl[0])
                onlineUrl = onlineUrl[0].trim()
            if(imageURL)
                imageURL = imageURL.trim()

            object = {
                name,
                category: category,
                tags,
                price,
                onlineUrl,
                imageURL
            }
        } else {
            console.log('Failed to find image by barcode')
        }

        return object;
    }
}

module.exports = scraperObject;