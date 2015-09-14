    var title_text="OBJETIVOS";
    var yAxis_text="(%) Porcentaje segun Apropiacion del objetivo"; 
    var xAxis_categories= [
                'Objetivo 1',
                'Objetivo 2',
                'Objetivo 3',
                'Objetivo 4'
            ] ;
            
    //var colores=  ['rgba(108,38,16,1)','rgba(158,68,16,1)','rgba(214,133,34,1','rgba(237,166,52,1)'];
    var colores=  ['#337ab7','#5cb85c','#f0ad4e','#d9534f'];
    var coloresinver=['#d9534f','#f0ad4e','#5cb85c','#337ab7' ];
   moment.locale("es"); 
$("#mapaInversión").click(function(){
	var win = window.open("http://saga.cundinamarca.gov.co/SIG/ol3/ol/comparative/", '_blank'); 
	win.focus();
});


$.getJSON("../servicios/GetDescripcion.php?tipo=FechaDatos", function(data, status){
	//console.log(data);
	
	var fechaData=moment(data[0].fecha).subtract(1, 'days').format("DD MMMM  YYYY");
	$("#fechadatos").append(fechaData);
});


var hash = CryptoJS.MD5(moment().format("DDMMYYYY"));
if(sessionStorage.token!=hash.toString(CryptoJS.enc.Base64)){
	 // window.location.assign("http://saga.cundinamarca.gov.co/");
}
