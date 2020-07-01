const http = require('http');
const url = require('url');
const fs = require('fs');

const fillTemplate = (targetTempate, dataFile) => {
    let template = targetTempate;
    template = template.replace(/{%id%}/g, dataFile.id);
    template = template.replace(/{%product-image%}/g, dataFile.image);
    template = template.replace(/{%product-name%}/g, dataFile.productName);
    if (dataFile.organic) {
        template = template.replace(/{%product-organic%}/g, 'ORGANIC!');
    } else {
        template = template.replace(/{%product-organic%}/g, '');
        template = template.replace(/{%not-organic%}/g, 'not-organic');
    }
    template = template.replace(/{%product-quantity%}/g, dataFile.quantity);
    template = template.replace(/{%product-price%}/g, dataFile.price);
    template = template.replace(/{%product-from%}/g, dataFile.from);
    template = template.replace(/{%product-nutrients%}/g, dataFile.nutrients);
    template = template.replace(/{%product-description%}/g, dataFile.description);

    return template;
}

const data = fs.readFileSync(`${__dirname}/api-file/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
let overview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const overviewCard = fs.readFileSync(`${__dirname}/templates/overview-card.html`, 'utf-8');
const product = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');

const server = http.createServer((request, response) => {
    const { query, pathname } = url.parse(request.url);

    if (pathname === '/' || pathname === '/overview') {
        response.writeHead(200, 'text/html');
        const output = dataObj.map(el => fillTemplate(overviewCard, el)).join('');
        overview = overview.replace('{$all-cards$}', output);
        response.end(overview);
    } else if (pathname === '/product') {
        response.writeHead(200, 'text/html');
        const id = parseInt(query.slice(3, 4));
        const idIndex = dataObj.findIndex(el => el.id === id);
        const specificProduct = fillTemplate(product, dataObj[idIndex]);
        response.end(specificProduct);
    } else {
        response.writeHead(404, {
            'content-type': 'text/html'
        });
        response.end('<h1 style="text-align:center; margin-top: 2rem;">Code 404, Page Not Found :(</h1>');
    }
});

server.listen(786, '127.0.0.1', () => {
    console.log('server is listening...');
});