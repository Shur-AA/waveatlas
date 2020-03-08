var findClosest = require('./roserender').findClosest;

function fill_vars(dataset) {
    for (i = 0; i < 5; i++){
        switch(dataset[i].season){
            case 'fall':
                var fall = (dataset[i].vls).split(',');
                break;
            case 'spring':
                var spring = (dataset[i].vls).split(',');
                break;
            case 'summer':
                var summer = (dataset[i].vls).split(',');
                break;
            case 'winter':
                var winter = (dataset[i].vls).split(',');
                break;
            case 'year':
                var year = (dataset[i].vls).split(',');
                break;
        }
    }
    var text = ["0 - 5", "5 - 10", "10 - 15", "15 - 20", "20 - 25", "25 - 30", "30 - 35", "35 - 40", "> 40"];
    return {year, fall, summer, winter, spring, text};
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
    crd = findClosest(clicked_lat, clicked_lon);
    var freqjson = {"lat": crd[0],
                    "lon": crd[1],
                    "height": clicked_h,
                    "type": "freq"};
    $.ajax({
        url: "http://127.0.0.1:3000/",
        type: "POST",
        data : JSON.stringify(freqjson),
        success : function(data) {
            console.log(data);
            var wind_data = fill_vars(data);
            console.log(wind_data);
            wind_hist(wind_data, wind_div);
        }
    })
}


module.exports = {
    render_hist
}



