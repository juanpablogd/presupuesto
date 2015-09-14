<?php
require_once('./conexion.php');
$tipo=$_GET["tipo"];

$idcentrogestor=$_GET["idcentrogestor"];
if($idcentrogestor!=""){
	$whereCentroGestor="and idcentrogestor=".$idcentrogestor;
}else{
	$whereCentroGestor="";
}
if($tipo=="Objetivo"){
	$query_sql="select descripcion
	from  planeacion_total.pi_objetivo
	where id=$id";
}else if($tipo=="Programa"){
	$idexpl= explode("-", $id);
	$query_sql="select descripcion
	from planeacion_total.pi_programa
	where id_objetivo::integer=$idexpl[0]
	and cod_programa::integer=$idexpl[1]
	";		
}else if($tipo=="SubPrograma"){
	
	$query_sql="
		select count(*)
		FROM (
			select idobjetivo,cod_programa,cod_subprograma
			from planeacion_total.ti_ppto_inv
			where apropiaciontotal<>0  and idcentrogestor>=1103 and idcentrogestor<=1197 and idcentrogestor<>1182  $whereCentroGestor
			group by idobjetivo,cod_programa,cod_subprograma
		)f
	";		
}else if($tipo=="Meta"){
	$query_sql="
	WITH tablagestor AS (
		 select idobjetivo,cod_programa,cod_subprograma,idmeta,
		sum(apropiaciontotal) apropiacion,sum(totalcdp) cdp,sum(totalrpc) rpc,sum(totalpagos) pago,
		ROUND((sum(totalcdp)/sum(apropiaciontotal))*100,2) porcdp,
		ROUND((sum(totalrpc)/sum(apropiaciontotal))*100,2) porrpc,
		ROUND(sum(totalpagos)/sum(apropiaciontotal)*100,2) porpagos
		from planeacion_total.ti_ppto_inv ic
		where ic.apropiaciontotal<>0  and idcentrogestor>=1103 and idcentrogestor<=1197  and idcentrogestor<>1182 $whereCentroGestor
		group by idobjetivo,cod_programa,cod_subprograma,idmeta
	)
	SELECT count(*)
	from tablagestor ic
	
	";		
}
//echo $query_sql;
$query_sql="SELECT array_to_json(array_agg(json))
FROM ( ".$query_sql." 
) json";



//echo $query_sql;

$resultado = pg_query($cx, $query_sql) or die(pg_last_error());
$total_filas = pg_num_rows($resultado);

while ($fila_vertical = pg_fetch_assoc($resultado)) {
	$row_to_json = $fila_vertical['array_to_json'];							
	echo $row_to_json;
}	
// Liberando el conjunto de resultados
pg_free_result($resultado);

// Cerrando la conexión
pg_close($cx);
?>
