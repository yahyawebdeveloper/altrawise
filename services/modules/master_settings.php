<?php
/**
* @author 		Jamal
* @date 		16-Nov-2015
* @modify
* @Note = Please follow the indentation
*         Please follow the naming convention
*/
//require_once(dirname(__FILE__) . '/../config/config.inc.php');
//require_once(constant('SHARED_DIR') . '/dbfunctions.php');


function get_misc($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

        $id     = if_property_exist($params,'id');
        $where  = '';

        if($id != '')
        {
            $where = 'cms_master_category.id = ' . $id;
        }


        $rs         = db_query('cms_master_list.id, cms_master_list.descr
                                ,IFNULL(cms_master_list.no_of_days,"") as no_of_days
                                ,cms_master_category.descr as category
                                ,cms_master_category.id as category_id
								,cms_master_list.field1
								,cms_master_list.field2
								,cms_master_list.field3
								, IF(cms_master_list.is_active = 1,"ACTIVE","IN-ACTIVE") as status
								, cms_master_list.is_active
								,IFNULL((select group_concat(a.name) from cms_employees a where FIND_IN_SET(a.id,cms_master_list.field1)),"") as roles ',
                               'cms_master_list inner join cms_master_category on cms_master_list.category_id = cms_master_category.id',
                                $where,'','ASC','cms_master_category.descr');

        return handle_success_response('Success', $rs);

    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function add_edit_misc($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

        $descr	        = if_property_exist($params,'descr');
        $ctg_id	        = if_property_exist($params,'category_id');
        $no_of_days     = if_property_exist($params,'no_of_days');
        $field1			= if_property_exist($params,'field1');
        $field2			= if_property_exist($params,'field2');
        $field3			= if_property_exist($params,'field3');
        $is_active		= if_property_exist($params,'is_active');
        $id	            = if_property_exist($params,'id');

		$emp_id	        = if_property_exist($params,'emp_id');

        if($descr === NULL || $descr == '')
        {
            return handle_fail_response('Description is mandatory');
        }

        $data = array
        (
            ':descr'	   	=> 	$descr,
            ':category_id' 	=> 	$ctg_id,
            ':no_of_days'	=>	$no_of_days,
        	':field1'		=>	$field1,
        	':field2'		=>	$field2,
        	':field3'		=>	$field3,
        	':is_active'	=>	$is_active
        );
		
        if($id == '')
        {
            if(check_existing($descr, $ctg_id))
            {
                return handle_fail_response('Item already exist');
            }
			$data           = add_timestamp_to_array($data, $emp_id, 0);
            $results        = db_add($data, 'cms_master_list');
        }
        else
        {
            $data[':id']    = $id;
			$data           = add_timestamp_to_array($data, $emp_id, 1);
            $results 		= db_update($data, 'cms_master_list', 'id');
        }
        
        $params->id = $ctg_id;
        $rs 		= json_decode(get_misc($params));
        
        return handle_success_response('Success', $rs->data);
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function check_existing($descr, $category)
{
    try 
    {
        log_it(__FUNCTION__, '');
        $where = "descr = '" . $descr . "' AND category_id = " . $category;

        $rs = db_query('count(*) as id_count', "cms_master_list", $where);
        if(isset($rs) && $rs != NULL)
    	{
    		return $rs[0]['id_count'];
    	}
        return false;
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}

function add_edit_holiday($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$id	            = if_property_exist($params,'id');
		$company_id	    = if_property_exist($params,'company_id');
		$date			= if_property_exist($params,'date');
		$desc	        = if_property_exist($params,'desc');
		$is_active		= if_property_exist($params,'is_active');
		$emp_id			= if_property_exist($params,'emp_id');
		$created_date	= date('Y-m-d H:i:s');

		$date			= convert_to_date($date);
		
		if($date === NULL || $date == '')
		{
			return handle_fail_response('Date  is mandatory');
		}
		if($desc === NULL || $desc == '')
		{
			return handle_fail_response('Description is mandatory');
		}
		
		$data = array
		(
			':company_id'	=> $company_id,
			':holiday'	   	=> $date,
			':holiday_desc'	=> $desc,
			':is_active'	=> $is_active,
			':created_by'	=> $emp_id,
			':created_date'	=> $created_date
		);
		
		if($id == '')
		{
			if(is_data_exist("cms_holidays", "holiday", $date) && is_data_exist("cms_holidays", "company_id", $company_id))
			{
				return handle_fail_response('Date already exist');
			}
			
			$results        = db_add($data, 'cms_holidays');
		}
		else
		{
			$data[':id']    = $id;
			$data 			= add_timestamp_to_array($data,$emp_id,1);
			$results 		= db_update($data, 'cms_holidays', 'id');
		}
		$rs = json_decode(get_holidays_list($params));
		
		echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs) );exit;
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_holidays_list($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$company_id	    	= if_property_exist($params,'company_id');
		$year				= if_property_exist($params,'year');
		
		$only_active_str 	= (if_property_exist($params,'onlyActive')) ? " AND cms_holidays.is_active = 1" : "";
		if($company_id && $year)
		{
			$where	= 'company_id = '.$company_id.' AND YEAR(holiday) = '.$year.$only_active_str;
		}
		
		$rs 			= db_query("cms_holidays.id
								   ,cms_master_employer.employer_name as company
								   ,cms_holidays.holiday
								   ,cms_holidays.holiday_desc
								   ,cms_holidays.is_active",
								   "cms_holidays
								   inner join cms_master_employer on cms_master_employer.id = cms_holidays.company_id",
								   $where, 0, 100, "cms_holidays.holiday", "desc"
								   );
		echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs) );exit;
		//return handle_success_response('Success', $rs);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}


function get_employers_list($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$rs = db_query
		(
				" cms_master_employer.id
                , cms_master_employer.employer_name
                , cms_master_employer.employer_address
                , cms_master_employer.mail_signature
                , cms_master_employer.prefix
                , cms_master_employer.is_active
				, IF(cms_master_employer.is_active = 1,'ACTIVE','IN-ACTIVE') as is_active_desc
                , IFNULL(JSON_UNQUOTE(JSON_EXTRACT(json_field, '$.phone_no')),'') as phone_no
                , IFNULL(JSON_UNQUOTE(JSON_EXTRACT(json_field, '$.website')),'') as website
                , IFNULL(JSON_UNQUOTE(JSON_EXTRACT(json_field, '$.voucher_prefix')),'') as voucher_prefix
                , IFNULL(JSON_UNQUOTE(JSON_EXTRACT(json_field, '$.voucher_sequence')),'') as voucher_sequence
				, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(json_field, '$.voucher_suffix')),'') as voucher_suffix
				, IFNULL(DATE_FORMAT(cms_master_employer.created_date,'" . constant('UI_DATE_FORMAT') .  "') , '-') as created_date
                ",
				"cms_master_employer");

		if (count($rs) > 0) {
            $count = count($rs);
            for ($i = 0; $i < $count; $i++) {
                $company_id = $rs[$i]["id"];
                // $rs[$i]['attachment'] = get_company_attachments($params, $company_id);

                //check if image exists and pass the image accordingly
                $logo = FILES_DIR.'/companies/'.$company_id.'/'.$company_id. '.jpeg';
                if(file_exists($logo))
                {
                	$rs[$i]['attachment'] = UPLOAD_DIR_URL.'companies/'.$company_id.'/'.$company_id. '.jpeg';
                	$rs[$i]['is_logo'] = true;
                }
                else
                {
                	$rs[$i]['attachment'] = '../../assets/img/add-logo.png';
                	$rs[$i]['is_logo'] = false;
                }
                
            }
        }
		
		if(count($rs) < 1 || !isset($rs))
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

//NON API compatible Services
function get_company_attachments($params, $company_id)
{
    try
    {
        log_it(__FUNCTION__, $params);
        
        $company_id         = if_property_exist($params, 'company_id');
		$emp_id             = if_property_exist($params, 'emp_id');
        
        require_once constant('MODULES_DIR') . '/attachments.php';
        $params->primary_id     = $company_id;
        $params->module_id      = 8;
        return json_decode(get_attachment($params))->data->attachment;
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function add_edit_employer($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$employer_id                = if_property_exist($params,'employer_id');
		$created_by                 = if_property_exist($params,'created_by');
		$employer_name              = if_property_exist($params,'employer_name');
		$employer_address           = if_property_exist($params,'employer_address');
		$prefix                     = if_property_exist($params,'prefix');
		$mail_signature             = if_property_exist($params,'mail_signature');
		$phone_no                   = if_property_exist($params,'phone_no');
		$website                    = if_property_exist($params,'website');

		$voucher_prefix             = if_property_exist($params,'voucher_prefix');
		$voucher_sequence           = if_property_exist($params,'voucher_sequence');
		$voucher_suffix             = if_property_exist($params,'voucher_suffix');

		$is_active                  = if_property_exist($params,'is_active');
		
		$json_field['phone_no']     	= $phone_no;
		$json_field['website']      	= $website;
		$json_field['voucher_prefix']   = $voucher_prefix;
		$json_field['voucher_sequence'] = $voucher_sequence;
		$json_field['voucher_suffix']   = $voucher_suffix;
		
		$data = array
		(
				':employer_name'         =>  $employer_name,
				':employer_address'      =>  $employer_address,
				':prefix'                =>  $prefix,
				':mail_signature'        =>  $mail_signature,
				':is_active'             =>  $is_active,
				':sequence_digit'        =>  5,
				':json_field'            =>  json_encode($json_field),
		);

		if ($employer_id)
		{
			$data[':id']  	= $employer_id;
			$data         	= add_timestamp_to_array($data, $created_by, 1);
			db_update($data, 'cms_master_employer', 'id');
			$result 		= $employer_id;
		}
		else
		{
			$data           = add_timestamp_to_array($data, $created_by, 0);
			$result         = db_add($data, 'cms_master_employer');
		}
		
		return handle_success_response('Success', $result);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function edit_company_logo($params) 
{
    try 
    {
        $image 		= if_property_exist($params, 'image');
        $company_id = if_property_exist($params, 'company_id');
        $emp_id = if_property_exist($params, 'emp_id');

        if ((isset($image)) && strlen($image) > 0) 
        {
            $image = preg_replace('#data:image/[^;]+;base64,#', '', $image);
            base64_to_jpeg($image, "companies/" . $company_id . '/' . $company_id . ".jpeg");

			//save filename in db
			include '../services/modules/attachments.php';
			$params->primary_id                 = $company_id;
			$params->module_id                  = 8;
			$params->emp_id                  = $emp_id;
			$params->filename                  = $company_id. ".jpeg";
			add_attachment($params);
        }

        return handle_success_response('Success', constant('UPLOAD_DIR_URL') . 'companies/' . $company_id . '/' . $company_id . '.jpeg');
    }
    catch(Exception $e) 
    {
        handle_exception($e);
    }
}

function get_public_holiday_upload($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		
		include_once(LIB_DIR . '/phpexcel/PHPExcel.php');
		
		$filename		= if_property_exist($params, 'filename','');
		$emp_id			= if_property_exist($params, 'emp_id','');
		$data			= [];
		$status			= true;
		
		if($filename === NULL || $filename == '')
		{
			return handle_fail_response('filename is mandatory');
		}
		if($emp_id === NULL || $emp_id == '')
		{
			return handle_fail_response('employee ID is mandatory');
		}
		
		
		$objPHPExcel 	= PHPExcel_IOFactory::load(constant('FILES_DIR') . "/temp/" . $filename);
		$sheet 			= $objPHPExcel->getSheet(0);
		$total_rows 	= $sheet->getHighestRow();
		
		
		for($i = 2; $i <= $total_rows; $i++)
		{
			$status				= true;
			$row = $sheet->rangeToArray('A' . $i . ':D' . $i, NULL, TRUE, FALSE);
			if($row[0][0] != '')
			{
				$data[($i - 2)]['date']  		= gmdate("Y-m-d", ($row[0][0] - 25569) * 86400);
				$data[($i - 2)]['descr']  		= trim(str_replace("'", "''", $row[0][1]));
				$data[($i - 2)]['company_id']  	= trim(str_replace("'", "''", $row[0][2]));
				$data[($i - 2)]['is_active']  	= trim(str_replace("'", "''", $row[0][3]));
				$data[($i - 2)]['active_name']  = $data[($i - 2)]['is_active'] ? 'Active' : 'InActive';
				
				if($data[($i - 2)]['date'] == "" || $data[($i - 2)]['descr'] == "" || $data[($i - 2)]['company_id'] == ""
						|| $data[($i - 2)]['is_active']  == ""
				)
				{
					$status = false;
				}
				$data[($i - 2)]['status']		= $status;
			}
		}
		
		return handle_success_response('Success', $data);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function add_ph_upload_batch($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$ph_data	= if_property_exist($params, 'ph_data','');
		$emp_id		= if_property_exist($params, 'emp_id','');
		
		if($ph_data === NULL || $ph_data == '')
		{
			return handle_fail_response('Public Holiday Data is mandatory');
		}
		if($emp_id === NULL || $emp_id == '')
		{
			return handle_fail_response('employee ID is mandatory');
		}
		
		$count 	= count($ph_data);

		//get companies list
		$rs 		= db_query('id'
							  , 'cms_master_employer'
							  , 'is_active = 1'
							  );
		$companies 	= array_column($rs, 'id');

		for($i = 0; $i < (int)$count; $i++)
		{
			if($ph_data[$i]->status == true && in_array($ph_data[$i]->company_id, $companies))
			{
				$data = array
				(
					':holiday'	   	=> $ph_data[$i]->date,
					':holiday_desc'	=> $ph_data[$i]->descr,
					':company_id'	=> $ph_data[$i]->company_id,
					':is_active'	=> $ph_data[$i]->is_active
				);
				
				$rs = db_execute_custom_sql("SELECT id from cms_holidays WHERE holiday = '" . $ph_data[$i]->date . "'");
				if(count($rs) > 0)
				{
					$data[':id']    		= $rs[0]['id'];
					$data 					= add_timestamp_to_array($data,$emp_id,1);
					$results 				= db_update($data, 'cms_holidays', 'id');
					$ph_data[$i]->result	= $rs[0]['id'];
				}
				else 
				{
					$data 					= add_timestamp_to_array($data,$emp_id,0);
					$id                		= db_add($data, 'cms_holidays');
					$ph_data[$i]->result	= $id;
				}
			}
		}
		
		return handle_success_response('Success', $ph_data);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function remove_company_logo($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$company_id = if_property_exist($params, 'company_id','');
		
		if($company_id === NULL || $company_id == '')
		{
			return handle_fail_response('Company ID is mandatory');
		}
		
		if(@unlink(FILES_DIR.'/companies/'.$company_id.'/'.$company_id. '.jpeg'))
		{	
			$empty_logo = '../../assets/img/add-logo.png';
			//return handle_success_response('Success', $empty_logo);
			echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$empty_logo) );exit;
		}
		else
		{
			return handle_fail_response('Error in deleting logo');
		}
		
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

?>
