<?php
/**
 * @author 		Jamal
 * @date 		19-Dec-2019
 * @modify
 * @Note = Please follow the indentation
 *         Please follow the naming convention
 */

function get_client_list($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		
		$id   			= if_property_exist($params, 'id');
		$from_date   	= if_property_exist($params, 'date_from');
		$to_date   		= if_property_exist($params, 'date_to');
		$is_date   		= if_property_exist($params, 'is_date');
		$client_name   	= if_property_exist($params, 'client_name');
		$assigned_to   	= if_property_exist($params, 'assigned_to');
		$type_id		= if_property_exist($params, 'type_id');
		$comm_type_id	= if_property_exist($params, 'comm_type_id');
		$emp_id        	= if_property_exist($params, 'emp_id');
		$offering_id    = if_property_exist($params, 'offering_id');
		$status_id    	= if_property_exist($params, 'status_id');
		$source_id    	= if_property_exist($params, 'source_id');
		// $emp_id        	= if_property_exist($params, 'emp_id');
		$is_contacts    = if_property_exist($params, 'is_contacts');
		$view_all       = if_property_exist($params, 'view_all',0);
		$start_index	= if_property_exist($params, 'start_index',	0);
		$limit	        = if_property_exist($params, 'limit',	MAX_NO_OF_RECORDS);
		$is_for_download= if_property_exist($params, 'is_for_download');
		$filter			= "";
		
		// $where      = "cms_clients.is_active = 1";
		if($is_for_download)
		{
			$start_index = 0;
			$limit = 10000;
		}

		$where      = "cms_clients.is_active = 1";
		$having     = "";
		if($view_all == 1)
		{
			$where	.=	" AND cms_clients.id != ''";
		}
		else
		{
			$where	.=	" AND FIND_IN_SET(" . $emp_id . ", cms_clients.assign_emp_id)";
		}
		
		if($is_date)
		{
			$having   = " having latest_comm_date between '" . $from_date . " 00:00:00' AND '" . $to_date . " 23:59:59'";
		}
		if( is_array($assigned_to) )
			$assignedToString = implode(",",$assigned_to);
		else
			$assignedToString = $assigned_to;
		if($assignedToString != '')
		{
			$where	.=	" AND FIND_IN_SET(" . $assignedToString . ", cms_clients.assign_emp_id)";
		}
		
		if($client_name != '')
		{
			$where  .= " AND cms_clients.name LIKE '%$client_name%'";
		}
		
		if($type_id != '')
		{
			$where	.=	" AND FIND_IN_SET(" . $type_id . ", cms_clients.type_id)";
		}

		if($offering_id != '')
		{
			$where	.=	" AND FIND_IN_SET(" . $offering_id . ", JSON_UNQUOTE(JSON_EXTRACT(cms_clients_contacts.json_field, '$.offerings')))";
		}

		if($status_id != '')
		{
			$where	.=	" AND FIND_IN_SET(" . $status_id . ", cms_clients.client_status)";
		}

		if($source_id != '')
		{
			$where	.=	" AND FIND_IN_SET(" . $source_id . ", cms_clients.source)";
		}

		if($comm_type_id != '')
		{	
			$where	.=	" AND (SELECT cms_clients_comm.comm_type 
			FROM cms_clients_comm 
			WHERE client_id = cms_clients.id
			ORDER BY cms_clients_comm.created_date DESC LIMIT 1) = $comm_type_id";
		}
		
		if($id != "")
		{
			$where 	= " cms_clients.id = $id";
		}

		if($is_contacts)
		{	
			if($assigned_to)
			{
				$where .= " AND cms_clients_contacts.created_by = $assigned_to";
			}
			else
			{
				$where .= " AND cms_clients_contacts.created_by <> ''";
			}
			
		}
		$sql                = get_clients_sql();
		// echo $where;exit;
        $field              = $sql['fields'];
        $table              = $sql['table'];
		$rs = db_query_list($field, $table, $where.' GROUP BY cms_clients.id'.$having, $start_index, $limit, "cms_clients.name",'');

		$rs_total           = db_query("cms_clients.id
            ,(SELECT cms_clients_comm.created_date 
			FROM cms_clients_comm 
			WHERE client_id = cms_clients.id
			ORDER BY cms_clients_comm.created_date DESC LIMIT 1) AS latest_comm_date",$table,$where.' GROUP BY cms_clients.id'.$having);
		
        $rs['total_records']= (isset($rs_total) && count($rs_total) > 0 ) ? count($rs_total) : 0;
		if (count($rs) < 1 || !isset($rs))
		{
			return handle_fail_response('No clients record found');
		}
        
		echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs ) );exit;
		//return handle_success_response('Success', $rs);
		
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function get_clients_sql()
{
    try
    {
        $fields = "cms_clients.id
            ,cms_clients.type_id
            ,GROUP_CONCAT(DISTINCT tbl_type.descr ORDER BY tbl_type.id) as type
            ,cms_clients.name
            ,cms_clients.industry
            ,IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_clients.json_field,'$.office_tel')),'') as office_tel
            ,IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_clients.json_field,'$.website')),'') as website
            ,IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_clients.json_field,'$.address')),'') as address
			,cms_clients.client_status as client_status_id
			,tbl_cs.descr as client_status
			,cms_clients.remarks
			,cms_clients.source
			,cms_clients.assign_emp_id
			,IFNULL(source.descr,'') as source_name
			,cms_master_list.descr as industry_name
			,cms_employees.name as created_by
			,date_format(cms_clients.created_date,'" . constant('UI_DATE_FORMAT') .  "') as created_date
			,(SELECT cms_clients_comm.created_date 
			FROM cms_clients_comm 
			WHERE client_id = cms_clients.id
			ORDER BY cms_clients_comm.created_date DESC LIMIT 1) AS latest_comm_date
			,(SELECT cms_clients_comm.comm_type 
			FROM cms_clients_comm 
			WHERE client_id = cms_clients.id
			ORDER BY cms_clients_comm.created_date DESC LIMIT 1) AS latest_comm_type_id
			,(SELECT JSON_OBJECT('name',cms_clients_contacts.name,'created_date',date_format(cms_clients_comm.created_date,'" . constant('DISPLAY_DATETIME_FORMAT') .  "'),'comm_type',comm_type.descr) 
			FROM cms_clients_comm 
			INNER JOIN cms_clients_contacts ON cms_clients_comm.contact_id = cms_clients_contacts.id
			INNER JOIN cms_master_list comm_type ON cms_clients_comm.comm_type = comm_type.id
			WHERE client_id = cms_clients.id ORDER BY cms_clients_comm.created_date DESC LIMIT 1) AS latest_comm";
        
        $table = "cms_clients
                LEFT JOIN cms_clients_comm ON cms_clients_comm.client_id = cms_clients.id
                LEFT JOIN cms_master_list ON cms_clients.industry = cms_master_list.id
				LEFT JOIN cms_master_list as source ON cms_clients.source = source.id
				LEFT JOIN cms_master_list as tbl_cs ON cms_clients.client_status = tbl_cs.id
				LEFT JOIN cms_master_list as tbl_type ON FIND_IN_SET(tbl_type.id, cms_clients.type_id) > 0
				LEFT JOIN cms_employees on cms_clients.created_by = cms_employees.id
				LEFT JOIN cms_clients_contacts on cms_clients_contacts.client = cms_clients.id";
        
        return array('fields' => $fields,'table'=> $table);
        
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}

function get_client_details($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$id   			= if_property_exist($params, 'id');
		$where = "cms_clients.id = $id";
		
		$rs = db_query_single
		(
			"cms_clients.id
            ,cms_clients.type_id
            ,cms_clients.name
            ,cms_clients.industry
            ,IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_clients.json_field,'$.office_tel')),'') as office_tel
            ,IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_clients.json_field,'$.website')),'') as website
            ,IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_clients.json_field,'$.address')),'') as address
			,cms_clients.client_status as client_status_id
			,cms_clients.remarks
			,cms_clients.source
			,cms_clients.assign_emp_id
			,cms_clients.json_field",
				"cms_clients",
				$where
		);
		
		if (  count($rs) < 1 || !isset($rs))
		{
			return handle_fail_response('No clients record found');
		}
		$rs_additional = json_decode(get_client_additional_list($params));
		$data['details'] = $rs;
		$data['additional'] = $rs_additional->data;

		//fetch details to assign principal accounts
 		$assign_emp_id 					= $rs['assign_emp_id'];
		$data['prinicpal_acc_managers'] =   db_query
										    (
												"id,name as descr"
												,"cms_employees"
												,"is_active = 1 AND id IN (".$assign_emp_id.")"
										    );
		$data['prinicpal_accounts'] 	=   db_query
											(
												"cms_clients_contacts.id
												,CONCAT(cms_clients.name, ' - ', cms_clients_contacts.name) as descr"
												, "cms_clients_contacts
												LEFT JOIN cms_clients ON cms_clients_contacts.client = cms_clients.id
				                                LEFT JOIN cms_master_list as tbl_type ON FIND_IN_SET(tbl_type.id, cms_clients.type_id) > 0
				                                LEFT JOIN cms_master_category ON tbl_type.category_id = cms_master_category.id",
                       	 						"tbl_type.descr = 'Principal Account' AND cms_master_category.id = 59 GROUP BY cms_clients_contacts.id"
                            				);
echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$data ) );exit;
		//return handle_success_response('Success', $data);
		
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function get_client_approvals($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		
		$id   			= if_property_exist($params, 'id');
		$type_id   		= if_property_exist($params, 'type_id');
		$created_by   	= if_property_exist($params, 'created_by');
		
		$emp_id        	= if_property_exist($params, 'emp_id');
		$view_all       = if_property_exist($params, 'view_all',0);
		$filter			= "";
		
		if($view_all == 1)
		{
			$where	=	"cms_clients_mock.id != ''";
		}
		else
		{
			$where	=	"cms_clients_mock.created_by = $emp_id";
		}
		
		if($created_by != '')
		{
			$where  .= " AND cms_clients_mock.created_by = $created_by";
		}

		if($type_id != '')
		{
			$where	.=	" AND FIND_IN_SET(" . $type_id . ", cms_clients_mock.type_id)";
		}
		
		if($id != "")
		{
			$where 	= " cms_clients_mock.id = $id";
		}

		$rs = db_query
		(
			"cms_clients_mock.id
			,cms_clients_mock.type_id
			, GROUP_CONCAT(tbl_type.descr ORDER BY tbl_type.id) as type
			, IFNULL((select GROUP_CONCAT(cms_clients.name) from cms_clients where cms_clients.name LIKE CONCAT('%', cms_clients_mock.name, '%')),'') as identical_names
			, cms_clients_mock.name
            ,cms_clients_mock.client_id
            ,cms_clients_mock.industry
            ,cms_clients_mock.remarks
            ,cms_clients_mock.source
            ,cms_clients_mock.client_status
            ,cms_employees.name as created_by
			,date_format(cms_clients_mock.created_date,'" . constant('UI_DATE_FORMAT') .  "') as created_date
			,IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_clients_mock.json_field,'$.website')),'') as website
            ,IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_clients_mock.json_field,'$.office_tel')),'') as office_tel
            ,IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_clients_mock.json_field,'$.address')),'') as address
            ,tbl_cs.descr as client_status_value
            ,IFNULL(JSON_UNQUOTE(JSON_EXTRACTcms_clients_mock.json_field,'$.offering'),'') as offering
            ,tbl_offering.descr as offering_value",
				"cms_clients_mock
                LEFT JOIN cms_employees on cms_clients_mock.created_by = cms_employees.id
                LEFT JOIN cms_master_list as tbl_cs ON cms_clients_mock.client_status = tbl_cs.id
                LEFT JOIN cms_master_list as tbl_type ON FIND_IN_SET(tbl_type.id, cms_clients_mock.type_id) > 0
                 LEFT JOIN cms_master_list tbl_offering on JSON_UNQUOTE(JSON_EXTRACT(cms_clients_mock.json_field, '$.offering')) = tbl_offering.id",
				$where.' GROUP BY cms_clients_mock.id'
		);
		
		return handle_success_response('Success', $rs);
		
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function add_edit_client($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$type_id      		= if_property_exist($params, 'type_id');
		$name       		= if_property_exist($params, 'name');
		$client_id       	= if_property_exist($params, 'client_id');
		$industry   		= if_property_exist($params, 'industry');
		$client_status		= if_property_exist($params, 'client_status');
		$source				= if_property_exist($params, 'source');
		$remarks			= if_property_exist($params, 'remarks');
		$json_field			= if_property_exist($params, 'json_field');
		$emp_id     		= if_property_exist($params, 'emp_id');
		$id         		= if_property_exist($params, 'id');
		$assign_emp_id      = if_property_exist($params, 'assign_emp_id');

		$additional 		= if_property_exist($params, 'additional');
		
		if (!$name || !$industry || !$emp_id)
		{
			return handle_fail_response('Missing parameters');
		}
		
		if(!$id)
		{
			$is_data_exist   =   db_query_single('cms_clients.id','cms_clients',"name = '$name' AND created_by = $emp_id");
		}
		else
		{
			$is_data_exist   =   db_query_single('cms_clients.id','cms_clients',"name = '$name' AND created_by = $emp_id AND id <> $id");
		}
		
		if ($is_data_exist)
		{
			return handle_fail_response('Stake Holder  name already exists');
		}

		$data = array
		(
			':type_id'      		=> $type_id,
			':name'      			=> $name,
			':industry'  			=> $industry,
			':client_status'  		=> $client_status,
			':source'  				=> $source,
			':remarks'  			=> $remarks,
			':is_active'  			=> 1,
			':assign_emp_id'		=> $assign_emp_id,
			':json_field'			=> json_encode($json_field)
		);

		if ($id)
		{
			$data[':id']  = $id;
			$data           = add_timestamp_to_array($data, $emp_id, 1);
			$result         = db_update($data, 'cms_clients', 'id');
		}
		else
		{
			$data           = add_timestamp_to_array($data, $emp_id, 0);
			$id				= db_add($data, 'cms_clients', 'id');
		}

		if (count($additional) > 0) {
			$params->id = $id;
            $rs_allowance = add_edit_client_additional($params);
        }
		
		if($id != '')
		{
			return handle_success_response('Success', $id);
		}
		else
		{
			return handle_fail_response('Failed to add client');
		}
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function add_edit_client_additional($params) 
{
    try 
    {
        log_it(__FUNCTION__, $params);
        $additional = if_property_exist($params, 'additional');
        $client_id = if_property_exist($params, 'id'); //client no
        $emp_id = if_property_exist($params, 'emp_id');
        $count_data = count($additional);
        for ($i = 0;$i < $count_data;$i++) 
        {
            $client_additional_id = if_property_exist($additional[$i], 'id');
            $additional_id = if_property_exist($additional[$i], 'additional_id');
            $value = if_property_exist($additional[$i], 'value');
            $active_status = if_property_exist($additional[$i], 'active_status');
            $data = array(':client_id' => $client_id, ':master_list_id' => $additional_id, ':value' => $value, ':active_status' => $active_status);
            if (is_data_exist('cms_clients_additional', 'id', $client_additional_id)) 
            {
                $data[':id'] = $client_additional_id;
                $data = add_timestamp_to_array($data, $emp_id, 1);
                $result = db_update($data, 'cms_clients_additional', 'id');
            } else 
            {
                $data = add_timestamp_to_array($data, $emp_id, 0);
                // echo '<pre>';print_r($data);exit;
                $id = db_add($data, 'cms_clients_additional');
            }
        }
        $rs = json_decode(get_client_additional_list($params));
        return handle_success_response('Success', $rs->data);
    }
    catch(Exception $e) 
    {
        handle_exception($e);
    }
}

function get_client_additional_list($params) 
{
    try 
    {
        log_it(__FUNCTION__, $params);
        $client_id = if_property_exist($params, 'id');
        if ($client_id === NULL || $client_id == "") 
        {
            return handle_fail_response('Stake Holder  ID is mandatory');
        }
        $rs = db_query("cms_clients_additional.id
			, cms_master_list.descr as additional_type
       		, master_list_id as additional_id
			, cms_clients_additional.value
			, cms_clients_additional.active_status
			, cms_master_list.category_id         
            ", "
           		cms_clients_additional 
				INNER JOIN cms_master_list ON cms_clients_additional.master_list_id = cms_master_list.id
				INNER JOIN cms_master_category ON cms_master_list.category_id = cms_master_category.id
            ", "cms_clients_additional.client_id = " . $client_id. " and cms_clients_additional.active_status = 1");
        if ( !isset($rs) || count($rs) < 1) 
        {
            return handle_fail_response('No record found');
        }
        return handle_success_response('Success', $rs ? $rs : array());
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function add_edit_tmp_client($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$type_id      		= if_property_exist($params, 'type_id');
		$name       		= if_property_exist($params, 'name');
		$client_id       	= if_property_exist($params, 'client_id');
		$industry   		= if_property_exist($params, 'industry');
		$client_status		= if_property_exist($params, 'client_status');
		$source				= if_property_exist($params, 'source');
		$remarks			= if_property_exist($params, 'remarks');
		$json_field			= if_property_exist($params, 'json_field');
		$emp_id     		= if_property_exist($params, 'emp_id');
		$id         		= if_property_exist($params, 'id');
		
		if (!$name || !$emp_id)
		{
			return handle_fail_response('Missing parameters');
		}

		$is_data_exist     		=   db_query_single('cms_clients.id','cms_clients',"name = '$name' AND FIND_IN_SET(" . $emp_id . ", cms_clients.assign_emp_id)");

		if ($is_data_exist)
		{
			return handle_fail_response('Stake Holder  already assigned in the list');
		}

		if(!$id)
		{
			$is_data_exist_mock   =   db_query_single('cms_clients_mock.id','cms_clients_mock',"name = '$name' AND created_by = $emp_id");

		}
		else
		{
			$is_data_exist_mock   =   db_query_single('cms_clients_mock.id','cms_clients_mock',"name = '$name' AND created_by = $emp_id AND id <> $id");
		}

		if ($is_data_exist_mock)
		{
			return handle_fail_response('Stake Holder  already registered and waiting for approval');
		}
		

		$data = array
		(	
			':type_id'      		=> $type_id,
			':name'      			=> $name,
			':industry'  			=> $industry,
			':client_status'  		=> $client_status,
			':source'  				=> $source,
			':remarks'  			=> $remarks,
			':is_active'  			=> 0,
			':json_field'			=> json_encode($json_field)
		);

		if ($client_id)
		{
			$data[':client_id']  = $client_id;
		}
		
		if ($id)
		{
			$data[':id']  = $id;
			$data           = add_timestamp_to_array($data, $emp_id, 1);
			$result         = db_update($data, 'cms_clients_mock', 'id');
		}
		else
		{
			$data           = add_timestamp_to_array($data, $emp_id, 0);
			$id				= db_add($data, 'cms_clients_mock', 'id');
		}
		
		if($id != '')
		{
			return handle_success_response('Success', $id);
		}
		else
		{
			return handle_fail_response('Failed to add client');
		}
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function assign_client_contacts($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$contacts       	= if_property_exist($params, 'contacts');
		$assign_to   		= if_property_exist($params, 'assign_to');
		$emp_id   			= if_property_exist($params, 'emp_id');

		$client_id   		= if_property_exist($params, 'client_id');
		
		if (!$assign_to || !$contacts)
		{
			return handle_fail_response('Missing parameters');
		}

		for ($i=0; $i < count($contacts); $i++)
		{
			$contact_id 		= $contacts[$i];

			$data = array
			(
				':id'  			=> $contact_id,
				':created_by'   => $assign_to
			);

			$data           = add_timestamp_to_array($data, $emp_id, 1);
			$result         = db_update($data, 'cms_clients_contacts', 'id');
		}

		db_execute_sql("UPDATE cms_clients
							SET assign_emp_id = if(find_in_set($assign_to,assign_emp_id),
								assign_emp_id, 
								CONCAT(assign_emp_id, ',', $assign_to)
								)
							WHERE  id = ".$client_id
							);
		
		if($result != '')
		{
			return handle_success_response('Success', $result);
		}
		else
		{
			return handle_fail_response('Contact assign failed');
		}
		
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function get_contacts_for_approval($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$client_id          = if_property_exist($params, 'client_id');
		$emp_id             = if_property_exist($params, 'emp_id');
		
		$where     = '';
		
		if($client_id === NULL)
		{
			return handle_fail_response('Missing Stake Holder  ID');
		}
		
		if($emp_id)
		{
			$where = " AND cms_clients_contacts.created_by = " . $emp_id;
		}
		
		$result 		   = array();
		$result['details'] = db_query("cms_clients_contacts.id
									  , cms_clients_contacts.name
									  , cms_clients_contacts.email
									  , cms_clients_contacts.mobile
									  , cms_clients_contacts.designation
									  , cms_clients_contacts.send_notifications
									  , cms_employees.name as emp_name
									  , cms_clients_contacts.json_field",
									'cms_clients_contacts
									LEFT JOIN cms_employees on cms_clients_contacts.created_by = cms_employees.id',
									'cms_clients_contacts.client = ' . $client_id . $where,"","","cms_clients_contacts.id","desc");

		$result['employees'] = db_query("cms_employees.id as emp_id
									 , cms_employees.name as emp_name",
									'cms_clients_contacts
									LEFT JOIN cms_employees on cms_clients_contacts.created_by = cms_employees.id',
									'cms_clients_contacts.client = ' . $client_id .' GROUP BY cms_employees.id',"","","cms_employees.name","desc");

		return handle_success_response('Success', $result);
		
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function get_contacts_list($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$client_id          = if_property_exist($params, 'client_id');
		$emp_id             = if_property_exist($params, 'emp_id');
		$view_all       	= if_property_exist($params, 'view_all',0);
		
		$where     = '';
		
		if($client_id === NULL)
		{
			return handle_fail_response('Missing Stake Holder  ID');
		}
		
		if((int)$view_all === 0)
		{
			$where = " AND cms_clients_contacts.created_by = " . $emp_id;
		}
		
		$result = db_query("cms_clients_contacts.id
						  , cms_clients_contacts.name
						  , cms_clients_contacts.email
						  , cms_clients_contacts.password
						  , cms_clients_contacts.mobile
						  , cms_clients_contacts.designation
						  , cms_clients_contacts.send_notifications
						  , cms_employees.id as emp_id
						  , cms_employees.name as emp_name
						  , cms_clients_contacts.json_field
						  ",
						'cms_clients_contacts
						LEFT JOIN cms_employees on cms_clients_contacts.created_by = cms_employees.id',
						'client = ' . $client_id . $where,"","","id","desc");

		if (count($result) > 0) {
            $count = count($result);
            for ($i = 0; $i < $count; $i++) {
                $contact_id = $result[$i]["id"];
                $result[$i]['attachment'] = get_contacts_attachments($params, $contact_id);
            }
        }
		
		if (count($result) < 1 || !isset($result))
		{
			return handle_fail_response('No contact person record found.');
		}

		return handle_success_response('Success', $result);
		
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

//NON API compatible Services
function get_contacts_attachments($params, $contact_id)
{
    try
    {
        log_it(__FUNCTION__, $params);
        
        $client_id          = if_property_exist($params, 'client_id');
		$emp_id             = if_property_exist($params, 'emp_id');
        
        require_once constant('MODULES_DIR') . '/attachments.php';
        $params->primary_id     = $client_id;
        $params->secondary_id   = $contact_id;
        $params->module_id      = 12;
        return json_decode(get_attachment($params))->data->attachment;
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function add_edit_contacts($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$id             		= if_property_exist($params, 'id');
		$name           		= if_property_exist($params, 'name');
		$client         		= if_property_exist($params, 'client');
		$email          		= if_property_exist($params, 'email');
		$password          		= if_property_exist($params, 'password');
		$mobile          		= if_property_exist($params, 'mobile');
		$designation    		= if_property_exist($params, 'designation');
		$send_notifications    	= if_property_exist($params, 'send_notifications');
		$json_field				= if_property_exist($params, 'json_field');
		$emp_id         		= if_property_exist($params, 'emp_id');
		$emp_name         		= if_property_exist($params, 'emp_name');
		
		if (!$name || !$client || !$emp_id)
		{
			return handle_fail_response('Missing parameter(s)');
		}
		
		$data = array
		(
			':name'         		=> $name,
			':client'       		=> $client,
			':email'       			=> $email,
			':mobile'       		=> $mobile,
			':designation'  		=> $designation,
			':send_notifications'  	=> $send_notifications,
			':json_field'			=> json_encode($json_field)
		);

		if($password != "")
        {
            if(!isValidMd5($password))
            {	
            	$data = array_push_assoc($data,":password",md5($password));
            }
            else
            {	
            	$data = array_push_assoc($data,":password",$password);
            }
        }
		if ($id && is_data_exist('cms_clients_contacts', 'id', $id))
		{
			$data[':id']    = $id;
			$data           = add_timestamp_to_array($data, $emp_id, 1);
			$result         = db_update($data, 'cms_clients_contacts', 'id');
		}
		else
		{
			$data           = add_timestamp_to_array($data, $emp_id, 0);
			$result         = db_add($data, 'cms_clients_contacts');
			$params->id		= $result;
		}
		
		if ($result != '')
		{
			$rs	= db_query("cms_employees.office_email,cms_employees.name,cms_master_employer.mail_signature"
					,'cms_employees INNER JOIN
					  cms_master_employer on cms_employees.employer_id = cms_master_employer.id'
					,'cms_employees.super_admin = 1');
			
			
			//fetch email template from table
		    $template_query     =   db_query_single('template_content','cms_master_template',"id = 41");
		    $template   		=   $template_query['template_content'];

			$replace 		= array('{NAME}', '{EMPLOYEE}','{PIC_NAME}','{PIC_EMAIL}','{PIC_PHONE}','{PIC_DESG}','{MAIL_SIGNATURE}','{APP_TITLE}');
			$with 			= array($rs[0]['name'],$emp_name,$name,$email,$mobile,$designation,$rs[0]['mail_signature'],constant('APPLICATION_TITLE'));
			$body			= str_replace($replace, $with, $template);

			smtpmailer
			(
					$rs[0]['office_email'],
					constant('MAIL_USERNAME'),
					constant('MAIL_FROMNAME'),
					"PIC Information Added / Changed",
					$body
					);
			
			return handle_success_response('Success', $params);
		}
		else
		{
			return handle_fail_response('Add/Edit Person in charge Failed');
		}
		
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function update_contact_attachment($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$id   		= if_property_exist($params, 'id');
		$data		= if_property_exist($params, 'data');
		
		if(!isset($id) || $id == '')
		{
			return handle_fail_response('Missing employee ID.');
		}
		if(!isset($data) || $data == '')
		{
			return handle_fail_response('Data is missing');
		}
		
		$operation			= "JSON_ARRAY_INSERT";
		$path				= "'$.attachment[0]'";
		
		$data->created_date = get_current_date();
		
		$value				= json_encode($data);
		$rs					= db_query("IFNULL(JSON_EXTRACT(json_field, '$.attachment'),'0') as key_exist", "cms_appt_pic","id = " . $id);
		if($rs[0]['key_exist'] == '0')
		{
			$operation  = "JSON_INSERT";
			$path		= "'$.attachment'";
			$value		= "[" . json_encode($data) . "]";
		}
		
		$sql  		= "UPDATE cms_appt_pic SET json_field = $operation(json_field,$path,CAST('" . $value . "'  AS JSON)) WHERE id = " . $id;
		$result 	= db_execute_sql($sql);
		
		$return_data= constant('UPLOAD_DIR_URL') . "/clients/" . $data->filename;
		
		return handle_success_response('Success',$return_data);
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function add_edit_client_comm($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$client_id	= if_property_exist($params,'client_id');
		$contact_id	= if_property_exist($params,'contact_id');
		$comm_type	= if_property_exist($params,'comm_type');
		$descr		= if_property_exist($params,'descr');
		$emp_id 	= if_property_exist($params,'emp_id');
		$id			= get_db_UUID();
		
		if($client_id === NULL || $client_id == '')
		{
			return handle_fail_response('Stake Holder  ID is mandatory');
		}

		if($contact_id === NULL || $contact_id == '')
		{
			return handle_fail_response('Contact ID is mandatory');
		}
		
		if($comm_type === NULL || $comm_type == '')
		{
			return handle_fail_response('Medium ID is mandatory');
		}
		
		if($descr === NULL || $descr == '')
		{
			return handle_fail_response('Description is mandatory');
		}
		
		$data = array
		(
			':id'			=> $id,
			':client_id'	=> $client_id,
			':contact_id'	=> $contact_id,
			':comm_type'	=> $comm_type,
			':descr'		=> $descr
		);
		$data 				= add_timestamp_to_array($data,$emp_id,0);
		$result             = db_add($data, 'cms_clients_comm');

		$result 	= db_query_single("cms_clients_comm.id
							,cms_clients_comm.descr
							, concat('" . constant('UPLOAD_DIR_URL') . "', 'photos/',cms_clients_comm.created_by,'/',cms_clients_comm.created_by,'.jpeg') as emp_photo
							,(SELECT name FROM cms_employees WHERE
								cms_employees.id = cms_clients_comm.created_by
							  ) AS name
							, cms_clients_contacts.name as contact_name
							, cms_master_list.descr as comm_type
							, date_format(cms_clients_comm.created_date,'" . constant('DISPLAY_DATETIME_FORMAT') .  "') as created_date
							, cms_clients_comm.created_by AS emp_id
							, cms_clients_comm.json_field
							",
							"cms_clients_comm 
							INNER JOIN cms_clients_contacts ON cms_clients_comm.contact_id = cms_clients_contacts.id
							INNER JOIN cms_master_list ON cms_clients_comm.comm_type = cms_master_list.id", 
				
							"cms_clients_comm.id = '$id'",'','','cms_clients_comm.created_date','desc');

        return handle_success_response('Success', $result);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_communication_attachments($params, $communication_id)
{
    try
    {
        log_it(__FUNCTION__, $params);
        
        $client_id            	= if_property_exist($params, 'client_id');
        $emp_id                 = if_property_exist($params, 'emp_id');
        
        require_once constant('MODULES_DIR') . '/attachments.php';
        $params->primary_id     = $client_id;
        $params->secondary_id   = $communication_id;
        $params->module_id      = 12;
        return json_decode(get_attachment($params))->data->attachment;
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function get_comm_list($params)
{
	try
	{	
		log_it(__FUNCTION__, $params);
		
		$client_id 			= if_property_exist($params, 'client_id');
		$emp_id             = if_property_exist($params, 'emp_id');
		$view_all       	= if_property_exist($params, 'view_all',0);

		$where     			= '';
		$meeting_where 		= '';
		
		if(!isset($client_id) || $client_id == '')
		{
			return handle_fail_response('Missing Stake Holder  ID.');
		}

		if((int)$view_all === 0)
		{
			$where = " AND cms_clients_contacts.created_by = " . $emp_id;
			$meeting_where = " AND cms_appt.created_by = " . $emp_id;
		}
		
		$result 	= db_query("cms_clients_comm.id
							,cms_clients_comm.descr
							, concat('" . constant('UPLOAD_DIR_URL') . "', 'photos/',cms_clients_comm.created_by,'/',cms_clients_comm.created_by,'.jpeg') as emp_photo
							,(SELECT name FROM cms_employees WHERE
								cms_employees.id = cms_clients_comm.created_by
							  ) AS name
							, cms_clients_contacts.name as contact_name
							, cms_master_list.descr as comm_type
							, date_format(cms_clients_comm.created_date,'" . constant('DISPLAY_DATETIME_FORMAT') .  "') as created_date
							, cms_clients_comm.created_by AS emp_id
							, cms_clients_comm.json_field
							",
							"cms_clients_comm
							INNER JOIN cms_clients_contacts ON cms_clients_comm.contact_id = cms_clients_contacts.id
							INNER JOIN cms_master_list ON cms_clients_comm.comm_type = cms_master_list.id", 
							"cms_clients_comm.client_id = $client_id AND cms_clients_comm.is_active = 1 ".$where,'','','cms_clients_comm.created_date','desc');
		
		if (count($result) > 0) 
		{
            $count = count($result);
            for ($i = 0; $i < $count; $i++) 
            {
                $comm_id = $result[$i]["id"];
                $result[$i]['attachment'] = get_communication_attachments($params, $comm_id);
            }
        }
        
		$meetings 	= db_query("cms_appt.id
							,cms_appt.outcome_of_meeting as descr
							, concat('" . constant('UPLOAD_DIR_URL') . "', 'photos/',cms_appt.created_by,'/',cms_appt.created_by,'.jpeg') as emp_photo
							,(SELECT name FROM cms_employees WHERE
								cms_employees.id = cms_appt.created_by
							  ) AS name
							,IFNULL(GROUP_CONCAT(DISTINCT cms_appt_pic.name ORDER BY cms_appt_pic.id),'-') as contact_name
							, IFNULL(cms_master_list.descr,'-') as comm_type
							, date_format(cms_appt.created_date,'" . constant('DISPLAY_DATETIME_FORMAT') .  "') as created_date
							, cms_appt.created_by AS emp_id
							, cms_appt_pic.json_field
							",
							"cms_appt 
							LEFT JOIN cms_appt_pic ON FIND_IN_SET(cms_appt_pic.id, cms_appt.pic) > 0
							LEFT JOIN cms_master_list ON cms_appt.meeting_mode = cms_master_list.id", 
				
							"cms_appt.client = $client_id AND cms_appt.is_active = 1".$meeting_where.' GROUP BY cms_appt.id','','','cms_appt.id','desc');
		
		
		if(!empty($result) && !empty($meetings))
		{
			$final_result = array_merge($result, $meetings);
		}
		elseif(!empty($result))
		{
			$final_result = $result;
		}
		elseif(!empty($meetings))
		{
			$final_result = $meetings;
		}
		else
		{
			$final_result = array();
		}
		
		if(count($final_result) < 1 || !isset($final_result))
		{
			return handle_fail_response('No record found');
		}
		
		return handle_success_response('Success', $final_result);
		
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
	
}

function update_comm_attachment($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$emp_id   	= if_property_exist($params, 'emp_id');
		$comm_id	= if_property_exist($params, 'comm_id');
		$old_file	= if_property_exist($params, 'old_file');
		$new_file	= if_property_exist($params, 'new_file');
		
		if(!isset($emp_id) || $emp_id == '')
		{
			return handle_fail_response('Missing employee ID.');
		}
		if(!isset($comm_id) || $comm_id == '')
		{
			return handle_fail_response('Missing Comm ID.');
		}
		if(!isset($old_file) || $old_file == '')
		{
			return handle_fail_response('Old Filename is missing');
		}
		if(!isset($new_file) || $new_file == '')
		{
			return handle_fail_response('New Filename is missing');
		}
		
		$sql 				= "UPDATE cms_clients_comm SET json_field = IFNULL(JSON_REPLACE(json_field,JSON_UNQUOTE(JSON_SEARCH(json_field, 'one', '%" . $old_file. "%',NULL, '$.attachment'))
					  			,'" . $new_file . "'),json_field)
					   			WHERE id = '" . $comm_id . "'";
		$result 			= db_execute_sql($sql);
		
		return handle_success_response('Success',true);
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function get_client_contacts($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$client_id	= if_property_exist($params, 'client_id');
		$emp_id		= if_property_exist($params, 'emp_id');
		$view_all	= if_property_exist($params, 'view_all', 0);
		
		
		if(!isset($client_id) || $client_id == '')
		{
			return handle_fail_response('Missing Stake Holder  ID.');
		}

		$where = '';
		if((int)$view_all === 0)
		{
			$where .= " AND cms_clients_contacts.created_by = " . $emp_id;
		}
		
		$rs = db_query(	"id,name","cms_clients_contacts","cms_clients_contacts.client = $client_id AND cms_clients_contacts.is_active = 1".$where);
		
		return handle_success_response('Success', $rs ? $rs : array());
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function get_clients_by_type($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$type_id	= if_property_exist($params, 'type_id');
		$emp_id		= if_property_exist($params, 'emp_id');
		$view_all	= if_property_exist($params, 'view_all', 0);
		
		
		if(!isset($type_id) || $type_id == '')
		{
			return handle_fail_response('Missing Type ID.');
		}

		$where = '';
		// if((int)$view_all === 0)
		// {
		// 	$where .= " AND FIND_IN_SET(" . $emp_id . ", cms_clients.assign_emp_id)";
		// }
		
		$rs = db_query(	"id,name","cms_clients","FIND_IN_SET(" . $type_id . ", cms_clients.type_id) AND cms_clients.is_active = 1".$where);
		
		return handle_success_response('Success', $rs ? $rs : array());
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function get_client_report($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$from_date      = if_property_exist($params,'date_from','');
		$to_date        = if_property_exist($params,'date_to','');
		
		$name               = if_property_exist($params,'name','');
		$office_tel   		= if_property_exist($params,'office_tel','');
		$is_active          = if_property_exist($params,'is_active','');
		$source             = if_property_exist($params,'source','');
		$industry           = if_property_exist($params,'industry','');
		$status             = if_property_exist($params,'status','');
		$created_by         = if_property_exist($params,'created_by','');
		
		$where      = "cms_clients.is_active = 1 AND (cms_clients.created_date between '" . $from_date . " 00:00:00' AND '" . $to_date . " 23:59:59' OR cms_clients_comm.created_date between '" . $from_date . " 00:00:00' AND '" . $to_date . " 23:59:59')";
		
		$emp_id         = if_property_exist($params, 'emp_id');
		$view_all       = if_property_exist($params, 'view_all',0);
		
		if($view_all == 1)
		{
			$where  .=  " AND cms_clients.id != ''";
		}
		else
		{
			$where  .=  " AND cms_clients.created_by = $emp_id";
		}
		
		if($name)
		{
			$where      .= ' AND cms_clients.name like "%'.$name.'%"';
		}

		if($office_tel)
		{
			$where      .= " AND JSON_UNQUOTE(cms_clients.json_field->'$.office_tel') = $office_tel";
		}
		
		if($is_active)
		{
			$is_active   = $is_active == 'active' ? 1 : 0;
			$where      .= ' AND employee.is_active = '.$is_active;
		}
		if($source)
		{
			$where      .= ' AND cms_clients.source = '.$source;
		}
		if($industry)
		{
			$where      .= ' AND cms_clients.industry = '.$industry;
		}
		if($status)
		{
			$where      .= " AND JSON_EXTRACT(cms_clients.json_field, '$.client_status') = '".$status."'";
		}
		if($created_by)
		{
			$where      .= ' AND cms_clients.created_by = '.$created_by;
		}
		
		$rs['report'] = db_query
		(
				"cms_clients.id
                , cms_clients.name
                , cms_clients.json_field
                , industry.descr as industry_name
                , source.descr as source_name
                , employee.name as employee_name
                , DATE_FORMAT(cms_clients.created_date, '%d-%m-%Y') as created_date
                , IFNULL(DATE_FORMAT(max(cms_clients_comm.created_date), '%d-%m-%Y'), '') as last_updated
                ,tbl_cs.descr as client_status
                ",
				"cms_clients
                INNER JOIN cms_master_list industry ON cms_clients.industry = industry.id
                INNER JOIN cms_master_list source ON cms_clients.source = source.id
                INNER JOIN cms_employees employee ON cms_clients.created_by = employee.id
                LEFT JOIN cms_clients_comm ON cms_clients_comm.client_id = cms_clients.id
                LEFT JOIN cms_master_list as tbl_cs ON cms_clients.client_status = tbl_cs.id
            "
				,
				$where.' GROUP BY cms_clients.id');
		
		
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

function search($array, $key, $value) 
{ 
    $results = array(); 
      
    // if it is array 
    if (is_array($array)) { 
          
        // if array has required key and value 
        // matched store result  
        if (isset($array[$key]) && $array[$key] == $value) { 
            $results[] = $array; 
        } 
          
        // Iterate for each element in array 
        foreach ($array as $subarray) { 
              
            // recur through each element and append result  
            $results = array_merge($results,  
                    search($subarray, $key, $value)); 
        } 
    } 
  
    return $results; 
} 

function get_client_drop_down_values($params)
{
	try
	{	
		$view_all       = if_property_exist($params, 'view_all',0);
		$emp_id       	= if_property_exist($params, 'emp_id',0);

		$field_id_array     =   array(  'industry'  	=>  22
									   ,'source'    	=>  27
									   ,'status'    	=>  51
									   ,'medium'    	=>  52
									   ,'offerings'    	=>  57
									   ,'contact_status'=>  56
									   ,'type'			=>  59
									   ,'lead_additional'=>  60
									   , 'bank'         =>  65
								);
		
		$drop_down_fields   = db_query("id, descr, category_id",
				"cms_master_list",
				"category_id in ('" . implode("','", $field_id_array) . "') AND is_active = 1"
				);
		$drop_down_groups   = array();
		for ($i=0; $i < count($drop_down_fields); $i++)
		{
			$category_id        = $drop_down_fields[$i]['category_id'];
			$category_label     = array_search($category_id, $field_id_array);
			
			if(!array_key_exists($category_label,$drop_down_groups))
			{
				$drop_down_groups[$category_label] = array();
			}
			
			array_push($drop_down_groups[$category_label], $drop_down_fields[$i]);
		}

		//create assign to employees records
		$assign_to   = db_query('cms_employees.id
								,cms_employees.name as descr
								,IFNULL(JSON_UNQUOTE(JSON_EXTRACT(cms_employees.json_field,"$.access")),"") as access'
								,'cms_employees'
								,'cms_employees.is_active = 1');
		
		$assign_to_employees = array();
		if( $assign_to){
			for ($i=0; $i < count($assign_to); $i++)
		{
			if($assign_to[$i]['access'] != '')
			{	
				$access 		= json_decode($assign_to[$i]['access']);
				$access_array 	= array();
				for ($j=0; $j < count($access); $j++)
				{	
					$access_record = (array) $access[$j];
					
					if(!isset($access_record['module_id']))
					{
						echo '<pre>';print_r($access);
					}

					$access_array[$access_record['module_id']] = $access_record;
				}
				
				if(array_key_exists('152', $access_array) && isset($access_array['152']['view']) && $access_array['152']['view'] == 1)
				{
					array_push($assign_to_employees, $assign_to[$i]);
				}
			}
		}
		}
		
		$drop_down_groups['assign_to'] = $assign_to_employees;

		if($view_all == 1)
		{
			$drop_down_groups['account_managers']	= db_query('id,name as descr','cms_employees','is_active = 1');
		}
		else
		{
			$drop_down_groups['account_managers']    = db_query('id,name as descr','cms_employees',"cms_employees.id = ".$emp_id." AND is_active = 1");
		}
		//$drop_down_groups = empty($drop_down_groups) ? array() : $drop_down_groups;
		echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$drop_down_groups ) );exit;
		//return handle_success_response('Success',$drop_down_groups);
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function get_client_report_drop_down_values()
{
	try
	{
		$field_id_array     =   array(  'industry'  =>  22
				, 'source'    =>  27
				, 'status'    =>  51
		);
		
		$drop_down_fields   = db_query("id, descr, category_id",
				"cms_master_list",
				"category_id in ('" . implode("','", $field_id_array) . "') AND is_active = 1"
				);
		$drop_down_groups   = array();
		for ($i=0; $i < count($drop_down_fields); $i++)
		{
			$category_id        = $drop_down_fields[$i]['category_id'];
			$category_label     = array_search($category_id, $field_id_array);
			
			if(!array_key_exists($category_label,$drop_down_groups))
			{
				$drop_down_groups[$category_label] = array();
			}
			
			array_push($drop_down_groups[$category_label], $drop_down_fields[$i]);
		}
		
		$drop_down_groups['employees']  =   db_query
		(
				" cms_employees.id as id
                                                , cms_employees.name as descr
                                                ",
				"cms_employees"
				);
		
		return handle_success_response('Success',$drop_down_groups);
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function populate_created_by($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$from_date      = if_property_exist($params,'date_from','');
		$to_date        = if_property_exist($params,'date_to','');
		
		$name               = if_property_exist($params,'name','');
		$services_offered   = if_property_exist($params,'services_offered','');
		$is_active          = if_property_exist($params,'is_active','');
		$source             = if_property_exist($params,'source','');
		$industry           = if_property_exist($params,'industry','');
		$status             = if_property_exist($params,'status','');
		
		$where      = "(cms_clients.created_date between '" . $from_date . " 00:00:00' AND '" . $to_date . " 23:59:59' OR cms_clients_comm.created_date between '" . $from_date . " 00:00:00' AND '" . $to_date . " 23:59:59')";
		
		$emp_id         = if_property_exist($params, 'emp_id');
		$view_all       = if_property_exist($params, 'view_all',0);
		
		if($view_all == 1)
		{
			$where  .=  " AND cms_clients.id != ''";
		}
		else
		{
			$where  .=  " AND cms_clients.created_by = $emp_id";
		}
		
		if($name)
		{
			$where      .= ' AND cms_clients.name like "%'.$name.'%"';
		}
		if($services_offered)
		{
			$where      .= ' AND cms_clients.services_offered like "%'.$services_offered.'%"';
		}
		if($is_active)
		{
			$is_active   = $is_active == 'active' ? 1 : 0;
			$where      .= ' AND employee.is_active = '.$is_active;
		}
		if($source)
		{
			$where      .= ' AND cms_clients.source = '.$source;
		}
		if($industry)
		{
			$where      .= ' AND cms_clients.industry = '.$industry;
		}
		if($status)
		{
			$where      .= " AND JSON_EXTRACT(cms_clients.json_field, '$.client_status') = '".$status."'";
		}
		
		$rs['created_by_filter'] = db_query
		(
				"employee.id
                                    ,   employee.name as employee_name
                                        ",
				"cms_clients
                                            INNER JOIN cms_master_list industry ON cms_clients.industry = industry.id
                                            INNER JOIN cms_master_list source ON cms_clients.source = source.id
                                            INNER JOIN cms_employees employee ON cms_clients.created_by = employee.id
                                            LEFT JOIN cms_master_list tbl_cs ON JSON_UNQUOTE(cms_clients.json_field->'$.client_status') = tbl_cs.id
                                            LEFT JOIN cms_clients_comm ON cms_clients_comm.client_id = cms_clients.id
                                        "
				,
				$where.' GROUP BY employee.id');
		// echo '<pre>';print_r($where);exit;
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

function deactivate_clients($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$id  		= if_property_exist($params,'id');
		$emp_id		= if_property_exist($params, 'emp_id');
		
		if($id === NULL || $id == '')
		{
			return handle_fail_response('ID is mandatory');
		}
		
		$data = array
		(
			':id'	  		=> $id,
			':is_active'  	=> 0,
		);
		
		$data 		= add_timestamp_to_array($data,$emp_id, 1);
		$result 	= db_update($data, 'cms_clients','id');
		
		return handle_success_response('Success', true);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function approve_client_details($params)
{
    try
    {	
    	log_it(__FUNCTION__, $params);

        $id         = if_property_exist($params,'id');
        $emp_id     = if_property_exist($params, 'emp_id');

        $emp_name   = if_property_exist($params, 'emp_name');
        $emp_email  = if_property_exist($params, 'emp_email');
        
        if($id === NULL || $id == '')
        {
            return handle_fail_response('ID is mandatory');
        }

        $tmp_client 	= 	db_query_single("cms_clients_mock.*
											,cms_employees.name as emp_name
											,cms_employees.email as emp_email",
											"cms_clients_mock
											LEFT JOIN cms_employees ON cms_employees.id = cms_clients_mock.created_by", 
											"cms_clients_mock.id = $id"
										   );
        
        if($tmp_client['client_id'] == '' || $tmp_client['client_id'] == 0)
        {
        	$data = array
			(
				':type_id'	  	=> $tmp_client['type_id'],
				':name'	  		=> $tmp_client['name'],
				':industry'  	=> $tmp_client['industry'],
				':remarks'  	=> $tmp_client['remarks'],
				':source'  		=> $tmp_client['source'],
				':client_status'=> $tmp_client['client_status'],
				':json_field'  	=> $tmp_client['json_field'],
				':assign_emp_id'=> $tmp_client['created_by']
			);

			$data           	= add_timestamp_to_array($data, $emp_id, 0);
			$result				= db_add($data, 'cms_clients', 'id');
        }
        else
        {	
        	$client_id 			= $tmp_client['client_id'];
        	$assign_emp_id 		= $tmp_client['created_by'];

        	$type_id 			= $tmp_client['type_id']; 

			$result = db_execute_sql("UPDATE cms_clients
										SET assign_emp_id = if(find_in_set($assign_emp_id,assign_emp_id),
								            assign_emp_id, 
								            CONCAT(assign_emp_id, ',', $assign_emp_id)
								          ),
								          type_id = if(find_in_set($type_id,type_id),
								            type_id, 
								            CONCAT(type_id, ',', $type_id)
								          )
										WHERE  id = ".$client_id
										);
		}

		if ($result)
		{
			//delete the client details from temp table
			db_execute_sql('DELETE FROM cms_clients_mock WHERE id='.$id);

			email_client_activation($tmp_client);
			
			return handle_success_response('Success', $result);
		}
         
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function email_client_activation($tmp_client)
{
	try
    {
    	$template_query     =   db_query_single('template_content','cms_master_template',"id = 42");
	    $template   		=   $template_query['template_content'];

	    $subject			=	'Client Approval Notification';
	    $approved_date 		= 	format_date(get_current_date());

		$replace 			= array('{NAME}','{SUBJECT}','{CLIENT_NAME}','{APPROVED_DATE}','{MAIL_SIGNATURE}','{APP_TITLE}');
		$with 				= array($tmp_client['emp_name'],$subject,$tmp_client['name'],$approved_date,constant('MAIL_SIGNATURE'),constant('APPLICATION_TITLE'));

		$body				= str_replace($replace, $with, $template);
		
		smtpmailer
		(
				$tmp_client['emp_email'],
				constant('MAIL_USERNAME'),
				constant('MAIL_FROMNAME'),
				$subject,
				$body
		);
	}
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function get_clients_for_auto_suggest()
{
    try
    {
        $result = db_query("cms_clients.id as data
						  , cms_clients.name as value
						  , cms_clients.industry
						  , cms_clients.remarks
						  , cms_clients.source
						  , cms_clients.client_status
						  , IFNULL(JSON_UNQUOTE(cms_clients.json_field->'$.address'),'') as address
						  , IFNULL(JSON_UNQUOTE(cms_clients.json_field->'$.website'),'') as website
						  , IFNULL(JSON_UNQUOTE(cms_clients.json_field->'$.office_tel'),'') as office_tel"
						  , "cms_clients"
						  , "cms_clients.is_active = 1"
						  );

		return handle_success_response('Success', $result); 
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function deactivate_clients_tmp($params)
{
	try
	{	
		log_it(__FUNCTION__, $params);
		
		$id  		= if_property_exist($params,'id');
		$emp_id		= if_property_exist($params, 'emp_id');

		
		$emp_name   = if_property_exist($params, 'emp_name');
        $emp_email  = if_property_exist($params, 'emp_email');
		
		if($id === NULL || $id == '')
		{
			return handle_fail_response('ID is mandatory');
		}
		
		$tmp_client 	= 	db_query_single("cms_clients_mock.*
											,cms_employees.name as emp_name
											,cms_employees.email as emp_email",
											"cms_clients_mock
											LEFT JOIN cms_employees ON cms_employees.id = cms_clients_mock.created_by", 
											"cms_clients_mock.id = $id"
										   );

		db_execute_sql('DELETE FROM cms_clients_mock WHERE id='.$id);
		
		email_client_deactivation($params, $tmp_client);

		return handle_success_response('Success', true);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function email_client_deactivation($params, $tmp_client)
{	
	try
	{
		$reason   			= if_property_exist($params, 'reason');
		$template_query     =   db_query_single('template_content','cms_master_template',"id = 43");
	    $template   		=   $template_query['template_content'];

	    $subject			=	'Client Rejection Notification';
	    $rejected_date 		= 	format_date(get_current_date());

		$replace 			= array('{NAME}','{SUBJECT}','{CLIENT_NAME}','{REASON}','{REJECTED_DATE}','{MAIL_SIGNATURE}','{APP_TITLE}');
		$with 				= array($tmp_client['emp_name'],$subject,$tmp_client['name'],$reason,$rejected_date,constant('MAIL_SIGNATURE'),constant('APPLICATION_TITLE'));

		$body				= str_replace($replace, $with, $template);
		
		smtpmailer
		(
				$tmp_client['emp_email'],
				constant('MAIL_USERNAME'),
				constant('MAIL_FROMNAME'),
				$subject,
				$body
		);

	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_documents_list_for_client($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$client_id  = if_property_exist($params,'client_id');
		$view_all   = if_property_exist($params, 'view_all',0);
		$emp_id		= if_property_exist($params, 'emp_id');
		
		$where     = '';
		
		if((int)$view_all === 0)
		{
			$where = " AND cms_clients_contacts.created_by = " . $emp_id;
		}

		$result = db_query(" cms_user_documents.doc_no
						   , cms_user_documents.created_date
						   , tbl_category.descr as category
						   , tbl_contacts.name as contact_name
						   , cms_user_documents.is_to_verify
                           , cms_user_documents.is_archived
						   , (select count(*) from cms_user_documents_approvals total_approvers where total_approvers.doc_no = cms_user_documents.doc_no) as total_approvers_count
                		   , (select count(*) from cms_user_documents_approvals total_approvals where total_approvals.doc_no = cms_user_documents.doc_no and total_approvals.is_verified = 1) as total_approvals_count",
							"cms_user_documents
							INNER JOIN cms_clients_contacts ON cms_user_documents.attention_to = cms_clients_contacts.id
							LEFT JOIN cms_master_list tbl_category on tbl_category.id = cms_user_documents.ctg_id
							LEFT JOIN cms_clients_contacts tbl_contacts on tbl_contacts.id = cms_user_documents.attention_to",
							"cms_user_documents.client_id = $client_id". $where." GROUP BY cms_user_documents.doc_no");

		
		if (count($result) > 0) {
            $count = count($result);
            for ($i = 0; $i < $count; $i++) {
                $doc_no = $result[$i]["doc_no"];
                $result[$i]['attachment'] = get_outbound_attachments($doc_no);
            }
        }

		return handle_success_response('Success', $result);
		
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_outbound_attachments($doc_no)
{
    try
    {
        $params = new stdClass();
        
        require_once constant('MODULES_DIR') . '/attachments.php';
        $params->primary_id     = $doc_no;
        $params->module_id      = 114;
        return json_decode(get_attachment($params))->data->attachment;
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function assign_principal_account($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		

		$client_id       	= if_property_exist($params, 'client_id');
		$offering_id   		= if_property_exist($params, 'offering_id');
		$manager_id   		= if_property_exist($params, 'manager_id');
		$principal_acc_id  	= if_property_exist($params, 'principal_acc_id');
		$emp_id   			= if_property_exist($params, 'emp_id');

		$is_data_exist   	=   db_query_single
								(
									"cms_clients_principal.id",
									"cms_clients_principal",
									"is_active = 1 AND client_id = $client_id AND 
									 offering_id = $offering_id AND
									 manager_id = $manager_id AND
									 principal_acc_id = $principal_acc_id"
							 	);

		if ($is_data_exist)
    	{
   			return handle_fail_response('Account already assigned for the offering');
   		}
		
		$data = array
		(
			':id'  					=> get_db_UUID(),
			':client_id'   			=> $client_id,
			':offering_id'   		=> $offering_id,
			':manager_id'   		=> $manager_id,
			':principal_acc_id'   	=> $principal_acc_id,
			':is_active'   			=> 1
		);

		$data           = add_timestamp_to_array($data, $emp_id, 0);
		$result         = db_add($data, 'cms_clients_principal', 'id');
		
		if($result != '')
		{
			return handle_success_response('Success', $result);
		}
		else
		{
			return handle_fail_response('Principal a/c assign failed');
		}
		
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function get_principal_accounts($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$client_id   	= if_property_exist($params, 'client_id');
		$where 			= "cms_clients_principal.is_active = 1 AND  cms_clients_principal.client_id = $client_id";

		$rs = db_query
		(
			"cms_clients_principal.id
			,tbl_off.descr as offering 
			,tbl_emp.name as acc_manager 
			,CONCAT(cms_clients.name, ' - ', cms_clients_contacts.name) as principal_acc 
			",
			"cms_clients_principal
			LEFT JOIN cms_master_list as tbl_off ON tbl_off.id = cms_clients_principal.offering_id
			LEFT JOIN cms_employees as tbl_emp ON tbl_emp.id = cms_clients_principal.manager_id
			LEFT JOIN cms_clients_contacts ON cms_clients_contacts.id = cms_clients_principal.principal_acc_id
			LEFT JOIN cms_clients ON cms_clients.id = cms_clients_contacts.client",
			$where
		);
		
		return handle_success_response('Success', $rs);
		
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function delete_principal_account($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

        $id    		= if_property_exist($params,'id');
        $emp_id 	= if_property_exist($params, 'emp_id');

        $data = array
        (
            ':id'  			=> $id,
            ':is_active'    => 0
        );

        if(is_data_exist('cms_clients_principal', 'id', $id))
        {
            $data[':id']   	= $id;
            $data           = add_timestamp_to_array($data,$emp_id,1);
            $result         = db_update($data, 'cms_clients_principal', 'id');
        }

        $return_data = array('id'   => $id);

        return handle_success_response('Success', $return_data);
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function get_offerings_by_contacts($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$contact_id   	= if_property_exist($params, 'contact_id');
		$where 			= "cms_clients_contacts.is_active = 1 AND  cms_clients_contacts.id = $contact_id";

		$rs = db_query
		(
			"tbl_offering.id
			,tbl_offering.descr",
			"cms_clients_contacts
			LEFT JOIN cms_master_list tbl_offering on FIND_IN_SET(tbl_offering.id, JSON_UNQUOTE(JSON_EXTRACT(cms_clients_contacts.json_field, '$.offerings')))",
			$where
		);
		
		return handle_success_response('Success', $rs);
		
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

function validate_contact_email($params)
{
    try
    {
        
        log_it(__FUNCTION__, $params);

        $email_id          = if_property_exist($params,'email_id');

        $count             = db_query_single('count(id) as count ', 'cms_clients_contacts', "cms_clients_contacts.email = '".$email_id."'");

        if($count['count'] > 0)
        {
            return handle_fail_response('Email ID already exists');
        }
        else
        {   
            return handle_success_response('Success', $count['count']);
        }
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function get_stake_holders_excel($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		
		include_once(LIB_DIR . '/phpexcel/PHPExcel.php');
		
		$filename		= if_property_exist($params, 'filename','');
		$emp_id			= if_property_exist($params, 'emp_id','');
		$data			= [];
		
		if($filename === NULL || $filename == '')
		{
			return handle_fail_response('filename is mandatory');
		}
		if($emp_id === NULL || $emp_id == '')
		{
			return handle_fail_response('employee ID is mandatory');
		}
		
		
		$objPHPExcel 	= PHPExcel_IOFactory::load(constant('FILES_DIR') . "/temp/" . $filename);
		$sheet 			= $objPHPExcel->getSheet(1);
		$total_so_rows 	= $sheet->getHighestRow();
		
		
		for($i = 2; $i <= $total_so_rows; $i++)
		{	
			$status = true;
			$row = $sheet->rangeToArray('A' . $i . ':K' . $i, NULL, TRUE, FALSE);
			
			$data[($i - 2)]['type_id']       = get_client_field_id(
													"cms_master_list"
													,"descr",$row[0][0]
													, 'and category_id = 59'
												);

			$data[($i - 2)]['type']			= trim(str_replace("'", "''", $row[0][0]));


			$client_name = '';
			if($row[0][1] != '')
			{
				$client_name = format_string($row[0][1]);
			}
			elseif($row[0][2] != '')
			{
				$client_name = format_string($row[0][2]);
			}

			$office_tel = $row[0][4];
			

			$client_id = get_client_field_id("cms_clients","name",$client_name, 'and is_active = 1');
			
			if($client_id)
			{
				$data[($i - 2)]['client_id'] = $client_id;
				$data[($i - 2)]['name']	     = $client_name;

				$data[($i - 2)]['address']			= '';
				$data[($i - 2)]['office_tel']		= '';
				$data[($i - 2)]['website']			= '';

				
				$data[($i - 2)]['industry_id']      = 0;
				$data[($i - 2)]['source_id']        = 0;
				$data[($i - 2)]['client_status_id'] = 0;
				$data[($i - 2)]['offering_id']      = 0;

				$data[($i - 2)]['industry']			= '';
				$data[($i - 2)]['source']			= '';
				$data[($i - 2)]['client_status']	= '';
				$data[($i - 2)]['offering']			= '';

				$data[($i - 2)]['remarks']			= '';
 			}
			else
			{	
				if($client_name == '')
				{
					$status = false;
				}
				if(!is_numeric($office_tel))
				{
					$status = false;
				}
				$data[($i - 2)]['client_id'] = 0;
				$data[($i - 2)]['name']	     = $client_name;

				$data[($i - 2)]['address']			= urlencode(format_string($row[0][3]));
				$data[($i - 2)]['office_tel']		= format_string($row[0][4]);
				$data[($i - 2)]['website']			= urlencode(format_string($row[0][5]));

				
				$data[($i - 2)]['industry_id']      = get_client_field_id(
														"cms_master_list"
														,"descr",$row[0][6]
														, 'and category_id = 22'
													);
				$data[($i - 2)]['source_id']        = get_client_field_id(
														"cms_master_list"
														,"descr",$row[0][7]
														, 'and category_id = 27'
													);
				$data[($i - 2)]['client_status_id'] = get_client_field_id(
														"cms_master_list"
														,"descr",$row[0][8]
														, 'and category_id = 51'
													);
				$data[($i - 2)]['offering_id']      = get_client_field_id(
														"cms_master_list"
														,"descr",$row[0][9]
														, 'and category_id = 57'
													);

				$data[($i - 2)]['industry']			= format_string($row[0][6]);
				$data[($i - 2)]['source']			= format_string($row[0][7]);
				$data[($i - 2)]['client_status']	= format_string($row[0][8]);
				$data[($i - 2)]['offering']			= format_string($row[0][9]);

				$data[($i - 2)]['remarks']			= format_string($row[0][10]);
			}

			$data[($i - 2)]['status']			= $status;								
		}
	
		return handle_success_response('Success', $data);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function format_string($string)
{
	return trim(str_replace("'", "''", $string));
}

function add_stake_holders_excel($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$s_data		= if_property_exist($params, 'scheduled_data','');
		$emp_id		= if_property_exist($params, 'emp_id','');
		
		if($s_data === NULL || $s_data == '')
		{
			return handle_fail_response('Data is mandatory');
		}
		if($emp_id === NULL || $emp_id == '')
		{
			return handle_fail_response('Employee ID is mandatory');
		}
		
		$count 	= count($s_data);
		
		for($i = 0; $i < (int)$count; $i++)
		{
			if($s_data[$i]->status == true)
			{	
				$json_field  = array('address'		=>$s_data[$i]->address
								   , 'office_tel'	=>$s_data[$i]->office_tel
								   , 'offering'		=>$s_data[$i]->offering_id
								   , 'website'		=>$s_data[$i]->website
									);

				$data = array
				(
					':type_id'			=> 	$s_data[$i]->type_id,
					':client_id'		=> 	$s_data[$i]->client_id,
					':name'				=> 	$s_data[$i]->name,
					':industry'			=> 	$s_data[$i]->industry_id,
					':client_status'	=> 	$s_data[$i]->client_status_id,
					':source'			=> 	$s_data[$i]->source_id,
					':remarks'			=> 	$s_data[$i]->remarks,
					':is_active'  		=>  0,
					':json_field'		=> 	json_encode($json_field)
				);
				
				$data 					= add_timestamp_to_array($data,$emp_id,0);
				$id                		= db_add($data, 'cms_clients_mock');
				
			}
		}

		return handle_success_response('Success', true);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_client_field_id($table_name, $search_field, $search_val, $additonal_search = '') 
{
    try 
    {	
    	$search_val = format_string($search_val);
        log_it(__FUNCTION__, $table_name . ' ' . $search_field . ' ' . $search_val);
        $id = '';
        $rs = db_execute_custom_sql("SELECT id FROM $table_name WHERE $search_field like '%" . stripcslashes($search_val) . "%' $additonal_search");
        if (count($rs) > 0) 
        {
            $id = $rs[0]['id'];
        }
        return $id;
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function update_stake_holders_multiple($params)
{
    try
    {	
    	log_it(__FUNCTION__, $params);

        $selected_records = if_property_exist($params,'selected_records');
        $emp_id     	  = if_property_exist($params, 'emp_id');
        $status     	  = if_property_exist($params, 'status');

        $sl_array   = array();
        parse_str($selected_records, $sl_array);
        $selected_array   =  $sl_array['chk_approve_reject'];
        $selected_values  = implode(',', $selected_array);

        $tmp_clients 	  =  db_query("cms_clients_mock.*
											,cms_employees.name as emp_name
											,cms_employees.email as emp_email",
											"cms_clients_mock
											LEFT JOIN cms_employees ON cms_employees.id = cms_clients_mock.created_by", 
											"cms_clients_mock.id IN ($selected_values)"
										   );

        foreach ($tmp_clients as $tmp_client) 
        {	
        	$id = $tmp_client['id'];
        	if($status == 'approve')
        	{
        		if($tmp_client['client_id'] == '' || $tmp_client['client_id'] == 0)
		        {
		        	$data = array
					(
						':type_id'	  	=> $tmp_client['type_id'],
						':name'	  		=> $tmp_client['name'],
						':industry'  	=> $tmp_client['industry'],
						':remarks'  	=> $tmp_client['remarks'],
						':source'  		=> $tmp_client['source'],
						':client_status'=> $tmp_client['client_status'],
						':json_field'  	=> $tmp_client['json_field'],
						':assign_emp_id'=> $tmp_client['created_by']
					);

					$data           	= add_timestamp_to_array($data, $emp_id, 0);
					$result				= db_add($data, 'cms_clients', 'id');
		        }
		        else
		        {	
		        	$client_id 			= $tmp_client['client_id'];
		        	$assign_emp_id 		= $tmp_client['created_by'];

		        	$type_id 			= $tmp_client['type_id']; 

					$result = db_execute_sql("UPDATE cms_clients
												SET assign_emp_id = if(find_in_set($assign_emp_id,assign_emp_id),
										            assign_emp_id, 
										            CONCAT(assign_emp_id, ',', $assign_emp_id)
										          ),
										          type_id = if(find_in_set($type_id,type_id),
										            type_id, 
										            CONCAT(type_id, ',', $type_id)
										          )
												WHERE  id = ".$client_id
												);
				}
        	}
        	else
        	{
        		$result = true;
        	}
			
			if ($result)
			{
				//delete the client details from temp table
				db_execute_sql('DELETE FROM cms_clients_mock WHERE id='.$id);
			}
        }
        
		return handle_success_response('Success');
         
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function format_date($date) 
{
    try 
    {
        if (is_valid_date($date)) 
        {
            $date = new DateTime($date);
            return $date->format('j F Y');
        } else 
        {
            return NULL;
        }
    }
    catch(Exception $e) 
    {
        handle_exception($e);
    }
}
?>
