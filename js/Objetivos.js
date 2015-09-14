var GeneralGrafica=function(){
    
   $.getJSON('../servicios/GetObjetivos.php',function( data ) {
        	arraycategorias=[];
            $.each( data[0].data, function( key, value ) {
                 arraycategorias.push("Objetivo "+value.id+":  "+
                	value.descripcion
                 );
            });     
            var seriesObjetivo=[
                data[4],data[3],data[2],data[1]
            ];
        $('#objetivos').highcharts({
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
