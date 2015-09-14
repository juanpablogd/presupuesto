var GeneralGrafica=function(){
    
   $.getJSON('../servicios/GetGeneral.php',function( data ) {
       
        $("#GenApropDinero").append("$"+formato_numero(data[0].data[0].dinero,0,',','.'));
        
        
        $("#GenCDPPorc").append(data[1].data[0].y);
        $("#GenCDPDinero").append("$"+formato_numero(data[1].data[0].dinero,0,',','.'));
        $("#GenRCPPorc").append(data[2].data[0].y);
        $("#GenRCPDinero").append("$"+formato_numero(data[2].data[0].dinero,0,',','.'));
        $("#GenPagoPorc").append(data[3].data[0].y);
        $("#GenPagoDinero").append("$"+formato_numero(data[3].data[0].dinero,0,',','.'));        
            
        $('#general').highcharts({
                 chart: {
                 	height:300,
                    type: 'column',
                     options3d: {
                        enabled: true,
                        alpha: 10,
                        beta: 15,
                        viewDistance: 20,
                        depth: 50
                    },
                    marginTop: 20
                },
                title: {
                    text: " "
                },
                xAxis: {
	                categories: [
	                    ''                       
	                ],
                    labels:{
					  enabled: false
					},
                     gridLineColor: 'transparent'
                     
                },
                yAxis: {
                    min: 0,
                    max:100,
                    labels:{
					  enabled: false
					},
                    title: {
                        text: "Porcentaje según Apropiación"
                    },gridLineColor: 'transparent'
                },
                colors: colores,
                tooltip: {
                    formatter: function () {
                        return this.series.name + ':<b> ' + this.point.labelcolumn + '%<</b><br/>' +
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
                        depth: 40,
                        pointPadding: 0.25
                    }
                },
                credits: {
					text: 'SAGA - Sistema de Análisis Geográfico Avanzado',
					href: 'http://saga.cundinamarca.gov.co/'
				},
                series: data
        });
    });
}
GeneralGrafica();
