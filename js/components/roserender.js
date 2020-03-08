
function rise(num, datarr) {
    var directions = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180,
        202.5, 225, 247.5, 270, 292.5, 315, 337.5];
    var radius = [0, Math.log(parseFloat(datarr[num])), Math.log(parseFloat(datarr[num])), 0];
    if (num == 0) {
        var angle = [0, 352, 8, 0];
    } else {
        var angle = [0, directions[num] - 8, directions[num] + 8, 0];
    };
    var dt = new Object;
    dt = {
        text: datarr[num] + "%",
        name: '',
        type: "scatterpolar",
        mode: "lines",
        r: radius,
        theta: angle,
        fill: "toself",
        fillcolor: '800',
        line: {
            color: 'black'
        }
    }
    return dt
}

function wind_rose(divId, dt) {
    var data = [
        rise(0, dt),
        rise(1, dt),
        rise(2, dt),
        rise(3, dt),
        rise(4, dt),
        rise(5, dt),
        rise(6, dt),
        rise(7, dt),
        rise(8, dt),
        rise(9, dt),
        rise(10, dt),
        rise(11, dt),
        rise(12, dt),
        rise(13, dt),
        rise(14, dt),
        rise(15, dt)
    ]

    var layout = {
        showlegend: false,
        margin: {
            l: 45,
            r: 45,
            b: 15,
            t: 40,
            pad: 5
          },
        polar: {
            radialaxis: {
                // range: [0, 3.8],
                // visible: false,
                tickfont: {
                    size: 1
                }
            },
            angularaxis: {
                tickfont: {
                    size: 11
                },
                dtick: 22.5,
                rotation: 90,
                direction: "clockwise"
            },
            showlegend: false
        }
    }
    Plotly.newPlot(divId, data, layout, {responsive: true})
}

function findClosest(clat, clon){
    let rfi = parseFloat((clat%1).toFixed(1));
    let rlb = parseFloat((clon%1).toFixed(1));
    let five = [0.3, 0.4, 0.5, 0.6, 0.7]
    let flor = [0.1, 0.2] 
    if (five.indexOf(rfi) >= 0){
        if (rfi == 0.3 || rfi == 0.4){
            var llat = parseFloat(clat.toFixed(0)) + 0.5;    
        } else {
            var llat = parseFloat(clat.toFixed(0)) - 0.5; 
        }
    } else if (flor.indexOf(rfi) >= 0){
        var llat = parseFloat(clat.toFixed(0)) + 0.0;
    } else {
        var llat = parseFloat(clat.toFixed(0));
    }

    if (five.indexOf(rlb) >= 0){
        if (rlb == 0.3 || rlb == 0.4){
            var llon = parseFloat(clon.toFixed(0)) + 0.5;    
        } else {
            var llon = parseFloat(clon.toFixed(0)) - 0.5; 
        }
    } else if (flor.indexOf(rlb) >= 0){
        var llon = parseFloat(clon.toFixed(0)) + 0.0;
    } else {
        var llon = parseFloat(clon.toFixed(0));
    }
    var g = [llat, llon];
    return g;
}

function render_rose(clicked_lat, clicked_lon) {
    var rose_div = 'rose-graphic';
    var div = document.getElementsByClassName("rose-graphic");
    div[0].style.visibility = 'visible';
    crd = findClosest(clicked_lat, clicked_lon);
    var rosejson = {"lat": crd[0],
                   "lon": crd[1],
                   "type": "rose"};
    $.ajax({
        url: "http://127.0.0.1:3000/",
        type: "POST",
        data : JSON.stringify(rosejson),
        success : function(data) {
        wind_rose(rose_div, (data[0].vls).split(','));
        }
    })
}


module.exports = {
    render_rose,
    findClosest
}