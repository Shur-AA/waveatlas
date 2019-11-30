const http = require('http');
const { Client } = require('pg');
const querystring = require('querystring');

const hostname = 'localhost';
const port = 3000;

function reformatDatetime(date, time){
  if (time.length == 1){time = '0' + time;};
  var datetime = "'" + date.slice(6, 10) + '-' + date.slice(3, 5) +
   '-' + date.slice(0, 2) + ' ' + time + ":00:00'";
  return datetime
}

function fillQtable(start, finish, ind){
  // var qry = 'select * from public.testdata1 where "Index" = ' + ind + ' and ' + '"Datetime" between ' + start + ' and ' + finish;
  var request = 'select round(CAST(float8(avg("Hsig")) as numeric), 2) as avg_hsig, round(CAST(float8 (avg("Period")) as numeric), 2) as avg_period, round(CAST(float8 (avg("Wlen")) as numeric), 2) as avg_wlen, round(CAST(float8 (avg("Energy")) as numeric), 2) as avg_energy, round(CAST(float8 (max("Hsig")) as numeric), 2) as max_hsig, round(CAST(float8 (max("Period")) as numeric), 2) as max_period, round(CAST(float8 (max("Wlen")) as numeric), 2) as max_wlen, round(CAST(float8 (max("Energy")) as numeric), 2) as max_energy, round(CAST(float8 (min("Hsig")) as numeric), 2) as min_hsig, round(CAST(float8 (min("Period")) as numeric), 2) as min_period, round(CAST(float8 (min("Wlen")) as numeric), 2) as min_wlen, round(CAST(float8 (min("Energy")) as numeric), 2) as min_energy, round(CAST(float8 (percentile_disc(0.5) within group (order by "Hsig")) as numeric), 2) as med_hsig, round(CAST(float8 (percentile_disc(0.5) within group (order by "Period")) as numeric), 2) as med_period, round(CAST(float8 (percentile_disc(0.5) within group (order by "Wlen")) as numeric), 2) as med_wlen, round(CAST(float8 (percentile_disc(0.5) within group (order by "Energy")) as numeric), 2) as med_energy, round(CAST(float8 (stddev("Hsig")) as numeric), 2) as std_hsig, round(CAST(float8 (stddev("Period")) as numeric), 2) as std_period, round(CAST(float8 (stddev("Wlen")) as numeric), 2) as std_wlen, round(CAST(float8 (stddev("Energy")) as numeric), 2) as std_energy from public.chdata where "Hsig" >= 0 and "Period" >= 0 and "Wlen" >= 0 and "Energy" >= 0 and "Index" = ' + ind + ' and ' + '"Datetime" between ' + start + ' and ' + finish;
  console.log('Query string from function: ' + request);
  return request;
}

const server = http.createServer((req, res) => {
      let data = {};
      req.on('data', chunk => {
        console.log('Query parameters sended: ' + chunk);
        data = JSON.parse(chunk);
      });
    
      req.on('end', () => {
        var query = fillQtable(reformatDatetime(data.startdate, data.starthour),
                               reformatDatetime(data.enddate, data.endhour), 2000);
        console.log('Query string from request: ' + query);
        // var query = querystring.parse(data.toString()).query
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