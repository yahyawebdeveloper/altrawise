<?php

function get_modules($params) {
    try
	{
		log_it(__FUNCTION__, $params);
		
		$id				= if_property_exist($params,'id');
		
		
		$where = 'cms_modules.is_active = 1';
		
		
		if($id != "")
		{
			$where .= " AND cms_modules.id = '$id'";
		}
		
		$rs = db_query("id,descr,IFNULL(json_field,'') as json_field",
						"cms_modules",
						$where);
		$data['modules'] = [];
		if(is_array($rs)) {
			for($i = 0;$i < count($rs);$i++)
			{
				$data['modules'][] = $rs[$i];
			}
		}
		
		return handle_success_response('Success',$data);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}

}