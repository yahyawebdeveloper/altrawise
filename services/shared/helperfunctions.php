<?php
/**
 * @author 		Jamal
 * @date 		17-Jun-2012
 * @modify
 * @Note = Please follow the indentation
 *         Please follow the naming convention
 */
use ZK\ZkLib;

function handle_exception(&$e)
{
	$err = $e->getTraceAsString();
	$err = $err . $e->getMessage();
	log_trans($err, ERROR_LOG_FILE);
	if(SHOW_ERROR_TO_USER)
		return return_error($err);
	else
		return return_error("An error has occured. Please contact the system administrator.","ERROR");
}

function handle_success_response($return_string = '',$return_value = '')
{
	try
	{
		
		$data = array
		(
			'code' 	=> '0',
			'msg' 	=> $return_string,
			'data' 	=> $return_value
		);
		return json_encode(utf8ize($data));
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function handle_fail_response($return_string = '',$return_value = '')
{
	$data = array
	(
		'code' 	=> '1',
		'msg' 	=> $return_string,
		'data' 	=> $return_value
	);
	return json_encode(utf8ize($data));
}

function return_error($return_string = '',$return_value = '')
{
	$data = array
	(
		'code' 	=> '2',
		'msg' 	=> $return_string,
		'data' 	=> $return_value
	);
	return json_encode($data);
}

function log_trans($str_data, $fname)
{
	if($fname != '')
	{
		if(!is_dir(constant('LOG_DIR')))
		{
			mkdir(constant('LOG_DIR'),0755,TRUE);
		}

		$fh = fopen($fname, 'a+') or die("can't open file");
		fwrite($fh,"[" . date('Y-m-d H:i:s') . "]\r\n");
		fwrite($fh, $str_data);
		fwrite($fh, "\r\n\r\n\r\n");
		fclose($fh);
	}
}

function array_push_assoc($array, $key, $value)
{
	$array[$key] = $value;
 	return $array;
}

function add_timestamp_to_array($data, $emp_id, $new_edit)
{
	if($new_edit === 0)
	{
		$data = array_push_assoc($data,':created_by',$emp_id);
		$data = array_push_assoc($data,':created_date', get_current_date());
	}
	if($new_edit === 1)
	{
		$data = array_push_assoc($data,':updated_by',$emp_id);
		$data = array_push_assoc($data,':updated_date', get_current_date());
	}

	return $data;
}

function add_timestamp_to_array_custom_sql($data, $emp_id, $new_edit)
{
	if($new_edit === 0)
	{
		$data .= ",created_by = $emp_id,created_date = now() ";
	}
	if($new_edit === 1)
	{
		$data .= ",updated_by = $emp_id,updated_date = now() ";
	}
	
	return $data;
}

function remove_invalid_char($params)
{
	for($i=0; $i < count($params); $i++)
		$params[$i] = rem_inval_chars($params[$i]);

	return $params;
}

function rem_inval_chars($parameter, $special_case='')
{
	$parameter = str_replace("'","",$parameter);
	$parameter = str_replace("\\","",$parameter);
	$parameter = str_replace("\0","",$parameter);
	$parameter = str_replace("\"","",$parameter);

	if(intval($special_case) === 1)
	{
		$parameter = str_replace(":","",$parameter);
		//$parameter = str_replace("/","",$parameter);
		$parameter = str_replace("!","",$parameter);
		$parameter = str_replace("<","",$parameter);
		$parameter = str_replace(">","",$parameter);
		$parameter = str_replace(".","",$parameter);
		$parameter = str_replace(",","",$parameter);
		$parameter = str_replace(";","",$parameter);
		$parameter = str_replace("�","",$parameter);
		$parameter = str_replace("�","",$parameter);
		$parameter = str_replace("@","",$parameter);
		$parameter = str_replace("#","",$parameter);
		$parameter = str_replace("^","",$parameter);
		$parameter = str_replace("*","",$parameter);
		$parameter = str_replace("(","",$parameter);
		$parameter = str_replace(")","",$parameter);
		$parameter = str_replace(" ","",$parameter);
		$parameter = str_replace("&","",$parameter);
		$parameter = str_replace("$","",$parameter);
		$parameter = str_replace("%","",$parameter);
		$parameter = str_replace("=","",$parameter);
	}

	return $parameter;
}

function base64_to_jpeg($base64_string, $filename)
{
	$filepath 		= constant('FILES_DIR');
	$sub_folders 	= dirname($filename);
	if (!file_exists($filepath. '/'. $sub_folders)) 
	{
		mkdir($filepath. '/'. $sub_folders, 0777, true);
	}
	file_put_contents($filepath . '/' . $filename, base64_decode($base64_string));
	return $filename;
	
// 	$filepath = constant('FILES_DIR');
// 	if(!file_exists($filepath))
// 	{
// 		mkdir($filepath, 0777, true);
// 	}
// 	file_put_contents($filepath . '/' . $filename, base64_decode($base64_string));

// 	return $filename;
}

function get_current_date()
{
	try
	{
		return date('Y-m-d H:i:s');
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_current_date_in_milliseconds()
{
	try
	{
		return floor(microtime(true) * 1000);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function convert_to_date($date)
{
	try
	{
		if(is_valid_date($date))
		{
			$date = new DateTime($date);
			return $date->format('Y-m-d');
		}
		else
		{
			return NULL;
		}
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function convert_to_datetime($date,$set_current_time = false)
{
	try
	{
		if(is_valid_date($date))
		{
			$date = new DateTime($date);

			if($set_current_time)
			{
				return $date->format('Y-m-d') . ' ' . date('H:i:s');
			}
			return $date->format('Y-m-d H:i:s');
		}
		else
		{
			return NULL;
		}
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function convert_date_to_format($date)
{
    try
    {
        if(is_valid_date($date))
        {
            $date = new DateTime($date);
            return $date->format('d-M-Y');
        }
        else
        {
            return NULL;
        }
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function is_valid_date($date)
{
    try
    {
    	$time 		= strtotime($date);

    	if($time)
    	{
    	   $d 			= DateTime::createFromFormat('Y-m-d', date('Y-m-d',$time));
    	   $valid_data = $d && $d->format('Y-m-d') == date('Y-m-d',$time);
    	   return $valid_data;
        }
        else
        {
            return false;
        }
	}
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function if_object_exist($object, $key, $return_val_if_empty = NULL)
{
	if(property_exists($object, $key))
		return empty($object->$key) ? $return_val_if_empty : $object->$key;
	else
		return $return_val_if_empty;
}

function if_property_exist($object, $key, $return_val_if_empty = NULL,$return_val_if_no_match = false,$trim_it = false)
{
	if(isset($object->$key))
	{
		if ($return_val_if_no_match !== false)
		{
			if(in_array($object->$key,$return_val_if_no_match))
			{
				if($trim_it == true)
				{
					if (is_array($return_val_if_no_match[0]))
					{
						return array_map('trim',$return_val_if_no_match[0]);
					}
					else 
					{	
						return trim($return_val_if_no_match[0]);
					}
				}
				return $return_val_if_no_match[0];
			}
		}
		
		if($trim_it == true)
		{
			if (is_array($object->$key))
			{
				return array_map('trim',$object->$key);
			}
			else
			{
				return trim($object->$key);
			}
		}
		return $object->$key;
	}
	else
	{
		if($trim_it == true)
		{
			return trim($return_val_if_empty);
		}
		return $return_val_if_empty;
	}
}

function log_it($function_name, $param, $bg = false)
{
	if(LOG_TRANS)
	{
		$filepath = constant('SERVICE_LOG');
		if($bg === true)
		{
			$filepath = constant('BG_LOG');
		}
		log_trans("Function Details: " . $function_name .
				" \r\n Param Details : \r\n" . json_encode($param) , $filepath);
	}
}

function unique_id($l = 4)
{
	return substr(md5(uniqid(mt_rand(), true)), 0, $l);
}

function get_unique_id()
{
	return md5(uniqid() . time());
}

function get_short_code()
{
	return strtoupper(strrev(base_convert((microtime(true)-1443621600),10,36)));
}

function random_numbers($digits)
{
	return rand(pow(10, $digits - 1) - 1, pow(10, $digits) - 1);
}

function push_it_to_ios($push_id_array, $params)
{
	
	log_it(__FUNCTION__, $params);
	log_it(__FUNCTION__, $push_id_array);
	$return_data    = array();
	$apns_host      = 'gateway.sandbox.push.apple.com';
	$apns_cert      = constant('LIB_DIR')  . '/pn_cert/apns_dev.pem';

	if(constant('API_ENV') === 'PROD')
	{
		$apns_host  = 'gateway.push.apple.com';
		$apns_cert  = constant('LIB_DIR')  . '/pn_cert/apns.pem';
	}
	$apns_port      = 2195;

	$stream_context = stream_context_create();
	stream_context_set_option($stream_context, 'ssl', 'local_cert', $apns_cert);
	stream_context_set_option($stream_context, 'ssl', 'passphrase', 'abc.123+');

	$apns           = stream_socket_client('ssl://' . $apns_host . ':' . $apns_port, $error, $errorString, 2, STREAM_CLIENT_CONNECT|STREAM_CLIENT_PERSISTENT, $stream_context);
	$payload['aps'] = array('alert' => substr($params->data->msg, 0, 200), 'badge' => 1, 'sound' => 'default');
	
	if(isset($params->data->data))
	{
		$payload['aps']['data'] = $params->data->data;
	}
	if(isset($params->data->lat))
	{
		$payload['aps']['lat'] = $params->data->lat;
		$payload['aps']['lng'] = $params->data->lng;
	}

	$output         = json_encode($payload);

	for ($i = 0; $i < count($push_id_array); $i++)
	{
		if(trim($push_id_array[$i]['push_id']) != '')
		{
			$token          = pack('H*', $push_id_array[$i]['push_id']);
			$apns_message   = chr(0) . chr(0) . chr(32) . $token . chr(0) . chr(strlen($output)) . $output;
			fwrite($apns, $apns_message);
			$return_data[$i]['status'] =  'ok';
			sleep(1);
		}
	}

	@socket_close($apns);
	fclose($apns);

	return handle_success_response('Success',$return_data);
}

function walk($val, $key, &$new_array)
{
	$nums = explode(',',$val);
	$new_array[$nums[0]] = $nums[1];
}

function smtpmailer($to, $from, $from_name, $subject, $body, $cc = NULL, $attachment = NULL, $ical = NULL )
{
	try 
	{
		error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
	        
		require_once constant('LIB_DIR')  . '/phpmailer/class.phpmailer.php';
		
		$mail = new PHPMailer(true);        // create a new object
		$mail->IsSMTP();                	// enable SMTP
		$mail->SMTPDebug    = 0;        	// debugging: 1 = errors and messages, 2 = messages only
		$mail->SMTPAuth     = true;     	// authentication enabled
	
		if(constant('MAIL_HOST_GMAIL') == true)
		   $mail->SMTPSecure   = 'ssl';    // secure transfer enabled REQUIRED for GMail
	
		if(constant('API_ENV') !== 'PROD')
		{
			$subject .= " - " . constant('API_ENV');
		}
		   
		$mail->Host         = constant('MAIL_HOST');
		$mail->Port         = constant('MAIL_PORT');;
	    $mail->Username     = constant('MAIL_USERNAME');
	    $mail->Password     = constant('MAIL_PASSWORD');
	    $mail->SetFrom($from, $from_name);
	    $mail->Subject      = $subject;
	    $mail->Body         = $body;
	    $mail->isHTML(true);
	    
	    if($attachment)
	    {
	    	if(is_array($attachment))
	    	{
	    		for($i = 0; $i < count($attachment); $i++)
	    		{
	    			$mail->AddAttachment($attachment[$i]);
	    		}
	    	}
	    	else
	    	{
	    		$mail->AddAttachment($attachment);
	    	}
	    }
		
	    $to_tmp	= explode(';', $to);
	    for($i = 0; $i < count($to_tmp); $i++)
	    {
	    	if(constant('STAGING_EMAIL_NOTIFICATION') != '')
	    	{
		    	if(constant('API_ENV') !== 'PROD')
		    	{
		    		$tmp = explode("@", strtolower(trim($to_tmp[$i])));
		    		if($tmp[1] != 'msphitect.com.my')
		    		{
		    			$to_tmp[$i] = constant('STAGING_EMAIL_NOTIFICATION');
		    		}
		    	}
	    	}
	    	
	    	$mail->AddAddress($to_tmp[$i]);
	    }
	    
	    if($cc)
	    {
	        $cc_tmp	= explode(';', $cc);
	        for($i = 0; $i < count($cc_tmp); $i++)
	        {
	        	if(constant('STAGING_EMAIL_NOTIFICATION') != '')
	        	{
		        	if(constant('API_ENV') !== 'PROD')
		        	{
		        		$tmp = explode("@", strtolower(trim($cc_tmp[$i])));
		        		if($tmp[1] != 'msphitect.com.my')
		        		{
		        			$cc_tmp[$i] = constant('STAGING_EMAIL_NOTIFICATION');
		        		}
		        	}
	        	}
	        	
	    	    $mail->AddCC($cc_tmp[$i]);
	        }
	    }
	
	    if(!$mail->Send())
	    {
	    	log_it(__FUNCTION__, 'Email Error ' . $mail->ErrorInfo);
	    	return false;
	    }
	    else
	    {
	    	log_it(__FUNCTION__, 'Email Sent : ' . $to . " CC'ed : " . ($cc ? $cc: ""));
	    	return true;
	    }
	}
    catch(Exception $e)
    {
    	handle_exception($e);
    }
}

function smtpmailer_new($to, $from, $from_name, $subject, $body, $cc = NULL, $attachment = NULL, $ical = NULL )
{
	try
	{
		error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
		
		require_once constant('LIB_DIR')  . '/phpmailer/class.phpmailer.php';
		
		$mail = new PHPMailer(true);        // create a new object
		$mail->IsSMTP();                	// enable SMTP
		$mail->SMTPDebug    = 0;        	// debugging: 1 = errors and messages, 2 = messages only
		$mail->SMTPAuth     = true;     	// authentication enabled
		
		if(constant('MAIL_HOST_GMAIL') == true)
			$mail->SMTPSecure   = 'ssl';    // secure transfer enabled REQUIRED for GMail
			
			if(constant('API_ENV') !== 'PROD')
			{
				$subject .= " - " . constant('API_ENV');
			}
			
			$mail->Host         = constant('MAIL_HOST');
			$mail->Port         = constant('MAIL_PORT');;
			$mail->Username     = constant('MAIL_USERNAME');
			$mail->Password     = constant('MAIL_PASSWORD');
			$mail->SetFrom($from, $from_name);
			$mail->Subject      = $subject;
			$mail->Body         = $body;
			$mail->isHTML(true);
			
			if($attachment)
			{
				$mail->AddAttachment($attachment);
			}
			
			$to_tmp	= explode(';', $to);
			for($i = 0; $i < count($to_tmp); $i++)
			{
				if(constant('STAGING_EMAIL_NOTIFICATION') != '')
				{
					if(constant('API_ENV') !== 'PROD')
					{
						$tmp = explode("@", strtolower(trim($to_tmp[$i])));
						if($tmp[1] != 'msphitect.com.my')
						{
							$to_tmp[$i] = constant('STAGING_EMAIL_NOTIFICATION');
						}
					}
				}
				
				$mail->AddAddress($to_tmp[$i]);
			}
			
			if($cc)
			{
				$cc_tmp	= explode(';', $cc);
				for($i = 0; $i < count($cc_tmp); $i++)
				{
					if(constant('STAGING_EMAIL_NOTIFICATION') != '')
					{
						if(constant('API_ENV') !== 'PROD')
						{
							$tmp = explode("@", strtolower(trim($cc_tmp[$i])));
							if($tmp[1] != 'msphitect.com.my')
							{
								$cc_tmp[$i] = constant('STAGING_EMAIL_NOTIFICATION');
							}
						}
					}
					
					$mail->AddCC($cc_tmp[$i]);
				}
			}
			
			if(!$mail->Send())
			{
				$data['status'] = false;
				$data['msg']	= $mail->ErrorInfo;
				log_it(__FUNCTION__, 'Email Error ' . $mail->ErrorInfo);
				return $data;
			}
			else
			{
				$data['status'] = true;
				$data['msg']	= 'Email Sent';
				log_it(__FUNCTION__, 'Email Sent : ' . $to . " CC'ed : " . ($cc ? $cc: ""));
				return $data;
			}
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function smtpmailer_notify($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$mail_type				= if_property_exist($params,'mail_type');
		$outserver_name			= if_property_exist($params,'outserver_name');
		$outserver_port			= if_property_exist($params,'outserver_port');
		$username				= if_property_exist($params,'username');
		$password				= if_property_exist($params,'password');
		$from_name				= if_property_exist($params,'from_name');
		$require_auth			= if_property_exist($params,'require_auth');
		$cc						= if_property_exist($params,'cc');
		
		
		$attachment				= if_property_exist($params,'attachment');
		$body					= if_property_exist($params,'body');
		$subject				= if_property_exist($params,'subject');
		$to						= $username;
		
		error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
		
		require_once constant('LIB_DIR')  . '/phpmailer/class.phpmailer.php';
		
		$mail = new PHPMailer(true);        // create a new object
		$mail->IsSMTP();                	// enable SMTP
		$mail->SMTPDebug    = 0;        	// debugging: 1 = errors and messages, 2 = messages only
		
		if($mail_type == 1)
		{
			$mail->SMTPSecure   = 'ssl';    // secure transfer enabled REQUIRED for GMail
		}
		if($require_auth == 1)
		{
			$mail->SMTPAuth     = true;
		}
			
			if(constant('API_ENV') !== 'PROD')
			{
				$subject .= " - " . constant('API_ENV');
			}
			
			$mail->Host         = $outserver_name;
			$mail->Port         = $outserver_port;
			$mail->Username     = $username;
			$mail->Password     = $password;
			$mail->SetFrom($username, $from_name);
			$mail->Subject      = $subject;
			$mail->Body         = $body;
			$mail->isHTML(true);
			
			if($attachment)
			{
				if(is_array($attachment))
				{
					for($i = 0; $i < count($attachment); $i++)
					{
						$mail->AddAttachment($attachment[$i]);
					}
				}
				else
				{
					$mail->AddAttachment($attachment);
				}
			}
			
			$to_tmp	= explode(';', $to);
			for($i = 0; $i < count($to_tmp); $i++)
			{
				if(constant('API_ENV') !== 'PROD')
				{
					$tmp = explode("@", strtolower(trim($to_tmp[$i])));
					if($tmp[1] != 'msphitect.com.my')
					{
						$to_tmp[$i] = constant('STAGING_EMAIL_NOTIFICATION');
					}
				}
				
				$mail->AddAddress($to_tmp[$i]);
			}
			
			if($cc)
			{
				$cc_tmp	= explode(';', $cc);
				for($i = 0; $i < count($cc_tmp); $i++)
				{
					if(constant('API_ENV') !== 'PROD')
					{
						$tmp = explode("@", strtolower(trim($cc_tmp[$i])));
						if($tmp[1] != 'msphitect.com.my')
						{
							$cc_tmp[$i] = constant('STAGING_EMAIL_NOTIFICATION');
						}
					}
					
					$mail->AddCC($cc_tmp[$i]);
				}
			}
			
			if(!$mail->Send())
			{
				$data['status'] = false;
				$data['msg']	= $mail->ErrorInfo;
				log_it(__FUNCTION__, 'Email Error ' . $mail->ErrorInfo);
				return $data;
			}
			else
			{
				$data['status'] = true;
				$data['msg']	= 'Email Sent';
				log_it(__FUNCTION__, 'Email Sent : ' . $to . " CC'ed : " . ($cc ? $cc: ""));
				return $data;
			}
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function send_private_msg_to_chat($params)
{
	try
	{
		log_it(__FUNCTION__, $params);

		$emp_id 	= if_property_exist($params,'emp_id');
		
		require_once constant('LIB_DIR') 	. '/httpful/vendor/autoload.php';
		$response = \Httpful\Request::post(constant('CHAT_SERVER') . constant('CHAT_API_ROOT') . "chat.postMessage")
		->addHeaders
		(
			array
			(
				'X-User-Id'    => constant('CHAT_USER_ID'),
				'X-Auth-Token' => constant('CHAT_TOKEN'),
				'Content-type' => "application/json"
			)
		)
		->body(json_encode($params))
		->send();

		if($response->body->success == 1)
		{
			$data = array
			(
				':noty_data' => json_encode($params)
			);
			$data = add_timestamp_to_array($data,$emp_id,0);
			$id   = db_add($data, 'cms_notifications_log');
			return true;
		}
		else
		{
			return false;
		}
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function send_sms_to_super_admin($msg)
{
	try 
	{
		log_it(__FUNCTION__, $msg);
		
		$rs = db_query("group_concat(malaysia_phone SEPARATOR ';') as mobile", "cms_employees", 'super_admin = 1');
		
		if (count((array)$rs) > 0)
		{
			send_sms($msg,$rs[0]['mobile']);
		}
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function send_sms($msg, $mobile_number )
{
	try 
	{
		log_it(__FUNCTION__, $msg . ' ' . $mobile_number);
		
		$mobile_number = str_replace(['+', '-', ' '], '', $mobile_number);

		if(constant('SMS_URL') != '')
		{
// 			if(constant('API_ENV') !== 'PROD')
// 			{
// 				$mobile_number = constant('STAGING_SMS_NOTIFICATION');
// 				$msg		   .= " -" . constant('API_ENV');
// 			}
			
			$url = constant('SMS_URL');
			$url.= "?un=" 			. constant('SMS_USERNAME');
			$url.= "&pwd=" 			. constant('SMS_PASSWORD');
			$url.= "&dstno=" 		. $mobile_number;
			$url.= "&msg=" 			. urlencode(html_entity_decode($msg, ENT_QUOTES, 'utf-8'));
			$url.= "&type=" 		. constant('SMS_LANG_TYPE');
			$url.= "&sendid=" 		. constant('SMS_SENDER_ID');
			$url.= constant('SMS_ADDITIONAL_PARAM');

			require_once constant('LIB_DIR') 	. '/httpful/vendor/autoload.php';

			$response = \Httpful\Request::GET($url)->send();
			if ($response)
			{
				log_it(__FUNCTION__, $response);
				if (trim($response) == "2000 = SUCCESS" || trim($response) == '')
				{
					return true;
				}
				else
				{
					return false;
				}
			}
		}
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_encrypt_password( $string, $action = 'e' )
{
	// you may change these values to your own
	$secret_key 	= constant("SECURITY_SECRET"); //'4Iuy7JB9qMCstxiIj1wIOyMeC9Hesa2vxclg6';
	$secret_iv 		= constant("SECURITY_SECRET"); //'4Iuy7JB9qMCstxiIj1wIOyMeC9Hesa2vxclg6';
	
	$output 		= false;
	$encrypt_method = "AES-256-CBC";
	$key 			= hash( 'sha256', $secret_key );
	$iv 			= substr( hash( 'sha256', $secret_iv ), 0, 16 );
	
	if( $action == 'e' )
	{
		if(is_array($string))
		{
			$string = json_encode($string);
		}
		$output = base64_encode( openssl_encrypt( $string, $encrypt_method, $key, 0, $iv ) );
	}
	else if( $action == 'd' )
	{
		$output = openssl_decrypt( base64_decode( $string ), $encrypt_method, $key, 0, $iv );
	}
	
	return $output;
}

function encrypt_string($param)
{
	return base64_encode( mcrypt_encrypt( MCRYPT_RIJNDAEL_256, md5( SECURITY_SECRET ), $param, MCRYPT_MODE_CBC, md5( md5( SECURITY_SECRET ) ) ) );
}

function decrypt_string($param)
{
	return rtrim( mcrypt_decrypt( MCRYPT_RIJNDAEL_256, md5( SECURITY_SECRET ), base64_decode( $param ), MCRYPT_MODE_CBC, md5( md5( SECURITY_SECRET ) ) ), "\0");
}

function convert_date_to_specified_format($date, $format)
{
	if($date === '' or $date === NULL)
		return '';

	$date = strtotime($date);
	$date = date($format, $date);
	return $date;
}

function is_this_integer($input)
{
	return(ctype_digit(strval($input)));
}

function isValidMd5($md5)
{
	return !empty($md5) && preg_match('/^[a-f0-9]{32}$/', $md5);
}

function include_css_files($address)
{
	return "<link rel='stylesheet' type='text/css' href='$address?v=" . constant('VERSION') . "' /> \n";
}

function include_js_files($address)
{
	return "<script type='text/javascript' src='$address?v=" . constant('VERSION') . "'></script> \n";
}

function is_number($val)
{
	return ctype_digit($val) ? $val : '0';
}

function make_thumb($src, $dest, $desired_width)
{
	$source_image 	= imagecreatefromjpeg($src);
	$width 			= imagesx($source_image);
	$height 		= imagesy($source_image);
	$desired_height = floor($height * ($desired_width / $width));
	$virtual_image 	= imagecreatetruecolor($desired_width, $desired_height);
	imagecopyresampled($virtual_image, $source_image, 0, 0, 0, 0, $desired_width, $desired_height, $width, $height);
	imagejpeg($virtual_image, $dest);
}

function make_thumbnails($filepath,$thumbnail_path)
{
	$thumbnail_width 	= 80;
	$thumbnail_height 	= 80;
	$arr_image_details 	= getimagesize($filepath);
	$original_width 	= $arr_image_details[0];
	$original_height 	= $arr_image_details[1];
	if ($original_width > $original_height)
	{
		$new_width 	= $thumbnail_width;
		$new_height = intval($original_height * $new_width / $original_width);
	}
	else
	{
		$new_height = $thumbnail_height;
		$new_width 	= intval($original_width * $new_height / $original_height);
	}
	$dest_x = intval(($thumbnail_width - $new_width) / 2);
	$dest_y = intval(($thumbnail_height - $new_height) / 2);
	if ($arr_image_details[2] == 1)
	{
		$imgt 			= 'ImageGIF';
		$imgcreatefrom 	= 'ImageCreateFromGIF';
	}
	if ($arr_image_details[2] == 2)
	{
		$imgt 			= 'ImageJPEG';
		$imgcreatefrom 	= 'ImageCreateFromJPEG';
	}
	if ($arr_image_details[2] == 3)
	{
		$imgt 			= 'ImagePNG';
		$imgcreatefrom 	= 'ImageCreateFromPNG';
	}

	if ($imgt)
	{
		$old_image = $imgcreatefrom($filepath);
		$new_image = imagecreatetruecolor($thumbnail_width, $thumbnail_height);
		imagecopyresized($new_image, $old_image, $dest_x, $dest_y, 0, 0, $new_width, $new_height, $original_width, $original_height);
		$imgt($new_image, $thumbnail_path);
	}
}

function split_filename_and_ext($filepath)
{
	$ext 		= pathinfo($filepath, PATHINFO_EXTENSION);
	$file_info	= array(basename($filepath, '.' . $ext), $ext);

	return $file_info;
}

function is_data_exist($table_name, $column_name, $item_id)
{
	log_it(__FUNCTION__,$table_name . ' ' . $column_name . ' ' . $item_id);

	$where = $column_name . " = '" . $item_id . "'";

	if(is_this_integer($item_id))
	{
		$where = $column_name . " = " . $item_id;
	}


	$rs = db_query('count(*) as id_count', $table_name, $where);

	if(isset($rs) && $rs != NULL)
	{
		return $rs[0]['id_count'];
	}

	return false;
}

// print_r (get_time_to_seconds('13:15'));
function get_time_to_seconds($time)
{
	$time_seconds = 0;
	sscanf($time, "%d:%d:%d", $hours, $minutes, $seconds);


	if(isset($seconds))
	{
		$time_seconds = $seconds;
	}

	if(isset($minutes))
	{
		$time_seconds += ($minutes * 60);
	}

	if(isset($hours))
	{
		$time_seconds += ($hours * 3600);
	}

// 	$time_seconds = isset($seconds) ? $hours * 3600 + $minutes * 60 + $seconds : $hours * 60 + $minutes;

	return $time_seconds;
}

function executeAsyncShellCommand($comando = null)
{
    if(!$comando)
    {
        throw new Exception("No command given");
    }
    // If windows, else
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') 
    {
        system($comando." > NUL");
    }
    else
    {

   		shell_exec(constant('NOHUP_PATH') . " " . constant('PHP_PATH') . " $command  > /dev/null 2>&1 & echo $!");
//         shell_exec("/usr/bin/nohup ".$comando." >/dev/null 2>&1 &");
    }
}

// echo strtotime(date('Y-m-d') . ' 20:00') . "\n";
// echo strtotime('2018-03-28 09:00');die;
// echo is_date_bigger_than_current_date('2018-03-28 09:00 AM');
function is_date_bigger_than_current_date($date)
{
    
    $current_date   = strtotime("now");
    $my_date        = strtotime($date);
    $is_bigger      = false;
    
    if($my_date > $current_date)
    {
        $is_bigger = true;
    }
    else 
    {
        if((int)date('H') < (int)constant('CUT_OFF_TIME_FOR_APPT')) //to over the is_bigger with cut of time
        {
            $is_bigger = true;
        }
    }
    
    return (int)$is_bigger;
}

function get_gmap_address($lat,$lng)
{
    try
    {
        log_it(__FUNCTION__, trim($lat). ',' . trim($lng));
        
        if($lat != "" && $lng != "")
        {
            $arrContextOptions=array
            (
            		"http" => array
            		(
            			"header" => "User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
            		)
//                 "ssl"=>array
//                 (
//                     "verify_peer"=>false,
//                     "verify_peer_name"=>false,
//                 ),
            );
            
//             $url    = constant('MAP_URL') . 'latlng=' . trim($lat) . ',' . trim($lng) . '&key=' . constant('MAP_KEY');
            
            $url	= sprintf(constant('MAP_URL'),trim($lat),trim($lng));
            
//             $json   = file_get_contents($url,false, stream_context_create($arrContextOptions));
            
            $json   = call_api("", $url);
            
            $data   = json_decode($json, true);
            
            log_it(__FUNCTION__, $data);
            
            return $data['display_name'];
        }
        else 
        {
            return "";
        }
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function run_in_background($command, $priority = 0)
{
	if($priority)
	{
		$pid = shell_exec(constant('NOHUP_PATH') . " " . constant('PHP_PATH') . " nice -n $priority $command > /dev/null 2>&1 & echo $!");
		
// 		$pid = shell_exec("/usr/bin/nohup /usr/local/bin/php nice -n $priority $command > /dev/null 2>&1 & echo $!");  // change due to server setting
// 		$pid = shell_exec("nohup php nice -n $priority $command > /dev/null 2>&1 & echo $!");
	}
	else
	{
		log_it(__FUNCTION__, constant('NOHUP_PATH') . " " . constant('PHP_PATH') . " $command > /dev/null 2>&1 & echo $!");
		$pid = shell_exec(constant('NOHUP_PATH') . " " . constant('PHP_PATH') . " $command > /dev/null 2>&1 & echo $!");
		
// 		$pid = shell_exec("/usr/bin/nohup /usr/local/bin/php $command > /dev/null 2>&1 & echo $!");
// 		log_it(__FUNCTION__, "nohup php $command > /dev/null 2>&1 & echo $!");
// 		$pid= shell_exec("nohup php $command > /dev/null 2>&1 & echo $!");
		log_it(__FUNCTION__, $pid);
	}
	return($pid);
}

function is_process_running($pid)
{
	exec("ps $pid", $process_state);
	return(count($process_state) >= 2);
}

function call_api($params,$url)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		if ( filter_var(urldecode(($url . $params)), FILTER_VALIDATE_URL, FILTER_FLAG_QUERY_REQUIRED) === false )
		{
			log_it(__FUNCTION__, "URL may contain malicious code: $params");
			return false;
		}
		
		$ch     = curl_init();
		
		curl_setopt($ch, CURLOPT_URL, ($url . $params));
		curl_setopt($ch, CURLOPT_HEADER, false);
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
		curl_setopt($ch, CURLOPT_FAILONERROR, true);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_USERAGENT, 'User-Agent: curl/7.39.0');
		
		$output     = curl_exec($ch);
		$curl_error =  curl_error($ch);
		curl_close($ch);
		
		if($curl_error)
		{
			log_it(__FUNCTION__, "cURL $curl_error");
			return false;
		}
		else
		{
			log_it(__FUNCTION__, $output);
			return $output;
		}
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_accessibility($module_id,$access)
{
	try 
	{
		$count_access 	= count($access);
		for($i = 0; $i < $count_access;$i++)
		{
			if((int)($access[$i]->module_id) == (int)($module_id))
			{
				return $access[$i];
			}
		}
		return false;
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function is_file_exist($filepath,$return_file_path = false)
{
	try
	{
		if (!file_exists($filepath)) 
		{
			$return_file_path;
		}
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_controlpanel_connection()
{
	try
	{
		log_it(__FUNCTION__, "");
		
		$xmlapi = new xmlapi(constant('CPANEL_IP'));
		$xmlapi->password_auth(constant('CPANEL_USERNAME'),constant('CPANEL_PASSWORD'));
		$xmlapi->set_output('json');
		$xmlapi->set_port(constant('CPANEL_PORT'));
		
		return $xmlapi;
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_controlpanel_connection_uapi()
{
	try
	{
		log_it(__FUNCTION__, "");
		
		return new cpanelAPI(constant('CPANEL_USERNAME'), constant('CPANEL_PASSWORD'), constant('CPANEL_DOMAIN'));
// 		$xmlapi = new xmlapi(constant('CPANEL_IP'));
// 		$xmlapi->password_auth(constant('CPANEL_USERNAME'),constant('CPANEL_PASSWORD'));
// 		$xmlapi->set_output('json');
// 		$xmlapi->set_port(constant('CPANEL_PORT'));
		
// 		return $xmlapi;
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_attendance_connection()
{
	try
	{
		log_it(__FUNCTION__, "");
		
		return new ZkLib(constant('ATTENDANCE_API_URL'));
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function route_to_admin($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$params->email 	= constant('STAGING_EMAIL_NOTIFICATION');
		$params->emp_id = 15;
		
		return $params;
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_working_days($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$start_date = if_property_exist($params, 'start_date');
		$end_date 	= if_property_exist($params, 'end_date');
		$holidays	= if_property_exist($params, 'holidays', array());
		
		
		if($start_date === NULL || $start_date == '')
		{
			return handle_fail_response('Start Date is mandatory');
		}
		
		if($end_date === NULL || $end_date == '')
		{
			return handle_fail_response('End Date is mandatory');
		}
		
		$start 		= new DateTime($start_date);
		$end 		= new DateTime($end_date);
		$oneday 	= new DateInterval("P1D");
		$days 		= array();
		
		foreach(new DatePeriod($start, $oneday, $end->add($oneday)) as $day)
		{
			$day_num = $day->format("N"); /* 'N' number days 1 (mon) to 7 (sun) */
			if($day_num < 6)  /* weekday */
			{
				$format = $day->format( 'Y-m-d' );
				if(in_array( $format, $holidays ) === false )
				{
					//Add the valid day to our days array
					//This could also just be a counter if that is all that is necessary
					$days[] = $day->format( 'Y-m-d' );
				}
				
			}
		}  
		
		return $days;
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_working_dates($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$date		= if_property_exist($params, 'date');
		$days_to_add= if_property_exist($params, 'days_to_add');
		$holidays	= if_property_exist($params, 'holidays', array());
		
		
		if($date === NULL || $date == '')
		{
			return handle_fail_response('Date is mandatory');
		}
		
		if($days_to_add === NULL || $days_to_add == '')
		{
			return handle_fail_response('Days to add is mandatory');
		}
		
		if(count($holidays) == 0)
		{
			$rs = db_execute_custom_sql("SELECT DATE_FORMAT(holiday, '%Y-%m-%d') as holiday FROM cms_holidays 
										WHERE year(holiday) = " . date('Y',strtotime($date)));
			
			if(count((array)$rs) > 0)
			{
				$holidays = array_column($rs, 'holiday');;
			}
		}
		
		while ($days_to_add > 0) 
		{
			$date	= date('Y-m-d', strtotime($date. ' +1 weekday'));
			if (! in_array($date, $holidays)) $days_to_add--;
		}
		
		return $date;
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_from_assoc_array($key,$value,$array)
{
	$data = array();
	if (empty($array))
	{
		return array();
	}
	else
	{
		foreach($array as $item)
		{
			if ($item[$key] == $value)
			{
				array_push($data, $item);
			}
		}
		return $data;
	}
}

function get_doc_primary_no($field,$table,$company_id = false, $digit = 10)
{
	try
	{
		log_it(__FUNCTION__, $field . " " . $table);
		
		if($company_id)
		{
			$rs_com		= db_query("prefix,sequence_digit", "cms_master_employer", "id = " . $company_id);
		
			if(count($rs_com) <= 0)
			{
				return false;
			}
			$digit = $rs_com[0]['sequence_digit'];
		}
		else
		{
			$rs_com[0]['prefix']= "";
		}
// 		$primary_rs = db_query("IFNULL( CONCAT( RIGHT(YEAR(NOW()),2),'-',  LPAD(  SUBSTRING_INDEX(MAX($field),'-',-1) + 1 ,$digit,REPEAT('0', $digit))), CONCAT( RIGHT(YEAR(NOW()),2),'-',  CONCAT( REPEAT('0', $digit-1),'1')    )) AS $field "
// 								, $table,"YEAR(created_date) = YEAR(NOW())",'1','0',$field,'desc');
		
		$primary_rs = db_query("IFNULL( CONCAT( RIGHT(YEAR(NOW()),2),'-',  LPAD(  SUBSTRING_INDEX($field,'-',-1) + 1 ,$digit,REPEAT('0', $digit))), CONCAT( RIGHT(YEAR(NOW()),2),'-',  CONCAT( REPEAT('0', $digit-1),'1')    )) AS $field "
				, $table,"YEAR(created_date) = YEAR(NOW())",'1','0',$field,'desc');
		
		if(count($primary_rs) > 0)
		{
			$primary_rs[0][$field] = $rs_com[0]['prefix'] . $primary_rs[0][$field];
			return  $primary_rs[0];
		}
		else
		{
// 			return array($field => $rs_com[0]['prefix'] .  date("y") . "-" . sprintf("%0" . $digit . "d", 1));
			return array($field => $rs_com[0]['prefix'] .  date("y") . "-" . sprintf("%0" . $digit . "d", 1)); 
		}
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_mail_signature($email)
{
	try
	{
		log_it(__FUNCTION__, $email);
		
		if($email == '')
		{
			return array();
		}
		
		$rs = db_execute_custom_sql("SELECT cms_employees.name, cms_master_employer.mail_signature
									,IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_employees.json_field, '$.chat_user_id')),'') as id
									FROM cms_employees
									LEFT JOIN cms_master_employer ON cms_employees.employer_id = cms_master_employer.id
									WHERE cms_employees.office_email in('" . $email . "') AND cms_employees.is_active = 1");
		
		
		return isset($rs[0]) ? $rs[0] : array();
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function get_mail_signature_by_access_level($emp_access_id)
{
	try
	{
		log_it(__FUNCTION__, $emp_access_id);
		
		if($emp_access_id == '')
		{
			return array();
		}
		
		$rs					= db_query('cms_employees.name, cms_employees.office_email ,cms_master_employer.employer_name,cms_master_employer.mail_signature',
										'cms_employees INNER JOIN cms_master_employer on cms_employees.employer_id = cms_master_employer.id',
										'cms_employees.access_level IN (' . $c_emp_access_id. ') AND cms_employees.is_active = 1');
		
		return isset($rs[0]) ? $rs : array();
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function get_verifier_approver($module_id,$type_id = 0)
{
	try
	{
		log_it(__FUNCTION__, $module_id);
		$employees = db_query("id 
							, office_email
							, IFNULL(JSON_UNQUOTE(json_field->'$.access'),'') as access"
							, "cms_employees"
							, "JSON_SEARCH(json_field, 'one', $module_id, NULL, '$.access[*].module_id') IS NOT NULL and is_active = 1");

		$emails_array = array();
		for ($i=0; $i < count($employees); $i++)
		{	
			$access = json_decode($employees[$i]['access']);
			for ($j=0; $j < count($access); $j++)
			{	
				if($access[$j]->module_id == $module_id && isset($access[$j]->verify) && isset($access[$j]->approve))
				{
					if($type_id == 1)
					{
						if($access[$j]->verify == 1 && !in_array($employees[$i]['office_email'], $emails_array))
						{
							array_push($emails_array, $employees[$i]['office_email']);
						}
					}
					else if($type_id == 2)
					{
						if($access[$j]->approve == 1 && !in_array($employees[$i]['office_email'], $emails_array))
						{
							array_push($emails_array, $employees[$i]['office_email']);
						}
					}
					else
					{	
						if($access[$j]->verify == 1 && $access[$j]->approve == 1 && !in_array($employees[$i]['office_email'], $emails_array))
						{
							array_push($emails_array, $employees[$i]['office_email']);
						}
					}
				}
				
			}
		}

		$emails = $emails_array ? implode(";", $emails_array) : 'notify_silan@msphitect.com.my';
		
		return $emails;
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function create_folder($folder_path)
{
	try
	{
		if (!is_dir($folder_path)) 
		{
			mkdir($folder_path, 0777, true);
		}
		return true;
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function get_string_between($content,$start,$end)
{
	try 
	{
		$r = explode($start, $content);
		if (isset($r[1])){
			$r = explode($end, $r[1]);
			return $r[0];
		}
		return '';
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function add_emp_user_log($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$timespend	= if_property_exist($params, 'timespend');
		$view_page	= if_property_exist($params, 'view_page');
		$emp_id		= if_property_exist($params, 'emp_id');
		
		
		if($timespend === NULL || $timespend == '')
		{
			return handle_fail_response('Time spend is mandatory');
		}
		
		if($view_page === NULL || $view_page == '')
		{
			return handle_fail_response('View page is mandatory');
		}
		
		if($emp_id === NULL || $emp_id == '')
		{
			return handle_fail_response('Emp Id is mandatory');
		}
		
		$data 				= array
		(
			':page'   		=>  $view_page,
			':view_duration'=>  $timespend,
			':current_utc_time' 	=> db_execute_custom_sql("SELECT UTC_TIMESTAMP() as utc")[0]['utc']
		);
		$data 				= add_timestamp_to_array($data,$emp_id,0);
		$results 			= db_add($data, 'cms_employee_usage_log');
		
		return handle_success_response('Success', true);
		
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function get_db_UUID()
{
	try
	{
		log_it(__FUNCTION__, "");
		
		return db_execute_custom_sql("SELECT UUID() as id")[0]['id'];
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function insert_email_tracking($id,$body)
{
	try
	{
		log_it(__FUNCTION__, $id);
		
		$email_body_html = preg_replace('/(<[^>]+) href=("|\')http(.*?)"/i', '$1 href="' . constant('EMAIL_CLICK') . '?crid=' . $id . '&href=http$3"', $body);
		$email_body_html .='<img src="' . constant('EMAIL_OPENED') . '?crid=' . $id . '" style="width:1px;height:1px;">';
		
		return $email_body_html;
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_salary_details($timesheet_id)
{
	try
	{
		$result = array();
		$data   =   db_query_single('cms_timesheet.month
                                    ,cms_timesheet.year
                                    ,IFNULL(JSON_UNQUOTE(cms_employees.json_field->"$.salary"),"") as salary'
				, 'cms_timesheet
                                    LEFT JOIN cms_employees ON cms_employees.id = cms_timesheet.employee_id'
				, 'cms_timesheet.id = '.$timesheet_id
				);
		$month = date_parse($data['month']);
		$number_of_days = countDays($data['year'], $month['month'], array(0, 6));
		
		$per_day_salary                         = $data['salary'] / $number_of_days;
		
		$result['number_of_days']               = $number_of_days;
		$result['hourly_salary']                = $per_day_salary / 8;
		$result['min_working_days_in_month']    = MIN_WORKING_DAYS_IN_MONTH;
		
		return $result;
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function countDays($year, $month, $ignore)
{
	$count = 0;
	$counter = mktime(0, 0, 0, $month, 1, $year);
	while (date("n", $counter) == $month)
	{
		if (in_array(date("w", $counter), $ignore) == false)
		{
			$count++;
		}
		$counter = strtotime("+1 day", $counter);
	}
	return $count;
}

function get_employee_currency($emp_id)
{
	try
	{
		//get currency from related contract, if no currency available make "MYR" as default
		$data       = db_query_single(
				"tbl_currency.descr as currency"
				, "cms_employees
                                LEFT JOIN cms_contracts ON cms_employees.contract_no = cms_contracts.contract_no
                                LEFT JOIN cms_master_list tbl_currency on JSON_UNQUOTE(JSON_EXTRACT(cms_contracts.json_field, '$.currency')) = tbl_currency.id"
				, "cms_employees.id = ".$emp_id
				);
		
		$currency   = $data['currency'] ? $data['currency'] : 'MYR';
		
		return $currency;
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_voucher_primary_no($field,$table,$company_id = false)
{
	try
	{
		log_it(__FUNCTION__, $field . "" . $table);
		
		if($company_id)
		{
			$rs_com     = db_query("IFNULL(JSON_UNQUOTE(cms_master_employer.json_field->'$.voucher_prefix'),'') as prefix
				, IFNULL(JSON_UNQUOTE(cms_master_employer.json_field->'$.voucher_suffix'),'') as suffix
				, IFNULL(JSON_UNQUOTE(cms_master_employer.json_field->'$.voucher_sequence'),'5') as sequence_digit", 
									"cms_master_employer",
									"id = " . $company_id
								);
			if(count($rs_com) <= 0)
			{
				return false;
			}
			$digit = $rs_com[0]['sequence_digit'];
			
		}
		else
		{
			$rs_com[0]['prefix']= "";
			$rs_com[0]['suffix']= "";
			$digit              = 5;
		}
		
		$primary_rs = db_query("IFNULL(CONCAT(RIGHT(YEAR(NOW()), 2), '-', LPAD(SUBSTRING_INDEX($field, '-', -1) + 1, $digit, REPEAT('0', $digit))), CONCAT(RIGHT(YEAR(NOW()), 2), '-', CONCAT(REPEAT('0', $digit - 1), '1'))) AS $field"
				, $table,"YEAR(created_date) = YEAR(NOW()) ",'1','0',$field,'desc');
		
		if(count($primary_rs) > 0)
		{
			if($rs_com[0]['suffix'] != '')
			{
				$primary_rs[0][$field] = $rs_com[0]['prefix'] . $primary_rs[0][$field]. "-" .$rs_com[0]['suffix'];
				return  $primary_rs[0];
			}
			else
			{
				$primary_rs[0][$field] = $rs_com[0]['prefix'] . $primary_rs[0][$field];
				return  $primary_rs[0];
			}
		}
		else
		{   
			if($rs_com[0]['suffix'] != '')
			{
				return array($field => $rs_com[0]['prefix'] .  date("y") . "-" . sprintf("%0" . $digit . "d", 1). "-" .$rs_com[0]['suffix']); 
			}
			else
			{
				return array($field => $rs_com[0]['prefix'] .  date("y") . "-" . sprintf("%0" . $digit . "d", 1)); 
			}
		}
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}


function execute_on_server($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		$field		= $params['0'];
		$table		= $params['1'];
		$where		= $params['2'];
		$limit		= $params['3'];
		$index		= $params['4'];
		$orderby 	= $params['5'];
		$sortorder 	= $params['6'];
		$rs 		= db_query($field,$table,$where,$limit, $index, $orderby, $sortorder);
		return handle_success_response('Success',$rs);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function execute_on_server_single($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		$field		= $params['0'];
		$table		= $params['1'];
		$where		= $params['2'];
		$limit		= $params['3'];
		$index		= $params['4'];
		$orderby 	= $params['5'];
		$sortorder 	= $params['6'];
		$rs 		= db_query_single($field,$table,$where,$limit, $index, $orderby, $sortorder);
		return handle_success_response('Success',$rs);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function execute_on_server_custom($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$rs = db_execute_custom_sql($params);
		return handle_success_response('Success',$rs);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}


function utf8ize( $mixed ) 
{
	if (is_array($mixed)) 
	{
		foreach ($mixed as $key => $value) 
		{
			$mixed[$key] = utf8ize($value);
		}
	} 
	elseif (is_string($mixed)) 
	{
		return mb_convert_encoding($mixed, "UTF-8", "UTF-8");
	}
	return $mixed;
}

function digital_sign_generate_keys($json_encode, $path)
{
	try
	{	
		$jar_file = constant('LIB_DIR')  .'/digital_sign/SG_Final_Jar_PHP/Final_ED_Both.jar';
		
		//create necessary files
		$txt_files = array(
							'json.txt'
						  , 'session_key.txt'
						  , 'Encrypted_Signed_Data.txt'
						  , 'encrypted_sessionkey.txt'
						  , 'encrypted_json_data.txt'
						  , 'encrypted_hashof_json_data.txt'
						  , 'Decrypted_Signed_Data.txt'
						 );
		foreach($txt_files as $txt_file)
		{
			if(!file_exists($path."/".$txt_file))
			{
				fopen($path."/".$txt_file, "w");
			}
		}
		
		//write the json data to text file
		file_put_contents($path."/json.txt", $json_encode);
		
		$arg1		= "Encrypt";
		$arg2		= $path."/json.txt";
		$arg3		= $path."/session_key.txt";
		$arg4		= $path."/encrypted_sessionkey.txt";
		$arg5		= $path."/encrypted_json_data.txt";
		$arg6		= $path."/encrypted_hashof_json_data.txt";
		$arg7		= constant('LIB_DIR')  ."/digital_sign/certificate/certificate.cer";
		
		$theFiles	= array($arg1,$arg2,$arg3,$arg4,$arg5,$arg6,$arg7);
		exec("java -jar $jar_file " . implode (' ', $theFiles),$output1,$ret);

	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function digital_sign_decrypt($folder, $file_path)
{
	try
	{	
		$jar_file = constant('LIB_DIR')  .'/digital_sign/SG_Final_Jar_PHP/Final_ED_Both.jar';
		$Decrypted_Signed_Data_file = fopen($folder."/Decrypted_Signed_Data.txt", "w");
		$txt = "";
		fwrite($Decrypted_Signed_Data_file, $txt);
		fclose($Decrypted_Signed_Data_file);

		$arg1		= "Decrypt";
		$arg2		= $folder."/Encrypted_Signed_Data.txt";
		$arg3		= $folder."/session_key.txt";
		$arg4		= $folder."/Decrypted_Signed_Data.txt";
		$theFiles	= array($arg1,$arg2,$arg3,$arg4);
		exec("java -jar $jar_file " . implode (' ', $theFiles),$output1,$ret);

		//convert the base_64 string to actual file
		$pdf_base64 = $folder."/Decrypted_Signed_Data.txt";
		//Get File content from txt file
		$pdf_base64_handler = fopen($pdf_base64,'r');
		$pdf_content = fread ($pdf_base64_handler,filesize($pdf_base64));
		fclose ($pdf_base64_handler);
		//Decode pdf content
		$pdf_decoded = base64_decode ($pdf_content);
		//Write data back to pdf file
		$pdf = fopen ($file_path,'w');
		fwrite ($pdf,$pdf_decoded);
		//close output file
		fclose ($pdf);

		return true;

	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

?>