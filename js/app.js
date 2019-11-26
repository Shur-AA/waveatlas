const http = require('http');
const { Client } = require('pg');
const querystring = require('querystring');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
      let data = []
      req.on('data', chunk => {
        console.log('Response: ' + chunk);
        data = chunk;
      });
    
      req.on('end', () => {
        var query = querystring.parse(data.toString()).query
        const client = new Client({
          user: 'postgres',
          host: 'localhost',
          database: 'wavenergy',
          password: '170496',
          port: 5432,
        })
        client.connect();
      client.query(query, (error, data) => {
        console.log(data.rows);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data.rows));
      });


 
});
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});