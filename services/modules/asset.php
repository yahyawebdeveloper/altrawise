<?php
/**
* @author 		Sancheev
* @date 		30-Aug-2017
* @modify
* @Note = Please follow the indentation
*         Please follow the naming convention
*/

function get_asset_list_flexi($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		
		$emp_id     	= if_property_exist($params,'emp_id');
		$post_values	= if_property_exist($params,'post_values');

		$field_replace = array();
		$field_replace['status'] 		= 'cms_assets.status_id';
		$field_replace['asset_type'] 	= 'cms_assets.type_id';
		$field_replace['asset_owner'] 	= 'cms_assets.owner_id';
		$field_replace['stake_holders'] = 'cms_assets.client_id';
		$field_replace['purchase_date'] = 'cms_assets.purchase_date';
		$field_replace['brand_name'] 	= 'cms_assets.brand_name';
		$field_replace['serial_no'] 	= 'cms_assets.serial_no';
		$field_replace['asset_name'] 	= 'cms_assets.asset_name';
		$field_replace['expiry_type'] 	= 'cms_assets.expiry_type_id';
		$field_replace['expiry_date'] 	= 'cms_assets.expiry_date';
		$field_replace['assigned_to'] 	= 'cms_assets_employees.assigned_to_id';
		$field_replace['taken_date'] 	= 'cms_assets_employees.taken_date';
		$field_replace['return_date'] 	= 'cms_assets_employees.return_date';
		$field_replace['asset_status'] 	= 'cms_assets_employees.is_active';
		
		$where = $join = '';
		
		foreach ($post_values as $key => $param)
		{	
			$where .= $key == 0 ? '' : ' and ';
			
			$search_condition       =   $param->search_condition;
			$search_field           =   $param->search_field;
			$search_field_value     =   $field_replace[$search_field];
			
			$fields_with_datepicker =   array('purchase_date'
											 ,'expiry_date'
											 ,'taken_date'
											 ,'return_date'
										);
			
			if(in_array($search_field, $fields_with_datepicker))
			{
				
				$original           =   $param->search_value;
				
				//Explode the string into an array.
				$exploded   = explode("/", $original);
				$from_date  = $exploded[0] . " 00:00:00";
				$to_date    = $exploded[1] . " 23:59:59";
				
				$where  .= $search_field_value." >= '" . $from_date . "' AND ".$search_field_value." <= '" . $to_date . "'";
			}
			else
			{
				if($search_condition == 'like')
				{
					$where .= $search_field_value .' '. $search_condition .' "%'. $param->search_value.'%"';
				}
				else
				{
					$where .= $search_field_value .' '. $search_condition .' "'. $param->search_value.'"';
				}
			}
		}
		
		$rs = db_query
		(
				"cms_assets.id
				, IFNULL(cms_employees.name,'-') as assigned_to
				, (select descr from cms_master_list where cms_master_list.id = cms_assets.type_id) as type_name
				, (select descr from cms_master_list where cms_master_list.id = cms_assets.client_id) as client_name
				, (select descr from cms_master_list where cms_master_list.id = cms_assets.owner_id) as owner_name
				, cms_assets.brand_name
				, cms_assets.expiry_date
				, cms_assets_employees.taken_date
				, cms_assets_employees.return_date
				, (select name from cms_employees where cms_employees.id = cms_assets.created_by) as created_by
	                ",
				"cms_assets
				LEFT JOIN cms_assets_employees
				ON (cms_assets_employees.asset_id = cms_assets.id AND cms_assets_employees.is_active = 1)
				LEFT JOIN cms_employees
				ON (cms_employees.id = cms_assets_employees.assigned_to_id)
	                ",
				$where, '', '', 'cms_assets.id','DESC');
		
		
		if(count($rs) < 1 || !isset($rs))
		{
			return handle_fail_response('No record found');
		}
		return handle_success_response('Success', $rs);
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_asset_list($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

        $employee_id	= if_property_exist($params, 'employee_id');
        $type_id      	= if_property_exist($params, 'type_id');
        $view_all       = if_property_exist($params, 'view_all',0);
        $start_index	= if_property_exist($params, 'start_index',	0);
        $limit	        = if_property_exist($params, 'limit',	MAX_NO_OF_RECORDS);
        $emp_id	        = if_property_exist($params, 'emp_id');

        $where	=	" cms_assets.is_active = 1";
        
        if($view_all == 1)
        {
        	$where	.=	" AND cms_assets.id != ''";
        }
        else
        {
        	$where	.=	" AND cms_assets_employees.assigned_to_id = $emp_id";
        }
        
        if($employee_id != "" && $employee_id != NULL)
        {
			$where 	.=  " AND cms_assets_employees.assigned_to_id = " . $employee_id;
        }
        if($type_id != "" && $type_id != NULL)
        {
			$where 	.=  " AND cms_assets.type_id = " . $type_id;
        }

        //$where  .= " GROUP BY cms_assets.id";

        $sql                = get_asset_sql();
        $field              = $sql['fields'];
        $table              = $sql['table'];

        $rs = db_query_list
        	(	  $field
        		, $table
        		, $where
        		, $start_index
        		, $limit
        		, "id"
        	);

        $rs_total           = db_query_single("count(*) as total_records",$table,$where);
        
        $rs['total_records']= $rs_total['total_records'];

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

function get_asset_sql()
{
    try
    {
        $fields = "cms_assets.id
        	, IFNULL(cms_employees.name,'-') as assigned_to
			, (select descr from cms_master_list where cms_master_list.id = cms_assets.type_id) as type_name
            , (select descr from cms_master_list where cms_master_list.id = cms_assets.client_id) as client_name
			, (select descr from cms_master_list where cms_master_list.id = cms_assets.owner_id) as owner_name
            , cms_assets.brand_name
            , cms_assets.expiry_date
            , cms_assets_employees.taken_date
            , cms_assets_employees.return_date
            , (select name from cms_employees where cms_employees.id = cms_assets.created_by) as created_by";
        
        $table = "  cms_assets
        			LEFT JOIN cms_assets_employees
                    ON (cms_assets_employees.asset_id = cms_assets.id AND cms_assets_employees.is_active = 1)
                    LEFT JOIN cms_employees
                    ON (cms_employees.id = cms_assets_employees.assigned_to_id)
                ";
        
        return array('fields' => $fields,'table'=> $table);
        
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}

function get_assets_details($params)
{
	try
	{
		log_it(__FUNCTION__, $params);

		$id	= if_property_exist($params,'id','');

		if($id === NULL || $id == '')
		{
			return handle_fail_response('Asset ID is mandatory');
		}

		$rs = db_query_single("
		id
		, client_id
		, owner_id
		, type_id
		, status_id
		, date_format(purchase_date,'" . constant('UI_DATE_FORMAT') .  "') as purchase_date
		, expiry_type_id
		, date_format(expiry_date,'" . constant('UI_DATE_FORMAT') .  "') as expiry_date
		, serial_no
		, asset_name
		, brand_name
		, product_value
		, quantity
		, json_field
		",
		"cms_assets",
		"id = '". $id ."'");

		$data['details']				= $rs;
        $data['details']['attachment'] 	= get_asset_attachments($params);


		 return handle_success_response('Success', $data);

	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
 }

function add_edit_asset($params)
{
	try
	{
		log_it(__FUNCTION__, $params);

		$id		    		= if_property_exist($params,'id');
		$client_id   		= if_property_exist($params,'client_id',0,array(0,""));
		$type_id  			= if_property_exist($params,'type_id',0,array(0,""));
		$owner_id  			= if_property_exist($params,'owner_id',0,array(0,""));
		$status_id  		= if_property_exist($params,'status_id',0,array(0,""));
		$purchase_date  	= if_property_exist($params,'purchase_date');
		$expiry_type_id		= if_property_exist($params,'expiry_type_id',0,array(0,""));
		$expiry_date  		= if_property_exist($params,'expiry_date');
		$serial_no   		= if_property_exist($params,'serial_no');
		$asset_name   		= if_property_exist($params,'asset_name');
		$brand_name  		= if_property_exist($params,'brand_name');
		$product_value   	= if_property_exist($params,'product_value',0,array(0,""));
		
		$quantity   		= if_property_exist($params,'quantity',0,array(0,""));
		$emp_id 	      	= if_property_exist($params,'emp_id');

		$purchase_date 	 	= convert_to_date($purchase_date);

		if($id == '')
        {
            $rs  = get_doc_primary_no('id', 'cms_assets');
            if($rs == false)
            {
            	return handle_fail_response('Error generating document number. Please contact admin');
            }
            else
            {
                $id = $rs['id'];
            }
        }
		

		$data = array
		(
			':id'				=>  $id,
			':client_id'		=> 	$client_id,
			':owner_id'			=> 	$owner_id,
			':type_id'			=> 	$type_id,
			':status_id'		=> 	$status_id,
			':purchase_date'	=> 	$purchase_date,
			':expiry_type_id'	=> 	$expiry_type_id,
			':serial_no'		=> 	$serial_no,
			':asset_name'		=> 	$asset_name,
			':brand_name'		=> 	$brand_name,
			':product_value'	=> 	$product_value,
			':quantity'			=> 	$quantity,
			':created_by'		=>  $emp_id
		);
		// echo '<pre>';print_r($data);exit;
		if(is_data_exist('cms_assets', 'id', $id))
		{	
			$data 			= add_timestamp_to_array($data,$emp_id,1);
			$result 		= db_update($data, 'cms_assets', 'id');
		}
		else
		{	
			$data 		= add_timestamp_to_array($data,$emp_id,0);
			db_add($data, 'cms_assets');
		}

		return handle_success_response('Success', $id);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function add_edit_asset_warranty($params)
{
	try
	{
		log_it(__FUNCTION__, $params);

		$id		    		= if_property_exist($params,'id');
		
		$expiry_type_id		= if_property_exist($params,'expiry_type_id',0,array(0,""));
		$expiry_date  		= if_property_exist($params,'expiry_date');
		
		$emp_id 	      	= if_property_exist($params,'emp_id');

		$json_field                = if_property_exist($params, 'json_field');
		
		$expiry_date	 	= convert_to_date($expiry_date);

		$data = array
		(
			':id'				=>  $id,
			':expiry_type_id'	=> 	$expiry_type_id,
			':expiry_date'		=> 	$expiry_date,
            ':json_field'       =>  json_encode($json_field)
		);

		$data[':id']    = $id;
		$data 			= add_timestamp_to_array($data,$emp_id,1);
		$result 		= db_update($data, 'cms_assets', 'id');
		
		return handle_success_response('Success', $id);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function assign_asset_to_employee($params)
{
	try
	{
		log_it(__FUNCTION__, $params);

		$id		    		= if_property_exist($params,'id');
		$asset_id		  	= if_property_exist($params,'asset_id');
		$assigned_to_id		= if_property_exist($params,'assigned_to_id');
		
		$taken_date  		= if_property_exist($params,'taken_date');
		$return_date  		= if_property_exist($params,'return_date');
		$is_active  		= if_property_exist($params,'is_active');
		$remarks  			= if_property_exist($params,'remarks');
		
		$emp_id 	      	= if_property_exist($params,'emp_id');

		$taken_date	 		= convert_to_date($taken_date);
		$return_date	 	= convert_to_date($return_date);

		$data = array
		(
			':asset_id'			=>  $asset_id,
			':assigned_to_id'	=>  $assigned_to_id,
			':taken_date'		=>  $taken_date,
			':return_date'		=>  $return_date,
			':is_active'		=> 	$is_active,
			':remarks'			=> 	$remarks
		);

		//update remaining employees status to in-active, if the current status is active
		$status_data[':asset_id']   	= $asset_id;
		$status_data[':is_active']   	= 0;
		$status_data 		= add_timestamp_to_array($status_data,$emp_id,1);
		db_update($status_data, 'cms_assets_employees', 'asset_id');

		if(is_data_exist('cms_assets_employees', 'id', $id))
		{	
			$data[':id']   	= $id;
			$data 			= add_timestamp_to_array($data,$emp_id,1);
			$result 		= db_update($data, 'cms_assets_employees', 'id');
		}
		else
		{	
			$data[':id']   	= get_db_UUID();
			$data 			= add_timestamp_to_array($data,$emp_id,0);
			$id 			= db_add($data, 'cms_assets_employees');
		}
		
		return handle_success_response('Success', $id);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_asset_employees_list($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

        $asset_id      = if_property_exist($params, 'asset_id','');
        
        
        $where  = "cms_assets_employees.asset_id = '$asset_id'";
        // echo $where;exit;

        $result = db_query
        (
            "cms_assets_employees.id
                , cms_assets_employees.asset_id
                , cms_assets_employees.assigned_to_id
                , cms_assets_employees.taken_date
                , cms_assets_employees.return_date
                , cms_assets_employees.is_active
                , cms_assets_employees.remarks
                , cms_employees.name as assigned_to
                ",
            "cms_assets_employees
                LEFT JOIN cms_employees
                    ON (cms_assets_employees.assigned_to_id = cms_employees.id)",
            $where);

        return handle_success_response('Success', $result);

    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function delete_asset($params)
{
	try
	{
		log_it(__FUNCTION__, $params);

		$id	        	= if_property_exist($params, 'id');
		$employee_id	= if_property_exist($params, 'employee_id');
        $type_id      	= if_property_exist($params, 'type_id');
        $start_index	= if_property_exist($params, 'start_index',	0);
        $limit	        = if_property_exist($params, 'limit',	MAX_NO_OF_RECORDS);
        $emp_id	        = if_property_exist($params, 'emp_id');

		$data = array
		(
			':id'  		  => $id,
			':is_active'  => 0
		);

		$data 		= add_timestamp_to_array($data,$emp_id, 1);
		$result 	= db_update($data, 'cms_assets','id');

		$list       = json_decode(get_asset_list($params));

		return handle_success_response('Success', $list->data);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_assets_dashboard_list($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

        $rs = db_query("descr,
                        IFNULL((select sum(product_value) from cms_assets where type_id=cms_master_list.id and cms_assets.is_active=1),0) as asset_val
                        ,(select count(*) from cms_assets where type_id=cms_master_list.id and cms_assets.is_active=1) as asset_count
                		",
                        "cms_master_list",
                        "category_id=20");
        
        $sql                = get_asset_sql();
        $field              = $sql['fields'];
        $table              = $sql['table'];

        $rs1 				= db_query
				        	(	  $field
				        		, $table
				        	);
                    

        $return_data = array('list' => $rs,'detail' => $rs1);
        
        return handle_success_response('Success', $return_data);

    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

//NON API compatible Services
function get_asset_attachments($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$id        			= if_property_exist($params, 'id');
		$emp_id	  	        = if_property_exist($params, 'emp_id');
		
		require_once constant('MODULES_DIR') . '/attachments.php';
		$params->primary_id	= $id;
		$params->module_id	= 20;
		return json_decode(get_attachment($params))->data->attachment;
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_asset_drop_down_values($params)
{
	try
	{	
		$view_all        	= if_property_exist($params, 'view_all');
		$emp_id	  	        = if_property_exist($params, 'emp_id');

		$result = array();
		
		$cms_master_list =  array
		(
			"asset_type" 	=> 20
		  , "expiry_type" 	=> 21
		  , "status" 		=> 66
		);
		
		foreach ($cms_master_list as $key => $value)
		{
			$result[$key]   =   db_query
			(
				"cms_master_list.id as id, cms_master_list.descr as descr",
				"cms_master_list",
				"cms_master_list.is_active = 1 and cms_master_list.category_id = ".$value
			);
		}

		$result['asset_owner']  =  db_query('id,employer_name as descr','cms_master_employer','is_active = 1');
		
		$result['stake_holders']  =  db_query('id,name as descr','cms_clients','is_active = 1');

		if($view_all)
		{
			$result['employees']  =   db_query
			(
				"cms_employees.id as id
				, cms_employees.name as descr",
				"cms_employees",
				"cms_employees.is_active = 1 GROUP BY cms_employees.id ORDER BY cms_employees.name ASC"
			);
		}
		else
		{
			$result['employees']  =   db_query
			(
				"cms_employees.id as id
				, cms_employees.name as descr",
				"cms_employees",
				"cms_employees.is_active = 1 AND cms_employees.id = ".$emp_id.""
			);
		}
		
		
		$result['asset_status'] =  array
		(
			array
			(
				'id'    => 1,
				'descr' => 'Active'
			),
			array
			(
				'id'    => 0,
				'descr' => 'Inactive'
			)
		);
		
		if(count($result) < 1 || !isset($result))
		{
			return handle_fail_response('No record found');
		}
		else
		{
			return handle_success_response('Success', $result);
		}
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

?>
