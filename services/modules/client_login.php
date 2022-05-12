<?php
/**
 * @author          Syed Anees
 * @module          Client Login
 * @description     client login
 * @date            04-05-2022
 */

 //client login
function client_login($params) {
	try
	{
 		log_it(__FUNCTION__, $params);

		$client_username	= $params->client_username;
		$client_password	= $params->client_password;
		// $device_info= if_property_exist($params, 'device_info',	'');
		// $device_id  = if_property_exist($params, 'device_id',	0);

		if((isset($client_username)) && strval($client_username) === '')
		{
			return handle_fail_response('Username is mandatory');
		}
		
		// if(constant('LDAP_SERVICE') == '')
		// {
		// 	if((isset($password)) && strval($password) === '')
		// 	{
		// 		return handle_fail_response('Password is mandatory');
		// 	}
			
		// 	$password_filter = " AND cms_employees.pswd = :password ";
		// }
		
		if((isset($client_password)) && strval($client_password) === '')
		{
			return handle_fail_response('Password is mandatory');
		}
		
		// $rs = db_query_new("id as emp_id, name, email,office_email, username
		// 				, is_admin, initial_pswd
		// 				, cms_emp_login_sessions.token
		// 				, concat('" . constant('UPLOAD_DIR_URL') . "', 'photos/',id,'/',id,'.jpeg') as profile_pic
		// 				, '" . constant('UPLOAD_DIR_URL') . "' as filepath
		//                 , super_admin
		// 				, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(json_field, '$.faq_id')),'') as faq_id
		// 				, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(json_field, '$.chat_username')),'') as chat_username
		// 				, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(json_field, '$.chat_token')),'') as chat_token
		// 				, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(json_field, '$.chat_user_id')),'') as chat_user_id 
		// 				, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(json_field, '$.access')),'') as access
		// 				, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(json_field, '$.permission.enable_portal')), 0) as enable_portal
		// 				, cms_employees.employer_id as company_id
		// 				, (select employer_name from cms_master_employer where cms_master_employer.id = JSON_UNQUOTE(cms_employees.json_field->'$.employer')) as company_name", 
		// 				"cms_employees
		// 				LEFT join cms_emp_login_sessions ON cms_employees.id = cms_emp_login_sessions.emp_id",
		// 				"cms_employees.username	= '$username' AND cms_employees.pswd = '$password' AND cms_employees.is_active = 1;"
		// 				//"cms_employees.username	= :username  $password_filter AND cms_employees.is_active = 1;"
		// 				, array(':username' => $username,':password' => $password) );
		// echo '<pre>';print_r($rs);exit;






		$rs = db_query_new("
		cms_clients_contacts.id as contact_id, cms_clients_contacts.name as contact_name, cms_clients_contacts.email, 
		cms_clients_contacts.mobile, cms_clients_contacts.designation, cms_clients_contacts.is_active,
		cms_clients.id as client_id, cms_clients.name as client_name, cms_clients.industry, cms_clients.type_id, cms_clients.source, cms_clients.assign_emp_id,
		cms_client_login_sessions.token
		, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_clients_contacts.json_field, '$.offerings')),'') as offerings
		, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_clients_contacts.json_field, '$.user_status')),'') as user_status
		, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_clients_contacts.json_field, '$.contact_status')),'') as contact_status
		, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_clients_contacts.json_field, '$.additional_values')),'') as additional_values
		"
		, "cms_clients_contacts
		join cms_clients ON cms_clients.id = cms_clients_contacts.client
		LEFT JOIN cms_client_login_sessions ON cms_client_login_sessions.client_id = cms_clients_contacts.id"
		, "cms_clients_contacts.email	= '$client_username' AND cms_clients_contacts.password = '$client_password' AND cms_clients_contacts.is_active = 1 AND cms_clients.is_active = 1;"
		, array(':email' => $client_username,':password' => $client_password) );

		
		
		if(count((array)$rs) < 1 || !isset($rs))
		{
			return handle_fail_response('Invalid username or password');
		}
		else
		{
			// if((int)$rs[0]['enable_portal'] == 0)
			// {
			// 	return handle_fail_response('Portal login not enabled');
			// }

			// if((!isset($rs[0]['access'])) || $rs[0]['access'] == '')
			// {
			// 	return handle_fail_response('No Accessibility level set for the user');
			// }

			// if(constant('RESTRICT_DUPLICATE_LOGIN') == true)
			// {
			// 	if($rs[0]['token_emp_id'] != '')
			// 	{
			// 		return handle_fail_response('Duplicate Login, Please contact administrator');
			// 	}
			// }
			
			// include '../services/modules/attachments.php';
			// $params->primary_id                 = $rs[0]['company_id'];
			// $params->module_id                  = 8;
			// $company_logo                       = json_decode(get_attachment($params))->data->attachment;
			
			// if($company_logo)
			// {
			// 	$logo_path = constant("UPLOAD_DIR_URL") . 'companies/' . $company_logo[0]->primary_id . '/' . $company_logo[0]->filename;
			// }
			// else
			// {
			// 	$logo_path = constant("ROOT_URL") . '/assets/img/logo.png';
			// }

			//profile pic
			// $params->primary_id                 = $rs[0]['emp_id'];
			// $params->module_id                  = 81;
			// $params->secondary_id               = 13;
			// $profile_pic                       = json_decode(get_attachment($params))->data->attachment;
			
			// if($profile_pic)
			// {
			// 	$profile_pic_path = constant("UPLOAD_DIR_URL") .  $profile_pic[0]->module_id .'/' . $profile_pic[0]->primary_id . '/' . $profile_pic[0]->filename;
			// }
			// else
			// {
			// 	$profile_pic_path = constant("ROOT_URL") . '/assets/img/profile-default.jpg';
			// }

			
			$params->client_id 	= $rs[0]['contact_id'];
			$params->token		= $rs[0]['token'];

			if(is_login_token_valid($params) == FALSE)
			{
				$rs[0]['token'] = add_session($params);
			}
			
			// if($device_id != '')
			// {
			//     db_execute_sql("UPDATE cms_employees set device_info = '" . stripslashes(str_replace("'", "", $device_info)) . "',device_id='" . stripslashes($device_id) . "' WHERE id = " . $params->emp_id);
			// }
			
			// $rs[0]['FILEUPLOAD_MAXSIZE']		= constant('FILEUPLOAD_MAXSIZE');
			// $rs[0]['FILEUPLOAD_ALLOWED_TYPE']	= constant('FILEUPLOAD_ALLOWED_TYPE');
			// $rs[0]['CPANEL_DOMAIN']				= constant('CPANEL_DOMAIN');
			// // $rs[0]['EXTERNAL_KEY']				= encrypt_decrypt(constant('EXTERNAL_KEY'),'e');
			// $rs[0]['SERVICE_URL']				= constant('SERVICE_URL');
			// $rs[0]['PUBLIC_URL']				= constant('ROOT_URL');
			// $rs[0]['access'] 					= json_decode($rs[0]['access']);
			// $rs[0]['modules']					= arrange_accessibilty($rs[0]['access']);
			// $rs[0]['logo_path']					= $logo_path;
			// $rs[0]['profile_pic_path']			= $profile_pic_path;
			
			return handle_success_response('Success', $rs[0]);
		}

	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function add_session($params)
{
	try
	{
		log_it(__FUNCTION__, $params);

		$token				= get_unique_id();
		$current_date		= get_current_date();
		$data 				= array
		(
			':token'   		    =>  $token,
			':client_id'    	=>  $params->client_id,
			':login_time'	    =>  $current_date,
			':last_active'	    =>  $current_date,
            ':created_by'       =>  0,
			':client_ip'        =>  isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : ''
		);
		$results 			= db_add($data, 'cms_client_login_sessions');

		return $token;

	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function update_session($params)
{
	try
	{
		log_it(__FUNCTION__, $params);

		$data = array
		(
			':token' 		=> 	$params->token,
			':client_id'    =>  $params->client_id,
			':last_active'	=>  get_current_date(),
			':client_ip'    =>  isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : ''
		);
		$results = db_update($data,'cms_client_login_sessions','token');

	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function delete_session($params)
{
	try
	{
		log_it(__FUNCTION__, $params);

		$results = db_execute_sql("DELETE from cms_client_login_sessions where token = '" . stripslashes($params->token) . "'");
		return handle_success_response('Success', TRUE);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function is_login_token_valid($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		$valid = FALSE;

		if($params->token == '')
		{
			return FALSE;
		}

		$rs = db_query( "count(token) as token_count ",
						"cms_client_login_sessions",
						"token	= '". stripslashes($params->token) . "'");

		if($rs[0]['token_count'] > 0)
		{
			$valid = TRUE;
			update_session($params);
		}

		return $valid;

	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}