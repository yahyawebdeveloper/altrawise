<?php
/**
 * @author 		Jamal
 * @date 		16-July-2018
 * @modify
 * @Note = Please follow the indentation
 *         Please follow the naming convention
 */

require_once(dirname(__FILE__)          . '/../server.php');
// require_once(dirname(__FILE__) . '/../config/config.inc.php');
// require_once(constant('SHARED_DIR') . '/dbfunctions.php');

send_reports();
function send_reports()
{
    try 
    {
        log_it(__FUNCTION__, array());

        $cc = $rs = db_query
        (
        	"group_concat(office_email SEPARATOR ';') as office_email",
        	"cms_employees",
        	"super_admin = 1 AND cms_employees.is_active = 1"
        );
        
        $rs = db_query
        (
            "date_format(cms_appt.date_time,'" . constant('DISPLAY_DATETIME_FORMAT') .  "') as date_time,cms_clients.name,cms_appt.remarks,cms_employees.name as emp_name,cms_employees.office_email",
            "cms_appt
			INNER JOIN cms_clients on cms_appt.client = cms_clients.id
			INNER JOIN cms_employees on cms_appt.created_by = cms_employees.id",
            "cms_appt.status = 0 AND cms_appt.date_time_to <= CURDATE() AND cms_employees.is_active = 1",'','','cms_employees.name','ASC, cms_appt.date_time ASC'
        );

        if(count((array)$rs) < 1 || !isset($rs))
        {
        	return handle_fail_response('No record found');
        }
        else
        {
        	$table_row 		= '';
        	$office_email 	= '';
        	$rec_count 		= count((array)$rs);
        	$template 		= file_get_contents(constant('TEMPLATE_DIR') . '/appointment_reminder_notification.html');
        	$replace 		= array('{NAME}', '{TABLE_ROW}','{MAIL_SIGNATURE}','{APP_TITLE}');
        	
        	for($i = 0; $i < $rec_count;$i++)
        	{	
        		if($i == 0)
        		{
        			$table_row.= "<tr><td width='20%' style='vertical-align:top'>" . $rs[$i]['date_time'] 	. "</td>
								  	  <td style='vertical-align:top'>" . $rs[$i]['name'] 		. "</td>
								 	  <td style='vertical-align:top'>" . $rs[$i]['remarks'] 	. "</td></tr>";
        			
        		}
        		else if($rs[$i]['office_email'] == $office_email)
        		{
        			$table_row.= "<tr><td width='20%' style='vertical-align:top'>" . $rs[$i]['date_time'] 	. "</td>
								  	  <td style='vertical-align:top'>" . $rs[$i]['name'] 		. "</td>
								 	  <td style='vertical-align:top'>" . $rs[$i]['remarks'] 	. "</td></tr>";
        		}
        		else if($rs[$i]['office_email'] != $office_email)
        		{
        			$rs_sign = get_mail_signature($office_email);
        			if(count($rs_sign) > 0)
        			{
        				$with 		= array($rs_sign['name'], $table_row, $rs_sign['mail_signature'],constant('APPLICATION_TITLE'));
        				$body		= str_replace($replace, $with, $template);
        				
        				send_appt_reminder_email($office_email,$body,$cc[0]['office_email']);

        			}
        			$table_row = "<tr><td width='20%' style='vertical-align:top'>" . $rs[$i]['date_time'] 	. "</td>
								  	  <td style='vertical-align:top'>" . $rs[$i]['name'] 		. "</td>
								 	  <td style='vertical-align:top'>" . $rs[$i]['remarks'] 	. "</td></tr>";
        		}
        		
        		$office_email = $rs[$i]['office_email'];
        	}
        	
        	
        	
        	if($i == $rec_count)
        	{
        		$rs_sign = get_mail_signature($office_email);
        		if(count($rs_sign) > 0)
        		{
        			$with 		= array($rs_sign['name'], $table_row, $rs_sign['mail_signature'],constant('APPLICATION_TITLE'));
        			$body		= str_replace($replace, $with, $template);
        			
        			send_appt_reminder_email($office_email,$body,$cc[0]['office_email']);
        		}
        	}
        }

    } 
    catch (Exception $e) 
    {
        handle_exception($e);
    }
}

function send_appt_reminder_email($office_email,$body,$cc)
{
	try
	{
		log_it(__FUNCTION__, $office_email);
// 		echo $body;
		smtpmailer($office_email,constant('MAIL_USERNAME'),constant('MAIL_FROMNAME'),"Appointments Summary",$body,$cc);
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

?>