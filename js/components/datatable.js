// Here we will store code parts which became useless,
// but may be utilized further


const dataform = document.querySelector('#dataform');
const databut = document.querySelector('#calcbut');
databut.addEventListener('click', function(event){
    event.preventDefault();
    console.log(dataform.elements.starttime.value);
})


var startyear = dataform.elements.startdate.value.slice(6, 10);
    var endyear = dataform.elements.enddate.value.slice(6, 10);
    var startmon = parseInt(dataform.elements.startdate.value.slice(3, 5));
    var endmon = parseInt(dataform.elements.enddate.value.slice(3, 5));
    var startday = parseInt(dataform.elements.startdate.value.slice(0, 2));
    var endday = parseInt(dataform.elements.enddate.value.slice(0, 2));
    var starthour = dataform.elements.starttime.value;
    var endhour = dataform.elements.endtime.value;