
// backend/server.js
const http = require('http');

const PORT = process.env.PORT || 7000; // Render will set PORT
let messages = [];

const server = http.createServer((req, res) => {
  // Allow frontend to call from Netlify or anywhere
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/send') {
    let body = '';
    req.on('data', chunk => { body += chunk });
    req.on('end', () => {
      const data = JSON.parse(body);
      messages.push({ text: data.text, sender: data.sender });
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ status: 'Message Sent' }));
    });
  } else if (req.method === 'GET' && req.url === '/messages') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(messages));
  } else {
    res.statusCode = 404;
    res.end('Not Found!');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
