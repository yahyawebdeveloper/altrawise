<?php

function get_attachment($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$id				= if_property_exist($params,'id');
		$primary_id		= if_property_exist($params,'primary_id');
		$secondary_id	= if_property_exist($params,'secondary_id');
		$is_primary		= if_property_exist($params,'is_primary');
		$module_id		= if_property_exist($params,'module_id');
		$filename		= if_property_exist($params,'filename');
		$emp_id	   		= if_property_exist($params,'emp_id');
		
		$where = 'cms_files.is_active = 1';
		if($primary_id != "")
		{
			$where .= " AND cms_files.primary_id = '$primary_id'";
		}
		if($secondary_id != "")
		{
			$where .= " AND cms_files.secondary_id = '$secondary_id'";
		}
		if($is_primary != "")
		{
			$where .= " AND cms_files.secondary_id IS NULL";
		}
		if($module_id != "")
		{
			$where .= " AND cms_files.module_id = $module_id";
		}
		
		else if($id != "")
		{
			$where .= " AND cms_files.id = '$id'";
		}
		else
		{
			if($primary_id === NULL || $primary_id == '')
			{
				return handle_fail_response('Primary ID is mandatory');
			}
			if($module_id === NULL || $module_id == '')
			{
				return handle_fail_response('Module ID is mandatory');
			}
		}
		$rs = db_query("cms_files.id
						,cms_files.primary_id
						,cms_files.secondary_id
						,cms_files.module_id
						,cms_modules.descr as module_name
						,cms_files.filename
						,cms_files.filesize
						,IFNULL(JSON_UNQUOTE(cms_files.json_field),'') as json_field
						,cms_files.is_active
						,cms_files.created_by
						,cms_employees.name as created_by_name
						,date_format(cms_files.created_date,'" . constant('UI_DATE_FORMAT') .  "') as created_date
						,cms_files.updated_by
						,cms_employees.name as updated_by_name
						,date_format(cms_files.updated_date,'" . constant('UI_DATE_FORMAT') .  "') as updated_date",
						"cms_files 
						LEFT join cms_employees on cms_employees.id = cms_files.created_by
						LEFT join cms_employees updated on updated.id = cms_files.updated_by
						LEFT join cms_modules on cms_files.module_id = cms_modules.id",
						$where);
		$data['attachment'] = [];
		if(is_array($rs)) {
			for($i = 0;$i < count($rs);$i++)
			{
				$data['attachment'][] = $rs[$i];
			}
		}
		
// 		,concat('" . constant("UPLOAD_DIR_URL") . "', cms_modules.descr, '/',cms_files.primary_id, '/', cms_files.filename) as filepath
		
		return handle_success_response('Success',$data);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function add_attachment($params)
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
			$id				= get_db_UUID();
			$data[':id']    = $id;
			$params->id		= $id;
			$data 			= add_timestamp_to_array($data,$emp_id,0);
			$result        	= db_add($data, 'cms_files');
		}
		
		$rs					= json_decode(get_attachment($params))->data;
		return handle_success_response('Success',$rs ? $rs : array());
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function delete_attachment($params)
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
		
		if($id === NULL || $id == '')
		{
			return handle_fail_response('ID is mandatory');
		}
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
			':id'   		=> $id,
			':is_active' 	=> 0
		);
		
		if ($id && is_data_exist('cms_files', 'id', $id))
		{
			$data 				= add_timestamp_to_array($data,$emp_id,1);
			$result        		= db_update($data, 'cms_files','id');
			
			$rs					= db_query_single("descr", "cms_modules","id = $module_id");
			if(count($rs) > 0)
			{
				$module_name 	= $rs['descr'];
				$old_path_file 	= constant("DOC_FOLDER") . "$module_name/$primary_id/$filename";
				$new_path_file 	= constant("DOC_FOLDER") . "$module_name/$primary_id/deleted/$filename";
				
				if(create_folder(constant("DOC_FOLDER") . "$module_name/$primary_id/deleted"))
				{
					if(file_exists($old_path_file))
					{
						rename($old_path_file,$new_path_file);
					}
				}
				return handle_success_response('Success',true);
			}
			else
			{
				return handle_fail_response('Unable to get module name');
			}
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

function delete_attachment_old($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$file_id	= if_property_exist($params,'file_id');
		$filename	= if_property_exist($params,'filename');
		$module		= if_property_exist($params,'module');
		$emp_id	   	= if_property_exist($params,'emp_id');
		
		
		if($file_id === NULL || $file_id == '')
		{
			return handle_fail_response('File ID is mandatory');
		}
		if($filename === NULL || $filename == '')
		{
			return handle_fail_response('Filename is mandatory');
		}
		if($module === NULL || $module == '')
		{
			return handle_fail_response('Module ID is mandatory');
		}
		if($emp_id === NULL || $emp_id == '')
		{
			return handle_fail_response('Emp Id is mandatory');
		}
		
		if((int)$module == 16)
		{
			$sql 		= "UPDATE cms_outbound_document SET attachment = IFNULL(JSON_REMOVE(attachment,JSON_UNQUOTE(JSON_SEARCH(attachment, 'one', '%$filename%',NULL, '$'))),attachment)
			WHERE outbound_no = '$file_id'";
			$result 	= db_execute_sql($sql);
			
			if(count($result) > 0)
			{
				$old_path_file = constant("DOC_FOLDER") . "outbound_document/$file_id/$filename";
				$new_path_file = constant("DOC_FOLDER") . "outbound_document/$file_id/deleted/$filename";
				
				if(create_folder(constant("DOC_FOLDER") . "outbound_document/$file_id/deleted"))
				{
					if(file_exists($old_path_file))
					{
						rename($old_path_file,$new_path_file);
					}
				}
				return handle_success_response('Success',true);
			}
			else
			{
				return handle_fail_response('Unable to update database, please contact administrator');
			}
		}
		return handle_fail_response('Unable to get identify module to update');
		
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

?>