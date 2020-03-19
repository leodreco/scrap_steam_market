const path = require('path');
const consult = require(path.join(__dirname,'connection.js'));

const game = {};

game.list = async () => {
    let games = await consult(`SELECT g.*,count(art.id_article) AS art_quantity FROM game g
                               LEFT JOIN article art on g.id_game = art.id_game
                               GROUP BY g.id_game`);
    // console.log(games);
    return games;
}

game.insert = async (game) => {
    if(!Array.isArray(game)){
        game = Object.keys(game).map( keys => {
            return game[keys];
        });
    };
    return await consult('INSERT INTO game(id_game,game_name,game_img_src) VALUES(? ,? ,?)',game);
}

game.update = async (game) => {
    let sql = `UPDATE game SET game_name = ?, game_img_src = ? WHERE id_game = ?`;
    if(!Array.isArray(game)){
        let values = [];
        let keys = Object.keys(game);
        if(keys.find(k => k == 'id_game') !== false){
            let update = [];
            keys.filter(k => k != 'id_game').forEach((k, i) => {
                values[i] = game[k];
                update[i] = `${k} = ?`;
            });
            values[values.length] = game['id_game'];
            sql = `UPDATE game SET ${update.join(',')} WHERE id_game = ?`;

            return await consult(sql,values);
        }else return false;
    }else{
        return await consult(sql,game); 
    }
    // return await consult(sql,game);
}

game.delete = async (id_game) => {
    if(!Array.isArray(id_game)) id_game = [id_game];
    return await consult('DELETE FROM game WHERE id_game = ?',id_game);
}

// (async () => {
//     await game.update({
//         id_game: 123,
//         game_name: "Don't Starve Toguether",
//         game_img_src: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/322330/a80aa6cff8eebc1cbc18c367d9ab063e1553b0ee.jpg'
//     });
// })();

module.exports = game;