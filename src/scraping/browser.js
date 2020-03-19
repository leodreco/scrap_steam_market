const puppeteer = require('puppeteer');

const getBrowser = async() => {
    return await puppeteer.launch({
        headless : false,
        defaultViewport : null,
        args : ['--start-maximized']
    });
}

module.exports = getBrowser();