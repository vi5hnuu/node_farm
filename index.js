//require core then 3rd-party then our modules
const fs = require('fs')
const http = require('http')
const url = require('url')
const slugify = require('slugify')
const replaceTemplate = require('./modules/replaceTemplate')//. points to where index.js resides
/////////////////////////////////
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, { encoding: 'utf-8' })
const temp_overview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, { encoding: 'utf-8' })
const temp_card = fs.readFileSync(`${__dirname}/templates/template-card.html`, { encoding: 'utf-8' })
const temp_product = fs.readFileSync(`${__dirname}/templates/template-product.html`, { encoding: 'utf-8' })

const productsObj = JSON.parse(data)

//use of 3rd party package
// const slugs = productsObj.map(el => slugify(el.productName, { lower: true }))
// console.log(slugs);
/////////////////////////////////
/////////////////////////////////
const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true)
    //overview page
    console.log(url.parse(req.url, true));
    if (pathname === '/overview' || pathname === '/') {
        const cardsHtml = productsObj.map((product, index, arr) => {
            return replaceTemplate(temp_card, product)
        }).join('')
        const output = temp_overview.replace(/{%PRODUCT_CARD%}/g, cardsHtml)
        res.writeHead(200, { 'Content-type': 'text/html' })
        res.end(output);
    }
    //product page
    else if (pathname === '/product') {
        const product = productsObj[query.id]
        const output = replaceTemplate(temp_product, product)
        res.writeHead(200, { 'Content-type': 'text/html' })
        res.end(output)
    }
    //api
    else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(data)
    }
    //not found
    else {
        res.writeHead(404, {
            'Content-type': 'text/plain',
            'my-own-header': 'vishnu'
        })
        res.end(`<h1>404 not found.</h1>`)
    }
})
server.listen(3000, '127.0.0.1', () => {
    console.log('listening');
})