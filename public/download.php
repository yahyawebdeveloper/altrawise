<?php

require_once '../services/server.php';

$key	= isset($_GET['key']) 			? $_GET['key'] 	: '';
$id		= isset($_GET['id']) 			? $_GET['id'] 	: '';
$type	= trim(isset($_GET['type'])) 	? $_GET['type'] : '';

if($type == "c")
{
	$rs = db_query("json_field", "cms_contracts", "cms_contracts.contract_no = " . $id);
	
	if(count((array)$rs) > 0)
	{
		$json_array = json_decode($rs[0]['json_field']);
		
		if($json_array->secret_key != $key)
		{
			echo "Invalid Access Key";
			return;
		}
		
		$json_field = "'$.viewed_date','" . get_current_date()	. "'";
		db_execute_sql("UPDATE cms_contracts SET json_field = JSON_SET(json_field,$json_field) WHERE contract_no = " . $id);
		
		header("Location: onboarding.php?key=$key");
		
// 		send_download_notification($id);	
		
	}
	else 
	{
		echo "Invalid Access";
	}
}
elseif($type == "config")
{
	$contents 		= file_get_contents('appsettings.json');

	$replace 		= array('{EMP_ID}');
	$with 			= array($id);
	$body			= str_replace($replace, $with, $contents);
	header('Content-disposition: attachment; filename=appsettings.json');
	header('Content-type: application/json');
	echo $body;
}
elseif($type == "task_template")
{	
	$path = str_replace('\\', '/', constant('PUBLIC_DIR'));
	$file_path = $path.'/excel_templates/Task_schedule_template.xlsx';
	header('Content-Description: File Transfer');
	header('Content-Type: application/octet-stream');
	header('Content-Disposition: attachment; filename="'.basename($file_path).'"');
	header('Expires: 0');
	header('Cache-Control: must-revalidate');
	header('Pragma: public');
	flush(); // Flush system output buffer
	readfile($file_path);
	die();
}
elseif($type == "public_holiday_template")
{	
	$path = str_replace('\\', '/', constant('PUBLIC_DIR'));
	$file_path = $path.'/excel_templates/public_holiday_template.xlsx';
	header('Content-Description: File Transfer');
	header('Content-Type: application/octet-stream');
	header('Content-Disposition: attachment; filename="'.basename($file_path).'"');
	header('Expires: 0');
	header('Cache-Control: must-revalidate');
	header('Pragma: public');
	flush(); // Flush system output buffer
	readfile($file_path);
	die();
}
else
{
	download_files($id);	
}

function download_files($id)
{
	try
	{
		log_it(__FUNCTION__, $id);
		
		if(defined('S3_URL') && constant('S3_URL') != '')
		{
			$path = constant('S3_URL');
		}
		else 
		{
			$document_path = $_SERVER["DOCUMENT_ROOT"] . "/wta/services/files/";
			$path = str_replace('\\', '/', $document_path);
		}
		
		$document_path = $_SERVER["DOCUMENT_ROOT"] . "/wta/services/files/";
		$path = str_replace('\\', '/', $document_path);

		$rs = db_query_single("concat('" . $path . "',cms_files.module_id, '/', cms_files.primary_id, '/', cms_files.filename) AS filepath",
		"cms_files",
		"cms_files.id ='$id'");
		
		if(count((array)$rs) > 0)
		{
			// echo $rs['filepath'];die;
			if(defined('S3_URL') && constant('S3_URL') != '')
			{
				$ext = strtolower(pathinfo($rs['filepath'], PATHINFO_EXTENSION));
				if(in_array($ext,array("pdf","png","jpg","jpeg")))
				{
					
					show_file_on_browser($rs['filepath'],$ext);
					die;
				}
				header('Content-Description: File Transfer');
				header('Content-Type: application/octet-stream');
				header('Content-Disposition: attachment; filename="'.basename($rs['filepath']).'"');
				header('Expires: 0');
				header('Cache-Control: must-revalidate');
				header('Pragma: public');
				header('Content-Length: ' . filesize($rs['filepath']));
				flush(); // Flush system output buffer
				readfile($rs['filepath']);
				die();
			}
			if(file_exists($rs['filepath'])) 
			{
				$ext = strtolower(pathinfo($rs['filepath'], PATHINFO_EXTENSION));
				if(in_array($ext,array("pdf","png","jpg","jpeg")))
				{
					show_file_on_browser($rs['filepath'],$ext);
					die;
				}
				header('Content-Description: File Transfer');
				header('Content-Type: application/octet-stream');
				header('Content-Disposition: attachment; filename="'.basename($rs['filepath']).'"');
				header('Expires: 0');
				header('Cache-Control: must-revalidate');
				header('Pragma: public');
				header('Content-Length: ' . filesize($rs['filepath']));
				flush(); // Flush system output buffer
				readfile($rs['filepath']);
				die();
			} 
			else 
			{
				http_response_code(404);
				die();
			}
		}
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function show_file_on_browser($filepath,$ext)
{
	$content_type = "image/jpeg";
	if($ext == "pdf")
	{
		$content_type = "application/pdf";
	}
	if($ext == "png")
	{
		$content_type = "image/png";
	}
	header("Content-Type: $content_type");
	header("Content-Disposition: inline;filename=" . basename($filepath));
	$content = file_get_contents($filepath); 
	echo $content;
}


// function send_download_notification($id)
// {
// 	try
//     {
//     	log_it(__FUNCTION__, $id);
    	
//     	$rs = db_query("cms_contracts.employee_name, cms_contracts.contract_no 
// 						,cms_employees.name as rec_name, cms_employees.office_email as rec_email
// 						,concat(ce.office_email,';', hr.office_email) as_cc
// 						,IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_employees.json_field, '$.chat_user_id')),'') as id
// 						,cms_employees.name
// 						,cms_master_employer.mail_signature"
// 		    			, " cms_contracts 
// 							INNER JOIN cms_employees ON cms_contracts.created_by = cms_employees.id
// 							INNER JOIN cms_employees ce ON cms_contracts.sales_approval = ce.id
// 							INNER JOIN cms_employees hr ON cms_contracts.approved_hr_by = hr.id
// 							INNER JOIN cms_master_employer ON cms_contracts.employer_id = cms_master_employer.id"
// 		    			,
//     					"cms_contracts.contract_no = " . $id);
    			
//     	if(count((array)$rs) > 0)
//     	{
//     		$template 		= file_get_contents(constant('TEMPLATE_DIR') . '/onboarding_offer_letter_downloaded.html');
//     		$replace 		= array('{NAME}', '{CANDIDATE_NAME}','{DOWNLOAD_DATE}','{MAIL_SIGNATURE}','{APP_TITLE}',);
//     		$with 			= array( $rs[0]['rec_name'], $rs[0]['employee_name'],get_current_date(), $rs[0]['mail_signature'], constant('APPLICATION_TITLE'));
//     		$body			= str_replace($replace, $with, $template);
    		
// 	    	if(!smtpmailer
// 	    	(
// 	    		$rs[0]['rec_email'],
// 	    		constant('MAIL_USERNAME'),
// 	    		constant('MAIL_FROMNAME'),
// 	    		"Candidate " . $rs[0]['employee_name'] . ' Downloaded Offer Letter',
// 	    		$body,$rs[0]['as_cc']
// 	    	))
// 	    	{
// 	    		return handle_fail_response('ERROR','Send Email to admin fail. Please re-try again later');
// 	    	}

// 	    	//CHAT PUSH NOTIFICATION
// 	    	require_once constant('MODULES_DIR') . '/chat.php';
// 	    	$params['emp_id']		= "15";
// 	    	$params['emp_name'] 	= $rs[0]['employee_name'];
// 	    	$params['to_chat_ids'] 	= $rs;
// 	    	$params['message'] = "\\n\\n*Module : Onboarding*\\n *" . $rs[0]['employee_name'] . " Downloaded Offer Letter*";
// 	    	chat_post_message(json_decode(json_encode($params)));
// 	    	//CHAT PUSH NOTIFICATION
	    	
//     		return handle_success_response('Success', true);
//     	}
    		
//     }
//     catch(Exception $e)
//     {
//     	handle_exception($e);
//     }
// }

?>
