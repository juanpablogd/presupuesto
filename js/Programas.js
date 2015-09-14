

 var DetallePrograma=function(id_detalle){
	var objetivo,programa;
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
        	BootstrapDialog.show({
            	title: 'Objetivo '+detalle[0]+' Programa '+detalle[1],
                message: '<b>Objetivo</b><br/>'+objetivo+'<br/><br/><b>Programa</b><br/>'
                +programa,
                buttons: [ {
	                label: 'Cerrar',
	                action: function(dialogItself){
	                    dialogItself.close();
	                }
	            }]});
		        
	        
        });
     });  
 };
 
 
var ProgramasGrafica=function(by,order){
    
   $.getJSON('../servicios/GetProgramas.php',{
        order: order,
        by: by
    },function( data ) {
        var contador=1;
        arraycategorias=[];
        var contador=1;
        $.each( data[0].data, function( key, value ) {
        	split_categorias=value.label.split("-");
        	
            arraycategorias.push(
            	'<small>Orden '+contador+':</small>'+	
            	'<a  onclick="DetallePrograma(\''+value.label+'\')" >'
                +" Programa "+split_categorias[1]+": "+value.descripcion+' </a>');
            	contador++;
        });     
            
         var seriesProgramas=[
            data[4],data[3],data[2],data[1]
        ];
        $('#programas').highcharts({
                chart: {
	                height: 120*arraycategorias.length,
	                style: {
	                        fontSize: '13px',
	                        fontFamily: 'Verdana, sans-serif'
	                        
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
	                    depth: 350
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
	                        return arraycategorias[this.value];  
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
                        return this.series.name + ': <b>' + this.point.labelcolumn + '%</b><br/>' +
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
	                        y: 2,
	                        x: 2,
	                        inside: false
	                    },
	                    //groupPadding: 0.1,
	                    pointWidth: 10
	
	                },
	                bar: {
	                	depth:10,
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
                series: seriesProgramas
        });
        
    });
};

$( "#select_By" ).change(function() {
    ProgramasGrafica($("#select_By").val(),$("#select_Order").val());  
});

$( "#select_Order" ).change(function() {
    ProgramasGrafica($("#select_By").val(),$("#select_Order").val()); 
});

ProgramasGrafica($("#select_By").val(),$("#select_Order").val());
