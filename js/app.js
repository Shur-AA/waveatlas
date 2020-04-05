var Service = require('node-windows').Service;


// Create a new service object
var svc = new Service({
  name:'Hello World',
  script: require('path').join('E:/Atlas/js','wservice.js')
});

// svc.logOnAs.domain = 'mydomain.local';
// svc.logOnAs.account = 'username';
// svc.logOnAs.password = 'password';


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
  let request = 'select round(CAST(float8(avg("Hsig")) as numeric), 2) as avg_hsig, round(CAST(float8 (avg("Period")) as numeric), 2) as avg_period, round(CAST(float8 (avg("Wlen")) as numeric), 2) as avg_wlen, round(CAST(float8 (avg("Energy")) as numeric), 2) as avg_energy, round(CAST(float8 (max("Hsig")) as numeric), 2) as max_hsig, round(CAST(float8 (max("Period")) as numeric), 2) as max_period, round(CAST(float8 (max("Wlen")) as numeric), 2) as max_wlen, round(CAST(float8 (max("Energy")) as numeric), 2) as max_energy, round(CAST(float8 (min("Hsig")) as numeric), 2) as min_hsig, round(CAST(float8 (min("Period")) as numeric), 2) as min_period, round(CAST(float8 (min("Wlen")) as numeric), 2) as min_wlen, round(CAST(float8 (min("Energy")) as numeric), 2) as min_energy, round(CAST(float8 (percentile_disc(0.5) within group (order by "Hsig")) as numeric), 2) as med_hsig, round(CAST(float8 (percentile_disc(0.5) within group (order by "Period")) as numeric), 2) as med_period, round(CAST(float8 (percentile_disc(0.5) within group (order by "Wlen")) as numeric), 2) as med_wlen, round(CAST(float8 (percentile_disc(0.5) within group (order by "Energy")) as numeric), 2) as med_energy, round(CAST(float8 (stddev("Hsig")) as numeric), 2) as std_hsig, round(CAST(float8 (stddev("Period")) as numeric), 2) as std_period, round(CAST(float8 (stddev("Wlen")) as numeric), 2) as std_wlen, round(CAST(float8 (stddev("Energy")) as numeric), 2) as std_energy from public.chdata where "Hsig" >= 0 and "Period" >= 0 and "Wlen" >= 0 and "Energy" >= 0 and "Index" = ' + ind + ' and ' + '"Datetime" between ' + start + ' and ' + finish;
  console.log('Query string from function: ' + request);
  return request;
}

function fillSupplyRow(field, operator, val, ind){
  switch(operator){
    case 'less': operator = '<';
    break;
    case 'greater': operator = '>';
    break;
    default: operator = '>';
  }
  let request = 'select round(cast(cast(part as float)*100/cast(total as float) as numeric), 1) as supply from(select count("'+ field +'") as part,(select count("'+ field +'") from chdata where "Index" = '+ ind +') as total from chdata where "'+ field +'" '+ operator + val +' and "Index" = '+ ind +') as temporal;'
  console.log('Query string from function: ' + request);
  return request;
}

function fillFullSupply(p, en, wl, hs, ind){
  let request = 'select round(cast(cast(ppart as float)*100/cast(total as float) as numeric), 1) as supper, round(cast(cast(hsigp as float)*100/cast(total as float) as numeric), 1) as suphsig, round(cast(cast(enerp as float)*100/cast(total as float) as numeric), 1) as supenerg, round(cast(cast(wlenp as float)*100/cast(total as float) as numeric), 1) as supwlen from(select count("Period") as ppart, (select count("Period") from chdata where "Index" = ' + ind + ') as total, (select count("Hsig") from chdata where "Hsig" > ' + hs + ' and "Index" = ' + ind + ') as hsigp, (select count("Energy") from chdata where "Energy" > ' + en + ' and "Index" = ' + ind + ') as enerp, (select count("Wlen") from chdata where "Wlen"> ' + wl + ' and "Index" = ' + ind + ') as wlenp from chdata where "Period" > ' + p + ' and "Index" = ' + ind + ') as temporal'
  console.log('Query string from function: ' + request);
  return request;
}

function rosedata(lat, lon){
  wind = "'wind'"
  let request = 'select "vls" from blackchart where "latitude" = ' + lat + ' and "longitude" = ' + lon + 'and "season" =' + wind;
  console.log('Query string from function: ' + request);
  return request;
}

function freqdata(lat, lon, ht){
  let request = 'select "vls", "season" from blackchart where "latitude" = ' + lat + ' and "longitude" = ' + lon + 'and "height" =' + ht;
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
        switch(data.type){
          case 'maintbl':
              var query = fillQtable(reformatDatetime(data.startdate, data.starthour),
              reformatDatetime(data.enddate, data.endhour), data.pindex);
              break;
          case 'supall':
              var query = fillFullSupply(data.period, data.energy, data.wlen, data.hsig, data.pindex);
              break;
          case 'supperiod':
              var query = fillSupplyRow('Period', data.operator, data.period_in, data.pindex);
              break;
          case 'supenergy':
              var query = fillSupplyRow('Energy', data.operator, data.energy_in, data.pindex);
              break;
          case 'suplen':
              var query = fillSupplyRow('Wlen', data.operator, data.wlen_in, data.pindex);
              break;
          case 'supsig':
              var query = fillSupplyRow('Hsig', data.operator, data.hsig_in, data.pindex);
              break;
          case 'rose':
              var query = rosedata(data.lat, data.lon);
              break;
          case 'freq':
              var query = freqdata(data.lat, data.lon, data.height);
              break;
        }
        
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
        // client.connect();
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