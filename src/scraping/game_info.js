const path = require('path');

class gameInfo{
    constructor(browser){
        this.browser = browser;
        this.loaded = false;
    }

    async setBrowser(){
        if(!this.loaded){
            this.browser = await this.browser;
            this.loaded = true;
        }
    }

    async getGames(){
        await this.setBrowser();
        var page = await this.browser.newPage();
        await page.goto('https://steamcommunity.com/market/');

        var arr_games = await page.evaluate(() => {
            var select = document.querySelector('#market_advancedsearch_appselect_options_apps');
            var games = select.querySelectorAll('.popup_item.popup_menu_item.market_advancedsearch_appname');
            let arr_games = [];
            games.forEach(g => {
                let id_game = g.getAttribute('data-appid');
                if(id_game == null) return;
                let game_name = g.querySelector('span').innerText;
                let game_img_src = g.querySelector('img').src;
                arr_games[arr_games.length] = {id_game, game_name, game_img_src};
            });

            console.log(arr_games);
            return Promise.resolve(arr_games);
        });
        await page.close();
        if(arr_games.length > 0){
            return Promise.resolve(arr_games);
        }
        return Promise.reject("error");
    }

    async getGameTotalArticles(id_game){
        await this.setBrowser();
        var page = await this.browser.newPage();
        await page.goto(`https://steamcommunity.com/market/search?appid=${id_game}`);
        var total = await page.evaluate(() => {
            let searchResults = document.querySelector('#searchResults_ctn');
            let total = searchResults.querySelector('#searchResults_total').innerText;
            total = parseInt(total.replace(',',''));
            return Promise.resolve(total);
        });
        return total;
    }
}

// (async () => {
//     var o_gameInfo = new gameInfo();
//     let games = await a.getGames();
//     console.log(games);
//     let total = await o_gameInfo.getGameTotalArticles(322330);
//     console.log(total);
//     o_gameInfo.browser.close();
// })();

module.exports = gameInfo;