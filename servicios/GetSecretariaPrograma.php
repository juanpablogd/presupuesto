<?php
require_once('./conexion.php');
$secretaria=$_GET["secretaria"];

$query_sql = "
SELECT array_to_json(array_agg(json)) FROM ( 
WITH tablacentrogestor AS ( 
select idobjetivo, sum(apropiaciontotal) apropiacion,sum(totalcdp) cdp,sum(totalrpc) rpc,sum(totalpagos) pago, 
ROUND((sum(totalcdp)/sum(apropiaciontotal))*100,0) porcdp, ROUND((sum(totalrpc)/sum(apropiaciontotal))*100,1) porrpc, 
ROUND(sum(totalpagos)/sum(apropiaciontotal)*100,1) porpagos 
from planeacion_total.ti_ppto_inv 
where idcentrogestor=$secretaria 
and  idcentrogestor>=1103 and idcentrogestor<=1197  and idcentrogestor<>1182
group by idobjetivo
) 
SELECT 'OBJETIVOS' As name, array_to_json(array_agg(f)) As data from ( 
select pi.id, pi.descripcion from tablacentrogestor ic 
left join planeacion_total.pi_objetivo pi on (pi.id=ic.idobjetivo) 
order by idobjetivo
) f	
union all 
SELECT 'APROPIACIÓN' As name, array_to_json(array_agg(f)) As data from ( 
select apropiacion dinero,100 labelcolumn,(100) as y from tablacentrogestor ic 
order by idobjetivo
) f 
union all SELECT 'CDP' As name, array_to_json(array_agg(f)) As data from ( 
select ic.cdp dinero,ic.porcdp labelcolumn,(ic.porcdp) as y from tablacentrogestor ic 
order by idobjetivo) f 
union all SELECT 'RPC' As name, array_to_json(array_agg(f)) As data from ( 
select ic.rpc dinero,ic.porrpc labelcolumn,(ic.porrpc) as y from tablacentrogestor ic 
order by idobjetivo) f 
union all SELECT 'PAGOS' As name, array_to_json(array_agg(f)) As data from ( 
select ic.pago dinero,ic.porpagos as labelcolumn,ic.porpagos as y from tablacentrogestor ic 
order by idobjetivo ) f 
) json 
";
//echo "$query_sql<br>";

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
