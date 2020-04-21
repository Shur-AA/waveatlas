import { Fill, Stroke, Icon, Style, Text, Circle } from 'ol/style';
var fun = require('../components/functions')
var colorbrewer = require('colorbrewer');

var selectedStyle = new Style({
  stroke: new Stroke({
    color: 'red',
    width: 3
  })
})

function band_style(feature, resolution, palette,
  value, from, to, by, field = 'Z_Mean') {
  var z = feature.get(field);
  return new Style({
    fill: new Fill({
      color: get_color(palette, value, from, to, by)
    })
  })
}

function cont_style(feature, resolution) {
  var idx = feature.get('index');

  return new Style({
    stroke: new Stroke({
      color: '#000058',
      width: (idx == 1) ? 1 : 0.5
    })
  });
}

function cont_label_style(feature, resolution) {
  var idx = feature.get('index');
  var z = fun.round(feature.get('z'), 1);
  console.log('style z ' + z);
  var len = feature.get('shape_leng');
  console.log('style len ' + len);
  var fontstyle = (idx == 1) ? 'bold 14px' : '13px'

  //  if (len > 5e-1 * resolution) {
  return new Style({
    text: new Text({
      text: z.toString(),
      font: `${fontstyle} "Open Sans", "Arial", "sans-serif"`,
      placement: 'line',
      fill: new Fill({
        color: '#000058'
      }),
      stroke: new Stroke({
        color: fun.get_color(colorbrewer.YlGnBu, z, 0, 35, 2.5),
        width: 6
      })
    })
  });
}
// }

function country_style() {
  return new Style({
    stroke: new Stroke({
      color: 'silver',
      width: 0.5
    }),
    fill: new Fill({
      color: 'white'
    })
  })
}


function russia_style() {
  return new Style({
    fill: new Fill({
      color: 'white'
    })
  })
}

function coastline_style() {
  return new Style({
    stroke: new Stroke({
      color: 'steelblue',
      width: 1.5
    })
  })
}

function river_style() {
  return new Style({
    stroke: new Stroke({
      color: 'steelblue',
      width: 0.5
    })
  })
}

function lake_style() {
  return new Style({
    stroke: new Stroke({
      color: 'steelblue',
      width: 0.5
    }),
    fill: new Fill({
      color: 'lightblue'
    })
  })
}

function city_style(label) {
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
      text: label,
      font: '10px Open Sans,sans-serif',
      fill: new Fill({
        color: 'slategray'
      }),
      offsetY: -8,
      offsetX: 10
    }),
  })
}

function port_style() {
  return new Style({
    image: new Circle({
      radius: 2,
      fill: new Fill({
        color: 'pink',
      }),
      stroke: new Stroke({
        color: 'rgba(0,0,0,1)',
        width: 0.5
      })
    })
  })
}


module.exports = {
  selectedStyle,
  band_style,
  cont_style,
  cont_label_style,
  country_style,
  russia_style,
  coastline_style,
  river_style,
  lake_style,
  city_style,
  port_style
}
