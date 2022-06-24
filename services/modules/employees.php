<?php
/**
* @author 		Jamal
* @date 		16-Nov-2015
* @modify
* @Note = Please follow the indentation
*         Please follow the naming convention
*/

function get_employee_list($params)
{
    try
	{
        log_it(__FUNCTION__, $params);

        $name	        = if_property_exist($params, 'name');
        $status_id      = if_property_exist($params, 'status_id');
        $client_id		= if_property_exist($params, 'client_id');
        $email	        = if_property_exist($params, 'email');
        $start_index	= if_property_exist($params, 'start_index',	0);
        $limit	        = if_property_exist($params, 'limit',	MAX_NO_OF_RECORDS);
        $is_admin       = if_property_exist($params, 'is_admin',	0);
        $created_by     = if_property_exist($params, 'created_by');
        $photoname   	= if_property_exist($params, 'photoname');
        $emp_id	        = if_property_exist($params, 'emp_id');

        if($emp_id === NULL)
        {
            return handle_fail_response('Employee ID is mandatory');
        }
        
        $where	=	" 1=1";

        if($is_admin != 1)
        {

        }

        if($name != "")
        {
            $where 	.= " AND name LIKE '%" . $name . "%' ";
        }
        if($status_id != "")
        {
            $where 	.=  " AND cms_employees.is_active = " . $status_id;
        }
        if($client_id != "")
        {
            $where 	.= " AND cms_employees.client_id in(" . $client_id . ")";
        }
        if($created_by != "")
        {
            $where 	.= " AND cms_employees.created_by in(" . $created_by . ")";
        }
        if($email != "")
        {
            $where 	.= " AND cms_employees.office_email LIKE '%" . $email . "%' ";
        }

        $rs = db_query_list
        (
            "cms_employees.id
            , cms_employees.employee_no
            , cms_employees.name
			, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_employees.json_field,'$.designation')),'') as designation
			, concat('" . constant('UPLOAD_DIR_URL') . "', 'photos/',cms_employees.id,'/',cms_employees.id,'.jpeg') as profile_pic
            , IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_employees.json_field,'$.malaysia_phone')),'') as malaysia_phone
            , cms_employees.email
			, cms_employees.office_email
            , cms_employees.username
            , cms_employees.pswd
            , cms_master_list.descr as department
            , cms_employees.is_admin
            , IF(cms_employees.is_active = 1, 'ACTIVE','IN-ACTIVE') as status
            , (select name from cms_employees emp where emp.id = cms_employees.created_by
            ) as created_by
            ",
            "
            cms_employees
            LEFT JOIN cms_master_list
            ON (cms_employees.dept_id = cms_master_list.id)
            ",
            $where, $start_index, $limit, "id");

            if(count((array)$rs) < 1 || !isset($rs))
            {
                return handle_fail_response('No record found');
            }
            else
            {
                return handle_success_response('Success', $rs);
            }

	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_employee_history_list($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

        $start_index	= if_property_exist($params, 'start_index',	0);
        $limit	        = if_property_exist($params, 'limit', MAX_NO_OF_RECORDS);
        $emp_id	        = if_property_exist($params, 'emp_id');


        $where	=	" cms_employees_work_history.id != ''";
        if($emp_id === NULL || $emp_id == "")
        {
            return handle_fail_response('Employee ID is mandatory');
        }
        else
        {
            $where 	.=  " AND cms_employees_work_history.emp_id = " . $emp_id . " AND cms_employees_work_history.is_active = 1";
        }


        $rs = db_query_list
        (
            "cms_employees_work_history.id
            , cms_employees_work_history.emp_id
            , cms_employees.name
            , (select descr from cms_master_list where cms_master_list.id = cms_employees_work_history.dept_id) as department
            , date_format(cms_employees_work_history.join_date,'" . constant('UI_DATE_FORMAT') .  "') as join_date
            , (select descr from cms_master_list where cms_master_list.id = cms_employees_work_history.client_id) as client_name
            , date_format(cms_employees_work_history.work_start_date,'" . constant('UI_DATE_FORMAT') .  "') as work_start_date
            , date_format(cms_employees_work_history.work_end_date,'" . constant('UI_DATE_FORMAT') .  "') as work_end_date
            , cms_employees_work_history.salary
            , date_format(cms_employees_work_history.increment_date,'" . constant('UI_DATE_FORMAT') .  "') as increment_date
            , cms_employees_work_history.increment_amount
            , date_format(cms_employees_work_history.next_increment_date,'" . constant('UI_DATE_FORMAT') .  "') as next_increment_date
            , IF(cms_employees_work_history.is_active = 1, 'ACTIVE','IN-ACTIVE') as status
            , (select name from cms_employees emp where emp.id = cms_employees_work_history.created_by) as created_by
            ",
            "
            cms_employees_work_history
            INNER JOIN cms_employees ON cms_employees_work_history.emp_id = cms_employees.id
            ",
            $where, $start_index, $limit, "work_start_date", "DESC");

        if(count((array)$rs) < 1 || !isset($rs))
        {
            return handle_fail_response('No record found');
        }
        else
        {
            return handle_success_response('Success', $rs);
        }

    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function get_employee_leave_list($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

        $start_index	= if_property_exist($params, 'start_index',	0);
        $limit	        = if_property_exist($params, 'limit',	MAX_NO_OF_RECORDS);
        $emp_id	        = if_property_exist($params, 'emp_id');


        $where	=	" cms_emp_leave.id != ''";
        if($emp_id === NULL || $emp_id == "")
        {
            return handle_fail_response('Employee ID is mandatory');
        }
        else
        {
            $where 	.=  " AND cms_emp_leave.emp_id = " . $emp_id . " AND cms_emp_leave.is_active != 0 ";
        }

        $rs = db_query_list
        (
            "cms_emp_leave.id
            , cms_emp_leave.emp_id
            , cms_employees.name
            , cms_master_list.descr as leave_type
            , cms_emp_leave.no_of_days
            , cms_emp_leave.brought_forward
            , cms_emp_leave.applicable_year
            , cms_emp_leave.applicable_to_next_year
            , (select name from cms_employees emp where emp.id = cms_emp_leave.created_by) as created_by
            ",
            "
            cms_emp_leave
            INNER JOIN cms_employees ON cms_emp_leave.emp_id = cms_employees.id
            INNER JOIN cms_master_list ON cms_emp_leave.master_list_id = cms_master_list.id
            ",
            $where, $start_index, $limit, "id"
        );

        if(count((array)$rs) < 1 || !isset($rs))
        {
            return handle_fail_response('No record found');
        }
        else
        {
            return handle_success_response('Success', $rs);
        }

    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function add_edit_employees($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

		$id		    			= if_property_exist($params,'id');
		$name					= if_property_exist($params,'name');
		$email					= if_property_exist($params,'email');
		$office_email			= if_property_exist($params,'office_email');
		$dept_id    			= if_property_exist($params,'dept_id');
		$reporting_to_id		= if_property_exist($params,'reporting_to_id',0,array(0,""));
		$username				= if_property_exist($params,'username');
		$pswd					= if_property_exist($params,'pswd');
		$is_admin           	= if_property_exist($params,'is_admin');
		$is_active          	= if_property_exist($params,'is_active');
		$is_super_admin     	= if_property_exist($params,'is_super_admin');
		$json_field     		= if_property_exist($params,'json_field');

        $emp_id 	        	= if_property_exist($params,'emp_id');
        $is_this_super_admin	= if_property_exist($params,'is_this_super_admin');
        
        if($name === NULL || $name == '')
        {
            return handle_fail_response('Name is mandatory');
        }
        if($email === NULL || $email == '')
        {
            return handle_fail_response('Email is mandatory');
        }

        $data = array
        (
			':name'						=> ucwords(strtolower($name)),
			':email'					=> $email,
			':office_email'				=> $office_email,
			':dept_id'					=> $dept_id,
			':reporting_to_id'      	=> $reporting_to_id,
			':json_field'				=> json_encode($json_field),
            ':is_active'            	=> $is_active,
            ':created_by'				=> $emp_id
        );
        
        if((int)$is_this_super_admin === 1)
        {
        	$data[':super_admin']      = $is_super_admin;
        	$data[':is_admin']         = $is_admin;
        }

		
        if($username != "")
        {
            $data 		= array_push_assoc($data,':username',$username);
		}
        if(is_data_exist('cms_employees', 'id', $id))
        {
            if($pswd != "")
            {
				$data = array_push_assoc($data,":pswd",get_encrypt_password($pswd));
                // if(!isValidMd5($pswd))
                // {
                //     $data = array_push_assoc($data,":pswd",md5($pswd));
                // }
            }
            $data[':id']    		= $id;
            $data 					= add_timestamp_to_array($data,$emp_id,1);
            $result 				= db_update($data, 'cms_employees', 'id');

			if($result) {
				return handle_success_response('Success', $id);
			}else {
				return handle_fail_response('Update failed', $result);
			}
        }
        else
        {
            if($pswd != "")
            {
				$data = array_push_assoc($data,":pswd",get_encrypt_password($pswd));
                // $data   = array_push_assoc($data,":pswd",md5($pswd));
            }
            $data[':json_field'] 	= json_encode($json_field);
            $data 					= add_timestamp_to_array($data,$emp_id,0);
            $id 					= db_add($data, 'cms_employees');
        }
        
        if(constant('API_ENV') === 'PROD')
        {
	        if($office_email != "")
	        {
	        	$tmp = explode("@", strtolower(trim($office_email)));
	        	if(trim($tmp[1]) == constant('CPANEL_DOMAIN'))
	        	{
					require_once(constant('MODULES_DIR') . '/controlpanel.php');
					if(is_control_panel_email_exist($params) == true)
					{
						$params->login 		= (int)$json_field->permission->enable_email;
						$params->incoming 	= (int)$json_field->permission->enable_email;
						$params->outgoing	= (int)$json_field->permission->enable_email;
						$params->email		= $office_email;
						$params->password 	= $pswd;
						get_control_panel_change_pass($params);
						$params->email		= $tmp[0];
						get_control_panel_suspend_email($params);
					}
	        	}
	        }
	
			if(constant('CHAT_SERVER') != '')
			{
				require_once(constant('MODULES_DIR') . '/chat.php');    
				if((int)$json_field->permission->enable_chat == 0)
				{
					$params->new_pwd	= "[!D3L3T3D2020!]";
					$params->new_name	= $username . "-DELETED-";
					$params->active		= false;
				}
				else
				{
					$params->new_pwd	= get_encrypt_password($pswd);
					$params->new_name	= $username;
					$params->active		= true;
				}
				chat_update_own_basic_info($params);
			}
        }
        
        return handle_success_response('Success', $id);
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function enable_disable_emp_service($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$id		    			= if_property_exist($params,'id');
		$chat_id       			= if_property_exist($params,'chat_id');
		$enable_chat			= if_property_exist($params,'enable_chat');
		$enable_email			= if_property_exist($params,'enable_email');
		
		
		
		return handle_success_response('Success',true);
		
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function add_edit_employees_history($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

        $id		    			= if_property_exist($params,'id');
        $emp_id    				= if_property_exist($params,'emp_id');
        $dept_id    		 	= if_property_exist($params,'dept_id');
        $join_date    		    = if_property_exist($params,'join_date');
        $client_id    		    = if_property_exist($params,'client_id');
        $work_start_date      	= if_property_exist($params,'work_start_date');
        $work_end_date        	= if_property_exist($params,'work_end_date');
        $salary               	= if_property_exist($params,'salary');
        $increment_date       	= if_property_exist($params,'increment_date');
        $increment_amount     	= if_property_exist($params,'increment_amount');
        $next_increment_date 	= if_property_exist($params,'next_increment_date');
        $emp_session_id  	    = if_property_exist($params,'emp_session_id');

        $join_date			 	= convert_to_date($join_date);
        $work_start_date 	   	= convert_to_date($work_start_date);
        $work_end_date 	     	= convert_to_date($work_end_date);
        $increment_date 	   	= convert_to_date($increment_date);
        $next_increment_date 	= convert_to_date($next_increment_date);

        if($increment_amount == '')
        {
            $increment_amount = 0;
        }
        if($emp_id === NULL || $emp_id == '')
        {
            return handle_fail_response('Employee ID is mandatory');
        }
        if($dept_id === NULL || $dept_id == '')
        {
            return handle_fail_response('Department is mandatory');
        }

        $data = array
        (
            ':emp_id'				=> 	$emp_id,
            ':dept_id'				=>  $dept_id,
            ':join_date'			=>  $join_date,
            ':client_id'			=> 	$client_id,
            ':work_start_date'      =>  $work_start_date,
            ':work_end_date'        =>  $work_end_date,
            ':salary'               =>  $salary,
            ':increment_date'       =>  $increment_date,
            ':increment_amount'     =>  $increment_amount,
            ':next_increment_date'  =>  $next_increment_date,
            ':created_by'			=>  $emp_session_id
        );

        if(is_data_exist('cms_employees_work_history', 'id', $id))
        {
            $data[':id'] = $id;
            $data 			 = add_timestamp_to_array($data,$emp_session_id,1);
            $result 		 = db_update($data, 'cms_employees_work_history', 'id');
        }
        else
        {
            $data = add_timestamp_to_array($data,$emp_session_id,0);
            $id   = db_add($data, 'cms_employees_work_history');
        }

        $params->start_index 	= 0;
        $params->limit 		 	= 50;
        $params->emp_id 		= $emp_id;

        $list       = json_decode(get_employee_history_list($params));

        return handle_success_response('Success', $list->data);
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function add_edit_employees_leave($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

        $id		    				= if_property_exist($params,'id');
        $emp_id    					= if_property_exist($params,'emp_id');
        $leave_id   				= if_property_exist($params,'leave_id');
        $no_of_days    				= if_property_exist($params,'no_of_days');
        $brought_forward			= if_property_exist($params,'brought_forward');
        $applicable_year			= if_property_exist($params,'applicable_year');
        $applicable_to_next_year	= if_property_exist($params,'applicable_to_next_year');
        $emp_session_id  			= if_property_exist($params,'emp_session_id');


        if($emp_id === NULL || $emp_id == '')
        {
            return handle_fail_response('Employee ID is mandatory');
        }

        if($leave_id  === NULL || $leave_id == '')
        {
            return handle_fail_response('Leave type is mandatory');
        }

        $data = array
        (
            ':emp_id'					=> 	$emp_id,
            ':master_list_id'			=>  $leave_id,
            ':no_of_days'				=>  $no_of_days,
            ':brought_forward'			=>  $brought_forward,
            ':applicable_year'			=>  $applicable_year,
            ':applicable_to_next_year'	=>  $applicable_to_next_year,
            ':created_by'				=>  $emp_session_id
        );

        if(is_data_exist('cms_emp_leave', 'id', $id))
        {

            $data[':id']    = $id;
            $data 			= add_timestamp_to_array($data,$emp_session_id,1);
            $result 		= db_update($data, 'cms_emp_leave', 'id');
        }
        else
        {
            $data 		= add_timestamp_to_array($data,$emp_session_id,0);
            $id 		= db_add($data, 'cms_emp_leave');
        }

        return handle_success_response('Success', $id);
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function get_employees_details($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

        $id	= if_property_exist($params,'id','');

        if($id === NULL || $id == '')
        {
            return handle_fail_response('Employee ID is mandatory');
        }

        $rs = db_query("
        cms_employees.id
        , cms_employees.employee_no
        , cms_employees.name
		,date_format(IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_employees.json_field,'$.dob')),''),'" . constant('UI_DATE_FORMAT') .  "') as dob
        , cms_employees.employer_id
		, cms_employees.email
		, cms_employees.office_email
		, cms_employees.username
        , cms_employees.pswd
		, cms_employees.is_admin
		, cms_employees.dept_id
		, cms_employees.reporting_to_id
		, cms_employees.contract_no
        , date_format(IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_employees.json_field,'$.work_start_date')),''),'" . constant('UI_DATE_FORMAT') .  "') as work_start_date
        , date_format(IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_employees.json_field,'$.work_end_date')),''),'" . constant('UI_DATE_FORMAT') .  "') as work_end_date
        , date_format(IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_employees.json_field,'$.ep_valid_till')),''),'" . constant('UI_DATE_FORMAT') .  "') as ep_valid_till
		, date_format(IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_employees.json_field,'$.marriage_date')),''),'" . constant('UI_DATE_FORMAT') .  "') as marriage_date
		, cms_employees.super_admin
		, cms_employees.is_active
		, concat('" . constant('UPLOAD_DIR_URL') . "', 'photos/',id,'/',id,'.jpeg') as profile_pic
		, date_format(IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_employees.json_field,'$.leaving_date')),''),'" . constant('UI_DATE_FORMAT') .  "') as leaving_date
		, cms_employees.created_by
		, cms_employees.contract_no as emp_contract_no
		, (select a.name from cms_employees a where a.id = cms_employees.reporting_to_id) as reporting_to_name
        , (select cms_master_employer.employer_name from cms_master_employer where cms_master_employer.id = cms_employees.employer_id) as employer_name
		, (select cms_master_list.descr from cms_master_list where cms_master_list.id = cms_employees.dept_id) as dept_name
		, (select cms_master_list.descr from cms_master_list where cms_master_list.id = JSON_UNQUOTE(JSON_EXTRACT(cms_employees.json_field,'$.notice_period'))) as notice_period
		, (select cms_country.name from cms_country where cms_country.id = JSON_UNQUOTE(JSON_EXTRACT(cms_employees.json_field,'$.nationality'))) as nationality_descr
		, (select cc.name from cms_country cc where cc.id = JSON_UNQUOTE(JSON_EXTRACT(cms_employees.json_field,'$.home_country'))) as home_country_descr
		, (select group_concat(cms_skills.skills_name) from cms_skills where FIND_IN_SET(cms_skills.id,(JSON_UNQUOTE(JSON_EXTRACT(cms_employees.json_field,'$.general_skills'))))) as general_skills_descr
		, (select group_concat(cms_skills.skills_name) from cms_skills where FIND_IN_SET(cms_skills.id,(JSON_UNQUOTE(JSON_EXTRACT(cms_employees.json_field,'$.specific_skills'))))) as specific_skills_descr
		, cms_employees.json_field
		",
        "cms_employees",
        "cms_employees.id = ". $id);


		$rs[0]['pswd'] 			= get_encrypt_password($rs[0]['pswd'],'d');

        $params->start_index 	= 0;
        $params->limit 		 	= 50;
        $params->emp_id 		= $id;
        $rs['work_list']     	= json_decode(get_employee_history_list($params))->data->list;

		
        $start_index			= 0;
        $limit	        		= 100;
        $emp_id	        		= $id;

        $where	=	" cms_emp_leave.id != ''";
        if($emp_id != NULL && $emp_id != "")
        {
            $where 	.=  " AND cms_emp_leave.emp_id = " . $emp_id . " AND cms_emp_leave.is_active != 0 ";
        }
        $rs_leave = db_query_list
        (
            "cms_emp_leave.id
            , cms_emp_leave.emp_id
            , cms_employees.name
            , cms_master_list.descr as leave_type
            , cms_emp_leave.no_of_days
            , cms_emp_leave.brought_forward
            , cms_emp_leave.applicable_year
            , cms_emp_leave.applicable_to_next_year
            , (select name from cms_employees emp where emp.id = cms_emp_leave.created_by) as created_by
            ",
            "
            cms_emp_leave
            INNER JOIN cms_employees ON cms_emp_leave.emp_id = cms_employees.id
            INNER JOIN cms_master_list ON cms_emp_leave.master_list_id = cms_master_list.id
            ",
            $where, $start_index, $limit, "id","desc");

        
        $rs['leave_list'] = $rs_leave['list'];

		$params->employee_id 	= $id;
		$params->type_id 		= "";
		$params->start_index 	= 0;
        $params->limit 		 	= 100;

        // require_once constant('MODULES_DIR') 	. '/asset.php';
        // $list       = json_decode(get_asset_list($params));

        $rs['asset_list'] 		= '';
        // if(isset($list->data->list))
        // {
        // 	$rs['asset_list'] = $list->data->list;
        // }
		
		$params->secondary_id = 1;
		$rs['documents'] 		= get_employee_files_attachments($params);
		$params->secondary_id = 2;
		$rs['exit_checklist'] 	= get_employee_files_attachments($params);  // exit interview files attachments
		 

         return handle_success_response('Success', $rs);

	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_employees_his_details($params)
{
    try
    {
    	log_it(__FUNCTION__, $params);
    	
    	$id	= if_property_exist($params,'id','');
    	
    	if($id === NULL || $id == '')
    	{
    		return handle_fail_response('Employee History ID is mandatory');
    	}
    	
    	$rs = db_query("
        id
        , dept_id
        , client_id
        , date_format(join_date,'" . constant('UI_DATE_FORMAT') .  "') as join_date
        , date_format(work_start_date,'" . constant('UI_DATE_FORMAT') .  "') as work_start_date
        , date_format(work_end_date,'" . constant('UI_DATE_FORMAT') .  "') as work_end_date
        , salary
        , date_format(increment_date,'" . constant('UI_DATE_FORMAT') .  "') as increment_date
        , increment_amount
        , date_format(next_increment_date,'" . constant('UI_DATE_FORMAT') .  "') as next_increment_date
        ",
    			"cms_employees_work_history",
    			"id = ". $id);
    	
    	return handle_success_response('Success', $rs);

    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function delete_work_history($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

        $id	        	= if_property_exist($params, 'id');
        $emp_id	        = if_property_exist($params, 'emp_id');
        $emp_session_id = if_property_exist($params, 'emp_session_id');

        $data = array
        (
            ':id'  		  => $id,
            ':is_active'  => 0
        );

        $data 		= add_timestamp_to_array($data,$emp_session_id, 1);
        $result 	= db_update($data, 'cms_employees_work_history','id');

        $params->start_index 	= 0;
        $params->limit 		 	= 50;
        $params->emp_id 		= $emp_id;

        $list       = json_decode(get_employee_history_list($params));

        return handle_success_response('Success', $list->data);
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function delete_leave($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

        $id	        	= if_property_exist($params, 'id');
        $emp_id	        = if_property_exist($params, 'emp_id');
        $emp_session_id = if_property_exist($params, 'emp_session_id');

        $data = array
        (
            ':id'  		  => $id,
            ':is_active'  => 0
        );

        $data 		= add_timestamp_to_array($data,$emp_session_id, 1);
        $result 	= db_update($data, 'cms_emp_leave','id');

        $list       = json_decode(get_employee_leave_list($params));


        return handle_success_response('Success', $list->data);
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function update_profile($params)
{
	try
	{
		$id     		= if_property_exist($params, 'id');
		$emp_id 		= if_property_exist($params, 'emp_id');
		$mobile 		= if_property_exist($params, 'mobile');
		
		$mail_type		= if_property_exist($params,'mail_type');
		$outserver_name	= if_property_exist($params,'outserver_name');
		$outserver_port	= if_property_exist($params,'outserver_port');
		$inserver_name	= if_property_exist($params,'inserver_name');
		$inserver_port	= if_property_exist($params,'inserver_port');
		$username		= if_property_exist($params,'username');
		$password		= if_property_exist($params,'password');
		$from_name		= if_property_exist($params,'from_name');
		$require_auth	= if_property_exist($params,'require_auth');

		$general_skills		= if_property_exist($params,'general_skills');
		$specific_skills	= if_property_exist($params,'specific_skills');

		$data = array
		(
			':id' => $id
		);
		
		$json_field = "'$.timestamp','" . strtotime("now") . "'";

		if (if_property_exist($params, 'email'))
		{
			$data[':email'] = if_property_exist($params, 'email');
		}
		if (if_property_exist($params, 'chat_id'))
		{
			$json_field .= ",'$.chat_id','" . if_property_exist($params, 'chat_id') . "'";
			$json_field .= ",'$.chat_password','" . if_property_exist($params, 'chat_password') . "'";
		}
		if (if_property_exist($params, 'phone'))
		{
			$json_field .= ",'$.home_phone','" . if_property_exist($params, 'phone') . "'";
		}
		if (if_property_exist($params, 'mobile'))
		{
			$json_field .= ",'$.malaysia_phone','" . if_property_exist($params, 'mobile') . "'";
		}
		if (if_property_exist($params, 'home_address'))
		{
			$json_field .= ",'$.home_address','" . if_property_exist($params, 'home_address') . "'";
		}
		if (if_property_exist($params, 'current_address'))
		{
			$json_field .= ",'$.local_address','" . if_property_exist($params, 'current_address') . "'";
		}
		if ($general_skills)
		{
			$json_field .= ",'$.general_skills','" . $general_skills . "'";
		}
		if ($specific_skills)
		{
			$json_field .= ",'$.specific_skills','" . $specific_skills . "'";
		}

		if ($outserver_name)
		{
			$json_field .= ",'$.mail.type','" . $mail_type . "'";
			$json_field .= ",'$.mail.outserver_name','" . $outserver_name . "'";
			$json_field .= ",'$.mail.outserver_port','" . $outserver_port . "'";
			$json_field .= ",'$.mail.inserver_name','" . $inserver_name . "'";
			$json_field .= ",'$.mail.inserver_port','" . $inserver_port . "'";
			$json_field .= ",'$.mail.username','" . $username . "'";
			$json_field .= ",'$.mail.password','" . $password . "'";
			$json_field .= ",'$.mail.from_name','" . $from_name . "'";
			$json_field .= ",'$.mail.require_auth','" . $require_auth . "'";
		}
		
		$sql	= "UPDATE cms_employees SET json_field 	= JSON_SET(json_field,$json_field)
				   WHERE id = " . $id;
		$result = db_execute_sql($sql);

		$data 	= add_timestamp_to_array($data,$emp_id, 1);
		$result = db_update($data, 'cms_employees','id');
		
		return handle_success_response('Success', $id);
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
	
}

function edit_profile_pic($params)
{
    try
    {
        $image          = if_property_exist($params,'image');
        $emp_id         = if_property_exist($params,'emp_id');

        if((isset($image)) && strlen($image) > 0)
        {
            $image = preg_replace('#data:image/[^;]+;base64,#', '', $image);
            base64_to_jpeg($image, "photos/" . $emp_id . '/' . $emp_id . ".jpeg");
        }
        return handle_success_response('Success', constant('UPLOAD_DIR_URL') . 'photos/' . $emp_id . '/' . $emp_id . '.jpeg');
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function get_employee_report($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$employee_id    = if_property_exist($params, 'employee_id','');
		$client_id   	= if_property_exist($params, 'client_id','');
		$dept_id   		= if_property_exist($params, 'dept_id','');
		$emp_id	        = if_property_exist($params, 'emp_id','');
		
		$where	=	" cms_employees_work_history.id != '' AND cms_employees_work_history.is_active = 1";
		
		if($employee_id != "ALL")
		{
			$where 	.=  " AND cms_employees_work_history.emp_id = " . $employee_id;
		}
		if($client_id != "ALL")
		{
			$where 	.=  " AND cms_employees_work_history.client_id = " . $client_id;
		}
		if($dept_id != "ALL")
		{
			$where 	.=  " AND cms_employees_work_history.dept_id = " . $dept_id;
		}
		
		$rs = db_execute_custom_sql(
				"SELECT
					cms_employees_work_history.id
					, cms_employees_work_history.emp_id as employee_id
					, cms_employees.name
					, (select descr from cms_master_list where cms_master_list.id = cms_employees_work_history.dept_id) as department
					, cms_employees_work_history.join_date
					, (select descr from cms_master_list where cms_master_list.id = cms_employees_work_history.client_id) as client_name
					, date_format(cms_employees_work_history.work_start_date,'" . constant('UI_DATE_FORMAT') .  "') as work_start_date
					, date_format(cms_employees_work_history.work_end_date,'" . constant('UI_DATE_FORMAT') .  "') as work_end_date
					, cms_employees_work_history.salary
					, date_format(cms_employees_work_history.increment_date,'" . constant('UI_DATE_FORMAT') .  "') as increment_date
					, cms_employees_work_history.increment_amount
					, date_format(cms_employees_work_history.next_increment_date,'" . constant('UI_DATE_FORMAT') .  "') as next_increment_date
				FROM
					cms_employees_work_history
                 	INNER JOIN cms_employees
					ON cms_employees_work_history.emp_id = cms_employees.id
				WHERE
					".$where."
				ORDER BY
					cms_employees_work_history.emp_id ASC, cms_employees_work_history.work_start_date ASC");
		
		
		if(count((array)$rs) < 1 || !isset($rs))
		{
			return handle_fail_response('No record found');
		}
		else
		{
			return handle_success_response('Success', $rs);
		}
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function send_emp_test_email($params)
{
	try
	{
		$mail_type				= if_property_exist($params,'mail_type');
		$server_name			= if_property_exist($params,'outserver_name');
		$server_port			= if_property_exist($params,'outserver_port');
		$username				= if_property_exist($params,'username');
		$password				= if_property_exist($params,'password');
		$from_name				= if_property_exist($params,'from_name');
		$require_auth			= if_property_exist($params,'require_auth');
		
		
		if($server_name === NULL || $server_name == '')
		{
			return handle_fail_response('Out server name is mandatory');
		}
		if($server_port === NULL || $server_port == '')
		{
			return handle_fail_response('Out server port is mandatory');
		}
		if($username === NULL || $username == '')
		{
			return handle_fail_response('Username is mandatory');
		}
		if($password === NULL || $password == '')
		{
			return handle_fail_response('Password is mandatory');
		}
		if($from_name === NULL || $from_name == '')
		{
			return handle_fail_response('From name is mandatory');
		}
		
		
		$params->body			= "This is a test email";
		$params->subject		= "This is a test email";
		$mail 					= smtpmailer_notify($params);
		
		if($mail['status'] == true)
		{
			return handle_success_response('Success',true);
		}
		else
		{
			return handle_fail_response('Sent test Email Failed');
		}
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_user_initial_data($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$data['countries']			= db_query('id,name as descr','cms_country');
		$data['years'] 				= array(array("id"=>"2017","descr"=>"2017"),
										array("id"=>"2018","descr"=>"2018"),
										array("id"=>"2019","descr"=>"2019"),
										array("id"=>"2020","descr"=>"2020"),
										array("id"=>"2021","descr"=>"2021"),
										array("id"=>"2022","descr"=>"2022"),
										array("id"=>"2023","descr"=>"2023"),
										array("id"=>"2024","descr"=>"2024"),
										array("id"=>"2025","descr"=>"2025"));

		$data['created_by'] 		= db_query('id,name as descr','cms_employees','is_active = 1');
		$data['dept']       		= db_query('id,descr','cms_master_list',"category_id = 1 AND is_active = 1");
		$data['sex']				= db_query('id,descr','cms_master_list',"category_id = 11 AND is_active = 1");
		$data['notice_period']  	= db_query('id,descr','cms_master_list',"category_id = 8 AND is_active = 1");
		$data['leave_type']			= db_query('id,descr,no_of_days','cms_master_list',"category_id = 16 AND id != 55 and is_active = 1");
		$data['employer']     		= db_query('id,employer_name as descr','cms_master_employer','is_active = 1');
		$data['client']				= db_query('id,descr','cms_master_list',"category_id = 18 AND is_active = 1");
		$data['reporting_to']  		= db_query('id,name as descr','cms_employees',"");
		$data['skills_general']  	= db_query('id,skills_name as descr','cms_skills',"type_id = 67 AND is_active = 1");
		$data['skills_specific'] 	= db_query('id,skills_name as descr','cms_skills',"type_id = 68 AND is_active = 1");
		$data['modules'] 			= db_query('id,descr','cms_modules');
		$data['employment_type']  	= db_query('id,descr','cms_master_list',"category_id = 6 AND is_active = 1");
		$data['marital_status']  	= db_query('id,descr','cms_master_list',"category_id = 10 AND is_active = 1");

		$data['faq'] 				= db_query('id,descr','cms_master_list',"category_id = 38 AND is_active = 1");
		$data['doc_ctg']        	= db_query('id,descr','cms_upload_doc','is_active = 1');
		$data['exit_ctg'] 			= db_query('id,descr','cms_master_list',"category_id = 55 AND is_active = 1");
		$data['timezone'] 			= db_query("id,concat(timezone, ' ', utc) as descr,utc",'cms_timezone',"is_active = 1");

		return handle_success_response('Success',$data);
		
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function update_employee_attachment_visible_status($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$id   		= if_property_exist($params, 'id');
		$is_visible = if_property_exist($params, 'is_visible');
		
		if(!isset($id) || $id == '')
		{
			return handle_fail_response('Missing ID.');
		}
		if(!isset($is_visible) || $is_visible == '')
		{
			return handle_fail_response('Visible status is missing');
		}

		$json_field = "'$.is_visible','$is_visible'";
		$sql		= "UPDATE cms_files SET json_field = JSON_SET(json_field,$json_field) WHERE id = '$id'";
		
		$result = db_execute_sql($sql);
		
		return handle_success_response('Success', $result);
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

//NON API compatible Services
function get_employee_files_attachments($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$emp_id	  	        = if_property_exist($params, 'emp_id');
		$secondary_id	  	= if_property_exist($params, 'secondary_id');
		
		require_once constant('MODULES_DIR') . '/attachments.php';
		$params->primary_id		= $emp_id;
		$params->secondary_id	= $secondary_id;
		$params->module_id		= 81;
		return json_decode(get_attachment($params))->data->attachment;
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_emp_details_screen_capture($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$id = if_property_exist($params,'id','');
		
		if($id === NULL || $id == '')
		{
			return handle_fail_response('Employee ID is mandatory');
		}
		$rs = db_query_new
		("
		            cms_employees.id
					, CONCAT('" . constant('KEYBOARD_MOUSE_IDLE_TIME') . "') as keyboard_mouse_idle_time
					, cms_employees.employee_no
		            , cms_employees.name
		            , cms_employees.designation
		            , cms_employees.office_email
		            , cms_employees.is_active
		            , concat('" . constant('UPLOAD_DIR_URL') . "', 'photos/',cms_employees.id,'/',cms_employees.id,'.jpeg') as profile_pic
					, '" . constant('UPLOAD_URL') . "' as upload_url
		            , concat('screenshots/',cms_employees.id,'/') as upload_path
		            , cms_employees.employer_id
		            , IFNULL(JSON_UNQUOTE(cms_employees.json_field->'$.screen_track.screenshot_enable'),'0') as st_enable
		            , IFNULL(JSON_UNQUOTE(cms_employees.json_field->'$.screen_track.screenshot_enable_days'),'') as st_enable_days
		            , IFNULL(JSON_UNQUOTE(cms_employees.json_field->'$.screen_track.screenshot_start_date'),'') as st_start_date
		            , IFNULL(JSON_UNQUOTE(cms_employees.json_field->'$.screen_track.screenshot_end_date'),'') as st_end_date
		            , IFNULL(JSON_UNQUOTE(cms_employees.json_field->'$.screen_track.screenshot_start_time'),'') as st_start_time
		            , IFNULL(JSON_UNQUOTE(cms_employees.json_field->'$.screen_track.screenshot_end_time'),'') as st_end_time
		            , IFNULL(JSON_UNQUOTE(cms_employees.json_field->'$.screen_track.screenshot_interval'),'15') as st_interval
		            , IFNULL(JSON_UNQUOTE(cms_employees.json_field->'$.screen_track.screenshot_exclude_ph'),'') as st_exclude_ph
		            , IFNULL(JSON_UNQUOTE(cms_employees.json_field->'$.screen_track.screenshot_exclude_leaves'),'') as st_exclude_leaves
		        ",
				"cms_employees","id = :id AND is_active = :is_active"
				, array(':id' => $id,':is_active' => 1)
				);
		
		
		if (count((array)$rs) < 1 || !isset($rs))
		{
			return handle_fail_response('No employee record found');
		}
		
		//get public holidays for the employee
		if($rs[0]['st_exclude_ph'] == 1)
		{
			$ph         = db_query("cms_holidays.holiday","cms_holidays",
					"is_active = 1 and company_id = ". $rs[0]['employer_id'] . " and holiday >= CURDATE()"
					);
			
			$ph_days    = array_column($ph, 'holiday');
			$rs[0]['st_exclude_days']= $ph_days;
		}
		else
		{
			$rs[0]['st_exclude_days']= array();
		}
		
		//get leaves for the employee
		if($rs[0]['st_exclude_leaves'] == 1)
		{
			$leaves         = db_query("cms_leave_by_day.leave_date","cms_leave_by_day",
					"is_active = 1 and approved = 1 and created_by = ". $rs[0]['id'] . " and leave_date >= CURDATE()"
					);
			
			$exclude_leaves    = array_column($leaves, 'leave_date');
			$rs[0]['st_exclude_leaves']= $exclude_leaves;
		}
		else
		{
			$rs[0]['st_exclude_leaves']= array();
		}
		
		return handle_success_response('Success', $rs);
		
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_employee_track($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$id 			= if_property_exist($params,'employee_id','');
		$from_date 		= if_property_exist($params,'from_date','');
		$to_date 		= if_property_exist($params,'to_date','');
		$files_image 	= [];
		
		
		if($id === NULL || $id == '')
		{
			return handle_fail_response('Employee ID is mandatory');
		}
		
		
		$rs = db_query("cms_files_track.id
					, concat('" . constant("UPLOAD_DIR_URL") . "','screenshots/', cms_employees.id , '/', cms_files_track.filename) as filename
					, concat('" . constant("UPLOAD_DIR_URL") . "','screenshots/', cms_employees.id , '/thumbnail/', cms_files_track.filename) as thumbnail
					, cms_employees.name as created_by
					, date_format(cms_files_track.created_date,'" . constant('DISPLAY_DATETIME_FORMAT') . "') as name",
					"cms_files_track INNER JOIN cms_employees ON cms_files_track.created_by = cms_employees.id",
					"cms_files_track.is_active = 1 AND cms_files_track.created_by = $id AND cms_files_track.created_date between '$from_date 00:00:00' AND '$to_date 23:59:59'", "", "", "cms_files_track.created_date", "desc");
		return handle_success_response('Success', $rs);
		
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function add_edit_employees_track($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		$id             = if_property_exist($params, 'emp_id');
		
		$is_active      = if_property_exist($params, 'screenshot_enable');
		$enable_days    = if_property_exist($params, 'screenshot_enable_days');
		$start_date     = if_property_exist($params, 'screenshot_start_date');
		$end_date       = if_property_exist($params, 'screenshot_end_date');
		$start_time     = if_property_exist($params, 'screenshot_start_time');
		$end_time       = if_property_exist($params, 'screenshot_end_time');
		$interval       = if_property_exist($params, 'screenshot_interval');
		$exclude_ph      = if_property_exist($params, 'screenshot_exclude_ph');
		$exclude_leaves  = if_property_exist($params, 'screenshot_exclude_leaves');
		
		
		$screen_track = "'$.st_is_active',         '" . $is_active . "',
	                        '$.st_enable_days',    '" . json_encode($enable_days) . "',
	                        '$.st_start_date',    '" . $start_date . "',
	                        '$.st_end_date',     '" . $end_date . "',
	                        '$.st_start_time',     '" . $start_time . "',
	                        '$.st_end_time',          '" . $end_time . "',
	                        '$.st_interval',          '" . $interval . "',
	                        '$.st_exclude_ph',         '" . $exclude_ph . "',
	                        '$.st_exclude_leaves',      '" . $exclude_leaves . "'";
		
		$sql = "UPDATE cms_employees
		SET json_field  = JSON_SET(json_field,$screen_track)
		WHERE id            = " . $id;
		
		$result     = db_execute_sql($sql);
		
		return handle_success_response('Success', true);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function update_employee_track($params)
{
    try
    {
        log_it(__FUNCTION__, $params);
        
        $emp_id             = if_property_exist($params, 'emp_id');
        $start_time         = if_property_exist($params, 'start_time');
        $end_time           = if_property_exist($params, 'end_time');
        $tracker_date      	= if_property_exist($params, 'tracker_date');
        $interval_time      = if_property_exist($params, 'interval_time');
        $total_idle_time    = if_property_exist($params, 'total_idle_time');
		$actual_start_time  = if_property_exist($params, 'actual_start_time');
		$actual_end_time    = if_property_exist($params, 'actual_end_time');
		$total_working_hours= if_property_exist($params, 'total_working_hours');
        $json_field         = if_property_exist($params, 'json_field');

        $data = array
        (
            ':id'                   =>  get_db_UUID(),
            ':emp_id'               =>  $emp_id,
            ':start_time'           =>  $start_time,
            ':end_time'             =>  $end_time,
            ':tracker_date'         =>  $tracker_date,
            ':interval_time'        =>  $interval_time,
            ':total_idle_time'      =>  $total_idle_time,
			':actual_start_time'    =>  $actual_start_time,
            ':actual_end_time'      =>  $actual_end_time,
            ':total_working_hours'  =>  $total_working_hours,
            ':json_field'           =>  json_encode($json_field)
        );

        $data          = add_timestamp_to_array($data,0,0);
        $id = db_add($data, 'cms_employees_track');

        return handle_success_response('Success', $id);
        
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}


// function update_employee_attachment_visible_status($params)
// {
// 	try
// 	{
// 		log_it(__FUNCTION__, $params);
		
// 		$emp_id   	= if_property_exist($params, 'emp_id');
// 		$filename	= if_property_exist($params, 'filename');
// 		$is_visible = if_property_exist($params, 'is_visible');
		
// 		if(!isset($emp_id) || $emp_id == '')
// 		{
// 			return handle_fail_response('Missing employee ID.');
// 		}
// 		if(!isset($filename) || $filename == '')
// 		{
// 			return handle_fail_response('Filename is missing');
// 		}
		
// 		$rs_json    = db_json_update("json_field", $filename, "$.attachment[*].filename",".filename","attachment","is_visible",$is_visible, "cms_employees", "id", $emp_id);
		
// 		return handle_success_response('Success', $rs_json);
// 	}
// 	catch (Exception $e)
// 	{
// 		handle_exception($e);
// 	}
// }


// function update_employee_attachment($params)
// {
// 	try
// 	{
// 		log_it(__FUNCTION__, $params);
		
// 		$emp_id   	= if_property_exist($params, 'emp_id');
// 		$id   		= if_property_exist($params, 'id');
// 		$data		= if_property_exist($params, 'data');
		
// 		if(!isset($id) || $id == '')
// 		{
// 			return handle_fail_response('Missing employee ID.');
// 		}
// 		if(!isset($data) || $data == '')
// 		{
// 			return handle_fail_response('Data is missing');
// 		}
	
// 		$operation			= "JSON_ARRAY_INSERT";
// 		$path				= "'$.attachment[0]'";
		
// 		$data->created_date = get_current_date();
		
		
// 		$value				= json_encode($data);
// 		$rs					= db_query("IFNULL(JSON_EXTRACT(json_field, '$.attachment'),'0') as key_exist", "cms_employees","id = " . $id);
// 		if($rs[0]['key_exist'] == '0')
// 		{
// 			$operation  = "JSON_INSERT";
// 			$path		= "'$.attachment'";
// 			$value		= "[" . json_encode($data) . "]";
// 		}
		
// 		$sql  		= "UPDATE cms_employees SET json_field = $operation(json_field,$path,CAST('" . $value . "'  AS JSON)) WHERE id = " . $id;
// 		$result 	= db_execute_sql($sql);
		
// 		$rs_attach  = get_employee_attachment($params);
		
// 		return handle_success_response('Success',$rs_attach ? $rs_attach : array());
// 	}
// 	catch (Exception $e)
// 	{
// 		handle_exception($e);
// 	}
// }

// function get_employee_attachment($params)
// {
// 	try
// 	{
// 		log_it(__FUNCTION__, $params);
		
// 		$id   			= if_property_exist($params, 'id');
// 		$is_visible		= if_property_exist($params, 'is_visible');
// 		$filter			= '';
		
// 		if($is_visible == 1)
// 		{
// 			$filter 	= ' AND cms_contract_documents.is_visible = 1';
// 		}
		
		
// 		$rs_attach 		= db_query("cms_contract_documents.id
// 								, concat('" . constant("UPLOAD_DIR_URL") . "','contracts/', cms_contract_documents.contract_no, '/', cms_contract_documents.filename) as filepath
// 								, cms_contract_documents.filename
// 								, '-FROM CONTRACT-' as remarks
// 								, cms_upload_doc.descr as category
// 								, IF(cms_contract_documents.is_active = 1, 'ACTIVE','IN-ACTIVE') as status
// 								, cms_contract_documents.is_visible
// 								, cms_employees.name as created_by
// 								, date_format(cms_contract_documents.created_date,'" . constant('UI_DATE_FORMAT') .  "') as created_date",
// 								"cms_contract_documents
// 								LEFT JOIN cms_upload_doc
// 									ON cms_contract_documents.doc_type_id = cms_upload_doc.id
// 								LEFT JOIN cms_employees ON cms_contract_documents.created_by = cms_employees.id",
// 								"cms_contract_documents.is_active = 1  $filter  AND cms_contract_documents.contract_no
// 								IN (SELECT cms_contracts.contract_no FROM cms_contracts WHERE cms_contracts.employee_id = $id) ");
		
		
// 		if($is_visible == 1)
// 		{
// 			$rs_json    = db_json_search("json_field", "all", "1", "$.attachment[*].is_visible",".is_visible","attachment", "cms_employees", "id", $id);
// 		}
// 		else
// 		{
// 			$rs_json	= db_query("json_field->'$.attachment' as attachment","cms_employees","id = " . $id);
// 		}
// 		$json_arr		= array();

// 		if(count((array)$rs_json) > 0)
// 		{
// 			$json_arr 	= json_decode($rs_json[0]['attachment']);
// 			$count_json	= count($json_arr);
			
// 			for($i = 0; $i < $count_json; $i++)
// 			{
// 				if($json_arr[$i]instanceof stdClass)
// 				{
// 					$json_arr[$i]->filepath = constant('UPLOAD_DIR_URL') . 'photos/' . $id . '/' . $json_arr[$i]->filename;
// 				}
// 				else
// 				{
// 					unset($json_arr[$i]);
// 				}
// 			}
// 		}
		
// 		$return_data = array_merge($rs_attach, (array)$json_arr); 
		
// 		return $return_data ? $return_data : array();
// 	}
// 	catch (Exception $e)
// 	{
// 		handle_exception($e);
// 	}
// }


// function get_skills($params)
// {
// 	try
// 	{
// 		$rs_skills_general 		= db_query('id,skills_name','cms_skills','type_id = 67');
// 		$rs_skills_specific		= db_query('id,skills_name','cms_skills','type_id = 68');
		
// 		$rs['general_skill']	= $rs_skills_general;
// 		$rs['specific_skill']	= $rs_skills_specific;
		
// 		return handle_success_response('Success', $rs);
// 	}
// 	catch(Exception $e)
// 	{
// 		handle_exception($e);
// 	}
// }

?>
