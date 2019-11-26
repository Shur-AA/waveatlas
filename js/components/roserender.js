
function rise(num, datarr) {
    var directions = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180,
        202.5, 225, 247.5, 270, 292.5, 315, 337.5];
    var radius = [0, Math.log(datarr[num]), Math.log(datarr[num]), 0];
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
console.log(dt);
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

function findClosest(tovalue, fromarr){
    let ind = 0;
    let delta = Math.abs(fromarr[ind] - tovalue);
    for (var i = 1; i < fromarr.length; i++) {
        if ((Math.abs(parseFloat(fromarr[i]) - tovalue)) < delta) {
            delta = Math.abs(parseFloat(fromarr[i]) - tovalue);
            ind = i;
        }
    }
    var g = fromarr[ind];
    return g;
}

function render_rose(clicked_lat, clicked_lon) {
    var rose_div = 'rose-graphic';
    var div = document.getElementsByClassName("rose-graphic");
    div[0].style.visibility = 'visible';
    if (localStorage['rose']) {
        var ls_rose = JSON.parse(localStorage['rose']);
        var sealats = Object.keys(ls_rose);
        var your_lat = findClosest(clicked_lat, sealats);
        var sealons = Object.keys(ls_rose[your_lat]);
        var your_lon = findClosest(clicked_lon, sealons);
        console.log('1 ' + ls_rose[your_lat][your_lon]);
        wind_rose(rose_div, ls_rose[your_lat][your_lon]);
    } else {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://shur-aa.github.io/LazoZMU/textdata/black_rose.json');
        xhr.send();
        xhr.onload = function () {
            localStorage['rose'] = JSON.stringify(JSON.parse(this.response));
            var ls_rose = JSON.parse(localStorage['rose']);
            var sealats = Object.keys(ls_rose);
            var your_lat = findClosest(clicked_lat, sealats);
            var sealons = Object.keys(ls_rose[your_lat]);
            var your_lon = findClosest(clicked_lon, sealons);
            console.log('2 ' + ls_rose[your_lat][your_lon]);
            wind_rose(rose_div, ls_rose[your_lat][your_lon]);
        }
    }
    
    window.onbeforeunload = function () {
        localStorage.removeItem(['rose'])
    };
   
}


module.exports = {
    render_rose
}