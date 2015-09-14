var recorrido_objetivo="";
var recorrido_programa="";
var recorrido_subprograma="";

$( "#recorrido_select_By,#recorrido_select_Order" ).change(function() {
 	  if(recorrido_subprograma!=""){
 	  	MetasGrafica(recorrido_subprograma);
 	  }else if(recorrido_programa!=""){
 	  	SubProgramasGrafica(recorrido_programa);	
 	  }else if(recorrido_objetivo!=""){	 
 	  	grfSercretariaPrograma(recorrido_objetivo);
 	  }
});
function funcion_regresar(){
	  if(recorrido_subprograma!=""){
	  	recorrido_subprograma="";
 	  	SubProgramasGrafica(recorrido_programa);
 	  }else if(recorrido_programa!=""){
 	  	recorrido_programa="";
 	  	grfSercretariaPrograma(recorrido_objetivo);	
 	  }else if(recorrido_objetivo!=""){
 	  	recorrido_objetivo="";	 
 	  	GeneralGrafica();
 	  }
}



function filtrarObjetivo(id_objetivo){
	recorrido_objetivo=id_objetivo;
	grfSercretariaPrograma(id_objetivo);	
}
var GeneralGrafica=function(){
    
   $.getJSON('../servicios/GetObjetivos.php',function( data ) {
        
        arraycategorias=[];
            
            $.each( data[0].data, function( key, value ) {
                arraycategorias.push(               
                	"Objetivo "+value.id+":  "+
                	value.descripcion+
                	'<br><button type="button" class="btn btn-primary btn-xs" onclick="filtrarObjetivo('+value.id+')">'+
					  '<span class="glyphicon glyphicon-glass" aria-hidden="true"></span>'+
					'</button>'
                );
            });     
            
         $("#titulo_recorrido").empty().append('<i class="fa fa-check-circle fa-fw"></i><b>Objetivos</b>')
         var seriesObjetivo=[
              data[4],data[3],data[2],data[1]
         ];
        $("#SelectOrden,#regresar").hide();
        
        
        $('#graficaRecorrido').highcharts({
                chart: {
                    height: 150*arraycategorias.length,
                    type: 'bar',
                    spacingLeft: 0,
                    spacingRight: 5,
                    marginLeft: 150, 
                    marginRight: 20, 
                    
                    type: 'bar',
                      options3d: {
                        enabled: true,
                        alpha: 2,
                        beta: 2,
                        depth: 80
                    },
                    marginTop: 20
                },
                title: {
                    text: ""
                },
                xAxis: {
                     labels: {
                    	padding:10,
	                    useHTML:true,
	                    formatter: function(){
	                    	if(arraycategorias[this.value].length>400){
	                        	return arraycategorias[this.value].substring(0, 400)+" <b>...</b>";
	                       	}else{
	                       		return arraycategorias[this.value].substring(0, 400);	
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
                        return this.series.name + ': <b>' + this.point.labelcolumn + '%<br/></b>' +
                            'Valor: <b>$' + formato_numero(this.point.dinero,0,',','.')+'</b>';
                    }
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
	                	depth:40,
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
                series: seriesObjetivo
        });
    });
}
GeneralGrafica();


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
 				
var grfSercretariaPrograma=function(id_objetivo){
	
	$("#titulo_recorrido").empty().append('<i class="fa fa-check-circle fa-fw"></i><b>Objetivos '+id_objetivo+'</b>')
   $.getJSON('../servicios/GetProgramas.php',{
   	order: $("#recorrido_select_Order").val(),
   	by: $("#recorrido_select_By").val(),
   	idobjetivo:id_objetivo  	
   },function( data ) {
       arraycategorias=[];
       contador=1;
       $.each( data[0].data, function( key, value ) {
       			split_categorias=value.label.split("-");
                arraycategorias.push(
                	'<small>Orden '+contador+':</small>'+
                	'<a  onclick="DetallePrograma(\''+value.label+'\')" >'
                	+"Programa "+split_categorias[1]+": "+value.descripcion+' </a>'+
                	'<br><button type="button" class="btn btn-primary btn-xs" onclick="filtrarPrograma(\''+value.label+'\')">'+
					  '<span class="glyphicon glyphicon-glass" aria-hidden="true"></span>'+
					'</button>'
                );
                contador++;
       });     
	     $("#SelectOrden,#regresar").show();
        var altura=calculo_altura(arraycategorias.length);
        	var seriesObjetivo=[
		         data[4],data[3],data[2],data[1]
		    ];
	        $('#graficaRecorrido').highcharts({
	                chart: {
	                     height: altura,
	                     //width:800,
	                    type: 'bar',
	                    spacingLeft: 0,
	                    spacingRight: 5,
	                    marginLeft: 150, 
	                    marginRight: 10, 
	                    
	                    type: 'bar',
	                      options3d: {
	                        enabled: true,
	                        alpha: 0,
	                        beta:0,
	                        depth: 40
	                    },
	                    marginTop: 20
	                },
	                title: {
	                    text: ""
	                },
	                xAxis: {
	                	labels: {
		                    padding:10,
		                    useHTML:true,
		                    style: {
		                        fontSize: '11px',
		                        fontFamily: 'Verdana, sans-serif'
		                    },
		                    formatter: function(){
		                    	if(arraycategorias[this.value].length>400){
		                        	return arraycategorias[this.value].substring(0, 400)+" <b>...</b>";
		                       	}else{
		                       		return arraycategorias[this.value].substring(0, 400);	
		                       	}
		                    },
	                	},
	                	gridLineColor: 'transparent'     
	                                       
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
	                        return this.series.name + ':<b> ' + this.point.labelcolumn + '%</b><br/>' +
	                            'Valor: <b>$' + formato_numero(this.point.dinero,0,',','.')+'</b>';
	                    }
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
		                        y: -1,
		                        x: 2,
		                        inside: false
		                    },
		                    //groupPadding: 0.1,
		                    pointWidth: 11
		
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
	                series: seriesObjetivo
	        });
    });
}
function filtrarPrograma(label){
	recorrido_programa=label;
	SubProgramasGrafica(label);	
}
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
 
$("#recorrido_paginacion").hide();
var SubProgramasGrafica=function(id_programa){
   var split_categorias=id_programa.split("-");
   $("#titulo_recorrido").empty().append('<i class="fa fa-check-circle fa-fw"></i><b>Objetivos '
   +split_categorias[0]+'- Programa '+split_categorias[1]+'</b>')
   $.getJSON('../servicios/GetSubProgramas.php',{
        order: $("#recorrido_select_Order").val(),
	   	by: $("#recorrido_select_By").val(),
	   	id_objetivo:split_categorias[0],
        id_programa:split_categorias[1],  
        OFFSET:parseInt($("#recorrido_offset").text())-1
    },function( data ) {
       	var contador=0;
        arraycategorias=[];
        $.each( data[0].data, function( key, value ) {
        	contador=parseInt(value.orden)+parseInt($("#recorrido_offset").text())-1;
            arraycategorias.push('<small >Orden '+contador+':</small><br/><a onclick="DetalleSubPrograma(\''+value.label+'\')">'+
            		"SubPrograma "+value.id+": "+value.descripcion+'</a>'+
                	'<br><button type="button" class="btn btn-primary btn-xs" onclick="filtrarSubPrograma(\''+value.label+'\')">'+
					  '<span class="glyphicon glyphicon-glass" aria-hidden="true"></span>'+
					'</button>'
                );
        });     
         $("#SelectOrden,#regresar").show();
        var altura=calculo_altura(arraycategorias.length);
         var seriesSubProgramas=[
             data[4],data[3],data[2],data[1]
        ];
       $('#graficaRecorrido').highcharts({
	                chart: {
	                     height: altura,
	                     //width:800,
	                    type: 'bar',
	                    spacingLeft: 0,
	                    spacingRight: 5,
	                    marginLeft: 150, 
	                    marginRight: 10, 
	                    
	                    type: 'bar',
	                      options3d: {
	                        enabled: true,
	                        alpha: 0,
	                        beta:0,
	                        depth: 40
	                    },
	                    marginTop: 20
	                },
	                title: {
	                    text: ""
	                },
	                xAxis: {
	                	labels: {
		                    padding:10,
		                    useHTML:true,
		                    style: {
		                        fontSize: '11px',
		                        fontFamily: 'Verdana, sans-serif'
		                    },
		                    formatter: function(){
		                    	if(arraycategorias[this.value].length>400){
		                        	return arraycategorias[this.value].substring(0, 400)+" <b>...</b>";
		                       	}else{
		                       		return arraycategorias[this.value].substring(0, 400);	
		                       	}
		                    },
	                	},
	                	gridLineColor: 'transparent'     
	                                       
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
	                        return this.series.name + ':<b> ' + this.point.labelcolumn + '%</b><br/>' +
	                            'Valor: <b>$' + formato_numero(this.point.dinero,0,',','.')+'</b>';
	                    }
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
		                        y: -1,
		                        x: 2,
		                        inside: false
		                    },
		                    //groupPadding: 0.1,
		                    pointWidth: 11
		
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

function filtrarSubPrograma(label){
	recorrido_subprograma=label;
	MetasGrafica(label);	
}
var DetalleMeta=function(id_detalle){
	var objetivo,programa,subprograma,meta,secretarias="";
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
	            $.getJSON('../servicios/GetDescripcion.php', {
		            tipo:"Meta",
		            id:detalle[3]
		        },function( data ) {
		        	meta=data[0].descripcion;
		        	 $.getJSON('../servicios/GetDescripcion.php', {
			            tipo:"MetaSecretaria",
			            id:detalle[3]
			        },function( data ) {
			        	$.each(data, function( index, value ) {
				        	secretarias=secretarias+value.descripcion+"<br/>";
				        });
				        	BootstrapDialog.show({
		                    	title: 'Objetivo '+detalle[0]+' Programa '+detalle[1]+' SubPrograma '+detalle[2]+' Meta '+detalle[3],
			                    message: '<b>Objetivo</b><br/>'+objetivo+'<br/><br/><b>Programa</b><br/>'
			                    +programa+'<br/><br/><b>SubPrograma</b><br/>'+subprograma+'<br/><br/><b>Meta</b><br/>'+meta
			                    +'<br/><br/><b>Secretarias:</b><br/>'+secretarias,
			                    buttons: [ {
					                label: 'Cerrar',
					                action: function(dialogItself){
					                    dialogItself.close();
					                }
					            }]});
					});
		        });
	        });
        });
     });        
}



var MetasGrafica=function(id_subprograma){
	console.log(id_subprograma);
    var split_categorias=id_subprograma.split("-");
    
       $("#titulo_recorrido").empty().append('<i class="fa fa-check-circle fa-fw"></i><b>Objetivos '
   +split_categorias[0]+'- Programa '+split_categorias[1]+'- SubPrograma '+split_categorias[2]+'</b>')
   $.getJSON('../servicios/GetMetas.php',{
        order: $("#recorrido_select_Order").val(),
	   	by: $("#recorrido_select_By").val(),
	   	id_objetivo:split_categorias[0],
        id_programa:split_categorias[1],  
        id_subprograma:split_categorias[2],  
        OFFSET:parseInt($("#recorrido_offset").text())-1
    },function( data ) {
       	var contador=0;
        arraycategorias=[];
        $.each( data[0].data, function( key, value ) {
        	//split_categorias=value.label.split("-");
        	contador=parseInt(value.orden)+parseInt($("#recorrido_offset").text())-1;
            arraycategorias.push('<small > Orden '+contador+':</small><a onclick="DetalleMeta(\''+value.label+'\')">'+
            " Meta "+value.id+": "+value.descripcion+'</a><br/>');
        });     
        var seriesMetas=[
            data[4],data[3],data[2],data[1]
        ];
         $("#SelectOrden,#regresar").show();
        var altura=calculo_altura(arraycategorias.length);
        
        $('#graficaRecorrido').highcharts({
                chart: {
	                height: altura,
	                style: {
	                        fontSize: '11px',
	                        fontFamily: 'Verdana, sans-serif'
	                        
	                },
	                spacingLeft: 0,
	                spacingRight: 0,
	                marginLeft: 200, 
	                marginRight: 10, 
	                
	                type: 'bar',
	                  options3d: {
	                    enabled: true,
	                    alpha: 0,
	                    beta: 0,
	                    depth: 46
	                },
	                marginTop: 30
	            },
                title: {
                    text: ""
                },
                
                  xAxis: {
                  	
                    labels: {
                    	padding:10,
	                    useHTML:true,
	                    formatter: function(){
	                    	if(arraycategorias[this.value].length>400){
	                        	return arraycategorias[this.value].substring(0, 400)+" <b>...</b>";
	                       	}else{
	                       		return arraycategorias[this.value].substring(0, 400);	
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
	                        y: 0,
	                        inside: false
	                    },
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
                series: seriesMetas
        });
    });
};