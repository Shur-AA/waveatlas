import Map from 'ol/Map';
import 'ol/ol.css';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Vector from 'ol/source/Vector.js';
import {Vector as VectorLayer, VectorTile as VectorTileLayer, Image, Group } from 'ol/layer.js';
import 'ol/style';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ';
import {transform, Projection} from 'ol/proj.js';
import Overlay from 'ol/Overlay.js';
import Select from 'ol/interaction/Select.js'
import click from 'ol/events/condition.js'
import Graticule from 'ol/layer/Graticule';
import $ from 'jquery';
import {Fill, Stroke, Icon, Style, Text, Circle} from 'ol/style';
import {toStringHDMS} from 'ol/coordinate';
import {fromLonLat, toLonLat} from 'ol/proj';
import {get as getProjection, getTransform} from 'ol/proj';

import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
// import {get as getProjection} from 'ol/proj';

 
var fun = require('./components/functions');
var layers = require('./components/layers');
var baselayerWMS = require('./components/base_layers_wms');
var baseWFSWMS = require('./components/base_layers_wfs');
var styles = require('./appearence/styles');
import * as tools from './components/maps_legend_builder';
const colorbrewer = require('colorbrewer');
const convert = require('color-convert');
var render_rose = require('./components/roserender');
var render_hist = require('./components/gistrender');
var FooPicker = require('./appearence/foopicker.js');

var epsg = 4326;

function insert_legend(palette, from, to, by, id = 'td00') {
  document.getElementById(id).innerHTML = "";
  tools.layeredColoring(0, 0,
              fun.get_colors(palette, from, to, by),
              false, [30, 15], false,
              fun.get_values(from, to, by), "8pt Arial", "black", 30, 20,
              false, "", "bold 10pt Arial");
}

// insert clicked point
var addMarker = function(coordinates){
  
  map.getLayers().forEach(function (layer) {
    if (layer.get('name') == 'xaxa'){
      map.removeLayer(layer);
    } 
  });
  var fill = new Fill({
    color: 'yellow'
  });
  var stroke = new Stroke({
    color: 'red',
    width: 1
  });
  var style = new Style({
    image: new Circle({
      fill: fill,
      stroke: stroke,
      radius: 4
    }),
    fill: fill,
    stroke: stroke
  });
  var point_feature = new Feature({});
  var point_geom = new Point(coordinates);
  point_feature.setGeometry(point_geom);
  var vector_layer = new VectorLayer({
    name: 'xaxa',
    source: new Vector({
      features: [point_feature],
    })
  })
  vector_layer.setStyle(style);

  map.addLayer(vector_layer);
}


// var center =  transform([100, 67], 'EPSG:4326', 'EPSG:3857');
var center = [97, 63];
// var prj = new Projection({
//   code: 'EPSG:4326',
//   units: 'degrees',
//   axisOrientation: 'neu'
// });


var cur_lyr = layers.hs_lyr_group;




// EXPERIMENT WITH PROJECTION *****************************************

// // равновеликая коническая Альберса с параметрами Витковского
// proj4.defs("EPSG:9822","+proj=aea +lat_0=59 +lon_0=108 +lat_1=52.5 +lat_2=78.2 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
// // равновеликая азимутальная Ламберта
// proj4.defs('EPSG:9820', '+proj=laea +lat_0=69 +lon_0=96 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
// register(proj4);
// var test_coordinate = transform([100,40], 'EPSG:4326', 'EPSG:9820');
// console.log('test_coords ' + test_coordinate);

// var extent = [-5000000, 1512900, 5000000, 7000000];
// var extent = [-5500000, -5000000, 5000000, 5000000];
// var projection = getProjection("EPSG:9820");
// console.log(projection);
// // projection.setExtent(extent);

// var center9822 = transform([97,63], 'EPSG:4326', 'EPSG:9820')

// var map = new Map({
//   layers: [
//         // new TileLayer({
//         //   source: new OSM()
//         // }),
//         // layers.gebco_lyr,
//         baselayerWMS.hs_lyr, 
//         // baselayerWMS.wms_base110_lyr_group,
//         baselayerWMS.wms_base50_lyr_group,
        
//       ],
//   target: 'map',
//   view: new View({
//     // projection: projection,
//     center: center9822,
//     projection: 'EPSG:9820',
//     // center: [97,63],
//     zoom: 4
//   })
// });

// END EXPERIMENT *******************************************8888

const map = new Map({
  target: 'map',
  layers: [
    // new TileLayer({
    //   source: new OSM()
    // }),
    // baseWFSWMS.gebco_lyr,
    baseWFSWMS.base110_lyr_group,
    baseWFSWMS.base50_lyr_group,
    baseWFSWMS.base10_lyr_group,
    layers.hs_lyr_group
  ],
  view: new View({
    projection: 'EPSG:4326',
    center: center,
    // center: transform([40, 60], 'EPSG:4326', 'ESRI:54003'),
    // extent: transformExtent([-180, -90, 180, 90], 'EPSG:4326', 'ESRI:54003'),
    zoom: 3,
    // minZoom: 0,
    // maxZoom: 10
  })
});

var coordinate = 0;
map.on('click', function(evt) {
  coordinate = evt.coordinate;
  console.log(coordinate);
  addMarker(coordinate);
  var htbox = document.getElementsByClassName("tb-checkbox");
  htbox[0].checked = false;
  render_rose.render_rose(coordinate[1], coordinate[0]);
  render_hist.render_hist(coordinate[1], coordinate[0], 50);
  var htbox = document.getElementsByClassName("tb-checkbox");
  htbox[0].checked = false;
  var htbox = document.getElementsByClassName("tb-checkbox");
  htbox[0].checked = false;
  htbox[0].addEventListener('change', function(event) {
    if (htbox[0].checked){
      render_hist.render_hist(coordinate[1], coordinate[0], 100);
    } else {
      render_hist.render_hist(coordinate[1], coordinate[0], 50);
    }
  });
  let coors_var = document.getElementById("coords-display");
  coors_var.innerHTML = 'Широта: ' + coordinate[1].toFixed(4) + '<br>' + 'Долгота: ' + coordinate[0].toFixed(4);
});




var point_index = 0;
map.on('singleclick', function(evt) {
  var viewResolution = /** @type {number} */ (map.getView().getResolution());
  var url = layers.wmsSource.getFeatureInfoUrl(
    evt.coordinate, viewResolution, 'EPSG:4326',
    {'INFO_FORMAT': 'application/json'});
  if (url) {
    let parser = new GeoJSON();
    $.ajax({
      url: url,
      type: "POST"
    }).then(function(response){
      let result = parser.readFeatures(response);
      if (result.length){
        var table = document.getElementsByClassName("ww-table");
        document.getElementById("sea_name").innerHTML = 
          result[0].get('sea').toUpperCase() + '<hr class="uk-divider-small">';
        document.getElementById("wave_height").innerHTML = 
          result[0].get('hsr').toFixed(2);
        document.getElementById("wave_lenght").innerHTML = 
          result[0].get('lsr').toFixed(2);
        document.getElementById("wave_period").innerHTML = 
          result[0].get('psr').toFixed(2);
        document.getElementById("wave_energy").innerHTML = 
          result[0].get('esr').toFixed(2);
        document.getElementById("wave_maxh").innerHTML = 
          result[0].get('hs').toFixed(2);
        document.getElementById("wave_maxh3p").innerHTML = 
          result[0].get('h3p').toFixed(2);
        table[0].style.visibility = 'visible';
        point_index = result[0].get('index');
        console.log(point_index);
      } else {
        document.getElementById("sea_name").innerHTML = '';
        document.getElementById("wave_height").innerHTML = '';
        document.getElementById("wave_lenght").innerHTML = '';
        document.getElementById("wave_period").innerHTML = '';
        document.getElementById("wave_energy").innerHTML = '';
        document.getElementById("wave_maxh").innerHTML = '';
        document.getElementById("wave_maxh3p").innerHTML = '';
      }
    })
  }
});


var timedata = document.getElementById("timedatabut");
timedata.addEventListener('click', function (event) {
  var is_seen = document.querySelector('.table_place').style.visibility;
  console.log(is_seen);
  if (is_seen == 'visible'){
    document.querySelector('.table_place').style.visibility = 'hidden';
    document.querySelector('#timeshowbut').style.visibility = 'hidden';
    document.querySelector('.responce_table').style.visibility = 'hidden';
    document.querySelector('.supply_table').style.visibility = 'hidden';
  } else {
    document.querySelector('.table_place').style.visibility = 'visible';
    if (document.getElementById("avg_hsig").innerHTML != ''){
      console.log('table1 not empty');
      document.querySelector('.responce_table').style.visibility = 'visible';
      document.querySelector('#timeshowbut').style.visibility = 'visible';
    };
    if (document.getElementById("periodsup_value").innerHTML != ''){
      console.log('table2 not empty');
      document.querySelector('.supply_table').style.visibility = 'visible';
    }
  }
  
  var foopicker_start = new FooPicker({
    id: 'start',
    dateFormat: 'dd.MM.yyyy'
  });
  var foopicker_end = new FooPicker({
    id: 'finish',
    dateFormat: 'dd.MM.yyyy'
  });
  const dataform = document.querySelector('#dataform');
  const databut = document.querySelector('#calcbut');

  databut.addEventListener('click', function (event) {
    event.preventDefault();
    var startdate = dataform.elements.startdate.value;
    var enddate = dataform.elements.enddate.value;
    var starthour = dataform.elements.startdate.value;
    var starthour = dataform.elements.starttime.value;
    var endhour = dataform.elements.endtime.value;
    console.log(startdate, starthour, enddate, endhour);
    var myjson = {"startdate": startdate,
                  "starthour": starthour,
                  "enddate": enddate,
                  "endhour": endhour,
                  "pindex": point_index,
                  "type": "maintbl"};

    let elem = $(event.currentTarget).parent().parent();
    elem.slideUp(600, function(){
      document.querySelector('#timeshowbut').style.height = 'auto';
      document.querySelector('#timeshowbut').style.visibility = 'visible';
      document.querySelector('#timeshowbut').innerText = startdate + ' ' + starthour + ':00 h  —  ' + enddate + ' ' + endhour + ':00 h';
    });
   
            
    var url = "http://127.0.0.1:3000/"
    if (url) {
      $.ajax({
        url: url,
        type: "POST",
        data : JSON.stringify(myjson),
        success : function(data) {
          console.log(data);
          document.querySelector('.responce_table').style.height = 'auto';
          document.querySelector('.responce_table').style.visibility = 'visible';
          document.getElementById("avg_hsig").innerHTML = data[0].avg_hsig;
          document.getElementById("avg_period").innerHTML = data[0].avg_period;
          document.getElementById("avg_energy").innerHTML = data[0].avg_energy;
          document.getElementById("avg_wlen").innerHTML = data[0].avg_wlen;
          document.getElementById("min_hsig").innerHTML = data[0].min_hsig;
          document.getElementById("min_period").innerHTML = data[0].min_period;
          document.getElementById("min_energy").innerHTML = data[0].min_energy;
          document.getElementById("min_wlen").innerHTML = data[0].min_wlen;
          document.getElementById("max_hsig").innerHTML = data[0].max_hsig;
          document.getElementById("max_period").innerHTML = data[0].max_period;
          document.getElementById("max_energy").innerHTML = data[0].max_energy;
          document.getElementById("max_wlen").innerHTML = data[0].max_wlen;
          document.getElementById("med_hsig").innerHTML = data[0].med_hsig;
          document.getElementById("med_period").innerHTML = data[0].med_period;
          document.getElementById("med_energy").innerHTML = data[0].med_energy;
          document.getElementById("med_wlen").innerHTML = data[0].med_wlen;
          document.getElementById("std_hsig").innerHTML = data[0].std_hsig;
          document.getElementById("std_period").innerHTML = data[0].std_period;
          document.getElementById("std_energy").innerHTML = data[0].std_energy;
          document.getElementById("std_wlen").innerHTML = data[0].std_wlen;
          document.getElementById("period_input").value = data[0].med_period;
          document.getElementById("energy_input").value = data[0].med_energy;
          document.getElementById("len_input").value = data[0].med_wlen;
          document.getElementById("hsig_input").value = data[0].med_hsig;

          var myjson2 = {"period": data[0].med_period,
                        "energy": data[0].med_energy,
                        "wlen": data[0].med_wlen,
                        "hsig": data[0].med_hsig,
                        "pindex": point_index,
                        "type": "supall"};
          $.ajax({
            url: url,
            type: "POST",
            data : JSON.stringify(myjson2),
            success : function(data) {
              console.log(data);
              document.getElementById("periodsup_value").innerHTML = data[0].supper + ' %';
              document.getElementById("energysup_value").innerHTML = data[0].supenerg + ' %';
              document.getElementById("lensup_value").innerHTML = data[0].supwlen + ' %';
              document.getElementById("hsigsup_value").innerHTML = data[0].suphsig + ' %';
              document.querySelector('.supply_table').style.height = 'auto';
              document.querySelector('.supply_table').style.visibility = 'visible';
            }
          })
        }
      })
    }
    $("#timeshowbut").on('click', e => {
      let elem = $(".datetime_manager");
      elem.slideDown(function () {
        document.querySelector('#timeshowbut').style.height = '0';
        document.querySelector('#timeshowbut').style.visibility = 'hidden';
      });
    })
  })
})

// ********************SUPPLY TABLE CHANGE******************

$("#period_input").on('change', e => {
  var changejson = {"period_in": $("#period_input")[0].value,
                  "operator": $("#greater_less1")[0].value,
                  "type": "supperiod"};
  var url = "http://127.0.0.1:3000/";
  $.ajax({
    url: url,
    type: "POST",
    data : JSON.stringify(changejson),
    success : function(data) {
      document.getElementById("periodsup_value").innerHTML = data[0].supply + ' %';
    }
  })
  });


$("#greater_less1").on('change', e => {
    var v = document.getElementById("periodsup_value").innerHTML;
    v = Number((100 - parseFloat(v)).toFixed(1))
    document.getElementById("periodsup_value").innerHTML = v + ' %';
    }
  );


$("#energy_input").on('change', e => {
  var changejson = {"energy_in": $("#energy_input")[0].value,
                  "operator": $("#greater_less2")[0].value,
                  "type": "supenergy"};
  var url = "http://127.0.0.1:3000/";
  $.ajax({
    url: url,
    type: "POST",
    data : JSON.stringify(changejson),
    success : function(data) {
      document.getElementById("energysup_value").innerHTML = data[0].supply + ' %';
    }
  })
  });

  $("#greater_less2").on('change', e => {
    var v = document.getElementById("energysup_value").innerHTML;
    v = Number((100 - parseFloat(v)).toFixed(1))
    document.getElementById("energysup_value").innerHTML = v + ' %';
    }
  );

  $("#len_input").on('change', e => {
    var changejson = {"wlen_in": $("#len_input")[0].value,
                    "operator": $("#greater_less3")[0].value,
                    "type": "suplen"};
    var url = "http://127.0.0.1:3000/";
    $.ajax({
      url: url,
      type: "POST",
      data : JSON.stringify(changejson),
      success : function(data) {
        document.getElementById("lensup_value").innerHTML = data[0].supply + ' %';
      }
    })
    });

    $("#greater_less3").on('change', e => {
      var v = document.getElementById("lensup_value").innerHTML;
      v = Number((100 - parseFloat(v)).toFixed(1))
      document.getElementById("lensup_value").innerHTML = v + ' %';
      }
    );

    $("#hsig_input").on('change', e => {
      var changejson = {"hsig_in": $("#hsig_input")[0].value,
                      "operator": $("#greater_less4")[0].value,
                      "type": "supsig"};
      var url = "http://127.0.0.1:3000/";
      $.ajax({
        url: url,
        type: "POST",
        data : JSON.stringify(changejson),
        success : function(data) {
          document.getElementById("hsigsup_value").innerHTML = data[0].supply + ' %';
        }
      })
      });

$("#greater_less4").on('change', e => {
  var v = document.getElementById("hsigsup_value").innerHTML;
  v = Number((100 - parseFloat(v)).toFixed(1));
  document.getElementById("hsigsup_value").innerHTML = v + ' %';
  }
);



// ********************SUPPLY TABLE CHANGE END************************

function ready(){
  console.log('Function ready start');
  function drawMapName(intext){
      console.log('Function drow map name start')
      const mapname = document.getElementsByClassName('curchoice');
      mapname[0].textContent = intext;
  };
  

  drawMapName('МАКСИМАЛЬНАЯ ВЫСОТА ЗНАЧИТЕЛЬНЫХ ВОЛН, [М]');

  var cur_var = layers.hs_lyr_group;
  // console.log(cur_var)
  const lili = document.getElementsByClassName('uk-dropdown-nav');
  lili[0].addEventListener('click', function(event) {
      event.preventDefault();
      let selection = event.target.parentElement;
      var MapRequestId = selection.id;
      drawMapName(selection.innerText);
      let lis = lili[0].childNodes;
      lis.forEach((item) => {
          if (item.classList){
              if (item.classList.contains('uk-active')) {
                  item.classList.remove('uk-active')
              }
          }
      });
      selection.classList.add('uk-active');

      // console.log(cur_var);
      map.removeLayer(cur_var);
      var level = 1;

      switch(MapRequestId) {
         case 'hs':
           cur_var = layers.hs_lyr_group;
           insert_legend(colorbrewer.RdPu, 0, 18, 1);
           break;
         case 'h3p':
           cur_var = layers.h3p_lyr_group;
           insert_legend(colorbrewer.PuRd, 0, 24, 2);
           break;
         case 'hsr':
           cur_var = layers.hsr_lyr_group;
           insert_legend(colorbrewer.OrRd, 0, 2.6, 0.2);
           break;
         case 'lsr':
           cur_var = layers.lsr_lyr_group;
           insert_legend(colorbrewer.Blues, 0, 80, 5);
           break;
         case 'psr':
           cur_var = layers.psr_lyr_group;
           insert_legend(colorbrewer.Greens, 0, 5, 0.5);
           break;
         case 'esr':
           cur_var = layers.esr_lyr_group;
           insert_legend(colorbrewer.YlGnBu, 0, 35, 2.5);
           break;
         case 'osr':
           cur_var = layers.osr_lyr_group;
           insert_legend(colorbrewer.YlGn, 0, 60, 5);
           break;
         case 'wind_grp_50':
           cur_var = layers.wind_grp_50_lyr_group;
           insert_legend(colorbrewer.PuBuGn, 0, 1200, 100);
           level = 2;
           break;
         case 'wind_grp_100':
           cur_var = layers.wind_grp_100_lyr_group;
           insert_legend(colorbrewer.PuBuGn, 0, 1200, 100);
           level = 2;
           break;
         case 'wind_grp_50c':
           cur_var = layers.wind_grp_50c_lyr_group;
           insert_legend(colorbrewer.PuBuGn, 0, 1200, 100);
           level = 2;
           break;
         case 'wind_grp_100c':
           cur_var = layers.wind_grp_100c_lyr_group;
           insert_legend(colorbrewer.PuBuGn, 0, 1200, 100);
           level = 2;
           break;
         case 'wind_spd_50c_year':
           cur_var = layers.wind_spd_50c_lyr_group;
           insert_legend(colorbrewer.PuBuGn, 0, 8, 1);
           level = 2;
           break;
         case 'wind_spd_100c_year':
           cur_var = layers.wind_spd_100c_lyr_group;
           insert_legend(colorbrewer.PuBuGn, 0, 8, 1);
           level = 2;
           break;
   
       }
   
       map.getLayers().insertAt(level, cur_var);

  });

  tools.tablesInit(1, [1], "legendplace");
  insert_legend(colorbrewer.RdPu, 0, 18, 1);

  const closeBut = document.getElementsByClassName('fa-times-circle');
  closeBut[0].addEventListener('click', function(event) {
      let rg = document.getElementsByClassName('rose-graphic');
      rg[0].style.visibility = 'hidden';
      let prnt = document.getElementsByClassName('graphics');
      prnt[0].style.justifyContent = 'start';
      prnt[0].style.paddingLeft = '4px';
  })
  closeBut[1].addEventListener('click', function(event) {
      let fg = document.getElementsByClassName('freq-graphic');
      fg[0].style.visibility = 'hidden';
      let prnt = document.getElementsByClassName('graphics');
      prnt[0].style.justifyContent = 'start';
      prnt[0].style.paddingLeft = '4px';
  })
  closeBut[2].addEventListener('click', function(event) {
      let tbl = document.getElementsByClassName('ww-table');
      tbl[0].style.visibility = 'hidden';
  })
}
document.addEventListener("DOMContentLoaded", ready);