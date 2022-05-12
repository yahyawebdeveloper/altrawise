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

send_appt_gps_reports();


function send_appt_reminder_email($office_email,$body,$cc)
{
	try
	{
		log_it(__FUNCTION__, $office_email);
// 		echo $body;
		smtpmailer($office_email,constant('MAIL_USERNAME'),constant('MAIL_FROMNAME'),"Appointments Data Insufficient",$body,$cc);
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}
?>