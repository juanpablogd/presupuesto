<?php
require_once('./conexion.php');
$order=$_GET["order"];
$by=$_GET["by"];
$OFFSET=$_GET["OFFSET"];

//$agrupacion=$_GET["agrupacion"];
$agrupacion_label="ic.idobjetivo||'-'||ic.cod_programa||'-'||ic.cod_subprograma as label," ;
$orderby="order by $by  $order";
$idcentrogestor=$_GET["idcentrogestor"];
$where="";
if($idcentrogestor!=""){
	$where=" and idcentrogestor=".$idcentrogestor;
}
$id_objetivo=$_GET["id_objetivo"];
$id_programa=$_GET["id_programa"];

if($id_objetivo!=""&&$id_programa!=""){
	$where=$where." and idobjetivo=".$id_objetivo." and cod_programa=".$id_programa;
}
$query_sql = "
	SELECT array_to_json(array_agg(json))
	FROM (
	WITH tablagestor AS (
		select idobjetivo,cod_programa,cod_subprograma,
		sum(apropiaciontotal) apropiacion,sum(totalcdp) cdp,sum(totalrpc) rpc,sum(totalpagos) pago,
		ROUND((sum(totalcdp)/sum(apropiaciontotal))*100,2) porcdp,
		ROUND((sum(totalrpc)/sum(apropiaciontotal))*100,2) porrpc,
		ROUND(sum(totalpagos)/sum(apropiaciontotal)*100,2) porpagos
		from planeacion_total.ti_ppto_inv ic
		where ic.apropiaciontotal>0 and idcentrogestor>=1103 and idcentrogestor<=1197  and idcentrogestor<>1182 $where
		group by idobjetivo,cod_programa,cod_subprograma
		$orderby	
		LIMIT 20 OFFSET $OFFSET
	)
	SELECT 'SUBPROGRAMAS'  As name, array_to_json(array_agg(f)) As data 
	from (
	select $agrupacion_label row_number() over() as orden,cg.cod_subprograma as id,cg.descripcion 
	from tablagestor ic
	left join  planeacion_total.pi_subprograma cg on 
	(ic.idobjetivo=cg.id_objetivo and ic.cod_programa=cg.cod_programa::integer and ic.cod_subprograma=cg.cod_subprograma::integer)
	$orderby
	) f
	union all
	SELECT 'APROPIACIÓN' As name, array_to_json(array_agg(f)) As data 
	from (
	select apropiacion dinero,100 labelcolumn,(100) as y
	from tablagestor ic
	$orderby
	) f
	union all
	SELECT 'CDP' As name, array_to_json(array_agg(f)) As data 
	from (
	select ic.cdp dinero,ic.porcdp labelcolumn,(ic.porcdp) as y
	from tablagestor ic
	$orderby
	) f
	union all
	SELECT 'RPC' As name, array_to_json(array_agg(f)) As data 
	from (
	select ic.rpc dinero,ic.porrpc labelcolumn,(ic.porrpc) as y
	from tablagestor ic
	$orderby
	) f
	union all
	SELECT 'PAGOS' As name, array_to_json(array_agg(f)) As data 
	from (
	select ic.pago dinero,ic.porpagos as labelcolumn,ic.porpagos as y
	from tablagestor ic
	$orderby
	) f
	) json
";
//echo "$query_sql<br>";

$resultado = pg_query($cx, $query_sql) or die(pg_last_error());
$total_filas = pg_num_rows($resultado);

while ($fila_vertical = pg_fetch_assoc($resultado)) {
	$row_to_json = $fila_vertical['array_to_json'];							
	echo $row_to_json;
}	//
// Liberando el conjunto de resultados
pg_free_result($resultado);

// Cerrando la conexión
pg_close($cx);
?>
