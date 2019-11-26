
var layers = require('../components/layers');

function ready(){
    function drawMapName(intext){
        const mapname = document.getElementsByClassName('curchoice');
        mapname[0].textContent = intext;
    };
    

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

        var cur_var = layers.hs_lyr_group;
        map.removeLayer(cur_var);
        var level = 1;

        switch(MapRequestId) {
           case 'hs':
             cur_var = layers.hs_lyr_group;
            //  insert_legend(colorbrewer.RdPu, 0, 18, 1);
             break;
           case 'h3p':
             cur_var = layers.h3p_lyr_group;
            //  insert_legend(colorbrewer.PuRd, 0, 24, 2);
             break;
           case 'hsr':
             cur_var = layers.hsr_lyr_group;
            //  insert_legend(colorbrewer.OrRd, 0, 2.8, 0.2);
             break;
           case 'lsr':
             cur_var = layers.lsr_lyr_group;
            //  insert_legend(colorbrewer.Blues, 0, 80, 5);
             break;
           case 'psr':
             cur_var = layers.psr_lyr_group;
            //  insert_legend(colorbrewer.Greens, 0, 5, 0.5);
             break;
           case 'esr':
             cur_var = layers.esr_lyr_group;
            //  insert_legend(colorbrewer.YlGnBu, 0, 35, 2.5);
             break;
           case 'osr':
             cur_var = layers.osr_lyr_group;
            //  insert_legend(colorbrewer.YlGn, 0, 60, 5);
             break;
           case 'wind_grp_50':
             cur_var = layers.wind_grp_50_lyr_group;
            //  insert_legend(colorbrewer.PuBuGn, 0, 1200, 100);
             level = 2;
             break;
           case 'wind_grp_100':
             cur_var = layers.wind_grp_100_lyr_group;
            //  insert_legend(colorbrewer.PuBuGn, 0, 1200, 100);
             level = 2;
             break;
           case 'wind_grp_50c':
             cur_var = layers.wind_grp_50c_lyr_group;
            //  insert_legend(colorbrewer.PuBuGn, 0, 1200, 100);
             level = 2;
             break;
           case 'wind_grp_100c':
             cur_var = layers.wind_grp_100c_lyr_group;
            //  insert_legend(colorbrewer.PuBuGn, 0, 1200, 100);
             level = 2;
             break;
           case 'wind_spd_50c_year':
             cur_var = layers.wind_spd_50c_lyr_group;
            //  insert_legend(colorbrewer.PuBuGn, 0, 8, 1);
             level = 2;
             break;
           case 'wind_spd_100c_year':
             cur_var = layers.wind_spd_100c_lyr_group;
            //  insert_legend(colorbrewer.PuBuGn, 0, 8, 1);
             level = 2;
             break;
     
         }
     
         map.getLayers().insertAt(level, cur_var);

    });



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

