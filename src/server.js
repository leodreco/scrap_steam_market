const path = require('path');
const express = require('express');
const app = express();

const puppeteer = require('puppeteer');
const browser = puppeteer.launch({headless: false, defaultViewport: null, args: ['--start-maximized']});

app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
// arreglar error y despues añadir esto
// app.use('/simple-datatables',express.static(path.join(__dirname,'../node_modules/simple-datatables/dist')))

app.use('/',require('./routes/index'));
app.use('/games',require('./routes/games')(browser));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req ,res ,next) => {
    res.status(404);
    res.end();
});

app.listen(80, () => {
    console.log("Escuchando en el puerto 80");
});