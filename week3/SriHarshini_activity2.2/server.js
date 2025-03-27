const http = require('http');
const fs = require('fs');
const path = require('path');


const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;

 
  if (url === '/form' && method === 'GET') {
    const filePath = path.join(__dirname, 'public', 'form.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading form.');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  }

  
  else if (url === '/data' && method === 'GET') {
    const filePath = path.join(__dirname, 'data.json');
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading data.');
      } else {
        const jsonData = JSON.parse(data);
        let htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Data</title>
          </head>
          <body>
            <h1>Stored Data</h1>
            <table border="1">
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Email</th>
              </tr>
        `;
        for (let i = 0; i < jsonData.length; i++) {
          htmlContent += `
              <tr>
                <td>${jsonData[i].name}</td>
                <td>${jsonData[i].age}</td>
                <td>${jsonData[i].email}</td>
              </tr>
          `;
        }
        htmlContent += `
            </table>
          </body>
          </html>
        `;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlContent);
      }
    });
  }

  // API route to add data
  else if (url === '/api/create' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const parsedData = {};
      const pairs = body.split('&');
      for (let i = 0; i < pairs.length; i++) {
        const [key, value] = pairs[i].split('=');
        parsedData[key] = decodeURIComponent(value.replace(/\+/g, ' '));
      }

      const newData = {
        name: parsedData.name,
        age: parsedData.age,
        email: parsedData.email,
      };

      const filePath = path.join(__dirname, 'data.json');
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error reading data.');
        } else {
          const jsonData = data ? JSON.parse(data) : [];
          jsonData.push(newData);
          fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Error saving data.');
            } else {
              res.writeHead(302, { Location: '/data' });
              res.end();
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


const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
