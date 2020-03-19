const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless : false,
        defaultViewport : null,
        args : ['--start-maximized']
    });
    const page = await browser.newPage();
    await page.goto('https://steamcommunity.com/market/');
    var arr_games = await page.evaluate(() => {
        var select = document.querySelector('#market_advancedsearch_appselect_options_apps');
        var games = select.querySelectorAll('.popup_item.popup_menu_item.market_advancedsearch_appname')
        let arr_games = [];
        games.forEach(g => {
            let id = g.getAttribute('data-appid');
            let name = g.querySelector('span').innerText;
            arr_games[arr_games.length] = {id, name};
        });

        return Promise.resolve(arr_games);
    });
    var selected_games = arr_games.filter(g => g.name == "Don't Starve Together");
    
    selected_games.forEach(async g => {
        await page.goto(`https://steamcommunity.com/market/search?appid=${g.id}`);
        var total_articles = await page.evaluate(()=>{
            let info = document.querySelector('#searchResults_ctn');
            let total = info.querySelector('#searchResults_total').innerText;
            return Promise.resolve(parseInt(total));
        });

        var articles = [];
        console.log('Empesando a escanear páginas...', Math.ceil(total_articles / 10));
        for(let i = 1 ; i <= Math.ceil(total_articles / 10); i++){
            console.log('Pagina:',i,' ...');
            if(i > 5) break;
            await page.goto(`https://steamcommunity.com/market/search?appid=${g.id}#p${i}_price_desc`);
            await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"]});
            let temp = await page.evaluate( i => {
                let results = document.querySelectorAll('#searchResultsRows > .market_listing_row_link > div.market_listing_row');
                let articles = [];
                results.forEach((res,index) => {
                    try{
                        let article_info = res.querySelector('.market_listing_item_name_block');
                        let article_price = res.querySelector('.market_listing_price_listings_block');
    
                        let data_hash_name = res.getAttribute('data-hash-name');
                        let name = article_info.querySelector('.market_listing_item_name').innerText;
    
                        let quantity = article_price.querySelector('.market_listing_num_listings_qty').innerText;
                        let price = article_price.querySelector('.normal_price[data-price]').getAttribute('data-price');
                        let sale_price = article_price.querySelector('.sale_price').innerText;
                        let currency = article_price.querySelector('.normal_price[data-price]').getAttribute('data-currency');
    
                        let img_src = res.querySelector('img').src;
    
                        articles[articles.length] = {
                            pos: index,
                            data_hash_name,
                            name,
                            quantity,
                            sale_price,
                            currency,
                            price,
                            img_src
                        };
                    }catch(ex){
                        console.log(ex)
                    }
                    
                });
                return Promise.resolve(articles);
            });

            temp.forEach(art => {
                articles.push(art);
            });
        }

        console.log(articles);
    });
})();