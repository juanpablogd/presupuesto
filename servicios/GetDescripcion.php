<?php
require_once('./conexion.php');
$tipo=$_GET["tipo"];
$id=$_GET["id"];

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
	$idexpl= explode("-", $id);
	$query_sql="select descripcion
	from planeacion_total.pi_subprograma
	where id_objetivo::integer=$idexpl[0]
	and cod_programa::integer=$idexpl[1]
	and cod_subprograma::integer=$idexpl[2]
	";		
}else if($tipo=="Meta"){
	
	$query_sql="select descripcion
	from planeacion_total.pi_meta
	where id=$id
	";		
}else if($tipo=="MetaSecretaria"){
	
	$query_sql="select cg.descripcion
	from planeacion_total.ti_ppto_inv p
	left join  planeacion_total.pi_centro_gestor cg on(p.idcentrogestor=cg.id)
	where p.idmeta=$id
	";		
}else if($tipo=="FechaDatos"){	
	$query_sql="select max(fecha_cargue) fecha
		from planeacion_total.ti_ppto_inv
	";		
}


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
