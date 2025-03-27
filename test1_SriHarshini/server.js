const http = require('http');
const fs = require('fs');
const path = require('path');
const hostname = '127.0.0.1';

const PORT = 8080;
const DATA_FILE = path.join(__dirname, 'data.json');

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${hostname}:${PORT}`);
    const pathname = url.pathname;

    if (pathname === '/hello-1' && url.searchParams.has('name')) {
        const name = url.searchParams.get('name');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Hi, I am ${name}`);
    } 
    else if (pathname === '/hello-2' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const data = JSON.parse(body);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Hi, I am ${data.name}`);
        });
    } 
    else if (pathname === '/api/data' && req.method === 'GET') {
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'dogs/json' });
                res.end(data);
            }
        });
    } 
    else if (pathname === '/data' && req.method === 'GET') {
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                const jsonData = JSON.parse(data);
                let html = '<html><body><h1>Data</h1><ul>';
                jsonData.forEach(item => {
                    html += `<li>${JSON.stringify(item)}</li>`;
                });
                html += '</ul></body></html>';
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            }
        });
    } 
    else if (pathname === '/add-data' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const newData = JSON.parse(body);
            fs.readFile(DATA_FILE, 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    const jsonData = JSON.parse(data);
                    jsonData.push(newData);
                    fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Error saving data');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            res.end('Data added successfully');
                        }
                    });
                }
            });
        });
    } 
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running on http://${hostname}:${PORT}`);
});