import 'ol/ol.css';
import {Map, View} from 'ol';
import {Tile as TileLayer, Vector as VectorLayer, VectorTile as VectorTileLayer, Group } from 'ol/layer.js';
import VectorSource from 'ol/source/Vector.js';
import {VectorTileSource} from 'ol/source/VectorTile.js';
import GeoJSON from 'ol/format/GeoJSON';
import JSONFeature from 'ol/format/JSONFeature';
import TileJSON from 'ol/source/TileJSON.js';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import MVT from 'ol/format/MVT.js';
import {Fill, Stroke, Icon, Style, Text, Circle} from 'ol/style';
import TileGrid from 'ol/tilegrid/TileGrid';
import TileWMS from 'ol/source/TileWMS.js';
import {transform, Projection} from 'ol/proj.js';
var fun = require('./functions.js');
var colorbrewer = require('colorbrewer');
import $ from 'jquery';
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import flatpickr from 'flatpickr';
import { Russian } from "flatpickr/dist/l10n/ru.js";
import Stamen from 'ol/source/Stamen';

var sel_date = '2019-09-30';
var sel_time = '00';

var loaded = false;
var filtering = true;
var show_netatmo = true;
var netatmo_loaded = false;
var netatmo_cleared = false;

var net_level = 1;

var num_observ = 0;
var min_date = sel_date;
var max_date = sel_date;

var min_temp = 0;
var max_temp = 0;
var error_temp = 1;

var epsg = 4326;
var host = "autolab.geogr.msu.ru/public/geoserver";

function vector_source(host, name, epsg = 4326){
  return new VectorSource({
    format: new GeoJSON(),
    url: `http://${host}/wfs?service=wfs&version=1.1.0&request=GetFeature&typename=${name}&outputFormat=application/json&srsname=EPSG%3A${epsg}`
  });
}

function netatmo_style(feature, resolution) {
  var z = Math.round(feature.get('temperature') * 10) / 10;
  if (z != null) {
    if (!filtering || (z >= min_temp - error_temp && z <= max_temp + error_temp)) {
      return new Style({
        image: new Circle({
          radius: 11,
          fill: new Fill({
            color: fun.select_color(z)
          }),
          stroke: new Stroke({
            color: 'rgba(255,255,255,1)',
            width: 0.5
          }),
        }),
        text: new Text({
          text: z.toString(),
          font: '8px Open Sans,sans-serif',
          fill: new Fill({
            color: fun.get_text_color(z)
          }),
        })
      })
    }
  }
}

var netatmo_source1 = new VectorSource({
  format: new GeoJSON(),
  loader: function(extent, resolution, projection) {
    $('#spinner').show();
    $.ajax({
      url : 'http://autolab.geogr.msu.ru/netatmo',
      type : 'POST',
      data : {
        query : `select * from get_netatmo_temp('${sel_date} ${sel_time}:00:00+03'::timestamptz)`,
      },
      success : function(data) {
        var features = netatmo_source1.getFormat().readFeatures(data, {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
        netatmo_source1.addFeatures(features);
        netatmo_loaded = true;
        // console.log('1 - YEAH!');

        net_lyr = net_lyr1;
        net_back_lyr = net_lyr2;
        if (show_netatmo) {
          // console.log('loaded source 1');
          // console.log('set unvisible 2');
          net_lyr.setVisible(true);
          net_back_lyr.setVisible(false);
        }

        $('#spinner').hide();
      }
    })
  }
});

var netatmo_source2 = new VectorSource({
  format: new GeoJSON(),
  loader: function(extent, resolution, projection) {
    $('#spinner').show();
    $.ajax({
      url : 'http://autolab.geogr.msu.ru/netatmo',
      type : 'POST',
      data : {
        query : `select * from get_netatmo_temp('${sel_date} ${sel_time}:00:00+03'::timestamptz)`,
      },
      success : function(data) {
        var features = netatmo_source2.getFormat().readFeatures(data, {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
        netatmo_source2.addFeatures(features);
        netatmo_loaded = true;
        // console.log('2 - YEAH!');

        net_lyr = net_lyr2;
        net_back_lyr = net_lyr1;
        if (show_netatmo) {
          // console.log('loaded source 2');
          // console.log('set unvisible 1');
          net_lyr.setVisible(true);
          net_back_lyr.setVisible(false);
        }

        $('#spinner').hide();
      }
    })
  }
});

var net_lyr1 = new VectorLayer({
  source: netatmo_source1,
  style: netatmo_style,
  visible: false,
  declutter: true
});

var net_lyr2 = new VectorLayer({
  source: netatmo_source2,
  style: netatmo_style,
  visible: false,
  declutter: true
});

var net_lyr = net_lyr1;
var net_back_lyr = net_lyr2;

var wea_lyr = new VectorLayer({
  source: vector_source(host, 'uclim:weaclim'),
  style: function(feature, resolution) {
      if (feature.get('Datetime') == `${sel_date}T${sel_time}:00:00Z`) {
        var z = feature.get('T');
        return [
          new Style({
            image: new Circle({
              radius: 17,
              fill: new Fill({
                color: fun.select_color(z)
              }),
              stroke: new Stroke({
                color: 'rgba(0,0,0,1)',
                width: 1
              }),
            }),
            text: new Text({
              text: z.toString(),
              font: 'bold 12px Open Sans,sans-serif',
              fill: new Fill({
                color: fun.get_text_color(z)
              }),
            })
          }),
          new Style({
            text: new Text({
              text: feature.get('NAME'),
              overflow: true,
              font: 'bold 10px Open Sans,sans-serif',
              stroke: new Stroke({
                color: 'rgba(255,255,255,1)',
                width: 3
              }),
              offsetY: -25
            })
          })
        ]
      }
    }
});

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new Stamen({
        layer: 'toner'
      }),
      opacity: 0.15
    }),
    net_back_lyr,
    net_lyr,
    wea_lyr
  ],
  view: new View({
    center: transform([37.6, 55.7], 'EPSG:4326', 'EPSG:3857'),
    zoom: 10
  })
});

function reset_styles() {
  $('#min_date').removeClass("btn-outline-danger").addClass("btn-outline-secondary");
  $('#btn_prev').removeClass("btn-outline-danger").addClass("btn-outline-primary");
  $('#max_date').removeClass("btn-outline-danger").addClass("btn-outline-secondary");
  $('#btn_next').removeClass("btn-outline-danger").addClass("btn-outline-primary");
}

function check_extremes(datetime) {
  reset_styles()
  if (datetime.getHours() == min_date.getHours() &&
      datetime.getFullYear() == min_date.getFullYear() &&
      datetime.getMonth() == min_date.getMonth()){
    $('#min_date').removeClass("btn-outline-secondary").addClass("btn-outline-danger");
    $('#btn_prev').removeClass("btn-outline-primary").addClass("btn-outline-danger");
  } else if (datetime.getHours() == max_date.getHours() &&
      datetime.getFullYear() == max_date.getFullYear() &&
      datetime.getMonth() == max_date.getMonth()){
    $('#max_date').removeClass("btn-outline-secondary").addClass("btn-outline-danger");
    $('#btn_next').removeClass("btn-outline-primary").addClass("btn-outline-danger");
  }
}

var pickr = flatpickr("#datetime", {
    dateFormat: "Y-m-d",
    defaultDate: max_date,
    maxDate: max_date,
    minDate: min_date,
    locale: Russian,
    onChange: function(selectedDates, dateStr, instance) {
        sel_date = dateStr;
        wea_lyr.getSource().changed();

        // console.log('CLEAR');
        netatmo_cleared = true;
        net_back_lyr.getSource().clear();

        // console.log('CHANGE DATE');
        netatmo_loaded = false;
        if (show_netatmo) {
          net_back_lyr.setVisible(true);
        }

        var datetime = new Date(`${sel_date}T${sel_time}:00:00Z`);
        check_extremes(datetime);
    }
});

// netatmo_source1.on('change', function(evt){
//   if (netatmo_source1.getState() == 'ready') {
//     if (netatmo_cleared) {
//       netatmo_cleared = false;
//       console.log('cleared source 1');
//     } else if (netatmo_loaded ) {
//       net_lyr = net_lyr1;
//       net_back_lyr = net_lyr2;
//       if (show_netatmo) {
//         console.log('loaded source 1');
//         console.log('set unvisible 2');
//         net_back_lyr.setVisible(false);
//       }
//     }
//   }
// });

// netatmo_source2.on('change', function(evt){
//   if (netatmo_source2.getState() == 'ready') {
//     if (netatmo_cleared) {
//       netatmo_cleared = false;
//       console.log('cleared source 2');
//     } else if (netatmo_loaded) {
//       net_lyr = net_lyr2;
//       net_back_lyr = net_lyr1;
//       if (show_netatmo) {
//         console.log('loaded source 2');
//         console.log('set unvisible 1');
//         net_back_lyr.setVisible(false);
//       }
//     }
//   }
// });

wea_lyr.getSource().on('change', function(evt){
  var source = evt.target;
  if (source.getState() === 'ready' && !loaded) {

    var features = source.getFeatures();
    var dates = [];
    var feature;

    // console.info(features[0]);

    num_observ = features.length;

    var i;

    for (i = 0; i < num_observ; i++) {
      dates.push(new Date(features[i].get('Datetime')));
    }


    min_date = new Date(Math.min.apply(null,dates));
    max_date = new Date(Math.max.apply(null,dates));

    console.log("Total number of observations: " + num_observ);
    console.log("Minimum date: " + min_date);
    console.log("Maximum date: " + max_date);

    sel_date = max_date.toJSON().slice(0,10);

    pickr.set('minDate', min_date.toJSON().slice(0,10));
    pickr.set('maxDate', max_date.toJSON().slice(0,10));
    pickr.setDate(sel_date);

    $("#min_date").text("От: " + min_date.toLocaleDateString())
    $("#max_date").text("До: " + max_date.toLocaleDateString());

    $('#spinner').hide();

  }

  var current_features = evt.target.getFeatures().filter(function(feature) {
    return feature.values_['Datetime'] == `${sel_date}T${sel_time}:00:00Z`;
  });

  var i;
  var temps = [];

  for (i = 0; i < current_features.length; i++) {
    temps.push(current_features[i].get('T'));
  }

  min_temp = Math.min.apply(null, temps);
  max_temp = Math.max.apply(null, temps);

  if (!loaded) {
    net_lyr.setVisible(true);
    loaded = true;
  }

});

$("input[name='time']").change(function(){
    sel_time = $('input[name=time]:checked').val();
    var datetime = new Date(`${sel_date}T${sel_time}:00:00Z`);
    check_extremes(datetime);
    wea_lyr.getSource().changed();

    // console.log('CLEAR');
    netatmo_cleared = true;
    net_back_lyr.getSource().clear();

    // console.log('CHANGE TIME');
    netatmo_loaded = false;
    if (show_netatmo) {
      net_back_lyr.setVisible(true);
    }
});

function set_time(datetime) {
  if (datetime <= max_date && datetime >= min_date) {
    sel_date = datetime.toJSON().slice(0,10);
    sel_time = datetime.toJSON().slice(11,13);
    pickr.setDate(sel_date);
    $(`#t${sel_time}`).click();
    check_extremes(datetime);
  }
}

function delta_time(delta) {
  // TODO: double clear-change time
  var datetime = new Date(`${sel_date}T${sel_time}:00:00Z`);
  datetime.setHours(datetime.getHours() + delta);
  set_time(datetime);
}

$('#min_date').on('click', function(event) {
  set_time(min_date);
});

$('#max_date').on('click', function(event) {
  set_time(max_date);
});

$('#btn_prev').on('click', function(event) {
  delta_time(-3);
});

$('#btn_next').on('click', function(event) {
  delta_time(3);
});

$('#show_hydromet').on('change',function (event) {
  if (this.checked) {
    wea_lyr.setVisible(true);
  } else {
    wea_lyr.setVisible(false);
  }
  event.preventDefault();
});

$('#show_netatmo').on('change',function (event) {
  if (this.checked) {
    show_netatmo = true;

    if (netatmo_loaded) {
      net_lyr.setVisible(true);
    } else {
      net_back_lyr.setVisible(true);
    }

  } else {
    show_netatmo = false;
    net_lyr.setVisible(false);
  }
  event.preventDefault();
});

$('#filter_netatmo').on('change',function (event) {
  if (this.checked) {
    filtering = true;
    net_lyr.getSource().changed();
  } else {
    filtering = false;
    net_lyr.getSource().changed();
  }
  event.preventDefault();
});
