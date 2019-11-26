
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
function fill_vars(lsdt, lat, lon, h) {
    var year = lsdt[lat][lon][h].year;
    var fall = lsdt[lat][lon][h].fall;
    var summer = lsdt[lat][lon][h].summer;
    var winter = lsdt[lat][lon][h].winter;
    var spring = lsdt[lat][lon][h].spring;
    var text = ["0 - 5", "5 - 10", "10 - 15", "15 - 20", "20 - 25", "25 - 30", "30 - 35", "35 - 40", "> 40"];
    return { year, fall, summer, winter, spring, text };
}

function wind_hist(wind_data, divId) {
    var data = [
        {
            histfunc: "sum",
            y: wind_data.year,
            x: wind_data.text,
            type: "histogram",
            name: "year"
        },
        {
            histfunc: "sum",
            y: wind_data.fall,
            x: wind_data.text,
            type: "histogram",
            name: "fall"
            // text: text
        },
        {
            histfunc: "sum",
            y: wind_data.spring,
            x: wind_data.text,
            type: "histogram",
            name: "spring"
        },
        {
            histfunc: "sum",
            y: wind_data.summer,
            x: wind_data.text,
            type: "histogram",
            name: "summer"
        },
        {
            histfunc: "sum",
            y: wind_data.winter,
            x: wind_data.text,
            type: "histogram",
            name: "winter",
            // histnorm:'probability density'
        }
    ];


    var layout = {
        // title: 'Повторяемость скоростей ветра',
        font: {size: 11},
        margin: {
            l: 45,
            r: 45,
            b: 40,
            t: 35,
            pad: 5
          },
      };

    Plotly.newPlot(divId, data, layout, {responsive: true})
}


function render_hist(clicked_lat, clicked_lon){
    var clicked_h = 100;
    var wind_div = 'freq-graphic';
    var div = document.getElementsByClassName("freq-graphic");
    div[0].style.visibility = 'visible';
    // if (localStorage['wind']) {
    //     localStorage.removeItem(['wind']);
    // }
   

    if (localStorage['wind']) {
        var ls_wind = JSON.parse(localStorage['wind']);
        var sealats = Object.keys(ls_wind);
        var your_lat = findClosest(clicked_lat, sealats);
        var sealons = Object.keys(ls_wind[your_lat]);
        var your_lon = findClosest(clicked_lon, sealons);
        var wind_data = fill_vars(ls_wind, your_lat, your_lon, clicked_h);
        wind_hist(wind_data, wind_div);
    } else {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://shur-aa.github.io/LazoZMU/textdata/black_freqwind.json');
        xhr.send();
        xhr.onload = function () {
            localStorage['wind'] = JSON.stringify(JSON.parse(this.response));
            var ls_wind = JSON.parse(localStorage['wind']);
            var sealats = Object.keys(ls_wind);
            var your_lat = findClosest(clicked_lat, sealats);
            var sealons = Object.keys(ls_wind[your_lat]);
            var your_lon = findClosest(clicked_lon, sealons);
            var wind_data = fill_vars(ls_wind, your_lat, your_lon, clicked_h);
            wind_hist(wind_data, wind_div);
        }
    }
    
    window.onbeforeunload = function () {
        localStorage.removeItem(['wind'])
    };

}


module.exports = {
    render_hist
}



