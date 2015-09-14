    
var seriesSecretaria,arraycategorias=[];
var DetalleSecretaria=function(id_detalle){
    if($("#select_Opciones :selected").text()=="Objetivo"){
         $.getJSON('../servicios/GetDescripcion.php', {
            tipo:"Objetivo",
            id:id_detalle
        },function( data ) {
            BootstrapDialog.show({
                title: 'Objetivo '+id_detalle,
                message: data[0].descripcion
            });
         });        
    }else if($("#select_Opciones :selected").text()=="Programa"){
        $.getJSON('../servicios/GetDescripcion.php', {
            tipo:"Programa",
            id:id_detalle
        },function( data ) {
            if(data!=null){
               var detalle=id_detalle.split("-");
                BootstrapDialog.show({
                    title: 'Objetivo '+detalle[0]+' Programa '+detalle[1]+' SubPrograma '+detalle[1],
                    message: data[0].descripcion
                });
            }
            
            
        });
    }else if($("#select_Opciones :selected").text()=="Subprograma"){
        $.getJSON('../servicios/GetDescripcion.php', {
            tipo: "SubPrograma",
            id:id_detalle
        },function( data ) {
            
           if(data!=null){
               var detalle=id_detalle.split("-");
                BootstrapDialog.show({
                    title: 'Objetivo '+detalle[0]+' Programa '+detalle[1]+' SubPrograma '+detalle[1],
                    message: data[0].descripcion
                });
            }
        });
    }else if($("#select_Opciones :selected").text()=="Meta"){
        $.getJSON('../servicios/GetDescripcion.php', {
            tipo:"Meta",
            id:id_detalle
        },function( data ) {
            BootstrapDialog.alert(data[0].descripcion);
        });
    }
}
var offset=20;

var inicial=function(indexpag){
		$('#'+indexpag+'back').prop("disabled", true);
		$('#'+indexpag+'inicial').prop("disabled", true);
		$('#'+indexpag+'next').prop("disabled", false);
		$('#'+indexpag+'ultimo').prop("disabled", false);
		$('#'+indexpag+'limit').text(offset);
		$('#'+indexpag+'offset').text(1);
		if(indexpag=='subprogramas_')grfSercretariaSubPrograma();
		if(indexpag=='metas_')grfSecretariaMetas();
};
var back=function(indexpag){
	if(parseInt($('#'+indexpag+'offset').text())!=1){
		if(parseInt($('#'+indexpag+'limit').text())==parseInt($('#'+indexpag+'totalgraficas').text())){
			$('#'+indexpag+'next').prop("disabled", false);
			$('#'+indexpag+'ultimo').prop("disabled", false);
			$('#'+indexpag+'limit').text(parseInt($('#'+indexpag+'offset').text())-1);	
			
		}else{
			console.log(parseInt($('#'+indexpag+'limit').text()));
			$('#'+indexpag+'limit').text(parseInt($('#'+indexpag+'limit').text())-offset);	
		}		
		$('#'+indexpag+'offset').text(parseInt($('#'+indexpag+'offset').text())-offset);
		if(parseInt($('#'+indexpag+'offset').text())==1){
			$('#'+indexpag+'back').prop("disabled", true);
			$('#'+indexpag+'inicial').prop("disabled", true);
		}
		if(indexpag=='subprogramas_')grfSercretariaSubPrograma();
		if(indexpag=='metas_')grfSecretariaMetas();
	}
	
};

var next=function(indexpag){
	$('#'+indexpag+'back').prop('disabled', false);
	$('#'+indexpag+'inicial').prop('disabled', false);
	if((parseInt($('#'+indexpag+'limit').text())+offset)<parseInt($('#'+indexpag+'totalgraficas').text())){
	    $('#'+indexpag+'offset').text(parseInt($('#'+indexpag+'offset').text())+offset);
		$('#'+indexpag+'limit').text(parseInt($('#'+indexpag+'limit').text())+offset);
	}else{
		$('#'+indexpag+'next').prop('disabled', true);
		$('#'+indexpag+'ultimo').prop('disabled', true);
		$('#'+indexpag+'limit').text($('#'+indexpag+'totalgraficas').text());
		$('#'+indexpag+'offset').text(parseInt($('#'+indexpag+'offset').text())+offset);
		
	}
	if(indexpag=='subprogramas_')grfSercretariaSubPrograma();
	if(indexpag=='metas_')grfSecretariaMetas();
};

var ultimo=function(indexpag){
		$('#'+indexpag+'inicial').prop('disabled', false)
		$('#'+indexpag+'back').prop('disabled', false);
		$('#'+indexpag+'next').prop('disabled', true);
		$('#'+indexpag+'ultimo').prop('disabled', true);
		$('#'+indexpag+'limit').text($('#totalgraficas').text());
		$('#'+indexpag+'offset').text(parseInt(parseInt($('#'+indexpag+'totalgraficas').text())/offset)*offset+1);
		if(indexpag=='subprogramas_')grfSercretariaSubPrograma();
		if(indexpag=='metas_')grfSecretariaMetas();
};

var grfSecretariaPuntual=function (secretaria){
    $.getJSON('../servicios/GetSecretariasSelect.php', {
            id_secretaria:secretaria
        },function( data ) {
            arraycategorias=[];
            
            $.each( data[0].data, function( key, value ) {
                arraycategorias.push(value.descripcion);
            });     
            
            $('#select_Secretaria').selectpicker('refresh');
            
            seriesSecretariaSelect=[
                data[1],data[2],data[3],data[4]
            ];
        
            $('#secretarias_general').highcharts({
                chart: {
                     type: 'column',
                     height:350,
                     options3d: {
                        
                        enabled: true,
                        alpha: 10,
                        beta: 15,
                        viewDistance: 20,
                        depth: 50
                    },
                    marginTop: 80
                },
                title: {
                    text: ""
                },
                xAxis: {
                        categories: " "   ,gridLineColor: 'transparent'                  
                },
                yAxis: {
                    min: 0,
                    max:100,
                    title: {
                        text: "Porcentaje según Apropiación"
                    },gridLineColor: 'transparent'
                },
                colors: colores,
                tooltip: {
                    formatter: function () {
                        return this.series.name + ': <b>' + this.point.labelcolumn + '%</b><br/>' +
                            'Valor: <b>$' + formato_numero(this.point.dinero,0,',','.')+'</b>';
                    }
                },
                plotOptions: {
                    column: {
                         dataLabels: {
                            allowOverlap:true,
                            enabled: true,
                            formatter: function () {
                                return this.y  + '%';
                            },
                            style: {
                                color: '#0B2161',
                                fontWeight: 'bold',
                                textShadow: ' 0 0 5px white, 0 0 7px white'
                            }
                        },
                        depth: 30,
                        pointPadding: 0.1
                    }
                },
                credits: {
					text: 'SAGA - Sistema de Análisis Geográfico Avanzado',
					href: 'http://saga.cundinamarca.gov.co/'
				},
                series: seriesSecretariaSelect
            });
        });
           
}; 
  
var grfSecretariaGeneral=function (by,order,agrupacion){
    var split_categorias;   
    $.getJSON('../servicios/GetSecretarias.php', {
        order: order,
        by: by,
        agrupacion:agrupacion
    },function( data ) {
    arraycategorias=[];
    var contador=1;
    $("#select_Secretaria").empty();
    $("#select_Secretaria").append('<option value="0" selected>Todas</option>');  
    $.each( data[0].data, function( key, value ) {
        if($("#select_Opciones :selected").text()=="General"){
             arraycategorias.push('<small>Orden '+contador+':</small><br>'+
            ' <a onclick="DetalleSubPrograma(\''+value.label+'\')">'+value.descripcion+'</a><br/>');
            contador++;
        }else{
            console.log(value.label);
            if($("#select_Opciones :selected").text()!="Objetivo"&&$("#select_Opciones :selected").text()!="Meta"){
                split_categorias=value.label.split("-");
                if(split_categorias.length==2){
                    arraycategorias.push(value.descripcion+' <br/> <a  onclick="DetalleSecretaria(\''+value.label+'\')" ><b> Objetivo '+ split_categorias[0]+'<br/> Programa '+split_categorias[1]+'</b></a>');
                }else if(split_categorias.length==3){
                    arraycategorias.push(value.descripcion+' <br/> <a  onclick="DetalleSecretaria(\''+value.label+'\')" ><b> Objetivo '+ split_categorias[0]+'<br/> Programa '+
                    split_categorias[1]+'<br/> Sub Programa '+ split_categorias[2]+'</b></a>');
                }
            }else{
                arraycategorias.push(value.descripcion+' <br/> <a  onclick="DetalleSecretaria(\''+value.label+'\')" ><b>'+$("#select_Opciones :selected").text()+" "+value.label+'</b></a>');
            }
            
        }
        $("#select_Secretaria").append('<option value="'+value.id+'" >'+value.descripcion+'</option>');  
    });     
    $('#select_Secretaria').selectpicker('refresh');
    seriesSecretaria=[
         data[4],data[3],data[2],data[1]
    ];
    $('#secretarias').highcharts({
            chart: {
                height: 120*arraycategorias.length,
                style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                        
                },
                spacingLeft: 0,
                spacingRight: 5,
                marginLeft: 150, 
                marginRight: 50, 
                
                type: 'bar',
                  options3d: {
                    enabled: true,
                    alpha: 0,
                    beta: 0,
                    depth: 46
                },
                marginTop: 20
            },
            title: {
                text: 'Seguimiento por Secretarías'
            },
            xAxis: {
                labels: {
                    useHTML: true,
                    align: 'right',
                    distance: 40,
                    padding: 10,
                    formatter: function(){
                        return arraycategorias[this.value];  
                    },
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                },gridLineColor: 'transparent'
            },
            colors: coloresinver,
            yAxis: {
                min: 0,
                max:105,
                title: {
                    text: yAxis_text
                },gridLineColor: 'transparent'
            },
            tooltip: {
                formatter: function () {
                    return this.series.name + ':<b> ' + this.point.labelcolumn + '%</b><br/>' +
                        'Valor: $ <b>' + formato_numero(this.point.dinero,0,',','.')+'</b>';
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
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
            series: seriesSecretaria
        }); 
         $('.highcharts-container').css('text-align', 'right');
    });
 };
$( "#select_By" ).change(function() {
    grfSecretariaGeneral($("#select_By").val(),$("#select_Order").val(),$("#select_Opciones").val());  
});

$( "#select_Order" ).change(function() {
    grfSecretariaGeneral($("#select_By").val(),$("#select_Order").val(),$("#select_Opciones").val()); 
});

$( "#select_Opciones" ).change(function() {
	
    grfSecretariaGeneral($("#select_By").val(),$("#select_Order").val(),$("#select_Opciones").val()); 
});
$("#divSelectOpciones").hide(100); 

var getcuentaSubPrograma=function(){
	$.getJSON('../servicios/GetCuenta.php',{
	        tipo:"SubPrograma",
	        idcentrogestor:$("#select_Secretaria").val()
	    },function( data ) {
	    	if(parseInt(data[0].count)>20){
	    		$('#subprograma_paginacion').show();
	    		$('#subprograma_titulo').hide();
	    		$('#subprograma_offset').text('1');
	    		$('#subprograma_limit').text('20');			    		
	    		$('#subprogramas_totalgraficas').text(parseInt(data[0].count));
	    	}else{
	    		$('#subprograma_paginacion').hide();
	    		$('#subprograma_titulo').show();
	    		$('#subprograma_offset').text('1');
	    		$('#subprograma_limit').text('20');		    		
	    		$('#subprograma_totalgraficas').text('21');	    		
	    	}
	    	grfSercretariaSubPrograma(); 
	    }
	);
}
var getcuentaMetas=function(){
	$.getJSON('../servicios/GetCuenta.php',{
	        tipo:"Meta",
	        idcentrogestor:$("#select_Secretaria").val()
	    },function( data ) {
	    	if(parseInt(data[0].count)>20){
	    		$('#metas_paginacion').show();
	    		$('#metas_titulo').hide();		    		
	    		$('#metas_offset').text('1');
	    		$('#metas_limit').text('20');		    		
	    		$('#metas_totalgraficas').text(parseInt(data[0].count));
	    		
	    	}else{
	    		$('#metas_paginacion').hide();
	    		$('#metas_titulo').show();
	    		$('#metas_offset').text('1');
	    		$('#metas_limit').text('20');		    		
	    		$('#metas_totalgraficas').text('21');
	    	}
	    	grfSecretariaMetas();
	    }			     
	);
}
$( "#select_Secretaria" ).change(function() {
    if($("#select_Secretaria").val()!="0"){
        grfSecretariaPuntual($("#select_Secretaria").val());
        $("#SelectOrdenSecretarias").hide(100);
        $("#select_Opciones").hide(100);
        //$("#divSelectOpciones").show(100);
        $("#panelall").addClass("hide");
		$("#panelsecretaria").removeClass("hide");
		gettabdata("Tab"+$("ul#TabSecretaria li.active").text());
		
		
    }else{
    	
        grfSecretariaGeneral($("#select_By").val(),$("#select_Order").val(),$("#select_Opciones").val());  
        $("#SelectOrdenSecretarias").show(100);
       // $("#divSelectOpciones").hide(100);
        $("#panelall").removeClass("hide");
		$("#panelsecretaria").addClass("hide");   
		     
    }
});

  grfSecretariaGeneral($("#select_By").val(),$("#select_Order").val(),"");  



var grfSercretariaObjetivo=function(){
    
   $.getJSON('../servicios/GetSecretariaObjetivos.php',{
   	secretaria: $("#select_Secretaria").val()
   },function( data ) {
       arraycategorias=[];
       $.each( data[0].data, function( key, value ) {
                arraycategorias.push("Objetivo "+value.id+": "+value.descripcion);
       });     
	    
        if(arraycategorias.length>1 ){
        	var seriesObjetivo=[
		         data[4],data[3],data[2],data[1]
		    ];
	        $('#objetivos2').highcharts({
	                chart: {
	                     height: 170*arraycategorias.length,
	                     //width:800,
	                    type: 'bar',
	                    spacingLeft: 0,
	                    spacingRight: 5,
	                    marginLeft: 150, 
	                    marginRight: 10, 
	                    
	                    type: 'bar',
	                      options3d: {
	                        enabled: true,
	                        alpha: 1,
	                        beta:0,
	                        depth: 40
	                    },
	                    marginTop: 40
	                },
	                title: {
	                    text: ""
	                },
	                xAxis: {
	                    categories: arraycategorias   ,gridLineColor: 'transparent'                   
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
		                	depth:20,
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
	      }else{
	      	var seriesObjetivo=[
		         data[1],data[2],data[3],data[4]
		    ];
	      	$('#objetivos2').highcharts({
	                chart: {
                     type: 'column',
                     height:350,
                     options3d: {
                        enabled: true,
                        alpha: 10,
                        beta: 15,
                        viewDistance: 20,
                        depth: 50
                    },
                    marginTop: 80
                },
                title: {
                    text: arraycategorias
                },
                xAxis: {
                        categories: " " ,gridLineColor: 'transparent'                   
                },
                yAxis: {
                    min: 0,
                    max:100,
                    title: {
                        text: "Porcentaje según Apropiación"
                    },gridLineColor: 'transparent'
                },
                colors: colores	,
                tooltip: {
                    formatter: function () {
                        return this.series.name + ': <b>' + this.point.labelcolumn + '%</b><br/>' +
                            'Valor: <b>$' + formato_numero(this.point.dinero,0,',','.')+'</b>';
                    }
                },
                plotOptions: {
                    column: {
                         dataLabels: {
                            allowOverlap:true,
                            enabled: true,
                            formatter: function () {
                                return this.y  + '%';
                            },
                            style: {
                                color: '#0B2161',
                                fontWeight: 'bold',
                                textShadow: ' 0 0 5px white, 0 0 7px white'
                            }
                        },
                        depth: 30,
                        pointPadding: 0.1
                    }
                },
                credits: {
					text: 'SAGA - Sistema de Análisis Geográfico Avanzado',
					href: 'http://saga.cundinamarca.gov.co/'
				},
                series: seriesObjetivo
            });
	      }
	    
    });
}
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
 				
var grfSercretariaPrograma=function(){
    
   $.getJSON('../servicios/GetProgramas.php',{
   	idcentrogestor: $("#select_Secretaria").val(),
   	order: $("#programas_select_Order").val(),
   	by: $("#programas_select_By").val()   	
   },function( data ) {
       arraycategorias=[];
       var contador=1;
       $.each( data[0].data, function( key, value ) {
       			split_categorias=value.label.split("-");
                arraycategorias.push(
                	'<small>Orden '+contador+':</small><br>'+
                	'<a  onclick="DetallePrograma(\''+value.label+'\')" >'+
                	" Programa "+split_categorias[1]+": "+value.descripcion+' <br/> </a>');
                contador++;
       });     
	    
        if(arraycategorias.length>1 ){
        	var altura=calculo_altura(arraycategorias.length);
        	var seriesObjetivo=[
		         data[4],data[3],data[2],data[1]
		    ];
	        $('#gfrPrograma').highcharts({
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
	                    marginTop: 40
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
	      }else{
	      	var seriesObjetivo=[
		         data[1],data[2],data[3],data[4]
		    ];
	      	$('#gfrPrograma').highcharts({
	                chart: {
                     type: 'column',
                     height:350,
                     options3d: {
                        enabled: true,
                        alpha: 10,
                        beta: 15,
                        viewDistance: 20,
                        depth: 50
                    },
                    marginTop: 80
                },
                title: {
                    text: arraycategorias
                },
                xAxis: {
                        categories: " " ,gridLineColor: 'transparent'                   
                },
                yAxis: {
                    min: 0,
                    max:100,
                    title: {
                        text: "Porcentaje según Apropiación"
                    },gridLineColor: 'transparent'
                },
                colors: colores	,
                tooltip: {
                    formatter: function () {
                        return this.series.name + ': <b>' + this.point.labelcolumn + '%</b><br/>' +
                            'Valor: <b>$' + formato_numero(this.point.dinero,0,',','.')+'</b>';
                    }
                },
                plotOptions: {
                    column: {
                         dataLabels: {
                            allowOverlap:true,
                            enabled: true,
                            formatter: function () {
                                return this.y  + '%';
                            },
                            style: {
                                color: '#0B2161',
                                fontWeight: 'bold',
                                textShadow: ' 0 0 5px white, 0 0 7px white'
                            }
                        },
                        depth: 30,
                        pointPadding: 0.1
                    }
                },
                credits: {
					text: 'SAGA - Sistema de Análisis Geográfico Avanzado',
					href: 'http://saga.cundinamarca.gov.co/'
				},
                series: seriesObjetivo
            });
	      }
	    
    });
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
var grfSercretariaSubPrograma=function(){
    $.getJSON('../servicios/GetSubProgramas.php',{
        idcentrogestor: $("#select_Secretaria").val(),
	   	order: $("#subprogramas_select_Order").val(),
	   	by: $("#subprogramas_select_By").val(),
        OFFSET:parseInt($("#subprogramas_offset").text())-1
   },function( data ) {
       arraycategorias=[];
       $.each( data[0].data, function( key, value ) {
       		contador=parseInt(value.orden)+parseInt($("#subprogramas_offset").text())-1;
       		arraycategorias.push(
            	'<small>Orden '+contador+':</small><br> '+
            	'<a onclick="DetalleSubPrograma(\''+value.label+'\')">'+
            	"SubPrograma "+value.id+": "+value.descripcion+'</a>'+'</a><br/>');
       });     
	    
        if(arraycategorias.length>1 ){
        	var altura=calculo_altura(arraycategorias.length);
        	var seriesSubProgramas=[
		         data[4],data[3],data[2],data[1]
		    ];
	        $('#gfrSubPrograma').highcharts({
                chart: {
	                height: altura,
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
	      }else{
	      	var seriesObjetivo=[
		         data[1],data[2],data[3],data[4]
		    ];
	      	$('#gfrSubPrograma').highcharts({
	                chart: {
                     type: 'column',
                     height:350,
                     options3d: {
                        enabled: true,
                        alpha: 10,
                        beta: 15,
                        viewDistance: 20,
                        depth: 50
                    },
                    marginTop: 80
                },
                title: {
                    text: arraycategorias
                },
                xAxis: {
                        categories: " " ,gridLineColor: 'transparent'                   
                },
                yAxis: {
                    min: 0,
                    max:100,
                    title: {
                        text: "Porcentaje según Apropiación"
                    },gridLineColor: 'transparent'
                },
                colors: colores	,
                tooltip: {
                    formatter: function () {
                        return this.series.name + ': <b>' + this.point.labelcolumn + '%</b><br/>' +
                            'Valor: <b>$' + formato_numero(this.point.dinero,0,',','.')+'</b>';
                    }
                },
                plotOptions: {
                    column: {
                         dataLabels: {
                            allowOverlap:true,
                            enabled: true,
                            formatter: function () {
                                return this.y  + '%';
                            },
                            style: {
                                color: '#0B2161',
                                fontWeight: 'bold',
                                textShadow: ' 0 0 5px white, 0 0 7px white'
                            }
                        },
                        depth: 30,
                        pointPadding: 0.1
                    }
                },
                credits: {
					text: 'SAGA - Sistema de Análisis Geográfico Avanzado',
					href: 'http://saga.cundinamarca.gov.co/'
				},
                series: seriesObjetivo
            });
	      }
	    
    });
}


var DetalleMeta=function(id_detalle){
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
	            $.getJSON('../servicios/GetDescripcion.php', {
		            tipo:"Meta",
		            id:detalle[3]
		        },function( data ) {
		        	meta=data[0].descripcion;
		        	BootstrapDialog.show({
                    	title: 'Objetivo '+detalle[0]+' Programa '+detalle[1]+' SubPrograma '+detalle[2]+' Meta '+detalle[3],
	                    message: '<b>Objetivo</b><br/>'+objetivo+'<br/><br/><b>Programa</b><br/>'
	                    +programa+'<br/><br/><b>SubPrograma</b><br/>'+subprograma+'<br/><br/><b>Meta</b><br/>'+meta,
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
}
var grfSecretariaMetas=function(){
    $.getJSON('../servicios/GetMetas.php',{
        idcentrogestor: $("#select_Secretaria").val(),
	   	order: $("#metas_select_Order").val(),
	   	by: $("#metas_select_By").val(),
        OFFSET:parseInt($("#metas_offset").text())-1
   },function( data ) {
       arraycategorias=[];
       $.each( data[0].data, function( key, value ) {
       		contador=parseInt(value.orden)+parseInt($("#metas_offset").text())-1;
            arraycategorias.push('<small>Orden '+contador+':</small><br/><a onclick="DetalleMeta(\''+value.label+'\')">'+
            " Meta "+value.id+": "+value.descripcion+'</a><br/>');
       });     
	    
        if(arraycategorias.length>1 ){
        	var altura=calculo_altura(arraycategorias.length);
        	var seriesObjetivo=[
		         data[4],data[3],data[2],data[1]
		    ];
	        $('#gfrMetas').highcharts({
	                chart: {
	                     height:altura,
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
	                    marginTop: 40
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
	      }else{
	      	var seriesObjetivo=[
		         data[1],data[2],data[3],data[4]
		    ];
	      	$('#gfrMetas').highcharts({
	                chart: {
                     type: 'column',
                     height:350,
                     options3d: {
                        enabled: true,
                        alpha: 10,
                        beta: 15,
                        viewDistance: 20,
                        depth: 50
                    },
                    marginTop: 80
                },
                title: {
                    text: arraycategorias
                },
                xAxis: {
                        categories: " " ,gridLineColor: 'transparent'                   
                },
                yAxis: {
                    min: 0,
                    max:100,
                    title: {
                        text: "Porcentaje según Apropiación"
                    },gridLineColor: 'transparent'
                },
                colors: colores	,
                tooltip: {
                    formatter: function () {
                        return this.series.name + ': <b>' + this.point.labelcolumn + '%</b><br/>' +
                            'Valor: <b>$' + formato_numero(this.point.dinero,0,',','.')+'</b>';
                    }
                },
                plotOptions: {
                    column: {
                         dataLabels: {
                            allowOverlap:true,
                            enabled: true,
                            formatter: function () {
                                return this.y  + '%';
                            },
                            style: {
                                color: '#0B2161',
                                fontWeight: 'bold',
                                textShadow: ' 0 0 5px white, 0 0 7px white'
                            }
                        },
                        depth: 30,
                        pointPadding: 0.1
                    }
                },
                credits: {
					text: 'SAGA - Sistema de Análisis Geográfico Avanzado',
					href: 'http://saga.cundinamarca.gov.co/'
				},
                series: seriesObjetivo
            });
	      }
	    
    });
}

$( "#programas_select_By" ).change(function() {
    grfSercretariaPrograma();  
});

$( "#programas_select_Order" ).change(function() {
	grfSercretariaPrograma();
});

$( "#subprogramas_select_By" ).change(function() {
    grfSercretariaSubPrograma();  
});

$( "#subprogramas_select_Order" ).change(function() {
	grfSercretariaSubPrograma();
});
$( "#metas_select_By" ).change(function() {
    grfSecretariaMetas();  
});

$( "#metas_select_Order" ).change(function() {
	grfSecretariaMetas();
});

$('#TabSecretaria').on('shown.bs.tab', function (e) {
	var targetTab = e.target.href.split('#')[1];
	gettabdata(targetTab);
});

var gettabdata=function(targetTab){
	if(targetTab=="TabObjetivos"){
	  	grfSercretariaObjetivo();	
	}else if(targetTab=="TabGeneral"){
		grfSecretariaPuntual($("#select_Secretaria").val());
	}else if(targetTab=="TabProgramas"){
		grfSercretariaPrograma();
	}else if(targetTab=="TabSubProgramas"){
		getcuentaSubPrograma();
		
	}else if(targetTab=="TabMetas"){
		getcuentaMetas();
		
	}
	
}
