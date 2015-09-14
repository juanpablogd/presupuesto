function formato_numero(numero, decimales, separador_decimal, separador_miles){ // v2007-08-06
    numero=parseFloat(numero);
    if(isNaN(numero)){
        return "";
    }

    if(decimales!==undefined){
        // Redondeamos
        numero=numero.toFixed(decimales);
    }

    // Convertimos el punto en separador_decimal
    numero=numero.toString().replace(".", separador_decimal!==undefined ? separador_decimal : ",");

    if(separador_miles){
        // Añadimos los separadores de miles
        var miles=new RegExp("(-?[0-9]+)([0-9]{3})");
        while(miles.test(numero)) {
            numero=numero.replace(miles, "$1" + separador_miles + "$2");
        }
    }

    return numero;
}
function calculo_altura(cantidadgraficas){
		if(cantidadgraficas==1){
        	return 300;
        }else if(cantidadgraficas==2){
        	return 250*cantidadgraficas;
        	
        }else if(cantidadgraficas==3){
        	return 200*cantidadgraficas;
        	
        }else{
        	return 150*cantidadgraficas;
        }	
}