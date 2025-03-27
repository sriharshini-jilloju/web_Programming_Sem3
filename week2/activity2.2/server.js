const http = require('http');
const fs = require('fs');
const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error reading file');
            return;
        }
        const jsonData = JSON.parse(data);

        
        let table = `
            <html>
                <head>
                    <title>Data Table</title>
                </head>
                <body>
                    <table border="1">
                        <tr>
        `;

        
        const keys = Object.keys(jsonData[0]);
        for (let i = 0; i < keys.length; i++) {
            table += `<th>${keys[i]}</th>`;
        }

        table += '</tr>';

        
        for (let i = 0; i < jsonData.length; i++) {
            table += '<tr>';
            const values = Object.values(jsonData[i]);
            for (let j = 0; j < values.length; j++) {
                table += `<td>${values[j]}</td>`;
            }
            table += '</tr>';
        }

        table += `
                    </table>
                </body>
            </html>
        `;

        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(table);
    });
});

server.listen(port,hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}/`);
});
