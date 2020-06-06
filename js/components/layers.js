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
// import transform from 'ol/proj.js';
import {transform, Projection} from 'ol/proj.js';
import {get as getProjection, getTransform} from 'ol/proj';
import proj4 from 'proj4';
// import proj4 from 'ol/proj/proj4';
import {register} from 'ol/proj/proj4';
import {getWidth, getTopLeft} from 'ol/extent';

var styles  = require('../appearence/styles');
var fun = require('./functions');
var colorbrewer = require('colorbrewer');

var epsg = 4326;

var host = "localhost:8080/geoserver";
// var host2 = "autolab.geogr.msu.ru:8080/geoserver";


var gridNames = ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10', 'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21'];

var resolutions = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5, 4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6, 6.705522537231445E-7, 3.3527612686157227E-7];


var gj = new VectorLayer({
  source: new VectorSource({
      format: new GeoJSON(),
      // dataProjection: 'EPSG:4326',
      projection: 'EPSG:4326',
      url: 'https://shur-aa.github.io/LazoZMU/textdata/ttttttt.geojson'
  }),
  style: new Style({
    stroke: new Stroke({
      color: 'red',
      width: 1
    })
  })
});

// console.log(JSON.stringify(gj));

function vt_source(){
  return new VectorTileLayer({
    style: new Style({
      stroke: new Stroke({
        color: '#000000',
        width: 0.5
      }),
      fill: new Fill({
        color: 'steelblue'
      })
    }),
    source: new VectorTileSource({
      format: new MVT(),
      // projection: 'EPSG:3857',
      // dataProjection:'EPSG:32638',
      // featureProjection: 'EPSG:4326',
      
      url: 'http://localhost:3456/public.esr_band/{z}/{x}/{y}.pbf'
    })
    })
}
var coast_lyr = vt_source()

function vtile_source(lyr){
  return new VectorTileSource({
    format: new MVT(),
    projection: 'EPSG:3857',
    dataProjection:'EPSG:4326',
    // featureProjection: 'EPSG:4326',
    url: `http://localhost:3456/public.${lyr}/{z}/{x}/{y}.pbf`
  })
}


// TEST ************************8

// TEST END ********************8







var esr_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'esr',
  layers: [
    new VectorTileLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       console.log('Z= '+ z);
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGnBu, z, 0, 35, 2.5)
          })
        })
      },
      source: vtile_source('esr_band')
    }),
    new VectorTileLayer({
      style: styles.cont_style,
      source: vtile_source('esr_cont')
    }),
    new VectorTileLayer({
      style: styles.cont_label_style,
      declutter: true,
      source: vtile_source('esr_cont')
    }),
  ]
});






function vector_source(host, name, epsg = 4326){
  return new VectorSource({
    format: new GeoJSON(),
    url: `http://${host}/wavenergy/ows?service=wfs&version=1.1.0&request=GetFeature&typename=${name}&outputFormat=application/json&srsname=EPSG:${epsg}`
  });
}




// var bnd_lyr = new VectorLayer({
//    style: new Style({
//      stroke: new Stroke({
//        color: '#888888',
//        width: 0.5
//      })
//    }),
//    source: vector_source(host, 'wavenergy:ne_10m_admin_0_countries')
// })

var geo_lines = new VectorLayer({
    style: new Style({
      stroke: new Stroke({
        color: '#888888',
        width: 0.5,
        lineDash: [1, 5]
      })
    }),
    source: vector_source(host, 'wavenergy:ne_10m_geographic_lines')
 })


var world_lyr = new VectorLayer({
   style: new Style({
      fill: new Fill({
        color: '#AAAAAA'
      })
    }),
   source: vector_source(host, 'general:world')
})

var land_lyr = new VectorLayer({
  style: new Style({
    fill: new Fill({
      color: '#FFFFFF'
    }),
    stroke: new Stroke({
      color: '#FFFFFF',
      width: 0.5
    })
  }),
  source: vector_source(host, 'wavenergy:ne_10m_admin_0_boundary_lines_land', epsg)
})


// color crutch
var hsr_colors = fun.get_colors(colorbrewer.OrRd, 0, 2.6, 0.2);
var bin_number = function(z, min, step){
  var bin_num = Math.floor((z - min)/step);
  return bin_num
}

var hs_lyr_group = new Group({
  combine: true,
  visible: true,
  title: 'Значительная высота волны',
  name: 'hs',
  layers: [
    new VectorLayer({
     style: function(feature, resolution) {
      var z = feature.get('Z_Mean');
      return new Style({
         fill: new Fill({
           color: fun.get_color(colorbrewer.RdPu, z, 0, 18, 1)
         })
       })
     },
     source: vector_source(host, 'wavenergy:hs_band', epsg)
    }),
    new VectorLayer({
     style: styles.cont_style,
     source: vector_source(host, 'wavenergy:hs_cont', epsg)
    }),
    new VectorLayer({
     declutter: true,
     style: styles.cont_label_style,
     source: vector_source(host, 'wavenergy:hs_cont', epsg)
    })
  ]
})

var h3p_lyr_group = new Group({
  combine: true,
  visible: true,
  title: 'Значительная высота волны',
  name: 'h3p',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('Z_Mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuRd, z, 0, 24, 2)
          })
        })
      },
      source: vector_source(host, 'wavenergy:h3p_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:h3p_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:h3p_cont', epsg)
    })
  ]
});

var hsr_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'hsr',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('Z_Mean');
       return new Style({
          fill: new Fill({
            // color: fun.get_color(colorbrewer.OrRd, z, 0, 2.6, 0.2)
            color: hsr_colors[bin_number(z, 0, 0.2)]
          })
        })
      },
      source: vector_source(host, 'wavenergy:hsr_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:hsr_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:hsr_cont', epsg)
    })
  ]
});

var lsr_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'lsr',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('Z_Mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.Blues, z, 0, 80, 5)
          })
        })
      },
      source: vector_source(host, 'wavenergy:lsr_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:lsr_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:lsr_cont', epsg)
    })
  ]
});

var psr_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'psr',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('Z_Mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.Greens, z, 0, 5, 0.5)
          })
        })
      },
      source: vector_source(host, 'wavenergy:psr_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:psr_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:psr_cont', epsg)
    })
  ]
});

// var esr_lyr_group = new Group({
//   combine: true,
//   visible: true,
//   name: 'esr',
//   layers: [
//     new VectorLayer({
//       style: function(feature, resolution) {
//        var z = feature.get('Z_Mean');
//        return new Style({
//           fill: new Fill({
//             color: fun.get_color(colorbrewer.YlGnBu, z, 0, 35, 2.5)
//           })
//         })
//       },
//       source: vector_source(host, 'wavenergy:esr_band', epsg)
//     }),
//     new VectorLayer({
//       style: styles.cont_style,
//       source: vector_source(host, 'wavenergy:esr_cont', epsg)
//     }),
//     new VectorLayer({
//       declutter: true,
//       style: styles.cont_label_style,
//       source: vector_source(host, 'wavenergy:esr_cont', epsg)
//     })
//   ]
// });

var osr_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'osr',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('Z_MEAN');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGn, z, 0, 60, 5)
          })
        })
      },
      source: vector_source(host, 'wavenergy:osr_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:osr_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:osr_cont', epsg)
    })
  ]
});

var wind_grp_50_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'psr',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('Z_Mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuBuGn, z, 0, 1200, 100)
          })
        })
      },
      source: vector_source(host, 'wavenergy:wind_grp50_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:wind_grp50_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:wind_grp50_cont', epsg)
    })
  ]
});

var wind_grp_100_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'psr',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('Z_Mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuBuGn, z, 0, 1200, 100)
          })
        })
      },
      source: vector_source(host, 'wavenergy:wind_grp100_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:wind_grp100_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:wind_grp100_cont', epsg)
    })
  ]
});

var wind_grp_50c_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'grp_50',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('grp_50');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuBuGn, z, 0, 1200, 100)
          }),
          stroke: new Stroke({
            color: '#000000',
            width: 0.1
          })
        })
      },
      source: vector_source(host, 'wavenergy:wind', epsg)
    })
  ]
});

var wind_grp_100c_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'grp_100',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('grp_100');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuBuGn, z, 0, 1200, 100)
          }),
          stroke: new Stroke({
            color: '#000000',
            width: 0.1
          })
        })
      },
      source: vector_source(host, 'wavenergy:wind', epsg)
    })
  ]
});

var wind_spd_50c_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'wind_spd_50c_lyr_group',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('spd_50_year');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuBuGn, z, 0, 9, 1)
          }),
          stroke: new Stroke({
            color: '#000000',
            width: 0.1
          })
        })
      },
      source: vector_source(host, 'wavenergy:wind', epsg)
    })
  ]
});

var wind_spd_50c_lyr_group = new VectorLayer({
  style: function(feature, resolution) {
   var z = feature.get('spd_50_year');
   return new Style({
      fill: new Fill({
        color: fun.get_color(colorbrewer.PuBuGn, z, 0, 9, 1)
      }),
      stroke: new Stroke({
        color: '#000000',
        width: 0.1
      })
    })
  },
  source: vector_source(host, 'wavenergy:wind', epsg)
});

var wind_spd_100c_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'wind_spd_100c_lyr_group',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('spd_100_year');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuBuGn, z, 0, 9, 1)
          }),
          stroke: new Stroke({
            color: '#000000',
            width: 0.1
          })
        })
      },
      source: vector_source(host, 'wavenergy:wind', epsg)
    })
  ]
});

var city_lyr = new VectorLayer({
  source: vector_source(host, 'wavenergy:ne_10m_populated_places'),
  style: function(feature, resolution) {
    if (feature.get('FEATURECLA') =='Admin-0 capital')
      return new Style({
        image: new Circle({
          radius: 2,
          fill: new Fill({
            color: 'rgba(255,255,255,0.5)',
          }),
          stroke: new Stroke({
            color: 'rgba(0,0,0,1)',
            width: 0.5
          })
        }),
        text: new Text({
          text: feature.get('name_ru'),
          font: '10px Open Sans,sans-serif',
          fill: new Fill({
            color: '#231a24'
          }),
          offsetY: -10
        })
      })
    else return new Style({})
  },
  declutter: true
});


var gebco = new TileWMS({
  url: 'https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?',
  params: {'LAYERS': 'GEBCO_LATEST', 'TILED': true},
  projection: 'EPSG:4326'
});
var gebco_lyr = new TileLayer({
  source: gebco,
});

var wmsSource = new TileWMS({
  url: 'http://localhost:8080/geoserver/wavenergy/wms?service=WMS',
  params: {'LAYERS': 'wavenergy:voronoy_ch', 'TILED': true},
  serverType: 'geoserver',
  crossOrigin: 'anonymous'
});
var wmsLayer = new TileLayer({
  source: wmsSource
});



module.exports = {
  world_lyr,
  hs_lyr_group,
  land_lyr,
  // bnd_lyr,
  coast_lyr,
  city_lyr,
  geo_lines,
  hs_lyr_group,
  h3p_lyr_group,
  hsr_lyr_group,
  lsr_lyr_group,
  psr_lyr_group,
  esr_lyr_group,
  osr_lyr_group,
  wind_grp_50_lyr_group,
  wind_grp_100_lyr_group,
  wind_grp_50c_lyr_group,
  wind_grp_100c_lyr_group,
  wind_spd_50c_lyr_group,
  wind_spd_100c_lyr_group,
  wmsSource,
  gj,
  gebco_lyr,
  // wmsLayer
}
