<?php

function get_files($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$id				= if_property_exist($params,'id');
		$primary_id		= if_property_exist($params,'primary_id');
		$secondary_id	= if_property_exist($params,'secondary_id');
		$module_id		= if_property_exist($params,'module_id');
		$filename		= if_property_exist($params,'filename');
		$emp_id	   		= if_property_exist($params,'emp_id');
		$token	   		= if_property_exist($params,'token');

		//handle validation
		if($primary_id === NULL || $primary_id == '') {
			return handle_fail_response('Primary ID is mandatory');
		}
			
		if($module_id === NULL || $module_id == '') {
			return handle_fail_response('Module ID is mandatory');
		}
		
		//where clause
		$where = 'cms_files.is_active = 1';
		if($primary_id != "")
		{
			$where .= " AND cms_files.primary_id = '$primary_id'";
		}
		if($secondary_id != "")
		{
			$where .= " AND cms_files.secondary_id = '$secondary_id'";
		}
		if($module_id != "")
		{
			$where .= " AND cms_files.module_id = $module_id";
		}
		
		if($id != "")
		{
			$where .= " AND cms_files.id = '$id'";
		}
		
		
		$rs = db_query("cms_files.id as uuid
						,cms_files.primary_id
						,cms_files.secondary_id
						,cms_files.module_id
						,cms_files.filename as name
						,cms_files.filesize as size
						,JSON_OBJECT('id',cms_files.id, 'token','" . $token . "') as deleteFileParams
						,concat('" . constant("UPLOAD_DIR_URL") . "', '" . $module_id . "', '/', '" . $primary_id . "', '/', cms_files.filename) as thumbnailUrl	
						,IFNULL(JSON_UNQUOTE(cms_files.json_field),'') as json_field
						,cms_files.is_active
						,IF(cms_files.is_active = 1,'ACTIVE','IN-ACTIVE') as status
						,cms_files.created_by
						,cms_employees.name as created_by_name
						,date_format(cms_files.created_date,'" . constant('UI_DATE_FORMAT') .  "') as created_date
						,cms_files.updated_by
						,updated.name as updated_by_name
						,date_format(cms_files.updated_date,'" . constant('UI_DATE_FORMAT') .  "') as updated_date",
						"cms_files 
						LEFT join cms_employees on cms_employees.id = cms_files.created_by
						LEFT join cms_employees AS updated on updated.id = cms_files.updated_by",
						$where);
		
		return handle_success_response('Success', $rs);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function add_files($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$id				= if_property_exist($params,'id');
		$primary_id		= if_property_exist($params,'primary_id');
		$secondary_id	= if_property_exist($params,'secondary_id');
		$module_id		= if_property_exist($params,'module_id');
		$filename		= if_property_exist($params,'filename');
		$filesize		= if_property_exist($params,'filesize');
		$json_field		= if_property_exist($params,'json_field');
		$emp_id	   		= if_property_exist($params,'emp_id');
		
		
		if($primary_id === NULL || $primary_id == '')
		{
			return handle_fail_response('Primary ID is mandatory');
		}
		if($module_id === NULL || $module_id == '')
		{
			return handle_fail_response('Module ID is mandatory');
		}
		if($filename === NULL || $filename == '')
		{
			return handle_fail_response('Filename is mandatory');
		}
		if($emp_id === NULL || $emp_id == '')
		{
			return handle_fail_response('Emp Id is mandatory');
		}
		
		$data = array
		(
			':primary_id'   => $primary_id,
			':secondary_id'	=> $secondary_id,
			':module_id' 	=> $module_id,
			':filename'   	=> $filename,
			':filesize'    	=> $filesize,
			':json_field' 	=> json_encode($json_field)
		);
		
		if ($id && is_data_exist('cms_files', 'id', $id))
		{
			$data[':id']    = $id;
			$data 			= add_timestamp_to_array($data,$emp_id,1);
			$result        	= db_update($data, 'cms_files','id');
		}
		else
		{
			$id				= get_db_UUID(); //if no uuid is passed - generate it
			$data[':id']    = $id;
			$params->id		= $id;
			$data 			= add_timestamp_to_array($data,$emp_id,0);
			$result        	= db_add($data, 'cms_files');
		}
		
		$rs					= json_decode(get_files($params))->data;
		return handle_success_response('Success',$rs ? $rs : array());
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function delete_files($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$id				= if_property_exist($params,'id');
		$emp_id	   		= if_property_exist($params,'emp_id');
		
		if($id === NULL || $id == '')
		{
			return handle_fail_response('ID is mandatory');
		}
		if($emp_id === NULL || $emp_id == '')
		{
			return handle_fail_response('Emp Id is mandatory');
		}
		
		$data = array
		(
			':id'   		=> $id,
			':is_active' 	=> 0
		);
		
		if ($id && is_data_exist('cms_files', 'id', $id))
		{
			$data 				= add_timestamp_to_array($data,$emp_id,1);
			$result        		= db_update($data, 'cms_files','id');
			
			return handle_success_response('Success',true);
		}
		else
		{
			return handle_fail_response('Unable to retrieve File data');
		}
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}


?>