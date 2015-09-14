var offset=20;

$("#inicial").click(function(){
		$('#back').prop("disabled", true);
		$("#inicial").prop("disabled", true);
		$('#next').prop("disabled", false);
		$("#ultimo").prop("disabled", false);
		
		$("#limit").text(offset+1);
		$("#offset").text(1);
		SubProgramasGrafica($("#select_By").val(),$("#select_Order").val());
});
$("#back").click(function(){
	if(parseInt($("#offset").text())!=1){
		if(parseInt($("#limit").text())==parseInt($("#totalgraficas").text())){
			$('#next').prop("disabled", false);
			$("#ultimo").prop("disabled", false);
			$("#limit").text(parseInt($("#offset").text())-1);	
		}else{
			$("#limit").text(parseInt($("#limit").text())-offset);	
		}		
		$("#offset").text(parseInt($("#offset").text())-offset);
		SubProgramasGrafica($("#select_By").val(),$("#select_Order").val());
		if(parseInt($("#offset").text())==1){
			$('#back').prop("disabled", true);
			$("#inicial").prop("disabled", true);
		}
		}
	
});
$("#next").click(function(){

	$('#back').prop("disabled", false);
	$("#inicial").prop("disabled", false);
	if((parseInt($("#limit").text())+offset)<parseInt($("#totalgraficas").text())){
		
		$("#offset").text(parseInt($("#offset").text())+offset);
		$("#limit").text(parseInt($("#limit").text())+offset);
		SubProgramasGrafica($("#select_By").val(),$("#select_Order").val());
		
	}else{
		$('#next').prop("disabled", true);
		$("#ultimo").prop("disabled", true);
		$("#limit").text($("#totalgraficas").text());
		$("#offset").text(parseInt($("#offset").text())+offset);
		SubProgramasGrafica($("#select_By").val(),$("#select_Order").val());
	}
});
$("#ultimo").click(function(){
		
		$("#inicial").prop("disabled", false)
		$('#back').prop("disabled", false);
		$('#next').prop("disabled", true);
		$("#ultimo").prop("disabled", true);
		$("#limit").text($("#totalgraficas").text());
		$("#offset").text(parseInt(parseInt($("#totalgraficas").text())/offset)*offset+1);
		
		SubProgramasGrafica($("#select_By").val(),$("#select_Order").val());
});
 $.getJSON('../servicios/GetCuenta.php',{
        tipo:"SubPrograma"
    },function( data ) {
    	console.log(data);
    	$("#totalgraficas").text(parseInt(data[0].count));
    }
 );
 
 var DetalleSubPrograma=function(id_detalle){
	var objetivo,programa,subprograma,meta;
	var detalle=id_detalle.split("-");
	 $.getJSON('../servicios/GetDescripcion.php', {
        tipo:"Objetivo",
        id:detalle[0]
    },function( data ) {
    	objetivo=data[0].descripcion;
    	$.getJSON('../servicios/GetDescripcion.php', {
            tipo:"Programa",
            id:detalle[0]+'-'+detalle[1]
        },function( data ) {
        	programa=data[0].descripcion;
            $.getJSON('../servicios/GetDescripcion.php', {
	            tipo: "SubPrograma",
	            id:detalle[0]+'-'+detalle[1]+'-'+detalle[2]
	        },function( data ) {
	            subprograma=data[0].descripcion;
	            	BootstrapDialog.show({
                    	title: 'Objetivo '+detalle[0]+' Programa '+detalle[1]+' SubPrograma '+detalle[2],
	                    message: '<b>Objetivo</b><br/>'+objetivo+'<br/><br/><b>Programa</b><br/>'
	                    +programa+'<br/><br/><b>SubPrograma</b><br/>'+subprograma,
	                    buttons: [ {
			                label: 'Cerrar',
			                action: function(dialogItself){
			                    dialogItself.close();
			                }
			            }]});
		        
	        });
        });
     });  
 };
var SubProgramasGrafica=function(by,order){
    
   $.getJSON('../servicios/GetSubProgramas.php',{
        order: order,
        by: by,
        OFFSET:parseInt($("#offset").text())-1
    },function( data ) {
       	var contador=0;
        arraycategorias=[];
        $.each( data[0].data, function( key, value ) {
        	contador=parseInt(value.orden)+parseInt($("#offset").text())-1;
            arraycategorias.push(
            	'<small>Orden '+contador+':</small><br> '+
            	'<a onclick="DetalleSubPrograma(\''+value.label+'\')">'+
            	"SubPrograma "+value.id+": "+value.descripcion+'</a>'+'</a><br/>');
        });     
            
         var seriesSubProgramas=[
             data[4],data[3],data[2],data[1]
        ];
        $('#subprogramas').highcharts({
                chart: {
	                height: 120*arraycategorias.length,
	                style: {
	                        fontSize: '11px',
	                        fontFamily: 'Verdana, sans-serif',
	                        'text-align': 'right' 
	                },
	                spacingLeft: 0,
	                spacingRight: 5,
	                marginLeft: 150, 
	                marginRight: 10, 
	                
	                type: 'bar',
	                  options3d: {
	                    enabled: true,
	                    alpha: 0,
	                    beta: 0,
	                    depth: 46
	                },
	                marginTop: 15
	            },
                title: {
                    text: ""
                },
                 xAxis: {
                  	
                    labels: {
                    	padding:10,
	                    useHTML:true,
	                    formatter: function(){
	                    	if(arraycategorias[this.value].length>220){
	                        	return arraycategorias[this.value].substring(0, 220)+" <b>...</b>";
	                       	}else{
	                       		return arraycategorias[this.value].substring(0, 220);	
	                       	}
	                    },
	                    style: {
	                        fontSize: '11px',
	                        fontFamily: 'Verdana, sans-serif'
	                    }
	                },gridLineColor: 'transparent'                   
                },
                yAxis: {
                    min: 0,
                    max:105,
                    title: {
                        text: "Porcentaje según Apropiación"
                    },gridLineColor: 'transparent'
                },
                colors: coloresinver,
                tooltip: {
                    formatter: function () {
                        return this.series.name + ': ' + this.point.labelcolumn + '%<br/>' +
                            'Valor: <b>$' + formato_numero(this.point.dinero,0,',','.')+'</b>';
                    }
                },
                legend: {
	                align: 'right',
	                x: -30,
	                verticalAlign: 'top',
	                y: 0,
	                floating: true,
	                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
	                borderColor: '#CCC',
	                borderWidth: 1,
	                shadow: false
	            },
                plotOptions: {
	                series: {
	                    //stacking: 'normal',
	                    dataLabels: {
	                        allowOverlap:true,
	                        enabled: true,
	                        formatter: function () {
	                            return this.point.labelcolumn  + '%';
	                        },
	                        style: {
	                            color: 'black',
	                            fontSize: '11px',
	                            fontWeight: 'bold',
	                            textShadow: ' 0 0 5px white, 0 0 7px white'
	                        },
	                        crop: false,
	                        enabled: true,
	                        y: 0,
	                        inside: false
	                    },
	                    //groupPadding: 0.1,
	                    pointWidth: 10
	
	                },
	                bar: {
	                	depth:4,
	                    dataLabels: {
	                        enabled: true
	                    }
	                },
	                allowPointSelect: false
	            },
                credits: {
					text: 'SAGA - Sistema de Análisis Geográfico Avanzado',
					href: 'http://saga.cundinamarca.gov.co/'
				},
                series: seriesSubProgramas
        });
    });
};

$( "#select_By" ).change(function() {
    SubProgramasGrafica($("#select_By").val(),$("#select_Order").val());  
});

$( "#select_Order" ).change(function() {
    SubProgramasGrafica($("#select_By").val(),$("#select_Order").val()); 
});

SubProgramasGrafica($("#select_By").val(),$("#select_Order").val());
