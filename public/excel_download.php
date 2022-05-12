<?php

require_once '../services/server.php';


$method		= isset($_GET['method']) ? $_GET['method'] 	: '';
$data		= isset($_GET['data'])  ? $_GET['data'] 	: '';

if($method == 'stake_holders')
{
	stake_holders($data);
}

function stake_holders($data)
{
	try
	{	
		require_once constant('MODULES_DIR') . '/clients.php';
		$data = json_decode($data);
		$result = json_decode(get_client_list($data))->data->list;

		include(constant('LIB_DIR')  .'/phpexcel/Classes/PHPExcel.php');
		$objPHPExcel    =   new PHPExcel();
		$objPHPExcel->setActiveSheetIndex(0);
		
		$alphas         = range('A', 'Z');
		$columns = array('type'
		           , 'name'
		           , 'industry'
		           , 'office_tel'
		           , 'website'
				   , 'source_name'
				   , 'created_by'
				   , 'created_date'
				   , 'communication');

		foreach ($columns as $c_key => $column) 
		{   
		    $column_label = str_replace('_', ' ', $column);
		    $column_label = ucwords($column_label);

		    if (strpos($column, 'name') !== false) 
		    {
		        $objPHPExcel->getActiveSheet()->getColumnDimension($alphas[$c_key])->setWidth(25);
		    }
			else if (strpos($column, 'communication') !== false) 
		    {
		        $objPHPExcel->getActiveSheet()->getColumnDimension($alphas[$c_key])->setWidth(35);
		    }
		    else
		    {
		        $objPHPExcel->getActiveSheet()->getColumnDimension($alphas[$c_key])->setWidth(15);
		    }
		    
		    $objPHPExcel->getActiveSheet()->getStyle($alphas[$c_key])->getAlignment()->setWrapText(true);  
		    $objPHPExcel->getActiveSheet()->getStyle($alphas[$c_key].'1')->getFont()->setBold(true);
		    $objPHPExcel->getActiveSheet()->SetCellValue($alphas[$c_key].'1', $column_label);

		}

		$c_rows = 0;
		
		foreach ($result as $key => $value) 
		{	
			$c_rows =$key + 2;
			$objPHPExcel->getActiveSheet()->setCellValue('A'.$c_rows, $value->type);
			$objPHPExcel->getActiveSheet()->setCellValue('B'.$c_rows, $value->name);
			$objPHPExcel->getActiveSheet()->setCellValue('C'.$c_rows, $value->industry_name);
			$objPHPExcel->getActiveSheet()->setCellValue('D'.$c_rows, $value->office_tel);
			$objPHPExcel->getActiveSheet()->setCellValue('E'.$c_rows, $value->website);
			$objPHPExcel->getActiveSheet()->setCellValue('F'.$c_rows, $value->source_name);
			$objPHPExcel->getActiveSheet()->setCellValue('G'.$c_rows, $value->created_by);
			$objPHPExcel->getActiveSheet()->setCellValue('H'.$c_rows, $value->created_date);

			if($value->latest_comm)
			{	
				$comm_data = json_decode($value->latest_comm);
				$communication = 'Communicated with '.$comm_data->name.' on '.$comm_data->created_date.' via '.$comm_data->comm_type;
				$objPHPExcel->getActiveSheet()->setCellValue('I'.$c_rows, $communication);
			}
		}

		$objWriter  =   new PHPExcel_Writer_Excel2007($objPHPExcel);
        header('Content-Type: application/vnd.ms-excel'); //mime type
        header('Content-Disposition: attachment;filename="stake_holders.xlsx"'); //tell browser what's the file name
        header('Cache-Control: max-age=0'); //no cache
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');  
        $objWriter->save('php://output');
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

?>