const express = require('express');
const router = express.Router();
const daoGames = require('../bd/daoGame');
const gameInfo = require('../scraping/game_info');

var o_gameInfo;
var games_memory = {
    games: [],
    updated: undefined,
    loaded: false,
};

router.get('/list', async (req, res) => {
    res.json(await daoGames.list());
});

router.get('/list_steam', async (req, res) => {
    res.json(games_memory.games);

    if(games_memory.loaded == false){
        games_memory.loaded = true;
        try{
            games_memory.games = await o_gameInfo.getGames();
            games_memory.updated = Date.now();
        }catch(ex){
            games_memory.loaded = false;
            console.error(ex);
        }
    }
});

router.post('/add', (req, res) => {
    let response = {state: false, msg: 'invalid value'};
    if(req.body.id_game !== undefined){
        for (let i = 0; i < games_memory.games.length; i++) {
            let game = games_memory.games[i];
            if(game.id_game == req.body.id_game){
                response = {state: true, object: game};
                daoGames.insert(game);
                break;
            }
        }
    }
    res.json(response);
});

module.exports = function(browser){
    o_gameInfo = new gameInfo(browser);
    return router;
}