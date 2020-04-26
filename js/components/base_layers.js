import {Tile as TileLayer, Vector as VectorLayer, VectorTile as VectorTileLayer, Image, Group } from 'ol/layer.js';
import VectorSource from 'ol/source/Vector.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import GeoJSON from 'ol/format/GeoJSON';
import TileJSON from 'ol/source/TileJSON.js';
import OSM from 'ol/source/OSM';
import MVT from 'ol/format/MVT';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {Fill, Stroke, Icon, Style, Text, Circle} from 'ol/style';
import TileGrid from 'ol/tilegrid/TileGrid';
import TileWMS from 'ol/source/TileWMS.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import * as olTilegrid from 'ol/tilegrid';
import {createXYZ} from 'ol/tilegrid';

var styles  = require('../appearence/styles');
var fun = require('./functions');
var colorbrewer = require('colorbrewer');

var epsg = 4326;

var host = "localhost:8080/geoserver";

function vtile_source(lyr){
  return new VectorTileSource({
    format: new MVT(),
    projection: 'EPSG:3857',
    dataProjection:'EPSG:4326',
    // featureProjection: 'EPSG:4326',
    url: `http://localhost:3456/public.${lyr}/{z}/{x}/{y}.pbf`
  })
}



var base110_lyr_group = new Group({
  combine: true,
  visible: true,
  maxZoom: 3,
  name: '110m',
  layers: [
    new VectorTileLayer({
      style: styles.russia_style(),
      source: vtile_source('base_110m_russia')
    }),
    new VectorTileLayer({
      style: styles.country_style(),
      source: vtile_source('base_110m_countries')
    }),
    new VectorTileLayer({
      style: styles.coastline_style(),
      source: vtile_source('base_110m_coastline')
    }),
    new VectorTileLayer({
      style: function(feature){
        name = feature.get('name_ru');
        var style = styles.city_style(name);
        return style;
      },
      source: vtile_source('base_110m_cities'),
      declutter: true
    })
  ]
});

var base50_lyr_group = new Group({
  combine: true,
  visible: true,
  minZoom: 3,
  maxZoom: 5,
  name: '50m',
  layers: [
    new VectorTileLayer({
      style: styles.russia_style(),
      source: vtile_source('base_50m_russia')
    }),
    new VectorTileLayer({
      style: styles.country_style(),
      source: vtile_source('base_50m_countries')
    }),
    new VectorTileLayer({
      style: styles.coastline_style(),
      source: vtile_source('base_50m_coastline')
    }),
    new VectorTileLayer({
      style: styles.river_style(),
      source: vtile_source('base_50m_rivers')
    }),
    new VectorTileLayer({
      style: function(feature){
        name = feature.get('name_ru');
        var style = styles.city_style(name);
        return style;
      },
      source: vtile_source('base_50m_cities'),
      declutter: true
    })
  ]
});

var base10_lyr_group = new Group({
  combine: true,
  visible: true,
  minZoom: 5,
  name: '10m',
  layers: [
    new VectorTileLayer({
      style: styles.russia_style(),
      source: vtile_source('base_10m_russia')
    }),
    new VectorTileLayer({
      style: styles.country_style(),
      source: vtile_source('base_10m_countries')
    }),
    new VectorTileLayer({
      style: styles.coastline_style(),
      source: vtile_source('base_10m_coastline')
    }),
    new VectorTileLayer({
      style: styles.river_style(),
      source: vtile_source('base_10m_rivers')
    }),
    new VectorTileLayer({
      style: styles.lake_style(),
      source: vtile_source('base_10m_lakes')
    }),
    new VectorTileLayer({
      style: function(feature){
        name = feature.get('name_ru');
        var style = styles.city_style(name);
        return style;
      },
      source: vtile_source('base_50m_cities'),
      declutter: true
    }),
    new VectorTileLayer({
      style: styles.port_style(),
      source: vtile_source('base_10m_ports')
    })
  ]
});


module.exports = {
  base110_lyr_group,
  base50_lyr_group,
  base10_lyr_group
}
