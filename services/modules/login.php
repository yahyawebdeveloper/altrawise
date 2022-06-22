<?php
/**
 * @author 		Jamal
 * @date 		14-Nov-2015
 * @modify
 * @Note = Please follow the indentation
 *         Please follow the naming convention
 */

function check_login($params)
{
	try
	{
 		log_it(__FUNCTION__, $params);

		$username	= $params->username;
		$password	= $params->password;
		$device_info= if_property_exist($params, 'device_info',	'');
		$device_id  = if_property_exist($params, 'device_id',	0);

		if((isset($username)) && strval($username) === '')
		{
			return handle_fail_response('Username is mandatory');
		}
		
		if(constant('LDAP_SERVICE') == '')
		{
			if((isset($password)) && strval($password) === '')
			{
				return handle_fail_response('Password is mandatory');
			}
			
			$password_filter = " AND cms_employees.pswd = :password ";
		}
		
		if((isset($password)) && strval($password) === '')
		{
			return handle_fail_response('Password is mandatory');
		}

		// $password = get_encrypt_password($password);
		
		$rs = db_query_new("id as emp_id, name, email,office_email, username
						, is_admin, initial_pswd
						, cms_emp_login_sessions.token
						, concat('" . constant('UPLOAD_DIR_URL') . "', 'photos/',id,'/',id,'.jpeg') as profile_pic
						, '" . constant('UPLOAD_DIR_URL') . "' as filepath
		                , super_admin
						, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(json_field, '$.faq_id')),'') as faq_id
						, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(json_field, '$.chat_username')),'') as chat_username
						, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(json_field, '$.chat_token')),'') as chat_token
						, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(json_field, '$.chat_user_id')),'') as chat_user_id 
						, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(json_field, '$.access')),'') as access
						, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(json_field, '$.permission.enable_portal')), 0) as enable_portal
						, cms_employees.employer_id as company_id
						, (select employer_name from cms_master_employer where cms_master_employer.id = JSON_UNQUOTE(cms_employees.json_field->'$.employer')) as company_name", 
						"cms_employees
						LEFT join cms_emp_login_sessions ON cms_employees.id = cms_emp_login_sessions.emp_id",
						"cms_employees.username	= '$username' AND cms_employees.pswd = '$password' AND cms_employees.is_active = 1;"
						//"cms_employees.username	= :username  $password_filter AND cms_employees.is_active = 1;"
						, array(':username' => $username,':password' => $password) );
		//echo '<pre>';print_r($rs);exit;
		if(count((array)$rs) < 1 || !isset($rs))
		{
			return handle_fail_response('Invalid username or password');
		}
		else
		{
			if((int)$rs[0]['enable_portal'] == 0)
			{
				return handle_fail_response('Portal login not enabled');
			}

			if((!isset($rs[0]['access'])) || $rs[0]['access'] == '')
			{
				return handle_fail_response('No Accessibility level set for the user');
			}

			if(constant('RESTRICT_DUPLICATE_LOGIN') == true)
			{
				if($rs[0]['token_emp_id'] != '')
				{
					return handle_fail_response('Duplicate Login, Please contact administrator');
				}
			}
			
			include '../services/modules/attachments.php';
			$params->primary_id                 = $rs[0]['company_id'];
			$params->module_id                  = 8;
			$company_logo                       = json_decode(get_attachment($params))->data->attachment;
			
			if($company_logo)
			{
				$logo_path = constant("UPLOAD_DIR_URL") . 'companies/' . $company_logo[0]->primary_id . '/' . $company_logo[0]->filename;
			}
			else
			{
				$logo_path = constant("ROOT_URL") . '/assets/img/logo.png';
			}

			//profile pic
			$params->primary_id                 = $rs[0]['emp_id'];
			$params->module_id                  = 81;
			$params->secondary_id               = 13;
			$profile_pic                       = json_decode(get_attachment($params))->data->attachment;
			
			if($profile_pic)
			{
				$profile_pic_path = constant("UPLOAD_DIR_URL") .  $profile_pic[0]->module_id .'/' . $profile_pic[0]->primary_id . '/' . $profile_pic[0]->filename;
			}
			else
			{
				$profile_pic_path = constant("ROOT_URL") . '/assets/img/profile-default.jpg';
			}

			
			$params->emp_id 	= $rs[0]['emp_id'];
			$params->token		= $rs[0]['token'];

			if(is_login_token_valid($params) == FALSE)
			{
				$rs[0]['token'] = add_session($params);
			}
			
			if($device_id != '')
			{
			    db_execute_sql("UPDATE cms_employees set device_info = '" . stripslashes(str_replace("'", "", $device_info)) . "',device_id='" . stripslashes($device_id) . "' WHERE id = " . $params->emp_id);
			}
			
			$rs[0]['FILEUPLOAD_MAXSIZE']		= constant('FILEUPLOAD_MAXSIZE');
			$rs[0]['FILEUPLOAD_ALLOWED_TYPE']	= constant('FILEUPLOAD_ALLOWED_TYPE');
			$rs[0]['CPANEL_DOMAIN']				= constant('CPANEL_DOMAIN');
			// $rs[0]['EXTERNAL_KEY']				= encrypt_decrypt(constant('EXTERNAL_KEY'),'e');
			$rs[0]['SERVICE_URL']				= constant('SERVICE_URL');
			$rs[0]['PUBLIC_URL']				= constant('ROOT_URL');
			$rs[0]['access'] 					= json_decode($rs[0]['access']);
			$rs[0]['modules']					= arrange_accessibilty($rs[0]['access']);
			$rs[0]['logo_path']					= $logo_path;
			$rs[0]['profile_pic_path']			= $profile_pic_path;
			
			return handle_success_response('Success', $rs[0]);
		}

	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_login_ldap_access($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		
		$rs = db_query("username",
				"cms_employees",
				"cms_employees.ad_username	= '". stripslashes($params->username) . "' AND cms_employees.is_active = 1");
		
		if(count((array)$rs) < 1 || !isset($rs))
		{
			return handle_fail_response('Invalid Collector ID, please check with administrator');
		}
		
		$params->ad_username = $rs[0]['username'];
		
		$username   = constant('LDAP_DOMAIN_PREFIX') . $params->ad_username;
		$password   = $params->password;
		
		if((isset($username)) && strval($username) === '')
		{
			return handle_fail_response('Username is mandatory');
		}
		
		if((isset($password)) && strval($password) === '')
		{
			return handle_fail_response('Password is mandatory');
		}
		
		$ad = ldap_connect(constant('LDAP_SERVICE'), constant('LDAP_PORT'));
		if(!$ad)
		{
			ldap_unbind($ad);
			return handle_fail_response('Fail to connect to LDAP');
		}
		
		ldap_set_option($ad, LDAP_OPT_PROTOCOL_VERSION, 3);
		ldap_set_option($ad, LDAP_OPT_REFERRALS, 0);
		
		$is_user_active = @ldap_bind($ad, $username, $password);
		
		if(!$is_user_active)
		{
			ldap_unbind($ad);
			return handle_fail_response('Invalid UserName Or Password');
		}
		ldap_unbind($ad);
		
		return check_login($params);
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
			':token'   		=>  $token,
			':emp_id'    	=>  $params->emp_id,
			':login_time'	=>  $current_date,
			':last_active'	=>  $current_date,
			':created_by'	=>  0,
			':client_ip'    =>  isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : ''
		);
		$results 			= db_add($data, 'cms_emp_login_sessions');

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
			':emp_id'    	=>  $params->emp_id,
			':last_active'	=>  get_current_date(),
			':client_ip'    =>  isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : ''
		);
		$results = db_update($data,'cms_emp_login_sessions','token');

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

		$results = db_execute_sql("DELETE from cms_emp_login_sessions where token = '" . stripslashes($params->token) . "'");
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
						"cms_emp_login_sessions",
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

function recover_password($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

        $email		= if_property_exist($params, 'email');

        if($email === NULL)
        {
            return handle_fail_response('Email is mandatory');
        }

        $rs = db_query("id, name, office_email, is_active",
            "cms_employees",
            "office_email = '". stripslashes($email) . "'");


        if(count((array)$rs) < 1 || !isset($rs))
        {
            return handle_fail_response('Invalid email address');
        }
        else
        {
            if($rs[0]['is_active'] == 0)
            {
                return handle_fail_response('The user is inactive, please contact administrator');
            }
            else
            {
                $secret_key = get_unique_id();

                $data = array
                (
                    ':id' 		    => $rs[0]['id'],
                    ':secret_key'   => $secret_key
                );
                $results = db_update($data,'cms_employees','id');

                $template 	= file_get_contents(constant('TEMPLATE_DIR') . '/reset_password_template.html');
                $replace 	= array('{APP_TITLE}', '{NAME}', '{RESET_URL}','{PARAM}','{MAIL_SIGNATURE}');
                $with 		= array(constant('APPLICATION_TITLE'), $rs[0]['name'], constant('RESET_PASS_URL'), 'email=' . $email . '&secret_key=' . $secret_key,constant('MAIL_SIGNATURE'));
                $body		= str_replace($replace, $with, $template);

                if(!smtpmailer
                    (
                        $rs[0]['office_email'],
                        constant('MAIL_USERNAME'),
                        constant('MAIL_FROMNAME'),
                        'Reset Password',
                        $body
                    ))
                {
                    return handle_fail_response('ERROR','Send Email to admin fail. Please re-try again later');
                }


                return handle_success_response('Success', $rs[0]);
            }
        }

    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function reset_password($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

        $email		= if_property_exist($params, 'email');
        $secret_key	= if_property_exist($params, 'secret_key');

        if($email === NULL)
        {
            return handle_fail_response('Email is mandatory');
        }

        if($secret_key === NULL)
        {
            return handle_fail_response('Secret Key is mandatory');
        }

        $rs = db_query("id,name",
            "cms_employees",
            "office_email = '". $email . "' and secret_key='" . $secret_key . "'");


        if(count((array)$rs) < 1 || !isset($rs))
        {
            return handle_fail_response('Invalid credentials');
        }
        else
        {
            $new_password = random_numbers(4);
            $data = array
            (
                ':id' 		    => $rs[0]['id'],
                ':pswd'    => md5($new_password)
            );

            $results = db_update($data,'cms_employees','id');

            $data = array
            (
                'result'   => $results,
                'name'     => $rs[0]['name'],
                'password' => $new_password
            );

            return handle_success_response('Success', $data);
        }

    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function change_password($params)
{
    try {
        log_it(__FUNCTION__, $params);

        $emp_id	 			= $params->emp_id;
		$old_pwd 			= md5($params->old_pwd);
		$new_pwd 			= md5($params->new_pwd);

		$return['portal'] 	= false;
		$return['email'] 	= false;
		$return['portal'] 	= false;
		
        if((isset($emp_id)) && strval($emp_id) === '')
		{
			return handle_fail_response('Missing employee ID');
		}
		if((isset($old_pwd)) && strval($old_pwd) === '')
		{
			return handle_fail_response('Mssing current password');
		}
		if((isset($new_pwd)) && strval($new_pwd) === '')
		{
			return handle_fail_response('Missing new password');
		}

        $rs = db_query('pswd', 'cms_employees', 'id = ' . $emp_id);

        if (count((array)$rs) < 1 || !isset($rs))
        {
            return handle_fail_response('No employee record found.');
        }
        else
        {
            if ($rs[0]['pswd'] == $new_pwd)
            {
                return handle_fail_response('New password cannot be same as current password.');
            }
            else
            {
                $data = array
                (
                    ':pswd'         => $new_pwd,
                    ':id'           => $emp_id,
                    ':initial_pswd' => 0
                );
                $result = db_update($data, 'cms_employees', 'id');

                if ($result != '')
                {
                	if(constant('API_ENV') === 'PROD')
                	{
	                	require_once constant('MODULES_DIR') . '/chat.php';
	                	require_once constant('MODULES_DIR') . '/controlpanel.php';
	                	$params->password	= $params->new_pwd;
	                	
	                	$return['portal'] 	= true;
	                	$return['email']	= json_decode(get_control_panel_change_pass($params))->data;
	                	$return['chat'] 	= json_decode(chat_update_own_basic_info($params))->data;
	                	
	                	$json_field			= "'$.mail.password',	'" 	. encrypt_string($params->new_pwd) 	. "',
											   '$.main_credential',	'" 	. encrypt_string($params->new_pwd) 	. "',
											   '$.last_pass_change','" 	. get_current_date() 	. "'";
	                	
	                	$sql				= "UPDATE cms_employees
	                				   		   SET json_field = JSON_SET(json_field,$json_field)
	                				  	 	   WHERE id = " . $emp_id;
	                	$result 			= db_execute_sql($sql);
                	}
                	
                	return handle_success_response('Success', $return);
                }
                else
                {
                    return handle_fail_response('Change password failed');
                }
            }
        }
    } catch (Exception $e) {
        handle_exception($e);
    }

}

function get_public_holidays($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

        $year		= if_property_exist($params, 'year');


        if($year === NULL)
        {
            $year = "year(now())";
        }

        $rs = db_query("DATE_FORMAT(holiday, '%m/%d/%Y') as holiday,holiday_desc",
                        "cms_holidays",
                        "year(holiday) = ". $year);


        return handle_success_response('Success', $rs);

    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function arrange_accessibilty($rs)
{
	try
	{
		log_it(__FUNCTION__, $rs);
		
		$modules	= array();
		$access		= array();
		$rs_count	= count((array)$rs);
		for($i = 0;$i < $rs_count;$i++)
		{
			if(isset($rs[$i]->view) && $rs[$i]->view == 1)
			{
				array_push($modules,$rs[$i]->module_id);
			}
		}
		
		return $modules;
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}



?>
