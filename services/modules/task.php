<?php 

function get_tasks_list_group($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$title			= if_property_exist($params, 'title','');
		$status      	= if_property_exist($params, 'status','');
		$assign_to		= if_property_exist($params, 'assign_to','');
		$dept_id		= if_property_exist($params, 'dept_id','');
		$group			= if_property_exist($params, 'group','');
		$company		= if_property_exist($params, 'company','');
		$created_by     = if_property_exist($params, 'created_by','');
		$view_all       = if_property_exist($params, 'view_all',0);
		
		$is_admin       = if_property_exist($params, 'is_admin','');
		$emp_id	        = if_property_exist($params, 'emp_id','');
		
		$close_bracket	= ")";
		
		
		if($view_all == 1)
		{
			$where		= "1 = 1";
			$where_or	= "";
            $close_bracket	= "";
		}
		else
		{
            $where = "(" . $emp_id . " IN(cms_tasks_new.created_by,cms_tasks_new.reviewer_id,cms_tasks_new.approver_id)";
            $where_or = " OR (cms_tasks_new_assignees.is_active = 1 and FIND_IN_SET(" . $emp_id . ", cms_tasks_new_assignees.user_id)";
            $close_bracket = ")";
		}
        
		if($title != "")
		{
			$where 	.= " AND cms_tasks_new.task_title like '%" . $title . "%'";
			$where_or .= " AND cms_tasks_new.task_title like '%" . $title . "%'";
		}
		
		if($created_by != "")
		{
			$where 	.= " AND cms_tasks_new.created_by in(" . $created_by . ")";
			$where_or .= " AND cms_tasks_new.created_by in(" . $created_by . ")";
		}
		
		if($dept_id != "")
		{
			$where 	.= " AND cms_tasks_new.dept_id in(" . $dept_id . ")";
			$where_or .= " AND cms_tasks_new.dept_id in(" . $dept_id . ")";
		}
		
		if($status != "")
		{
			$where 	.= " AND cms_tasks_new.status_id in(" . $status . ")";
			$where_or .= " AND cms_tasks_new.status_id in(" . $status . ")";
		}
		
		if($assign_to != "")
		{
            // $where.= " AND cms_tasks_new_assignees.is_active = 1 AND cms_tasks_new_assignees.user_id in(" . $assign_to . ")";
            // $where_or.= " AND cms_tasks_new_assignees.is_active = 1 AND cms_tasks_new_assignees.user_id in(" . $assign_to . ")";
		}
		
		if($group != "")
		{
			if($group == 'NOT SCHEDULED')
			{
				$where 		.= " AND (cms_tasks_new.master_task_no IS NULL OR cms_master_tasks.schedule_type = '')";
				$where_or	.= " AND (cms_tasks_new.master_task_no IS NULL OR cms_master_tasks.schedule_type = '')";
			}
			else
			{
				$where 		.= " AND cms_tasks_new.master_task_no IN (SELECT task_no FROM cms_master_tasks WHERE schedule_type = '$group')";
				$where_or	.= " AND cms_tasks_new.master_task_no IN (SELECT task_no FROM cms_master_tasks WHERE schedule_type = '$group')";
			}
		}
		
		if($company != "")
		{
			$where 		.= " AND cms_tasks_new.company_id in($company)";
			$where_or 	.= " AND cms_tasks_new.company_id in($company)";
		}
		
		$where_due_today =  $where.$close_bracket;
		$where_due_today 	.= " and cms_tasks_new.due_date = '".date("Y-m-d")."' and cms_tasks_new.status_id != 252 ";
		
		$where_overDue =  $where.$close_bracket;
		$where_overDue 	.= " and cms_tasks_new.due_date < '".date("Y-m-d")."' and cms_tasks_new.status_id != 252 ";
		
		$where 	.=  $close_bracket . $where_or . $close_bracket . " AND JSON_EXTRACT(cms_tasks_new.json_field, '$.sent_for_review') IS NULL AND cms_tasks_new.is_active in (1) group by s_type";
		$rs = db_query
		(
			"DISTINCT IF(IFNULL(cms_master_tasks.schedule_type, '') = '', 'NOT SCHEDULED', 
            cms_master_tasks.schedule_type) AS s_type, 
            COUNT(DISTINCT(cms_tasks_new.task_no)) as task_count",
			"cms_tasks_new 
            LEFT JOIN cms_master_tasks ON
			cms_tasks_new.master_task_no = cms_master_tasks.task_no
            LEFT JOIN cms_tasks_new_assignees ON cms_tasks_new.task_no = cms_tasks_new_assignees.task_no",
			$where
		);
		
		$rs_due_today = db_query
		(
			"COUNT(DISTINCT(cms_tasks_new.task_no)) as task_count_due_today",
			"cms_tasks_new 
            LEFT JOIN cms_master_tasks ON
			cms_tasks_new.master_task_no = cms_master_tasks.task_no
            LEFT JOIN cms_tasks_new_assignees ON cms_tasks_new.task_no = cms_tasks_new_assignees.task_no",
			$where_due_today
		);
		
		$rs_overDue = db_query
		(
			"COUNT(DISTINCT(cms_tasks_new.task_no)) as task_count_overDue",
			"cms_tasks_new 
            LEFT JOIN cms_master_tasks ON
			cms_tasks_new.master_task_no = cms_master_tasks.task_no
            LEFT JOIN cms_tasks_new_assignees ON cms_tasks_new.task_no = cms_tasks_new_assignees.task_no",
			$where_overDue
		);

        // $where_client_task = $where.$close_bracket;
        $where_client_task = "cms_clients.assign_emp_id IN ($emp_id)";
        $where_client_task .= " AND cms_clients.is_active = 1";
        $where_client_task .= " AND cms_tasks_new.is_active = 1";

        //get client tasks
        $rs_clientTask = db_query(
            "COUNT(DISTINCT(cms_tasks_new.task_no)) as client_tasks",
            "cms_tasks_new
            JOIN cms_clients ON cms_tasks_new.client_id = cms_clients.id",
            $where_client_task
        );

		$todaysCount = isset($rs_due_today[0]['task_count_due_today'] ) ? $rs_due_today[0]['task_count_due_today'] : 0;
		$overDueCount = isset($rs_overDue[0]['task_count_overDue'] ) ? $rs_overDue[0]['task_count_overDue'] : 0;

        $clientTaskCount = isset($rs_clientTask[0]['client_tasks'] ) ? $rs_clientTask[0]['client_tasks'] : 0;
		 
        if (count((array)$rs) < 1 || !isset($rs)) 
        {
            echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>true, "todaysCount"=>$todaysCount, "overDueCount"=>$overDueCount, "clientTaskCount" => $clientTaskCount ) );exit;
        } 
        else 
        {
			echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs, "todaysCount"=>$todaysCount, "overDueCount"=>$overDueCount, "clientTaskCount" => $clientTaskCount ) );exit;
            //return handle_success_response('Success', $rs);
        }
		
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}
function get_tasks_template_list_new($params) {
    try {
        log_it(__FUNCTION__, $params);
        $task_no = if_property_exist($params, 'id', '');
        $title = if_property_exist($params, 'title', '');
        $status = if_property_exist($params, 'status', '');
        $assign_to = if_property_exist($params, 'assign_to', '');
        $dept_id = if_property_exist($params, 'dept_id', '');
        $group = if_property_exist($params, 'group', '');
        $company = if_property_exist($params, 'company', '');
        $created_by = if_property_exist($params, 'created_by', '');
        $start_index = if_property_exist($params, 'start_index', 0);
        $limit = if_property_exist($params, 'limit', MAX_NO_OF_RECORDS);
        $view_all = if_property_exist($params, 'view_all', 0);
        $is_admin = if_property_exist($params, 'is_admin', '');
        $emp_id = if_property_exist($params, 'emp_id', '');
        $close_bracket = "";
        if ($view_all == 1) {
            $where = "1 = 1";
            $where_or = "";
        } else {
            $where = "(" . $emp_id . " IN(cms_master_tasks_template.created_by,cms_master_tasks_template.reviewer_id,cms_master_tasks_template.approver_id) ";
            $where_or = " OR (cms_tasks_template_new_assignees.is_active = 1 and FIND_IN_SET(" . $emp_id . ", cms_tasks_template_new_assignees.user_id)";
            $close_bracket = ")";
        }
        
        if ($title != "") {
            $where.= " AND cms_master_tasks_template.task_title like '%" . $title . "%'";
            $where_or.= " AND cms_master_tasks_template.task_title like '%" . $title . "%'";
        }
        if ($created_by != "") {
            $where.= " AND cms_master_tasks_template.created_by in(" . $created_by . ")";
            $where_or.= " AND cms_master_tasks_template.created_by in(" . $created_by . ")";
        }
        if ($dept_id != "") {
            $where.= " AND cms_master_tasks_template.dept_id in(" . $dept_id . ")";
            $where_or.= " AND cms_master_tasks_template.dept_id in(" . $dept_id . ")";
        }
        if ($status != "") {
            $where.= " AND cms_master_tasks_template.status_id in(" . $status . ")";
            $where_or.= " AND cms_master_tasks_template.status_id in(" . $status . ")";
        }
        
        if ($assign_to != "") {
            $where.= " AND cms_tasks_template_new_assignees.is_active = 1 AND cms_tasks_template_new_assignees.user_id in(" . $assign_to . ")";
            $where_or.= " AND cms_tasks_template_new_assignees.is_active = 1 AND cms_tasks_template_new_assignees.user_id in(" . $assign_to . ")";
        }
        if ($group != "") {
            if ($group == 'NOT SCHEDULED') {
                $where.= " AND (cms_master_tasks_template.master_task_no IS NULL OR cms_master_tasks_template.schedule_type = '')";
                $where_or.= " AND (cms_master_tasks_template.master_task_no IS NULL OR cms_master_tasks_template.schedule_type = '')";
            } else {
                $where.= " AND cms_master_tasks_template.master_task_no IN (SELECT id FROM cms_master_tasks_template WHERE schedule_type = '$group')";
                $where_or.= " AND cms_master_tasks_template.master_task_no IN (SELECT id FROM cms_master_tasks_template WHERE schedule_type = '$group')";
            }
        }
        if ($company != "") {
            $where.= " AND cms_master_tasks_template.company_id in($company)";
            $where_or.= " AND cms_master_tasks_template.company_id in($company)";
        }
        $where.= $close_bracket . $where_or . $close_bracket . " AND JSON_EXTRACT(cms_master_tasks_template.json_field, '$.sent_for_review') IS NULL AND cms_master_tasks_template.is_active in (1)";
        if ($task_no != "") {
            $where = " cms_master_tasks_template.id = '" . $task_no . "'";
        }
        $where .= " GROUP BY cms_master_tasks_template.id";
		
        $sql = get_task_template_sql();
		
        $field = $sql['fields'];
        $table = $sql['table'];
        //$sql = db_get_sql($field, $table, $where, $start_index, $limit, "task_no", 'DESC', "SET SESSION group_concat_max_len = 1000000;");
        //$rs = db_execute_multiple_query($sql);
        $rs = db_query_list($field, $table, $where, $start_index, 100000, "cms_master_tasks_template.id", 'DESC');
		
        if (count(array($rs)) < 1 || !isset($rs)) {
            echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs ) );exit;
        } else {
			echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs ) );exit;
        }
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}
function get_tasks_list_new($params) {
    try {
        log_it(__FUNCTION__, $params);
        $task_no = if_property_exist($params, 'task_no', '');
        $title = if_property_exist($params, 'title', '');
        $status = if_property_exist($params, 'status', '');
        $assign_to = if_property_exist($params, 'assign_to', '');
        $dept_id = if_property_exist($params, 'dept_id', '');
        $group = if_property_exist($params, 'group', '');
        $company = if_property_exist($params, 'company', '');
        $created_by = if_property_exist($params, 'created_by', '');
        $start_index = if_property_exist($params, 'start_index', 0);
        $limit = if_property_exist($params, 'limit', MAX_NO_OF_RECORDS);
        $view_all = if_property_exist($params, 'view_all', 0);
        $is_admin = if_property_exist($params, 'is_admin', '');
        $emp_id = if_property_exist($params, 'emp_id', '');
        $close_bracket = "";
        if ($view_all == 1) {
            $where = "1 = 1";
            $where_or = "";
        } else {
            $where = "(" . $emp_id . " IN(cms_tasks_new.created_by,cms_tasks_new.reviewer_id,cms_tasks_new.approver_id) ";
            $where_or = " OR (cms_tasks_new_assignees.is_active = 1 and FIND_IN_SET(" . $emp_id . ", cms_tasks_new_assignees.user_id)";
            $close_bracket = ")";
        }
        
        if ($title != "") {
            $where.= " AND cms_tasks_new.task_title like '%" . $title . "%'";
            $where_or.= " AND cms_tasks_new.task_title like '%" . $title . "%'";
        }
        if ($created_by != "") {
            $where.= " AND cms_tasks_new.created_by in(" . $created_by . ")";
            $where_or.= " AND cms_tasks_new.created_by in(" . $created_by . ")";
        }
        if ($dept_id != "") {
            $where.= " AND cms_tasks_new.dept_id in(" . $dept_id . ")";
            $where_or.= " AND cms_tasks_new.dept_id in(" . $dept_id . ")";
        }
        if ($status != "") {
            $where.= " AND cms_tasks_new.status_id in(" . $status . ")";
            $where_or.= " AND cms_tasks_new.status_id in(" . $status . ")";
        }
        
        if ($assign_to != "") {
            $where.= " AND cms_tasks_new_assignees.is_active = 1 AND cms_tasks_new_assignees.user_id in(" . $assign_to . ")";
            $where_or.= " AND cms_tasks_new_assignees.is_active = 1 AND cms_tasks_new_assignees.user_id in(" . $assign_to . ")";
        }
		
        if ($group != "") {
            if ($group == 'NOT SCHEDULED') {
                $where.= " AND (cms_tasks_new.master_task_no IS NULL OR cms_master_tasks.schedule_type = '')";
                $where_or.= " AND (cms_tasks_new.master_task_no IS NULL OR cms_master_tasks.schedule_type = '')";
            }
			else if( $group == 'due_today'){
				$where.= " AND (cms_tasks_new.due_date = '".date('Y-m-d')."' and cms_tasks_new.status_id != 252 )";
			}
			else if( $group == 'overdue'){
				$where.= " AND (cms_tasks_new.due_date < '".date('Y-m-d')."' and cms_tasks_new.status_id != 252 )";
			}
			else {
                $where.= " AND cms_tasks_new.master_task_no IN (SELECT task_no FROM cms_master_tasks WHERE schedule_type = '$group')";
                $where_or.= " AND cms_tasks_new.master_task_no IN (SELECT task_no FROM cms_master_tasks WHERE schedule_type = '$group')";
            }
        }
        if ($company != "") {
            $where.= " AND cms_tasks_new.company_id in($company)";
            $where_or.= " AND cms_tasks_new.company_id in($company)";
        }
        $where.= $close_bracket . $where_or . $close_bracket . " AND JSON_EXTRACT(cms_tasks_new.json_field, '$.sent_for_review') IS NULL AND cms_tasks_new.is_active in (1)";
        if ($task_no != "") {
            $where = " cms_tasks_new.task_no = '" . $task_no . "'";
        }
        $where .= " GROUP BY cms_tasks_new.task_no";
        $sql = get_task_sql();
        $field = $sql['fields'];
        $table = $sql['table'];
        //$sql = db_get_sql($field, $table, $where, $start_index, $limit, "task_no", 'DESC', "SET SESSION group_concat_max_len = 1000000;");
        //$rs = db_execute_multiple_query($sql);
        $rs = db_query_list($field, $table, $where, $start_index, 100000, "cms_tasks_new.task_no", 'DESC');
        if (count($rs) < 1 || !isset($rs)) {
            return handle_fail_response('No record found');
        } else {
			echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs ) );exit;
        }
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function get_tasks_list_waiting_review_approval($params) {
    try {
        log_it(__FUNCTION__, $params);
        $is_admin = if_property_exist($params, 'is_admin', '');
        $emp_id = if_property_exist($params, 'emp_id', '');
        $type = if_property_exist($params, 'type', '');
        $where = "cms_tasks_new.reviewer_id = $emp_id AND cms_tasks_new.json_field->'$.sent_for_review' = 1 AND cms_tasks_new.json_field->'$.reviewed_by_name' IS NULL AND cms_tasks_new.json_field->'$.approved_by_name' IS NULL AND cms_tasks_new.is_active in (1)";
        if ($type == 1) {
            $where = "(FIND_IN_SET(" . $emp_id . ", cms_tasks_new_assignees.user_id) OR $emp_id IN(cms_tasks_new.created_by) OR $emp_id IN(cms_tasks_new.approver_id)) AND cms_tasks_new.approver_id = $emp_id AND cms_tasks_new.json_field->'$.sent_for_review' = 1 AND cms_tasks_new.json_field->'$.approved_by_name' IS NULL AND cms_tasks_new.json_field->'$.reviewed_by_name' IS NOT NULL AND cms_tasks_new.is_active in (1)";
        } else if ($type == 2) {
            $where = "(FIND_IN_SET(" . $emp_id . ", cms_tasks_new_assignees.user_id) OR $emp_id IN(cms_tasks_new.created_by) OR $emp_id IN(cms_tasks_new.reviewer_id)) AND cms_tasks_new.json_field->'$.sent_for_review' = 1 AND cms_tasks_new.json_field->'$.reviewed_by_name' IS NULL AND cms_tasks_new.json_field->'$.approved_by_name' IS NULL AND cms_tasks_new.is_active in (1)";
        }
        $sql = get_task_sql();
        $field = $sql['fields'];
        $table = $sql['table'];
        $rs = db_query($field, $table, $where, '', '', "cms_tasks_new.task_no", 'DESC');
        if (!isset($rs) || count($rs) < 1) {
            return handle_fail_response('No record found');
			//echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>false ) );exit;
        } else {
            $results = array('list' => $rs);
            //return handle_success_response('Success', $results);
			 echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$results ) );exit;
			
        }
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function get_task_reply_list_new($params) {
    try {
        log_it(__FUNCTION__, $params);
        $task_no = if_property_exist($params, 'task_no');
        if (!isset($task_no) || $task_no == '') {
            return handle_fail_response('Missing Task ID.');
        }
        $rs = db_query("id, task_no
                            , remarks as descr,json_field
                            , concat('" . constant('UPLOAD_DIR_URL') . "', 'photos/',cms_tasks_new_remarks.created_by,'/',cms_tasks_new_remarks.created_by,'.jpeg') as emp_photo
                            ,(SELECT id FROM cms_employees WHERE
                                cms_employees.id = cms_tasks_new_remarks.created_by
                              ) AS emp_photo
                            ,(SELECT name FROM cms_employees WHERE
                                cms_employees.id = cms_tasks_new_remarks.created_by
                              ) AS name, created_date, created_by AS emp_id
                            ", "cms_tasks_new_remarks", "task_no = '" . $task_no . "' AND is_active = 1", '', '', 'created_date', 'desc');
       
        if (count($rs) < 1 || !isset($rs)) {
			
            echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>array() ) );exit;
        } else {
            $list = count($rs);
        	for($i = 0; $i < $list; $i++)
        	{
        		$params->id 					= $rs[$i]['task_no'];
        		$rs[$i]['attachment'] 			= get_assignee_attachments($params, $rs[$i]['id']);
        	}
            echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs ) );exit;
        }/* else {
            echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>array() ) );exit;
        } */
        
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function add_edit_tasks_new($params) 
{
    try 
    {
        log_it(__FUNCTION__, $params);
        $task_no = if_property_exist($params, 'task_no');
        $title = if_property_exist($params, 'title');
        $descr = if_property_exist($params, 'descr');
        $checklist = if_property_exist($params, 'checklist');
        $task_type = if_property_exist($params, 'task_type');
        $priority = if_property_exist($params, 'priority');
        $status = if_property_exist($params, 'status');
        $dept_id = if_property_exist($params, 'dept_id');
        $due_date = if_property_exist($params, 'due_date');
        $sbg_id = if_property_exist($params, 'sbg_id');
        $sbd_id = if_property_exist($params, 'sbd_id');
        $oc_id = if_property_exist($params, 'oc_id');
        $task_group = if_property_exist($params, 'task_group');
        $emp_id = if_property_exist($params, 'emp_id');
        $emp_name = if_property_exist($params, 'emp_name');

        //$assign_data = if_property_exist($params, 'assign_data');

        $json_field['checklist'] = $checklist;
        $data = array(':task_title' => $title
                    , ':descr' => $descr
                    , ':sbg_id' => $sbg_id
                    , ':sbd_id' => $sbd_id
                    , ':company_id' => $oc_id
                    , ':task_group_id' => $task_group
                    , ':due_date' => $due_date
                    , ':priority_id' => $priority
                    , ':dept_id' => $dept_id
                    , ':task_type' => $task_type
                    , ':status_id' => $status
                    , ':json_field' => json_encode($json_field)
                    );

        if (is_data_exist('cms_tasks_new', 'task_no', $task_no)) 
        {
            $data[':task_no'] = $task_no;
            $data = add_timestamp_to_array($data, $emp_id, 1);
            $result = db_update($data, 'cms_tasks_new', 'task_no');
            $params->action = "edit";
            $params->message = "(UPDATED)";
        } 
        else 
        {
            if ($task_no == '') {
                $rs = get_doc_primary_no('task_no', 'cms_tasks_new', false, 4);
                if ($rs == false) {
                    return handle_fail_response('Error generating task number. Please contact admin');
                } else {
                    $task_no = $rs['task_no'];
                }
            }
            $data[':task_no'] = $task_no;
            $data = add_timestamp_to_array($data, $emp_id, 0);
            $id = db_add($data, 'cms_tasks_new');
            $params->task_no = $task_no;
            $params->action = "add";
            $params->message = "(NEW)";
        }

        // if($assign_data)
        // {
        //     foreach($assign_data as $a_data)
        //     {
        //         $deadline_date = convert_to_date($a_data->deadline_date);
        //         $data = array(':task_no'        => $task_no
        //                     , ':type'           => $a_data->type
        //                     , ':user_id'        => $a_data->user_id
        //                     , ':action'         => $a_data->action
        //                     , ':deadline_date'  => $deadline_date
        //                     , ':status_id'      => $a_data->status_id);
                    
        //         $data = add_timestamp_to_array($data, $emp_id, 0);
        //         db_add($data, 'cms_tasks_new_assignees');
        //     }
        // }
		echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$params ) );exit;
       
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function update_task_attachment_new($params) {
    try {
        log_it(__FUNCTION__, $params);
        $emp_id = if_property_exist($params, 'emp_id');
        $task_no = if_property_exist($params, 'task_no');
        $old_file = if_property_exist($params, 'old_file');
        $new_file = if_property_exist($params, 'new_file');
        if (!isset($emp_id) || $emp_id == '') {
            return handle_fail_response('Missing employee ID.');
        }
        if (!isset($task_no) || $task_no == '') {
            return handle_fail_response('Missing task ID.');
        }
        if (!isset($old_file) || $old_file == '') {
            return handle_fail_response('Old Filename is missing');
        }
        if (!isset($new_file) || $new_file == '') {
            return handle_fail_response('New Filename is missing');
        }
        $sql = "UPDATE cms_tasks_new SET json_field = IFNULL(JSON_REPLACE(json_field,JSON_UNQUOTE(JSON_SEARCH(json_field, 'one', '%" . $old_file . "%',NULL, '$.attachment'))
                                ,'" . $new_file . "'),json_field)
                                WHERE task_no = '" . $task_no . "'";
        $result = db_execute_sql($sql);
        $rs = db_query("json_field->'$.attachment' as attachment,created_by", "cms_tasks_new", "task_no = '" . $task_no . "'");
        $rs[0]['filepath'] = constant("UPLOAD_DIR_URL") . 'tasks_doc/' . $task_no . '/';
        $rs[0]['attachment'] = json_decode($rs[0]['attachment']);
        return handle_success_response('Success', $rs[0] ? $rs[0] : array());
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function add_edit_tasks_reply_new($params) {
    try {
        log_it(__FUNCTION__, $params);
        $task_id = if_property_exist($params, 'task_id');
        $task_no = if_property_exist($params, 'task_no');
        $review_it = if_property_exist($params, 'review_it');
        $comments = if_property_exist($params, 'comments');
        $attachment = if_property_exist($params, 'attachment');
        $emp_id = if_property_exist($params, 'emp_id');
        $id = get_db_UUID();
        $result_review = 0;
        if ($review_it == true) {
            $json_field = "'$.sent_for_review'," . $review_it;
            $json_field.= ",'$.sent_for_review_date','" . get_current_date() . "'";
            $json_field.= ",'$.sent_for_review_by','" . $emp_id . "'";
            $sql = "UPDATE cms_tasks_new SET json_field = JSON_INSERT(json_field,$json_field) WHERE task_no = '" . $task_no . "'";
            $result_review = db_execute_sql($sql);
        }
        $rs = db_query("count(*) as count", "cms_tasks_new_remarks", "task_no = '" . $task_no . "'");
        if ($rs[0]['count'] == 0) {
            db_execute_sql("UPDATE cms_tasks_new set status_id = 251 where task_no = '" . $task_no . "'");
        }
        $data = array(':id' => $id, ':task_no' => $task_no, ':remarks' => $comments, ':json_field' => json_encode(array('attachment' => $attachment)));
        $data = add_timestamp_to_array($data, $emp_id, 0);
        $result = db_add($data, 'cms_tasks_new_remarks');
        //CHAT PUSH NOTIFICATION
        //require_once constant('MODULES_DIR') . '/chat.php';
        $params->message = "*Module : Task*" . str_replace('<br/>', "", $comments);
        //chat_post_message($params);
        //CHAT PUSH NOTIFICATION
        // send_email_task_notification_reply($params);
        $return_data = array('id' => $id, 'review_result' => $result_review);
        echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );exit;
        //return handle_success_response('Success', $return_data);
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function update_task_attachment_reply_new($params) {
    try {
        log_it(__FUNCTION__, $params);
        $emp_id = if_property_exist($params, 'emp_id');
        $task_id = if_property_exist($params, 'task_id');
        $old_file = if_property_exist($params, 'old_file');
        $new_file = if_property_exist($params, 'new_file');
        if (!isset($emp_id) || $emp_id == '') {
            return handle_fail_response('Missing employee ID.');
        }
        if (!isset($task_id) || $task_id == '') {
            return handle_fail_response('Missing task ID.');
        }
        if (!isset($old_file) || $old_file == '') {
            return handle_fail_response('Old Filename is missing');
        }
        if (!isset($new_file) || $new_file == '') {
            return handle_fail_response('New Filename is missing');
        }
        $sql = "UPDATE cms_tasks_new_remarks SET json_field = IFNULL(JSON_REPLACE(json_field,JSON_UNQUOTE(JSON_SEARCH(json_field, 'one', '%" . $old_file . "%',NULL, '$.attachment'))
                                ,'" . $new_file . "'),json_field)
                                WHERE id = '" . $task_id . "'";
        $result = db_execute_sql($sql);
        return handle_success_response('Success', true);
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function send_email_task_notification($params, $id) {
    try {
        log_it(__FUNCTION__, $params);
        $emp_id = if_property_exist($params, 'emp_id');
        $priority_name = if_property_exist($params, 'priority_name');
        $task_data = if_property_exist($params, 'task_data');
        $title = if_property_exist($params, 'title');
        $descr = if_property_exist($params, 'descr');
        $assigned_to = if_property_exist($params, 'assigned_to');
        $due_date = if_property_exist($params, 'due_date');
        $rs_assign_emp = db_query('name,office_email', 'cms_employees', 'id IN (' . $assigned_to . ')');
        $rs_emp = db_query_single('name', 'cms_employees', 'id = ' . $emp_id);


        $rs = db_query_single("tasks_tbl.task_title
                             , tasks_tbl.task_no
                             , tasks_tbl.descr
                             , priority_tbl.descr as priority_name
                             , cms_tasks_new_assignees.action
                             , CASE cms_tasks_new_assignees.type
                                when 'individual' then emp_tbl.name
                                when 'company' then contacts_tbl.name
                                END as name
                             , CASE cms_tasks_new_assignees.type
                                when 'individual' then emp_tbl.office_email
                                when 'company' then contacts_tbl.email
                                END as email
                             , date_format(cms_tasks_new_assignees.deadline_date,'" . constant('UI_DATE_FORMAT') .  "') as deadline_date
                             "
                             , "cms_tasks_new_assignees
                                left join cms_employees emp_tbl on emp_tbl.id = cms_tasks_new_assignees.user_id
                                left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_tasks_new_assignees.user_id
                                left join cms_tasks_new tasks_tbl on tasks_tbl.task_no = cms_tasks_new_assignees.task_no
                                left join cms_master_list priority_tbl on priority_tbl.id = tasks_tbl.priority_id"
                             , "cms_tasks_new_assignees.id = '" . $id . "'");

        if (count($rs) < 1 || !isset($rs)) {
            return handle_fail_response('No client record found');
        } else {
            
                $assigned_name = $rs['name'];
                $assigned_email = $rs['email'];
                $task_link       = constant('ROOT_URL').'/modules/task/task.php?task_no='.$rs['task_no'];
                $subject = 'Task Assigned by ' . $rs_emp['name'];
                
                $template 	= db_query_single("template_content", "cms_master_template","id=15");
                $replace = array('{APP_TITLE}', '{NAME}', '{EMPLOYEE}', '{TASK}', '{DESC}', '{DUE_DATE}', '{PRIORITY}', '{ACTION}', '{TASK_NO}', '{TASK_LINK}');
                $with = array(constant('APPLICATION_TITLE'), $assigned_name, $rs_emp['name'], $rs['task_title'], urldecode($rs['descr']), $rs['deadline_date'], $rs['priority_name'], $rs['action'], $rs['task_no'], $task_link);
                $body = str_replace($replace, $with, $template['template_content']);
                if (!smtpmailer($assigned_email, constant('MAIL_USERNAME'), constant('MAIL_FROMNAME'), $subject, $body)) {
                    return handle_fail_response('ERROR', 'Send Email to admin fail. Please re-try again later');
                }
           
        }
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

// function send_email_task_notification_reply($params) {
//     try {
//         log_it(__FUNCTION__, $params);
//         $emp_id = if_property_exist($params, 'emp_id');
//         $title = if_property_exist($params, 'title');
//         $comments = if_property_exist($params, 'comments');
//         $assigned_to = if_property_exist($params, 'assigned_to');
//         $task_no    = if_property_exist($params, 'task_no');
//         $rs_assign_emp = db_query("CASE cms_tasks_new_assignees.type
//                                     when 'individual' then emp_tbl.name
//                                     when 'company' then contacts_tbl.name
//                                     END as name
//                                  , CASE cms_tasks_new_assignees.type
//                                  when 'individual' then emp_tbl.office_email
//                                  when 'company' then contacts_tbl.email
//                                  END as office_email"
//                                 , "cms_tasks_new_assignees
//                                 LEFT JOIN cms_clients_contacts contacts_tbl
//                                         ON (contacts_tbl.id = cms_tasks_new_assignees.user_id)
//                                 LEFT JOIN cms_employees emp_tbl
//                                         ON (emp_tbl.id = cms_tasks_new_assignees.user_id)"
//                                 , "cms_tasks_new_assignees.task_no = '".$task_no."'");

//         $rs_created = db_query_single("emp_tbl.name
//                                  , emp_tbl.office_email"
//                                 , "cms_tasks_new
//                                 LEFT JOIN cms_employees emp_tbl
//                                         ON (emp_tbl.id = cms_tasks_new.created_by)"
//                                 , "cms_tasks_new.task_no = '".$task_no."'");

//         array_push($rs_assign_emp, $rs_created);
//         $recipients = array();

//         $rs = db_query('name', 'cms_employees', 'id = ' . $emp_id);
//         if (count($rs) < 1 || !isset($rs)) {
//             return handle_fail_response('No client record found');
//         } else {
//             for ($i = 0;$i < count($rs_assign_emp);$i++) {
//                 //check duplicates and send email only once
//                 if(!in_array($rs_assign_emp[$i]['office_email'], $recipients))
//                 {
//                     array_push($recipients, $rs_assign_emp[$i]['office_email']);
//                     $assigned_name = $rs_assign_emp[$i]['name'];
//                     $assigned_email = $rs_assign_emp[$i]['office_email'];
//                     $subject = 'Task Replied by ' . $rs[0]['name'];
//                     $template = file_get_contents(constant('TEMPLATE_DIR') . '/task_notification_reply.html');
//                     $replace = array('{APP_TITLE}', '{NAME}', '{EMPLOYEE}', '{TASK}', '{COMM}');
//                     $with = array(constant('APPLICATION_TITLE'), $assigned_name, $rs[0]['name'], $title, $comments);
//                     $body = str_replace($replace, $with, $template);
//                     if (!smtpmailer($assigned_email, constant('MAIL_USERNAME'), constant('MAIL_FROMNAME'), $subject, $body)) {
//                         return handle_fail_response('ERROR', 'Send Email to admin fail. Please re-try again later');
//                     }
//                 }
//             }
//         }
//     }
//     catch(Exception $e) {
//         handle_exception($e);
//     }
// }

function update_task_review_approval($params) {
    try {
        log_it(__FUNCTION__, $params);
        $task_no = if_property_exist($params, 'task_no');
        $emp_id = if_property_exist($params, 'emp_id');
        $emp_name = if_property_exist($params, 'emp_name');
        $type = if_property_exist($params, 'type');
        $field_status = "";
        if (!isset($emp_id) || $emp_id == '') {
            return handle_fail_response('Missing employee ID.');
        }
        if (!isset($task_no) || $task_no == '') {
            return handle_fail_response('Missing task No.');
        }
        if (!isset($type) || $type == '') {
            return handle_fail_response('Missing type');
        }
        if ($type == 1) //review
        {
            $json_field = "'$.reviewed_by_name','" . $emp_name . "'";
            $json_field.= ",'$.reviewed_date','" . get_current_date() . "'";
            $json_field.= ",'$.reviewed_by_id'," . $emp_id;
        } else if ($type == 2) {
            $json_field = "'$.approved_by_name','" . $emp_name . "'";
            $json_field.= ",'$.approved_date','" . get_current_date() . "'";
            $json_field.= ",'$.approved_by_id'," . $emp_id;
            $field_status = ",status_id = 252 ";
        }
        $sql = "UPDATE cms_tasks_new SET json_field = JSON_INSERT(json_field,$json_field) $field_status WHERE task_no = '" . $task_no . "'";
        $result_review = db_execute_sql($sql);
        return handle_success_response('Success', true);
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function get_tasks_count_waiting_review_approval($params) {
    try {
        log_it(__FUNCTION__, $params);
        $is_admin = if_property_exist($params, 'is_admin', '');
        $emp_id = if_property_exist($params, 'emp_id', '');
        if (!isset($emp_id) || $emp_id == '') {
            return handle_fail_response('Missing employee ID.');
        }

        $rs_priority = db_query("count(*) as count"
                                 , "cms_tasks_new
                                    LEFT JOIN cms_tasks_new_assignees on cms_tasks_new_assignees.task_no = cms_tasks_new.task_no"
                                 , "FIND_IN_SET(" . $emp_id . ", cms_tasks_new_assignees.user_id) AND cms_tasks_new.status_id NOT IN (252) AND cms_tasks_new.is_active in (1)");

        $rs_approve = db_query("count(*) as count", "cms_tasks_new", "approver_id = $emp_id AND cms_tasks_new.json_field->'$.sent_for_review' = 1 AND cms_tasks_new.json_field->'$.approved_by_name' IS NULL AND cms_tasks_new.json_field->'$.reviewed_by_name' IS NOT NULL AND cms_tasks_new.is_active in (1)");
        $rs_review = db_query("count(*) as count", "cms_tasks_new", "reviewer_id = $emp_id AND cms_tasks_new.json_field->'$.sent_for_review' = 1 AND cms_tasks_new.json_field->'$.reviewed_by_name' IS NULL AND cms_tasks_new.json_field->'$.approved_by_name' IS NULL AND cms_tasks_new.is_active in (1)");
        $rs_sent_review = db_query("count(*) as count"
                                 , "cms_tasks_new
                                    LEFT JOIN cms_tasks_new_assignees on cms_tasks_new_assignees.task_no = cms_tasks_new.task_no"
                                 , "(FIND_IN_SET(" . $emp_id . ", cms_tasks_new_assignees.user_id) OR $emp_id IN(cms_tasks_new.created_by) OR $emp_id IN(cms_tasks_new.reviewer_id)) AND cms_tasks_new.json_field->'$.sent_for_review' = 1 AND cms_tasks_new.json_field->'$.reviewed_by_name' IS NULL AND cms_tasks_new.json_field->'$.approved_by_name' IS NULL AND cms_tasks_new.is_active in (1)");
        $rs_waiting_approve = db_query("count(*) as count"
                                     , "cms_tasks_new
                                        LEFT JOIN cms_tasks_new_assignees on cms_tasks_new_assignees.task_no = cms_tasks_new.task_no"
                                     , "(FIND_IN_SET(" . $emp_id . ", cms_tasks_new_assignees.user_id) OR $emp_id IN(cms_tasks_new.created_by) OR $emp_id IN(cms_tasks_new.approver_id)) AND cms_tasks_new.json_field->'$.sent_for_review' = 1 AND cms_tasks_new.json_field->'$.reviewed_by_name' IS NOT NULL AND cms_tasks_new.json_field->'$.approved_by_name' IS NULL AND cms_tasks_new.is_active in (1)");
		
		$rsap = isset($rs_approve[0]['count']) ? $rs_approve[0]['count'] : 0;
		$rssr = isset($rs_sent_review[0]['count']) ? $rs_sent_review[0]['count'] : 0;
		$rswa = isset($rs_waiting_approve[0]['count']) ? $rs_waiting_approve[0]['count'] : 0;
		
		
        $return_data = array('priority' => $rs_priority[0]['count'],'review' => $rssr, 'approve' => $rsap, 
		'sent_for_review' => $rssr, 
		'waiting_approval' => $rswa );
        //return handle_success_response('Success', $return_data);
		echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );exit;
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function get_tasks_my_priority($params) {
    try {
        log_it(__FUNCTION__, $params);
        $emp_id = if_property_exist($params, 'emp_id', '');
        if (!isset($emp_id) || $emp_id == '') {
            return handle_fail_response('Missing employee ID.');
        }
        $where = "FIND_IN_SET(" . $emp_id . ", cms_tasks_new_assignees.user_id) AND cms_tasks_new.status_id NOT IN (252) AND cms_tasks_new.is_active in (1)";
        $sql = get_task_sql();
        $field = $sql['fields'];
        $table = $sql['table'];
        $rs = db_query($field, $table, $where, '', '', "cms_tasks_new.due_date ASC,cms_tasks_new.priority_id", 'ASC');
        if ( !isset($rs) || count($rs) < 1) {
            return handle_fail_response('No record found');
        } else {
            $results = array('list' => $rs, 'count' => count($rs));
            return handle_success_response('Success', $results);
        }
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function get_task_report_list($params) {
    try {
        log_it(__FUNCTION__, $params);
        $company_id = if_property_exist($params, 'company_id');
        $assigned_to = if_property_exist($params, 'assigned_to');
        $emp_id = if_property_exist($params, 'emp_id');
        $date_to = if_property_exist($params, 'date_to');
        $date_from = if_property_exist($params, 'date_from');
        $where = 'is_active = 1';
        $assigned_to_where = '';
        if (!isset($date_from) || $date_from == '') {
            return handle_fail_response('Date From and To are required');
        }
        if (!isset($date_to) || $date_to == '') {
            return handle_fail_response('Date From and To are required');
        }
        if (!isset($emp_id) || $emp_id == '') {
            return handle_fail_response('Missing employee ID.');
        }
        if ($company_id != "") {
            $where.= " AND cms_master_employer.id = " . $company_id;
        }
        
        $rs = db_query("cms_master_employer.id as company_id,employer_name,
            (SELECT COUNT(*) FROM cms_tasks_new 
                WHERE cms_tasks_new.company_id = cms_master_employer.id AND cms_tasks_new.created_date 
                BETWEEN '$date_from' AND '$date_to'
            ) AS total_assigned_task,

            (SELECT COUNT(*) FROM cms_tasks_new 
                WHERE cms_tasks_new.company_id = id AND cms_tasks_new.created_date 
                BETWEEN '$date_from' AND '$date_to' AND cms_tasks_new.status_id = 251
            ) AS total_in_progress_task,

            (SELECT COUNT(*) FROM cms_tasks_new 
                WHERE cms_tasks_new.company_id = id AND cms_tasks_new.created_date 
                BETWEEN '$date_from' AND '$date_to' AND cms_tasks_new.status_id = 252
            ) AS total_complete_task,

            (SELECT COUNT(*) FROM cms_tasks_new 
                WHERE cms_tasks_new.company_id = id AND cms_tasks_new.created_date 
                BETWEEN '$date_from' AND '$date_to' AND cms_tasks_new.status_id IN (250,251)
                AND IF(DATEDIFF(due_date, NOW()) < 0, 1,0) = 1 
            ) AS total_overdue_task", "cms_master_employer", $where);
        if (count($rs) < 1) {
            return handle_fail_response('No record found');
        } else {
            return handle_success_response('Success', $rs);
        }
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function get_task_report_assigned($params) {
    try {
        log_it(__FUNCTION__, $params);
        $company_id = if_property_exist($params, 'company_id');
        $assigned_to = if_property_exist($params, 'assigned_to');
        $emp_id = if_property_exist($params, 'emp_id');
        $date_to = if_property_exist($params, 'date_to');
        $date_from = if_property_exist($params, 'date_from');
        if (!isset($date_from) || $date_from == '') {
            return handle_fail_response('Date From and To are required');
        }
        if (!isset($date_to) || $date_to == '') {
            return handle_fail_response('Date From and To are required');
        }
        if (!isset($emp_id) || $emp_id == '') {
            return handle_fail_response('Missing employee ID.');
        }
        if (!isset($company_id) || $company_id == '') {
            return handle_fail_response('Company ID is required');
        }
        $assigned_to_where = '';
        if ($assigned_to != "") {
            $assigned_to_where = " AND cms_tasks_new_assignees.is_active = 1 AND cms_tasks_new_assignees.user_id in(" . $assigned_to . ")";
        }
        $where = "cms_tasks_new.is_active = 1 AND cms_tasks_new.company_id = $company_id AND
                  cms_tasks_new.created_date BETWEEN '$date_from' AND '$date_to' ".$assigned_to_where." GROUP BY cms_employees.id";
        $rs = db_query("cms_employees.id as assigned_to,cms_tasks_new.company_id,
            GROUP_CONCAT(DISTINCT cms_employees.name ORDER BY cms_employees.id) as name,
            (SELECT COUNT(*) FROM cms_tasks_new AS t
            left join cms_tasks_new_assignees on t.task_no = cms_tasks_new_assignees.task_no
            WHERE assigned_to = cms_tasks_new_assignees.user_id AND t.is_active = 1 AND
            t.created_date BETWEEN '$date_from' AND '$date_to' AND t.company_id = $company_id
            ) AS total_assigned_task,

            (SELECT COUNT(*) FROM cms_tasks_new AS t 
            left join cms_tasks_new_assignees on t.task_no = cms_tasks_new_assignees.task_no
            WHERE assigned_to = cms_tasks_new_assignees.user_id AND t.is_active = 1 AND
            t.created_date BETWEEN '$date_from' AND '$date_to' AND cms_tasks_new.company_id = $company_id
            AND t.status_id = 251
            ) AS total_in_progress_task,

            (SELECT COUNT(*) FROM cms_tasks_new AS t 
            left join cms_tasks_new_assignees on t.task_no = cms_tasks_new_assignees.task_no
            WHERE assigned_to = cms_tasks_new_assignees.user_id AND t.is_active = 1 AND
            t.created_date BETWEEN '$date_from' AND '$date_to' AND cms_tasks_new.company_id = $company_id
            AND t.status_id = 252
            ) AS total_complete_task,

            (SELECT COUNT(*) FROM cms_tasks_new AS t 
            left join cms_tasks_new_assignees on t.task_no = cms_tasks_new_assignees.task_no
            WHERE assigned_to = cms_tasks_new_assignees.user_id AND t.is_active = 1 AND
            t.created_date BETWEEN '$date_from' AND '$date_to' AND cms_tasks_new.company_id = $company_id
            AND t.status_id IN (250,251) AND IF(DATEDIFF(due_date, NOW()) < 0, 1,0) = 1
            ) AS total_overdue_task", "cms_tasks_new 
            LEFT JOIN cms_tasks_new_assignees
            ON (cms_tasks_new.task_no = cms_tasks_new_assignees.task_no)
            LEFT JOIN cms_employees
            ON (cms_employees.id = cms_tasks_new_assignees.user_id)
                ", $where);
        // echo '<pre>';print_r($rs);exit;
        if (count($rs) < 1) {
            return handle_fail_response('No record found');
        } else {
            return handle_success_response('Success', $rs);
        }
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function get_task_report_task_detail($params) {
    try {
        log_it(__FUNCTION__, $params);
        $company_id = if_property_exist($params, 'company_id');
        $assigned_to = if_property_exist($params, 'assigned_to');
        $emp_id = if_property_exist($params, 'emp_id');
        $date_to = if_property_exist($params, 'date_to');
        $date_from = if_property_exist($params, 'date_from');
        if (!isset($date_from) || $date_from == '') {
            return handle_fail_response('Date From and To are required');
        }
        if (!isset($date_to) || $date_to == '') {
            return handle_fail_response('Date From and To are required');
        }
        if (!isset($emp_id) || $emp_id == '') {
            return handle_fail_response('Missing employee ID.');
        }
        if (!isset($company_id) || $company_id == '') {
            return handle_fail_response('Company ID is required');
        }
        $where = "cms_tasks_new.is_active = 1 AND cms_tasks_new.company_id = $company_id AND
                  cms_tasks_new.created_date BETWEEN '$date_from' AND '$date_to' AND cms_tasks_new_assignees.user_id = $assigned_to 
                  GROUP BY cms_tasks_new.task_title";

        $rs = db_query("cms_tasks_new.task_title,cms_employees.name,
                (SELECT COUNT(*) FROM cms_tasks_new AS t 
                WHERE t.is_active = 1 AND
                t.created_date BETWEEN '$date_from' AND '$date_to' AND t.task_title = cms_tasks_new.task_title
                ) AS total_assigned_task,
                
                (SELECT COUNT(*) FROM cms_tasks_new AS t 
                WHERE t.is_active = 1 AND
                t.created_date BETWEEN '$date_from' AND '$date_to' AND t.task_title = cms_tasks_new.task_title
                AND t.status_id = 251
                AND t.task_title = cms_tasks_new.task_title
                ) AS total_in_progress_task,
                
                (SELECT COUNT(*) FROM cms_tasks_new AS t 
                WHERE  t.is_active = 1 AND
                t.created_date BETWEEN '$date_from' AND '$date_to' AND cms_tasks_new.company_id = $company_id
                AND t.status_id = 252
                AND  t.task_title = cms_tasks_new.task_title
                ) AS total_complete_task,
                
                (SELECT COUNT(*) FROM cms_tasks_new AS t 
                WHERE  t.is_active = 1 AND
                t.created_date BETWEEN '$date_from' AND '$date_to' AND cms_tasks_new.company_id = $company_id
                AND t.status_id IN (250,251) AND IF(DATEDIFF(due_date, NOW()) < 0, 1,0) = 1
                AND  t.task_title = cms_tasks_new.task_title
                ) AS total_overdue_task", "cms_tasks_new
                INNER JOIN
                cms_employees ON FIND_IN_SET(cms_employees.id, cms_tasks_new.created_by)
                left join cms_tasks_new_assignees on cms_tasks_new.task_no = cms_tasks_new_assignees.task_no
                ", $where);
        if (count($rs) < 1) {
            return handle_fail_response('No record found');
        } else {
            return handle_success_response('Success', $rs);
        }
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function get_task_report_assign_to_detail($params) {
    try {
        log_it(__FUNCTION__, $params);
        $assigned_to = if_property_exist($params, 'assigned_to');
        $emp_id = if_property_exist($params, 'emp_id');
        $date_to = if_property_exist($params, 'date_to');
        $date_from = if_property_exist($params, 'date_from');
        if (!isset($date_from) || $date_from == '') {
            return handle_fail_response('Date From and To are required');
        }
        if (!isset($date_to) || $date_to == '') {
            return handle_fail_response('Date From and To are required');
        }
        if (!isset($emp_id) || $emp_id == '') {
            return handle_fail_response('Missing employee ID.');
        }
        if ($assigned_to != "") {
            $assigned_to_where = " AND cms_tasks_new_assignees.is_active = 1 AND cms_tasks_new_assignees.user_id in(" . $assigned_to . ")";
        }
        $where = "cms_tasks_new.is_active = 1 AND
        cms_tasks_new.created_date BETWEEN '$date_from' AND '$date_to' ".$assigned_to_where."
        GROUP BY cms_tasks_new.task_title";
        $rs = db_query("cms_tasks_new.task_title,cms_employees.name,
                (SELECT COUNT(*) FROM cms_tasks_new AS t
                WHERE cms_tasks_new.is_active = 1 AND
                cms_tasks_new.created_date BETWEEN '$date_from' AND '$date_to'  AND t.task_title = cms_tasks_new.task_title
                ) AS total_assigned_task,
                
                (SELECT COUNT(*) FROM cms_tasks_new AS t
                WHERE t.is_active = 1 AND
                t.created_date BETWEEN '$date_from' AND '$date_to'
                AND t.status_id = 251 AND t.task_title = cms_tasks_new.task_title
                ) AS total_in_progress_task,
                
                (SELECT COUNT(*) FROM cms_tasks_new AS t
                WHERE t.is_active = 1 AND
                t.created_date BETWEEN '$date_from' AND '$date_to'
                AND t.status_id = 252 AND t.task_title = cms_tasks_new.task_title
                ) AS total_complete_task,
                
                (SELECT COUNT(*) FROM cms_tasks_new AS t
                WHERE t.is_active = 1 AND
                t.created_date BETWEEN '$date_from' AND '$date_to'
                AND t.status_id IN (250,251) AND IF(DATEDIFF(due_date, NOW()) < 0, 1,0) = 1 AND t.task_title = cms_tasks_new.task_title
                ) AS total_overdue_task", "cms_tasks_new
                LEFT JOIN cms_tasks_new_assignees
                        ON (cms_tasks_new.task_no = cms_tasks_new_assignees.task_no)
                LEFT JOIN cms_employees
                        ON (cms_employees.id = cms_tasks_new_assignees.user_id)
                ", $where);
        if (count($rs) < 1) {
            return handle_fail_response('No record found');
        } else {
            return handle_success_response('Success', $rs);
        }
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}
function get_task_template_sql() {
    try {
        $fields = " cms_master_tasks_template.id
                    , cms_master_tasks_template.task_title
                    , cms_master_tasks_template.descr
                    , cms_master_tasks_template.task_type_id
                    , task_type_list.descr as task_type_desc
                    , cms_master_tasks_template.dept_id
                    , cms_master_tasks_template.reviewer_id
                    , cms_master_tasks_template.approver_id
                    , cms_master_tasks_template.due_date
                    , cms_master_tasks_template.priority_id
                    , RPAD(cms_master_list.descr,10,' ') AS priority_name
                    , status_list.descr as status_name
                    , cms_master_tasks_template.created_date
                    , cms_master_tasks_template.created_by
                    , cms_master_tasks_template.status_id
                    , cms_master_tasks_template.roll_over
                    , cms_master_tasks_template.freeze_date
                    , (SELECT GROUP_CONCAT(DISTINCT(emp_tbl.name))
                        FROM cms_tasks_template_new_assignees
                        LEFT JOIN cms_employees as emp_tbl
                        ON (cms_tasks_template_new_assignees.user_id = emp_tbl.id)
                        WHERE cms_tasks_template_new_assignees.is_active = 1 and FIND_IN_SET(cms_tasks_template_new_assignees.task_id,cms_master_tasks_template.id)
                        ) AS assigned_to_name
                    , IF(cms_master_tasks_template.is_active = 1,'ACTIVE','IN-ACTIVE') as is_active
                    , concat('" . constant("UPLOAD_DIR_URL") . "', 'schedule_tasks_doc', '/',cms_master_tasks_template.id, '/') as filepath
                    , JSON_UNQUOTE(cms_master_tasks_template.json_field) as json_field
                    , IFNULL(cms_employees.name,'SYSTEM') as created_by_name
                    , IFNULL(DATEDIFF(cms_master_tasks_template.due_date, NOW()),'0') AS days_left
                    ,(SELECT COUNT(*) FROM cms_tasks_new_remarks WHERE task_no = cms_master_tasks_template.id) AS reply_count
                    ,(SELECT JSON_OBJECT('name',cms_employees.name,'created_date',cms_tasks_new_remarks.created_date)
                        FROM cms_tasks_new_remarks
                        INNER JOIN cms_employees ON cms_tasks_new_remarks.created_by = cms_employees.id
                        WHERE cms_tasks_new_remarks.task_no = cms_master_tasks_template.id ORDER BY cms_tasks_new_remarks.created_date DESC LIMIT 1) AS latest_reply
                    , IFNULL(cms_master_employer.employer_name,'') as company_name
                    , IFNULL(master_sbg.descr,'') as sbg_name
                    , IFNULL(master_sbd.descr,'') as sbd_name
                    , IF(cms_master_tasks_template.freeze_date > now(), 0, 1) as freeze_it";
        $table = "  cms_master_tasks_template
                    LEFT JOIN cms_tasks_template_new_assignees
                        ON (cms_master_tasks_template.id = cms_tasks_template_new_assignees.task_id)
                    LEFT JOIN cms_employees
                        ON (cms_master_tasks_template.created_by = cms_employees.id)
                    LEFT JOIN cms_master_list
                        ON (cms_master_tasks_template.priority_id = cms_master_list.id)
                    LEFT JOIN cms_master_list as status_list
                        ON (cms_master_tasks_template.status_id = status_list.id)
                    LEFT JOIN cms_master_list as task_type_list
                        ON (cms_master_tasks_template.task_type_id = task_type_list.id)
                    
                    LEFT JOIN cms_master_employer 
                        ON (cms_master_tasks_template.company_id = cms_master_employer.id)
                    LEFT JOIN cms_master_list master_sbg 
                        ON (cms_master_tasks_template.sbg_id = master_sbg.id)
                    LEFT JOIN cms_master_list master_sbd 
                        ON (cms_master_tasks_template.sbd_id = master_sbd.id)
                ";
        return array('fields' => $fields, 'table' => $table);
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}
function get_task_sql() {
    try {
        $fields = " cms_tasks_new.task_no
                    , cms_tasks_new.master_task_no
                    , cms_tasks_new.task_title
                    , cms_tasks_new.descr
                    , cms_tasks_new.task_type
                    , task_type_list.descr as task_type_desc
                    , cms_tasks_new.dept_id
                    , cms_tasks_new.reviewer_id
                    , cms_tasks_new.approver_id
                    , cms_tasks_new.due_date
                    , cms_tasks_new.priority_id
                    , RPAD(cms_master_list.descr,10,' ') AS priority_name
                    , status_list.descr as status_name
                    , cms_tasks_new.created_date
                    , cms_tasks_new.created_by
                    , cms_tasks_new.status_id
                    , cms_tasks_new.roll_over
                    , cms_tasks_new.freeze_date
                    , (SELECT GROUP_CONCAT(DISTINCT(emp_tbl.name))
                        FROM cms_tasks_new_assignees
                        LEFT JOIN cms_employees as emp_tbl
                        ON (cms_tasks_new_assignees.user_id = emp_tbl.id)
                        WHERE cms_tasks_new_assignees.is_active = 1 and FIND_IN_SET(cms_tasks_new_assignees.task_no,cms_tasks_new.task_no)
                        ) AS assigned_to_name
                    , IF(cms_tasks_new.is_active = 1,'ACTIVE','IN-ACTIVE') as is_active
                    , concat('" . constant("UPLOAD_DIR_URL") . "', 'schedule_tasks_doc', '/',cms_tasks_new.task_no, '/') as filepath
                    , JSON_UNQUOTE(cms_tasks_new.json_field) as json_field
                    , IFNULL(cms_employees.name,'SYSTEM') as created_by_name
                    , IFNULL(DATEDIFF(cms_tasks_new.due_date, NOW()),'0') AS days_left
                    ,(SELECT COUNT(*) FROM cms_tasks_new_remarks WHERE task_no = cms_tasks_new.task_no) AS reply_count
                    ,(SELECT JSON_OBJECT('name',cms_employees.name,'created_date',cms_tasks_new_remarks.created_date)
                        FROM cms_tasks_new_remarks
                        INNER JOIN cms_employees ON cms_tasks_new_remarks.created_by = cms_employees.id
                        WHERE cms_tasks_new_remarks.task_no = cms_tasks_new.task_no ORDER BY cms_tasks_new_remarks.created_date DESC LIMIT 1) AS latest_reply
                    , IFNULL(cms_master_employer.employer_name,'') as company_name
                    , IFNULL(master_sbg.descr,'') as sbg_name
                    , IFNULL(master_sbd.descr,'') as sbd_name
                    , IF(cms_tasks_new.freeze_date > now(), 0, 1) as freeze_it";
        $table = "  cms_tasks_new
                    LEFT JOIN cms_tasks_new_assignees
                        ON (cms_tasks_new.task_no = cms_tasks_new_assignees.task_no)
                    LEFT JOIN cms_employees
                        ON (cms_tasks_new.created_by = cms_employees.id)
                    LEFT JOIN cms_master_list
                        ON (cms_tasks_new.priority_id = cms_master_list.id)
                    LEFT JOIN cms_master_list as status_list
                        ON (cms_tasks_new.status_id = status_list.id)
                    LEFT JOIN cms_master_list as task_type_list
                        ON (cms_tasks_new.task_type = task_type_list.id)
                    LEFT JOIN cms_master_tasks 
                        ON (cms_tasks_new.master_task_no = cms_master_tasks.task_no)
                    LEFT JOIN cms_master_employer 
                        ON (cms_tasks_new.company_id = cms_master_employer.id)
                    LEFT JOIN cms_master_list master_sbg 
                        ON (cms_tasks_new.sbg_id = master_sbg.id)
                    LEFT JOIN cms_master_list master_sbd 
                        ON (cms_tasks_new.sbd_id = master_sbd.id)
                ";
        return array('fields' => $fields, 'table' => $table);
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

// start of scheduling task services
function get_schedule_tasks_list($params) {
    try {
        log_it(__FUNCTION__, $params);
        $title = if_property_exist($params, 'title', '');
        $status = if_property_exist($params, 'status', '');
        $assign_to = if_property_exist($params, 'assign_to', '');
        $dept_id = if_property_exist($params, 'dept_id', '');
        $created_by = if_property_exist($params, 'created_by', '');
        $start_index = if_property_exist($params, 'start_index', 0);
        $limit = if_property_exist($params, 'limit', MAX_NO_OF_RECORDS);
        $view_all = if_property_exist($params, 'view_all', 0);
        $is_admin = if_property_exist($params, 'is_admin', '');
        $emp_id = if_property_exist($params, 'emp_id', '');
		$statusString = '';

		if( is_array($status) ){
			$statusString = implode(",",$status);
		}
        if ($view_all == 1) {
            $where = "1 = 1";
        } else {
            $where = "cms_master_tasks.created_by in (" . $emp_id . ")";
        }
        if ($created_by != "") {
            $where.= " AND cms_master_tasks.created_by in(" . $created_by . ")";
        }
		if ($title != "") {
            $where.= " AND cms_master_tasks.task_title like '".$title."%'";
        }
	
        if ($dept_id != "0" && $dept_id != '' ) {
            $where.= " AND cms_master_tasks.dept_id in(" . $dept_id . ")";
        }
        if ($statusString != "") {
            $where.= " AND cms_master_tasks.is_active in(" . $statusString . ")";
        } else {
            $where.= " AND cms_master_tasks.is_active in (1)";
        }
        if ($assign_to != "") {
            $where.= " AND cms_master_tasks_assignees.is_active = 1 AND cms_master_tasks_assignees.user_id in(" . $assign_to . ")";
        }
        $where .= "GROUP BY cms_master_tasks.task_no";

        $rs = db_query_list(" cms_master_tasks.task_no
                , cms_master_tasks.task_title
                , cms_master_tasks.descr
                , cms_master_tasks.descr_action
                , cms_master_tasks.sbg_id
                , cms_master_tasks.sbd_id
                , cms_master_tasks.task_group_id
                , cms_master_tasks.company_id
                , cms_master_tasks.task_type
                , task_type_list.descr as task_type_desc
                , cms_master_tasks.dept_id
                , cms_master_tasks.reviewer_id
                , cms_master_tasks.approver_id
                , cms_master_tasks.start_date
                , IFNULL(cms_master_tasks.expiry_date,'') as expiry_date
                , cms_master_tasks.due_days
                , cms_master_tasks.reviewer_due_days
                , cms_master_tasks.approver_due_days
                , cms_master_tasks.priority_id
                , RPAD(cms_master_list.descr,10,' ') AS priority_name
                , date_format(cms_master_tasks.next_run_time,'" . constant('DISPLAY_DATETIME_FORMAT') . "') as next_run_time
                , IFNULL(date_format(cms_master_tasks.last_run_time,'" . constant('DISPLAY_DATETIME_FORMAT') . "'),'YET TO RUN') as last_run_time               
                , cms_master_tasks.schedule_desc
                , cms_master_tasks.schedule_type
                , cms_master_tasks.created_date
                , cms_master_tasks.created_by
                , cms_master_tasks.roll_over
                , cms_master_tasks.freeze_date
                , cms_master_tasks.is_active
                , IF(cms_master_tasks.is_active = 1,'ACTIVE','IN-ACTIVE') as active_status
                , concat('" . constant("UPLOAD_DIR_URL") . "', 'schedule_tasks_doc', '/',cms_master_tasks.task_no, '/') as filepath
                , JSON_UNQUOTE(cms_master_tasks.json_field) as json_field
                , cms_employees.name as created_by_name
                , DATEDIFF(cms_master_tasks.expiry_date, NOW()) AS days_left
                , (SELECT GROUP_CONCAT(DISTINCT(emp_tbl.name))
                        FROM cms_master_tasks_assignees
                        LEFT JOIN cms_employees as emp_tbl
                        ON (cms_master_tasks_assignees.user_id = emp_tbl.id)
                        WHERE cms_master_tasks_assignees.is_active = 1 and FIND_IN_SET(cms_master_tasks_assignees.task_no,cms_master_tasks.task_no)
                        ) AS assign_name
                
                ", "cms_master_tasks
                LEFT JOIN cms_master_tasks_assignees
                        ON (cms_master_tasks.task_no = cms_master_tasks_assignees.task_no) 
                LEFT JOIN cms_employees
                    ON (cms_master_tasks.created_by = cms_employees.id)
                LEFT JOIN cms_master_list
                    ON (cms_master_tasks.priority_id = cms_master_list.id)
                LEFT JOIN cms_master_list as task_type_list
                    ON (cms_master_tasks.task_type = task_type_list.id)
                ", $where, $start_index, $limit, "cms_master_tasks.task_no", 'DESC');
                if ( !isset($rs) || count($rs) < 1 ) {
                    return handle_fail_response('No record found');
                } else {
                    
                    //return handle_success_response('Success', $rs);
                    echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs ) );exit;
                }
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function add_edit_schedule_tasks($params) {
    try {
        log_it(__FUNCTION__, $params);
        $task_no = if_property_exist($params, 'task_no');
        $title = if_property_exist($params, 'title');
        $descr = if_property_exist($params, 'descr');
        $descr_action = if_property_exist($params, 'descr_action');
        $task_type = if_property_exist($params, 'task_type');
        $priority = if_property_exist($params, 'priority');
        $priority_name = if_property_exist($params, 'priority_name');
        $assigned_to = if_property_exist($params, 'assigned_to');
        $is_active = if_property_exist($params, 'is_active');
        $dept_id = if_property_exist($params, 'dept_id');
        $attachment = if_property_exist($params, 'attachment');
        $checklist = if_property_exist($params, 'checklist');
        $due_date = if_property_exist($params, 'due_date');
        $emp_id = if_property_exist($params, 'emp_id');
        $emp_name = if_property_exist($params, 'emp_name');
        $roll_over = if_property_exist($params, 'roll_over', 0);
        $freeze_date = if_property_exist($params, 'freeze_date');
        $sbg_id = if_property_exist($params, 'sbg_id');
        $sbd_id = if_property_exist($params, 'sbd_id');
        $oc_id = if_property_exist($params, 'oc_id');
        $task_group = if_property_exist($params, 'task_group');
        $schedule_one_time = if_property_exist($params, 'schedule_one_time');
        $reviewer = if_property_exist($params, 'reviewer');
        $approver = if_property_exist($params, 'approver');
        $schedule_desc = if_property_exist($params, 'schedule_desc');
        $start_date = if_property_exist($params, 'start_date');
        $expiry_date = if_property_exist($params, 'expiry_date');
        $schedule_type = if_property_exist($params, 'schedule_type');
        $due_days = if_property_exist($params, 'due_days');
        $r_due_days = if_property_exist($params, 'r_due_days');
        $a_due_days = if_property_exist($params, 'a_due_days');
        $date_to_add = "INTERVAL 1 DAY";
        $start_date = convert_to_datetime($start_date);
        $expiry_date = convert_to_datetime($expiry_date);
        $freeze_date = convert_to_date($freeze_date);
        if ($task_no == '') {
            $rs = get_doc_primary_no('task_no', 'cms_master_tasks');
            if ($rs == false) {
                return handle_fail_response('Error generating task number. Please contact admin');
            } else {
                $task_no = $rs['task_no'];
            }
        }
        $json_field['attachment'] = $attachment;
        $json_field['checklist'] = $checklist;
        switch ($schedule_type) {
            case "daily":
                $date_to_add = "INTERVAL 1 DAY";
            break;
            case "weekly":
                $date_to_add = "INTERVAL 1 WEEK";
            break;
            case "monthly":
                $date_to_add = "INTERVAL 1 MONTH";
            break;
            case "quarterly":
                $date_to_add = "INTERVAL 1 QUARTER";
            break;
            case "biannually":
                $date_to_add = "INTERVAL 6 MONTH";
            break;
            case "yearly":
                $date_to_add = "INTERVAL 1 YEAR";
            break;
            default:
                $date_to_add = "INTERVAL 1 DAY";
        }
        $data = array(':task_no' => $task_no, ':task_title' => $title, ':descr' => $descr, ':descr_action' => $descr_action, ':sbg_id' => $sbg_id, ':sbd_id' => $sbd_id, ':company_id' => $oc_id, ':task_group_id' => $task_group, ':task_type' => $task_type, ':dept_id' => $dept_id, ':assigned_to_id' => $assigned_to, ':reviewer_id' => $reviewer, ':approver_id' => $approver, ':start_date' => $start_date, ':expiry_date' => $expiry_date, ':due_days' => $due_days, ':reviewer_due_days' => $r_due_days, ':approver_due_days' => $a_due_days, ':priority_id' => $priority, ':date_to_add' => $date_to_add, ':schedule_type' => $schedule_type, ':schedule_desc' => $schedule_desc, ':roll_over' => $roll_over, ':freeze_date' => $freeze_date, ':json_field' => json_encode($json_field), ':is_active' => $is_active);
        if (is_data_exist('cms_master_tasks', 'task_no', $task_no)) {
            $data = add_timestamp_to_array($data, $emp_id, 1);
            $result = db_update($data, 'cms_master_tasks', 'task_no');
        } else {
            $data[':next_run_time'] = $start_date;
            $data = add_timestamp_to_array($data, $emp_id, 0);
            $id = db_add($data, 'cms_master_tasks');
            $params->task_no = $task_no;
        }
        $params->filepath = constant("UPLOAD_DIR_URL") . 'schedule_tasks_doc/' . $task_no . '/';
        return handle_success_response('Success', $params);
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function update_schedule_task_attachment($params) {
    try {
        log_it(__FUNCTION__, $params);
        $emp_id = if_property_exist($params, 'emp_id');
        $task_no = if_property_exist($params, 'task_no');
        $old_file = if_property_exist($params, 'old_file');
        $new_file = if_property_exist($params, 'new_file');
        if (!isset($emp_id) || $emp_id == '') {
            return handle_fail_response('Missing employee ID.');
        }
        if (!isset($task_no) || $task_no == '') {
            return handle_fail_response('Missing task ID.');
        }
        if (!isset($old_file) || $old_file == '') {
            return handle_fail_response('Old Filename is missing');
        }
        if (!isset($new_file) || $new_file == '') {
            return handle_fail_response('New Filename is missing');
        }
        $sql = "UPDATE cms_master_tasks SET json_field = IFNULL(JSON_REPLACE(json_field,JSON_UNQUOTE(JSON_SEARCH(json_field, 'one', '%" . $old_file . "%',NULL, '$.attachment'))
                                ,'" . $new_file . "'),json_field)
                                WHERE task_no = '" . $task_no . "'";
        $result = db_execute_sql($sql);
        $rs = db_query("json_field->'$.attachment' as attachment", "cms_master_tasks", "task_no = '" . $task_no . "'");
        $rs[0]['filepath'] = constant("UPLOAD_DIR_URL") . 'schedule_tasks_doc/' . $task_no . '/';
        $rs[0]['attachment'] = json_decode($rs[0]['attachment']);
        return handle_success_response('Success', $rs[0] ? $rs[0] : array());
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function delete_tasks_attachment($params) {
    try {
        log_it(__FUNCTION__, $params);
        $emp_id = if_property_exist($params, 'emp_id');
        $task_no = if_property_exist($params, 'task_no');
        $filename = if_property_exist($params, 'filename');

        if (!isset($emp_id) || $emp_id == '') {
            return handle_fail_response('Missing employee ID.');
        }
        if (!isset($task_no) || $task_no == '') {
            return handle_fail_response('Missing task ID.');
        }
        if (!isset($filename) || $filename == '') {
            return handle_fail_response('Filename is missing');
        }
        $sql = "UPDATE cms_tasks_new SET json_field = IFNULL(JSON_REMOVE(json_field,JSON_UNQUOTE(JSON_SEARCH(json_field, 'one', '%" . $filename . "%',NULL, '$.attachment'))),json_field)
                       WHERE task_no = '" . $task_no . "'";
        $result = db_execute_sql($sql);
        if (count($result) > 0) {
            if (create_folder(constant("DOC_FOLDER") . 'tasks_doc/' . $task_no . '/deleted')) {
                rename(constant("DOC_FOLDER") . 'tasks_doc/' . $task_no . '/' . $filename, constant("DOC_FOLDER") . 'tasks_doc/' . $task_no . '/deleted/' . $filename);
            }
            return handle_success_response('Success', true);
        }
        return handle_fail_response('Failed to delete attachment');
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function delete_schedule_tasks_attachment($params) {
    try {
        log_it(__FUNCTION__, $params);
        $emp_id = if_property_exist($params, 'emp_id');
        $task_no = if_property_exist($params, 'task_no');
        $filename = if_property_exist($params, 'filename');
        if (!isset($emp_id) || $emp_id == '') {
            return handle_fail_response('Missing employee ID.');
        }
        if (!isset($task_no) || $task_no == '') {
            return handle_fail_response('Missing task ID.');
        }
        if (!isset($filename) || $filename == '') {
            return handle_fail_response('Filename is missing');
        }
        $sql = "UPDATE cms_tasks SET json_field = IFNULL(JSON_REMOVE(json_field,JSON_UNQUOTE(JSON_SEARCH(json_field, 'one', '%" . $filename . "%',NULL, '$.attachment'))),json_field)
                       WHERE task_no = '" . $task_no . "'";
        $result = db_execute_sql($sql);
        if (count($result) > 0) {
            if (create_folder(constant("DOC_FOLDER") . 'schedule_tasks_doc/' . $task_no . '/deleted')) {
                rename(constant("DOC_FOLDER") . 'schedule_tasks_doc/' . $task_no . '/' . $filename, constant("DOC_FOLDER") . 'schedule_tasks_doc/' . $task_no . '/deleted/' . $filename);
            }
            return handle_success_response('Success', true);
        }
        return handle_fail_response('Failed to delete attachment');
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}
function get_everything_at_once($params){
	$dataArray = [];
	for($i=0;$i<sizeof($params);$i++){
		$dataArray[] = call_user_func($params[$i]);
	}
	echo json_encode( array( "code"=>0, "msg"=>"Success", 'data'=>$dataArray ) );exit;
}
function get_sbd(){
	$return_data    	= [];
	$temp				= [];
	$rs_sbd       		= db_query('id,descr','cms_master_list','category_id = 48 AND is_active = 1');

    if(is_array($rs_sbd)) {
        for($i = 0; $i < count($rs_sbd); $i++) {
            $temp['id']   = $rs_sbd[$i]['id'];
            $temp['desc'] = $rs_sbd[$i]['descr'];
            $return_data[] = $temp;
        }
    }
	return json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );
	//echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );exit;
	//return json_encode( array("code"=>0,"msg"=>"Success","data"=>$return_data) );
}
function get_search_priority(){
	$return_data    	= [];
	$temp				= [];
	$rs_priority       	= db_query('id,descr','cms_master_list','category_id = 43 AND is_active = 1');
	for($i = 0; $i < count($rs_priority); $i++)
    {
		$temp['id']   = $rs_priority[$i]['id'];
		$temp['desc'] = $rs_priority[$i]['descr'];
		$return_data[] = $temp;
	}
	echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );exit;
	//return json_encode( array("code"=>0,"msg"=>"Success","data"=>$return_data) );
}
function get_search_status(){
	$return_data    	= [];
	$temp				= [];
	$rs_task        	= db_query('id,descr','cms_master_list','category_id = 42 AND is_active = 1');
	for($i = 0; $i < count($rs_task); $i++)
    {
		$temp['id']   = $rs_task[$i]['id'];
		$temp['desc'] = $rs_task[$i]['descr'];
		$return_data[] = $temp;
	}
	return json_encode( array("code"=>0,"msg"=>"Success","data"=>$return_data) );
	//return json_encode( array("code"=>0,"msg"=>"Success","data"=>$return_data) );
}
function get_search_assignee(){
	$return_data    	= [];
	$temp				= [];
	$rs_assign        	= db_query("id,name,office_email,IFNULL(JSON_UNQUOTE(JSON_EXTRACT(json_field, '$.chat_user_id')),'') as chat_username",
							   'cms_employees','is_active = 1', '', '', 'cms_employees.name');
	for($i = 0; $i < count($rs_assign); $i++)
    {
		$temp['id']   = $rs_assign[$i]['id'];
		$temp['desc'] = $rs_assign[$i]['name'];
		$return_data[] = $temp;
	}
	return json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );
	//echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );exit;
	//return json_encode( array("code"=>0,"msg"=>"Success","data"=>$return_data) );
} 
function get_search_created_by(){
	$return_data    	= [];
	$temp				= [];
	$emp        	= db_query('cms_employees.id,cms_employees.name,cms_employees.office_email'
							  ,'cms_employees
							  inner join cms_tasks_new on cms_employees.id = cms_tasks_new.created_by'
							  ,'cms_employees.is_active = 1 GROUP BY cms_employees.id ORDER BY cms_employees.name ASC');
	if( count($emp) > 0 )
	{	
		for($i = 0; $i < count($emp); $i++)
		{
			$temp['id']   = $emp[$i]['id'];
			$temp['desc'] = $emp[$i]['name'];
			$return_data[] = $temp;
		}
	}
	return json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );
	//echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );exit;
	//return json_encode( array("code"=>0,"msg"=>"Success","data"=>$return_data) );
}
function get_search_schedule_type(){
	$return_data    	= [];
	$temp				= [];
	$rs_group_search    = db_query("DISTINCT IF(IFNULL(cms_master_tasks.schedule_type, '') = '', 'NOT SCHEDULED', cms_master_tasks.schedule_type) AS s_type",
							   'cms_tasks_new LEFT JOIN cms_master_tasks ON cms_tasks_new.master_task_no = cms_master_tasks.task_no',
							   'cms_tasks_new.is_active = 1');
	for($i = 0; $i < count($rs_group_search); $i++)
    {
		$temp['id']   = $rs_group_search[$i]['s_type'];
		$temp['desc'] = $rs_group_search[$i]['s_type'];
		$return_data[] = $temp;
	}
	return json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );
	//echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );exit;
	//return json_encode( array("code"=>0,"msg"=>"Success","data"=>$return_data) );
}
function get_search_company(){
	$return_data    	= [];
	$temp				= [];
	$rs_company       	= db_query('id,employer_name','cms_master_employer','is_active = 1');
	for($i = 0; $i < count($rs_company); $i++)
    {
		$temp['id']   = $rs_company[$i]['id'];
		$temp['desc'] = $rs_company[$i]['employer_name'];
		$return_data[] = $temp;
	}
	return json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );
	//echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );exit;
	//return json_encode( array("code"=>0,"msg"=>"Success","data"=>$return_data) );
}
function get_sbg(){
	$return_data    	= [];
	$temp				= [];
	$rs_sbg       		= db_query('id,descr','cms_master_list','category_id = 47 AND is_active = 1');

    if(is_array($rs_sbg)) {
        for($i = 0; $i < count($rs_sbg); $i++) {
            $temp['id']   = $rs_sbg[$i]['id'];
            $temp['desc'] = $rs_sbg[$i]['descr'];
            $return_data[] = $temp;
        }
    }
	return json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );
	//echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );exit;
}

function get_departments(){
	$return_data    	= [];
	$temp				= [];
	$rs_dept       		= db_query('id,descr','cms_master_list','category_id = 1 AND is_active = 1');

    if(is_array($rs_dept)) {
        for($i = 0; $i < count($rs_dept); $i++) {
            $temp['id']   = $rs_dept[$i]['id'];
            $temp['desc'] = $rs_dept[$i]['descr'];
            $return_data[] = $temp;
        }
    }
	
	echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );exit;
}
function get_company(){
	$return_data    	= [];
	$temp				= [];
	$rs_company       	= db_query('id,employer_name','cms_master_employer','is_active = 1');
	for($i = 0; $i < count($rs_company); $i++)
    {
		$temp['id']   = $rs_company[$i]['id'];
		$temp['desc'] = $rs_company[$i]['employer_name'];
		$return_data[] = $temp;
	}

	return json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data, "defaultValue"=>$rs_company[0]['id'] ) );
	//echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data, "defaultValue"=>$rs_company[0]['id'] ) );exit;
}
function get_taskTypes(){
	$return_data    	= [];
	$temp				= [];
	$rs_type       		= db_query('id,descr','cms_master_list','category_id = 44 AND is_active = 1');

    if(is_array($rs_type)) {
        for($i = 0; $i < count($rs_type); $i++) {
            $temp['id']   = $rs_type[$i]['id'];
            $temp['desc'] = $rs_type[$i]['descr'];
            $return_data[] = $temp;
        }
    }
	return json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );
	//echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );exit;
}

function get_priority(){
	$return_data    	= [];
	$temp				= [];
	$rs_priority       	= db_query('id,descr','cms_master_list','category_id = 43 AND is_active = 1');

    if(is_array($rs_priority)) {
        for($i = 0; $i < count($rs_priority); $i++) {
            $temp['id']   = $rs_priority[$i]['id'];
            $temp['desc'] = $rs_priority[$i]['descr'];
            $return_data[] = $temp;
        }
    }
	return json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );
	//echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );exit;
}
function get_assignee(){
	$return_data    	= [];
	$temp				= [];
	$rs_assign        	= db_query("id,name,office_email",
							   'cms_employees','is_active = 1', '', '', 'cms_employees.name');
	for($i = 0; $i < count($rs_assign); $i++)
    {
		$temp['id']   = $rs_assign[$i]['id'];
		$temp['desc'] = $rs_assign[$i]['name'];
		$return_data[] = $temp;
	}
	return json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );
	//echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );exit;
}
function get_emp(){
	$return_data    	= [];
	$temp				= [];
	//$access = get_accessibility(32,$_SESSION['access']);
	//if(isset($access->viewall) && $access->viewall == 1)
	//{
		$emp        	= db_query('cms_employees.id,cms_employees.name,cms_employees.office_email'
								  ,'cms_employees
								  inner join cms_tasks_new on cms_employees.id = cms_tasks_new.created_by'
								  ,'cms_employees.is_active = 1 GROUP BY cms_employees.id ORDER BY cms_employees.name ASC');
	//}
	/* else
	{
		$emp        	= db_query('id,name,office_email','cms_employees',"id =" . $_SESSION['emp_id'] . " AND is_active = 1", '', '', 'cms_employees.name');
	} */
	for($i = 0; $i < count($emp); $i++)
    {
		$temp['id']   = $emp[$i]['id'];
		$temp['desc'] = $emp[$i]['name'];
		$return_data[] = $temp;
	}
	return json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );
	//echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );exit;
}
function get_taskGroups(){
	$return_data    	= [];
	$temp				= [];
	$rs_group       	= db_query('id,descr','cms_master_list','category_id = 49 AND is_active = 1');

    if(is_array($rs_group)) {
        for($i = 0; $i < count($rs_group); $i++) {
            $temp['id']   = $rs_group[$i]['id'];
            $temp['desc'] = $rs_group[$i]['descr'];
            $return_data[] = $temp;
        }
    }
	return json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );
	//echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );exit;
}

function get_status(){
	$return_data    	= [];
	$temp				= [];
	$rs_task        	= db_query('id,descr','cms_master_list','category_id = 42 AND is_active = 1');

    if(is_array($rs_task)) {
        for($i = 0; $i < count($rs_task); $i++) {
            $temp['id']   = $rs_task[$i]['id'];
            $temp['desc'] = $rs_task[$i]['descr'];
            $return_data[] = $temp;
        }
    }
	return json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );
	//echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );exit;
}

function get_sbg_chart($params)
{
    try
    {
        log_it(__FUNCTION__, $params);
        
        $from_date      = if_property_exist($params,'date_from','');
        $to_date        = if_property_exist($params,'date_to','');
        $sbg_id         = if_property_exist($params,'sbg_id','');
        $sbd_id         = if_property_exist($params,'sbd_id','');
        $task_group_id  = if_property_exist($params,'task_group_id','');
        $task_type      = if_property_exist($params,'task_type','');
        $priority_id    = if_property_exist($params,'priority_id','');
        $status_id      = if_property_exist($params,'status_id','');
        
        $return_data    = [];

        if($from_date === NULL || $from_date == '')
        {
            return handle_fail_response('Dates are mandatory');
        }

        $where      = " cms_tasks_new.sbg_id = $sbg_id AND cms_tasks_new.created_date between '" . $from_date . " 00:00:00' AND '" . $to_date . " 23:59:59'";
        
        if($sbd_id)
        {
            $where      .= " AND cms_tasks_new.sbd_id = $sbd_id";
        }
        if($task_group_id)
        {
            $where      .= " AND cms_tasks_new.task_group_id = $task_group_id";
        }
        if($task_type)
        {
            $where      .= " AND cms_tasks_new.task_type = $task_type";
        }
        if($priority_id)
        {
            $where      .= " AND cms_tasks_new.priority_id = $priority_id";
        }
        
        if($status_id)
        {
            if($status_id == 'overdue_tasks')
            {
                $today_date = date('Y-m-d');
                $where .= ' AND DATE(cms_tasks_new.due_date) < '.' "'. $today_date.'"';
            }
            else
            {
                $where      .= " AND cms_tasks_new.status_id = $status_id";
            }
            
        }
        
        
        $rs         = db_query('cms_master_list.descr as labels, COUNT(*) AS counts, sbg.descr AS sbg_name, cms_tasks_new.status_id,cms_tasks_new.sbg_id',
                                'cms_tasks_new
                                INNER JOIN cms_master_list ON cms_master_list.id = cms_tasks_new.status_id
                                INNER JOIN cms_master_list sbg ON sbg.id = cms_tasks_new.sbg_id',
                                $where . " GROUP BY cms_tasks_new.status_id, cms_tasks_new.sbg_id");
        
        
        $rs_sbd     = db_query('COUNT(*) AS counts, sbd.descr AS labels, cms_tasks_new.sbd_id ',
                                'cms_tasks_new
                                INNER JOIN cms_master_list sbd ON sbd.id = cms_tasks_new.sbd_id',
                                $where . " GROUP BY cms_tasks_new.sbd_id");
        
        for($i = 0; $i < count($rs); $i++)
        {
            $return_data['sbg']['labels'][$i]   = $rs[$i]['labels'];
            $return_data['sbg']['data'][$i]     = $rs[$i]['counts'];
            $return_data['sbg']['data_val'][$i] = $rs[$i];
        }
        
        for($i = 0; $i < count($rs_sbd); $i++)
        {
            $return_data['sbd']['labels'][$i]   = $rs_sbd[$i]['labels'];
            $return_data['sbd']['data'][$i]     = $rs_sbd[$i]['counts'];
            $return_data['sbd']['data_val'][$i] = $rs_sbd[$i];
        }
        
        
        return handle_success_response('Success',$return_data);
    
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}

function get_sbd_chart($params)
{
    try
    {
        log_it(__FUNCTION__, $params);
        
        $from_date      = if_property_exist($params,'date_from','');
        $to_date        = if_property_exist($params,'date_to','');
        $sbd_id         = if_property_exist($params,'sbd_id','');
        $return_data    = [];
        
        /* if($from_date === NULL || $from_date == '')
        {
            return handle_fail_response('Dates are mandatory');
        } */
        
        $where      = " cms_tasks_new.sbd_id = $sbd_id";
        
        $rs         = db_query('cms_master_list.descr AS labels, COUNT(*) AS counts, sbd.descr AS sbd_name, cms_tasks_new.sbd_id',
                            'cms_tasks_new
                            INNER JOIN cms_master_list ON cms_master_list.id = cms_tasks_new.status_id
                            INNER JOIN cms_master_list sbd ON sbd.id = cms_tasks_new.sbd_id',
                            $where . " GROUP BY cms_tasks_new.status_id, cms_tasks_new.sbd_id");
        
        
        for($i = 0; $i < count($rs); $i++)
        {
            $return_data['labels'][$i]      = $rs[$i]['labels'];
            $return_data['data'][$i]        = $rs[$i]['counts'];
            $return_data['data_val'][$i]    = $rs[$i];
        }
        
        return handle_success_response('Success',$return_data);
        
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}

function get_oc_chart($params)
{
    try
    {
        log_it(__FUNCTION__, $params);
        
        $from_date      = if_property_exist($params,'date_from','');
        $to_date        = if_property_exist($params,'date_to','');
        $sbg_id         = if_property_exist($params,'sbg_id','');
        $sbd_id         = if_property_exist($params,'sbd_id','');
        $return_data    = [];
        
        if($from_date === NULL || $from_date == '')
        {
            return handle_fail_response('Dates are mandatory');
        }
        
        $where      = " cms_tasks_new.sbg_id = $sbg_id AND cms_tasks_new.sbd_id = $sbd_id AND cms_tasks_new.created_date between '" . $from_date . " 00:00:00' AND '" . $to_date . " 23:59:59'";
        
        $rs         = db_query('COUNT(*) AS counts, cms_master_employer.employer_name AS labels, cms_tasks_new.company_id',
                            'cms_tasks_new INNER JOIN cms_master_employer ON cms_master_employer.id = cms_tasks_new.company_id',
                    $where . " GROUP BY cms_tasks_new.company_id");
        
        
        for($i = 0; $i < count($rs); $i++)
        {
            $return_data['labels'][$i]      = $rs[$i]['labels'];
            $return_data['data'][$i]        = $rs[$i]['counts'];
            $return_data['data_val'][$i]    = $rs[$i];
        }
        
        return handle_success_response('Success',$return_data);
        
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}

function get_oc_detail_chart($params)
{
    try
    {
        log_it(__FUNCTION__, $params);
        
        $from_date      = if_property_exist($params,'date_from','');
        $to_date        = if_property_exist($params,'date_to','');
        $sbg_id         = if_property_exist($params,'sbg_id','');
        $sbd_id         = if_property_exist($params,'sbd_id','');
        $oc_id          = if_property_exist($params,'oc_id','');
        $return_data    = [];
        
        if($from_date === NULL || $from_date == '')
        {
            return handle_fail_response('Dates are mandatory');
        }
        
        $where      = " cms_tasks_new.sbg_id = $sbg_id AND cms_tasks_new.sbd_id = $sbd_id AND cms_tasks_new.company_id = $oc_id AND cms_tasks_new.created_date between '" . $from_date . " 00:00:00' AND '" . $to_date . " 23:59:59'";
        
        $rs         = db_query('cms_master_list.descr AS labels, COUNT(*) AS counts, cms_master_employer.employer_name AS oc_name, cms_tasks_new.company_id',
                                'cms_tasks_new 
                                INNER JOIN cms_master_list ON cms_master_list.id = cms_tasks_new.status_id
                                INNER JOIN cms_master_employer ON cms_master_employer.id = cms_tasks_new.company_id',
                    $where . " GROUP BY cms_tasks_new.status_id, cms_tasks_new.company_id");
        
        
        $sql    = get_task_sql();
        $field  = $sql['fields'];
        $table  = $sql['table'];
        
        $rs_list                = db_query($field,$table,$where,'','', "task_no",'DESC');
        $return_data['list']    = $rs_list;
        
        
        for($i = 0; $i < count($rs); $i++)
        {
            $return_data['labels'][$i]      = $rs[$i]['labels'];
            $return_data['data'][$i]        = $rs[$i]['counts'];
            $return_data['data_val'][$i]    = $rs[$i];
        }
        
        
        
        return handle_success_response('Success',$return_data);
        
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}

function get_sbg_detail_chart($params)
{
    try
    {
        log_it(__FUNCTION__, $params);
        
        $from_date      = if_property_exist($params,'date_from','');
        $to_date        = if_property_exist($params,'date_to','');
        $sbg_id         = if_property_exist($params,'sbg_id','');
        $status_id      = if_property_exist($params,'status_id','');
        $return_data    = [];
        
        if($from_date === NULL || $from_date == '')
        {
            return handle_fail_response('Dates are mandatory');
        }
        
        $where      = " cms_tasks_new.sbg_id = $sbg_id AND cms_tasks_new.created_date between '" . $from_date . " 00:00:00' AND '" . $to_date . " 23:59:59'";
        $where      .=" AND cms_tasks_new.status_id = $status_id";
        $rs         = db_query('cms_master_list.descr AS labels, COUNT(*) AS counts, sbd.descr AS sbg_name',
                                'cms_tasks_new
                                INNER JOIN cms_master_list ON cms_master_list.id = cms_tasks_new.status_id
                                INNER JOIN cms_master_list sbd ON cms_tasks_new.sbd_id = sbd.id',
                        $where . " GROUP BY cms_tasks_new.status_id, sbd.descr");
        
        
        for($i = 0; $i < count($rs); $i++)
        {
            $return_data['labels'][$i]      = $rs[$i]['sbg_name'];
            $return_data['data'][$i]        = $rs[$i]['counts'];
            $return_data['data_val'][$i]    = $rs[$i];
        }

        return handle_success_response('Success',$return_data);
        
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}

function get_sbg_report_list($params)
{
    try
    {
        log_it(__FUNCTION__, $params);
        
        $from_date      = if_property_exist($params,'date_from','');
        $to_date        = if_property_exist($params,'date_to','');
        $sbg_id         = if_property_exist($params,'sbg_id','');
        $status_id      = if_property_exist($params,'status_id','');
        $return_data    = [];
        
        if($from_date === NULL || $from_date == '')
        {
            return handle_fail_response('Dates are mandatory');
        }
        
        $where      = " cms_tasks_new.sbg_id = $sbg_id AND cms_tasks_new.status_id = $status_id AND cms_tasks_new.created_date between '" . $from_date . " 00:00:00' AND '" . $to_date . " 23:59:59'";
        $where     .= " GROUP BY cms_tasks_new.task_no";
        $sql        = get_task_sql();
        $field      = $sql['fields'];
        $table      = $sql['table'];
        
        $rs_list    = db_query($field,$table,$where,'','', "cms_tasks_new.task_no",'DESC');
        $rs_chart   = json_decode(get_sbg_detail_chart($params));
        
        
        $return_data['list']    = $rs_list;
        $return_data['chart']   = $rs_chart->data;
        
        return handle_success_response('Success',$return_data);
        
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}
function get_schedule_upload($params) {
    try {
		error_reporting(0);
        log_it(__FUNCTION__, $params);
        include_once (LIB_DIR . '/phpexcel/PHPExcel.php');
        $filename = if_property_exist($params, 'filename', '');
        $emp_id = if_property_exist($params, 'emp_id', '');
        $data = [];
        $status = true;
        if ($filename === NULL || $filename == '') {
            return handle_fail_response('filename is mandatory');
        }
        if ($emp_id === NULL || $emp_id == '') {
            return handle_fail_response('employee ID is mandatory');
        }
        $objPHPExcel = PHPExcel_IOFactory::load(constant('FILES_DIR') . "/temp/" . $filename);
        $sheet = $objPHPExcel->getSheet(0);
        $total_so_rows = $sheet->getHighestRow();
        for ($i = 2;$i <= $total_so_rows;$i++) {
            $start_date = '';
            $expiry_date = 'NULL';
            $freeze_date = 'NULL';
            $expiry_date_desc = '';
            $status = true;
            $row = $sheet->rangeToArray('A' . $i . ':T' . $i, NULL, TRUE, FALSE);
            if ($row[0][0] != '') {
                if ($row[0][12] != null) {
                    $expiry_date = gmdate("Y-m-d H:i", ($row[0][12] - 25569) * 86400);
                    $expiry_date_desc = ', it will expiry on <b>' . $expiry_date . '</b>';
                }
                $data[($i - 2) ]['title'] = trim(str_replace("'", "''", $row[0][0]));
                $data[($i - 2) ]['descr'] = trim(str_replace("'", "''", $row[0][1]));
                $data[($i - 2) ]['sbg_id'] = get_task_field_ids("cms_master_list", "descr", trim(str_replace("'", "''", $row[0][2])));
                $data[($i - 2) ]['sbd_id'] = get_task_field_ids("cms_master_list", "descr", trim(str_replace("'", "''", $row[0][3])));
                //              $data[($i - 2)]['holding_name']     = trim(str_replace("'", "''", $row[0][2]));
                $company_id = get_task_field_ids("cms_master_employer", "prefix", trim(str_replace("'", "''", $row[0][4])));
                $data[($i - 2) ]['company_id'] = $company_id;
                $company_rs = db_query_single('employer_name', 'cms_master_employer', 'id = '.$company_id);
                $data[($i - 2) ]['company_name'] = $company_rs['employer_name'];
                
                $data[($i - 2) ]['group_id'] = get_task_field_ids("cms_master_list", "descr", trim(str_replace("'", "''", $row[0][5])));
                $data[($i - 2) ]['task_type'] = get_task_field_ids("cms_master_list", "descr", trim(str_replace("'", "''", $row[0][6])), " AND category_id = 44");
                $data[($i - 2) ]['task_type_name'] = trim(str_replace("'", "''", $row[0][6]));
                $data[($i - 2) ]['dept_id'] = get_task_field_ids("cms_master_list", "descr", trim(str_replace("'", "''", $row[0][7])), " AND category_id = 1");
                $data[($i - 2) ]['dept_name'] = trim(str_replace("'", "''", $row[0][7]));
                $data[($i - 2) ]['assigned_to'] = get_task_field_ids("cms_employees", "office_email", trim(str_replace("'", "''", $row[0][8])), " AND is_active = 1");
                $data[($i - 2) ]['assigned_to_name'] = trim(str_replace("'", "''", $row[0][8]));
                $data[($i - 2) ]['reviewer'] = get_task_field_ids("cms_employees", "office_email", trim(str_replace("'", "''", $row[0][9])), " AND is_active = 1");
                $data[($i - 2) ]['reviewer_email'] = trim(str_replace("'", "''", $row[0][9]));
                $data[($i - 2) ]['approver'] = get_task_field_ids("cms_employees", "office_email", trim(str_replace("'", "''", $row[0][10])), " AND is_active = 1");
                $data[($i - 2) ]['approver_email'] = trim(str_replace("'", "''", $row[0][10]));
                $data[($i - 2) ]['priority'] = get_task_field_ids("cms_master_list", "descr", trim(str_replace("'", "''", $row[0][16])), " AND category_id = 43");
                $data[($i - 2) ]['priority_name'] = trim(str_replace("'", "''", $row[0][16]));
                $data[($i - 2) ]['schedule_type'] = trim(str_replace("'", "''", $row[0][17]));
                $start_date = gmdate("Y-m-d H:i", ($row[0][11] - 25569) * 86400);
                $data[($i - 2) ]['start_date'] = $start_date;
                $data[($i - 2) ]['expiry_date'] = $expiry_date;
                $data[($i - 2) ]['due_days'] = trim(str_replace("'", "''", $row[0][13]));
                $data[($i - 2) ]['r_due_days'] = trim(str_replace("'", "''", $row[0][14]));
                $data[($i - 2) ]['a_due_days'] = trim(str_replace("'", "''", $row[0][15]));
                $data[($i - 2) ]['status'] = "1";
                $data[($i - 2) ]['emp_id'] = "0";
                $data[($i - 2) ]['schedule_desc'] = "This task scheduled to repeat " . $row[0][17] . ", it will start on <b>" . $start_date . "</b><br/> " . "next run time will be on <b>[ " . $start_date . " ]</b>" . $expiry_date_desc;
                $data[($i - 2) ]['roll_over'] = trim(str_replace("'", "''", $row[0][18]));
                if ($row[0][19] != null) {
                    $freeze_date = gmdate("Y-m-d H:i", ($row[0][19] - 25569) * 86400);
                }
                if ($data[($i - 2) ]['company_id'] == "" || $data[($i - 2) ]['task_type'] == "" || $data[($i - 2) ]['dept_id'] == "" || $data[($i - 2) ]['assigned_to'] == "" || $data[($i - 2) ]['reviewer'] == "" || $data[($i - 2) ]['approver'] == "" || $data[($i - 2) ]['priority'] == "" || $data[($i - 2) ]['schedule_type'] == "") {
                    $status = false;
                }
                if ($data[($i - 2) ]['roll_over'] == 'YES') {
                    if ($freeze_date == null) {
                        $status = false;
                    }
                }
                $data[($i - 2) ]['status'] = $status;
            }
        }
		error_reporting(E_ALL);
        return handle_success_response('Success', $data);
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}
function add_schedule_upload_batch($params) {
    try {
        log_it(__FUNCTION__, $params);
        $s_data = if_property_exist($params, 'scheduled_data', '');
        $emp_id = if_property_exist($params, 'emp_id', '');
        if ($s_data === NULL || $s_data == '') {
            return handle_fail_response('Scheduled Data is mandatory');
        }
        if ($emp_id === NULL || $emp_id == '') {
            return handle_fail_response('employee ID is mandatory');
        }
        $count = count($s_data);
        for ($i = 0;$i < (int)$count;$i++) {
            if ($s_data[$i]->status == true) {
                $rs = get_doc_primary_no('task_no', 'cms_master_tasks');
                if ($rs == false) {
                    if (constant('CHAT_ERROR_ID') != '') {
                        //CHAT PUSH NOTIFICATION
                        require_once constant('MODULES_DIR') . '/chat.php';
                        $chat_data['emp_id'] = "15";
                        $chat_data['emp_name'] = constant('APPLICATION_TITLE');
                        $chat_data['to_chat_ids'] = json_decode('{"name" : "Admin","id" : "' . constant("CHAT_ERROR_ID") . '"}');
                        $chat_data['message'] = "

*Module : " . __FUNCTION__ . " *
 *Error generating task number. Please contact admin*";
                        chat_post_message(json_decode(json_encode($chat_data)));
                        //CHAT PUSH NOTIFICATION
                        
                    }
                    continue;
                } else {
                    $task_no = $rs['task_no'];
                }
                if ($s_data[$i]->expiry_date == "NULL") {
                    $s_data[$i]->expiry_date = NULL;
                }
                $data = array(':task_no' => $task_no, ':task_title' => $s_data[$i]->title, ':descr' => $s_data[$i]->descr, ':sbg_id' => $s_data[$i]->sbg_id, ':sbd_id' => $s_data[$i]->sbd_id, ':company_id' => $s_data[$i]->company_id, ':task_type' => $s_data[$i]->task_type, ':dept_id' => $s_data[$i]->dept_id, ':assigned_to_id' => $s_data[$i]->assigned_to, ':reviewer_id' => $s_data[$i]->reviewer, ':approver_id' => $s_data[$i]->approver, ':start_date' => $s_data[$i]->start_date, ':expiry_date' => $s_data[$i]->expiry_date, ':next_run_time' => $s_data[$i]->start_date, ':due_days' => $s_data[$i]->due_days, ':reviewer_due_days' => $s_data[$i]->r_due_days, ':approver_due_days' => $s_data[$i]->a_due_days, ':priority_id' => $s_data[$i]->priority, ':date_to_add' => get_interval_command($s_data[$i]->schedule_type), ':schedule_type' => strtolower($s_data[$i]->schedule_type), ':schedule_desc' => $s_data[$i]->schedule_desc, ':json_field' => '{"attachment": []}', ':is_active' => $s_data[$i]->status);
                $data = add_timestamp_to_array($data, $emp_id, 0);
                $id = db_add($data, 'cms_master_tasks');
                $s_data[$i]->result = $id;
            }
        }
        return handle_success_response('Success', $s_data);
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}
function update_schedule_task_status($params) {
    try {
        log_it(__FUNCTION__, $params);
        $emp_id = if_property_exist($params, 'emp_id');
        $task_no = if_property_exist($params, 'task_no');
        $status_id = if_property_exist($params, 'status_id');
        if (!isset($emp_id) || $emp_id == '') {
            return handle_fail_response('Missing employee ID.');
        }
        if (!isset($task_no) || $task_no == '') {
            return handle_fail_response('Missing task ID.');
        }
        $data = array(':task_no' => $task_no, ':is_active' => $status_id);
        $data = add_timestamp_to_array($data, $emp_id, 1);
        $result = db_update($data, 'cms_master_tasks', 'task_no');
        return handle_success_response('Success', $result);
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}
function get_task_field_ids($table_name, $search_field, $search_val, $additonal_search = '') {
    try {
        log_it(__FUNCTION__, $table_name . ' ' . $search_field . ' ' . $search_val);
        $id = '';
        $rs = db_execute_custom_sql("SELECT id FROM $table_name WHERE $search_field like '%" . stripcslashes($search_val) . "%' $additonal_search");
        if (count($rs) > 0) {
            $id = $rs[0]['id'];
        }
        return $id;
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}
function get_interval_command($schedule_type) {
    try {
        log_it(__FUNCTION__, $schedule_type);
        $date_to_add = "INTERVAL 1 DAY";
        switch (strtolower($schedule_type)) {
            case "daily":
                $date_to_add = "INTERVAL 1 DAY";
            break;
            case "weekly":
                $date_to_add = "INTERVAL 1 WEEK";
            break;
            case "monthly":
                $date_to_add = "INTERVAL 1 MONTH";
            break;
            case "quarterly":
                $date_to_add = "INTERVAL 1 QUARTER";
            break;
            case "biannually":
                $date_to_add = "INTERVAL 6 MONTH";
            break;
            case "yearly":
                $date_to_add = "INTERVAL 1 YEAR";
            break;
            default:
                $date_to_add = "INTERVAL 1 DAY";
        }
        return $date_to_add;
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}
function add_edit_schedule_tasks_batch($params) {
    try {
        log_it(__FUNCTION__, $params);
        $task_no = if_property_exist($params, 'task_no');
        $assigned_to = if_property_exist($params, 'assigned_to');
        $is_active = if_property_exist($params, 'is_active');
        $type = if_property_exist($params, 'type');
        $emp_id = if_property_exist($params, 'emp_id');
        $fields = '';
        if (!isset($emp_id) || $emp_id == '') {
            return handle_fail_response('Missing employee ID.');
        }
        if (!isset($task_no) || $task_no == '') {
            return handle_fail_response('Missing task ID.');
        }
        if ($type == 1) {
            if (!isset($assigned_to) || $assigned_to == '') {
                return handle_fail_response('Missing Assigned To.');
            }
            $fields = "assigned_to_id = $assigned_to";
        }
        if ($type == 2) {
            if (!is_numeric($is_active)) {
                return handle_fail_response('Missing Status ID.');
            }
            $fields = "is_active = $is_active";
        }
        if ($fields != '') {
            $sql = "UPDATE cms_master_tasks set $fields";
            $sql = add_timestamp_to_array_custom_sql($sql, $emp_id, 1);
            $sql.= " WHERE task_no in($task_no)";
            $result = db_execute_sql($sql);
        }
        return handle_success_response('Success', $result);
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}
function get_tasks_template_list($params) {
    try {
        log_it(__FUNCTION__, $params);
        $title = if_property_exist($params, 'title', '');
        $is_active = if_property_exist($params, 'is_active', '');
        $dept_id = if_property_exist($params, 'dept_id', '');
        $created_by = if_property_exist($params, 'created_by', '');
        $start_index = if_property_exist($params, 'start_index', 0);
        $limit = if_property_exist($params, 'limit', MAX_NO_OF_RECORDS);
        $view_all = if_property_exist($params, 'view_all', 0);
        $is_admin = if_property_exist($params, 'is_admin', '');
        $emp_id = if_property_exist($params, 'emp_id', '');
        if ($view_all == 1) {
            $where = "1 = 1";
        } else {
            $where = "cms_master_tasks_template.created_by in (" . $emp_id . ")";
        }
        if ($created_by != "") {
            $where.= " AND cms_master_tasks_template.created_by in(" . $created_by . ")";
        }
        if ($title != '') {
            $where.= " AND cms_master_tasks_template.task_title like '%" . $title . "%'";
        }
        $where.= " AND cms_master_tasks_template.is_active in(" . $is_active . ")";
        $rs = db_query_list("cms_master_tasks_template.id
            ,cms_master_tasks_template.task_title
			,cms_master_tasks_template.sbg_id
            ,cms_master_tasks_template.sbd_id
			,cms_master_tasks_template.task_group_id
			,cms_master_tasks_template.company_id
			,cms_master_tasks_template.due_date
			,cms_master_tasks_template.priority_id
			,cms_master_tasks_template.roll_over
			,cms_master_tasks_template.freeze_date
			,cms_master_tasks_template.status_id
            ,cms_master_tasks_template.descr
            ,cms_master_tasks_template.descr_action
            ,cms_master_tasks_template.task_type_id
            ,IFNULL(cms_master_list.descr,'-') as dept_name
            ,task_type_list.descr as task_type_desc
            ,cms_master_tasks_template.dept_id
            ,cms_master_tasks_template.created_date
            ,cms_master_tasks_template.created_by
            , cms_master_tasks_template.is_active
            , concat('" . constant("UPLOAD_DIR_URL") . "', 'tasks_template', '/',cms_master_tasks_template.id, '/') as filepath
            , JSON_UNQUOTE(cms_master_tasks_template.json_field) as json_field
            , cms_employees.name as created_by_name
            ", "cms_master_tasks_template
            LEFT JOIN cms_employees
                ON (cms_master_tasks_template.created_by = cms_employees.id)
            LEFT JOIN cms_master_list
                ON (cms_master_tasks_template.dept_id = cms_master_list.id)
            LEFT JOIN cms_master_list as task_type_list
                ON (cms_master_tasks_template.task_type_id = task_type_list.id)
            ", $where, $start_index, $limit, "cms_master_tasks_template.id", 'DESC');
		
		$assignees      = db_query("cmtt.id as taskId, cms_tasks_template_new_assignees.id
                            , cms_tasks_template_new_assignees.type
                            , cms_tasks_template_new_assignees.user_id
                            , cms_tasks_template_new_assignees.status_id
                            , cms_tasks_template_new_assignees.created_by
                            , cms_tasks_template_new_assignees.action
                            , cms_tasks_template_new_assignees.json_field
                            , CASE cms_tasks_template_new_assignees.type
                            when 'individual' then emp_tbl.name
                            when 'company' then contacts_tbl.name
                            END as name
                            , CASE cms_tasks_template_new_assignees.type
                            when 'individual' then employer_tbl.employer_name
                            when 'company' then clients_tbl.name
                            END as company
                            , date_format(cms_tasks_template_new_assignees.deadline_date,'" . constant('UI_DATE_FORMAT') .  "') as deadline_date
                            , (SELECT descr FROM cms_master_list WHERE
                            cms_master_list.id = cms_tasks_template_new_assignees.status_id
                            ) AS status_name"
                            , "cms_tasks_template_new_assignees
                            left join cms_employees emp_tbl on emp_tbl.id = cms_tasks_template_new_assignees.user_id
                            left join cms_master_employer employer_tbl on employer_tbl.id = emp_tbl.employer_id
                            left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_tasks_template_new_assignees.user_id
                            left join cms_clients clients_tbl on clients_tbl.id = contacts_tbl.client
							 left join cms_master_tasks_template cmtt on cmtt.id = cms_tasks_template_new_assignees.task_id
							"
                            , "cms_tasks_template_new_assignees.is_active = 1 ");
		
        if ($assignees && count(array($assignees)) > 0) 
        {
			
            $count = count(array($assignees));
            for ($i = 0; $i < $count; $i++) {
                $assignee_id = $assignees[$i]["id"];
            }
        }
        $rs['assignees'] = $assignees;
		
        if (count((array)$rs) < 1 || !isset($rs)) {
            return handle_fail_response('No record found');
        } else {
            echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs ) );exit;
        }
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}
function add_edit_tasks_template($params) {
    try {
        log_it(__FUNCTION__, $params);
		
        $task_no = if_property_exist($params, 'id');
        $title = if_property_exist($params, 'title');
        $descr = if_property_exist($params, 'descr');
        $descr_action = if_property_exist($params, 'descr_action');
        $task_type_id = if_property_exist($params, 'task_type_id');
        $dept_id = if_property_exist($params, 'dept_id');
        $attachment = if_property_exist($params, 'attachment');
        $emp_id = if_property_exist($params, 'emp_id');
        $checklist = if_property_exist($params, 'checklist');
        $is_active = if_property_exist($params, 'is_active');
		$status = if_property_exist($params, 'status');
		$priority = if_property_exist($params, 'priority');
		$due_date = if_property_exist($params, 'due_date');
		$sbg_id = if_property_exist($params, 'sbg_id');
        $sbd_id = if_property_exist($params, 'sbd_id');
        $oc_id = if_property_exist($params, 'oc_id');
		$task_group = if_property_exist($params, 'task_group');
		
		
		
        $data = array(':task_title' => $title, 
		':descr' => $descr 
		,':sbg_id' => $sbg_id
        ,':sbd_id' => $sbd_id
		, ':company_id' => $oc_id
		, ':task_group_id' => $task_group
		, ':due_date' => $due_date
		, ':priority_id' => $priority
		,':descr_action' => $descr_action
		,':dept_id' => $dept_id
		,':task_type_id' => $task_type_id
		, ':status_id' => $status
		,':json_field' => json_encode(array('attachment' => $attachment, 'checklist' => $checklist))
		,':is_active' => $is_active);
			
        if (is_data_exist('cms_master_tasks_template', 'id', $task_no)) {
            $data[':id'] = $task_no;
            $data = add_timestamp_to_array($data, $emp_id, 1);
            $result = db_update($data, 'cms_master_tasks_template', 'id');
        } else {
            $data[':id'] = get_db_UUID();
			$task_no = $data[':id'];
            $data = add_timestamp_to_array($data, $emp_id, 0);
            $id = db_add($data, 'cms_master_tasks_template');
        }
       $params->id = $task_no;
            $params->action = "add";
            $params->message = "(NEW)";
			
        //return handle_success_response('Success', $params);
		echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$params ) );exit;
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}
function update_task_template_attachment($params) {
    try {
        log_it(__FUNCTION__, $params);
        $emp_id = if_property_exist($params, 'emp_id');
        $id = if_property_exist($params, 'id');
        $old_file = if_property_exist($params, 'old_file');
        $new_file = if_property_exist($params, 'new_file');
        if (!isset($emp_id) || $emp_id == '') {
            return handle_fail_response('Missing employee ID.');
        }
        if (!isset($task_no) || $task_no == '') {
            return handle_fail_response('Missing task ID.');
        }
        if (!isset($old_file) || $old_file == '') {
            return handle_fail_response('Old Filename is missing');
        }
        if (!isset($new_file) || $new_file == '') {
            return handle_fail_response('New Filename is missing');
        }
        $sql = "UPDATE cms_master_tasks_template SET json_field = IFNULL(JSON_REPLACE(json_field,JSON_UNQUOTE(JSON_SEARCH(json_field, 'one', '%" . $old_file . "%',NULL, '$.attachment'))
                                ,'" . $new_file . "'),json_field)
                                WHERE id = '" . $id . "'";
        $result = db_execute_sql($sql);
        $rs = db_query("json_field->'$.attachment' as attachment,created_by", "cms_master_tasks_template", "id = '" . $task_no . "'");
        $rs[0]['filepath'] = constant("UPLOAD_DIR_URL") . 'tasks_template/' . $id . '/';
        $rs[0]['attachment'] = json_decode($rs[0]['attachment']);
        return handle_success_response('Success', $rs[0] ? $rs[0] : array());
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}
function get_tasks_report_list($params) {
    try {
        log_it(__FUNCTION__, $params);
        $where = $join = '';
        foreach ($params as $key => $param) {
            $where.= $key == 0 ? '' : ' and ';
            $search_condition = $param->search_condition;
            $search_field = $param->search_field;
            $fields_with_datepicker = array('due_date', 'created_date');
            if (in_array($search_field, $fields_with_datepicker)) {
                $original = $param->search_value;
                //Explode the string into an array.
                $exploded = explode("-", $original);
                //Reverse the order.
                $exploded = array_reverse($exploded);
                //Convert it back into a string.
                $newFormat = implode("-", $exploded);
                $where.= 'DATE(cms_tasks_new.' . $param->search_field . ') ' . $search_condition . ' "' . $newFormat . '"';
            } elseif ($search_field == 'assigned_to_id') {
                $where.= 'cms_tasks_new.' . $param->search_field . ' IN ' . ' (' . $param->search_value . ')';
            } elseif ($search_field == 'overdue_tasks') {
                $today_date = date('Y-m-d');
                $where.= 'DATE(cms_tasks_new.due_date) < ' . ' "' . $today_date . '"';
            } else {
                if ($search_condition == 'like') {
                    $where.= 'cms_tasks_new.' . $param->search_field . ' ' . $search_condition . ' "%' . $param->search_value . '%"';
                } else {
                    $where.= 'cms_tasks_new.' . $param->search_field . ' ' . $search_condition . ' "' . $param->search_value . '"';
                }
            }
        }
        $rs = db_query("cms_tasks_new.task_no
                , cms_tasks_new.task_title
                , task_type.descr as task_type_name
                , DATE_FORMAT(cms_tasks_new.due_date, '%d-%m-%Y') as due_date
                , DATE_FORMAT(cms_tasks_new.created_date, '%d-%m-%Y') as created_date
                , employee.name as employee_name
                ", "cms_tasks_new
                INNER JOIN cms_master_list task_type ON cms_tasks_new.task_type = task_type.id
                INNER JOIN cms_employees employee ON cms_tasks_new.created_by = employee.id
            " . $join, $where, '', '', 'task_no', 'DESC');
        // echo '<pre>';print_r($rs);exit;
        if (count($rs) < 1 || !isset($rs)) {
            return handle_fail_response('No record found');
        } else {
            return handle_success_response('Success', $rs);
        }
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}
function get_task_drop_down_values() {
    try {
        $result = array();
        $cms_master_list = array("sbg_id" => 47, "sbd_id" => 48, "task_group_id" => 49, "dept_id" => 1, "task_type" => 44, "priority_id" => 43, "status_id" => 42);
        foreach ($cms_master_list as $key => $value) {
            $result[$key] = db_query("cms_master_list.id as id, cms_master_list.descr as value", "cms_master_list", "cms_master_list.category_id = $value");
        }
        $result['employees'] = db_query("cms_employees.id as id, cms_employees.name as value", "cms_employees", "cms_employees.is_active = 1", "", "", "cms_employees.name");

        $result['company_id'] = db_query("cms_master_employer.id, cms_master_employer.employer_name as value", "cms_master_employer", "cms_master_employer.is_active = 1");

        $result['is_active'] = array(array('id' => 1, 'value' => 'Active'), array('id' => 0, 'value' => 'Inactive'));
        if (count($result) < 1 || !isset($result)) {
            return handle_fail_response('No record found');
        } else {
            return handle_success_response('Success', $result);
        }
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function get_tasks_for_timesheet($params)
{
    try
    {
        log_it(__FUNCTION__, $params);
        
        $emp_id = if_property_exist($params, 'emp_id');

        $field_id_array =  array( 'admin_tasks'      =>  61
                                , 'default_tasks'    =>  62
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
        
        $where = " cms_tasks_new_assignees.is_active = 1 and FIND_IN_SET(" . $emp_id . ", cms_tasks_new_assignees.user_id)";
        
        $drop_down_groups['tasks_drop_down'] = db_query
        (
                "cms_tasks_new.task_no
                ,cms_tasks_new.task_title",
                "cms_tasks_new
                 LEFT JOIN cms_tasks_new_assignees on cms_tasks_new_assignees.task_no = cms_tasks_new.task_no",
                $where
        );
        return handle_success_response('Success',$drop_down_groups);
        
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function get_master_task_detail($params) 
{
    try 
    {
        log_it(__FUNCTION__, $params);
        $task_no = if_property_exist($params, 'task_no', '');
        $rs['details'] = db_query_single("cms_master_tasks.task_no
                                        , cms_master_tasks.task_title
                                        , cms_master_tasks.descr
                                        , cms_master_tasks.descr_action
                                        , cms_master_tasks.sbg_id
                                        , cms_master_tasks.sbd_id
                                        , cms_master_tasks.task_group_id
                                        , cms_master_tasks.company_id
                                        , cms_master_tasks.task_type
                                        , task_type_list.descr as task_type_desc
                                        , cms_master_tasks.dept_id
                                        , cms_master_tasks.assigned_to_id
                                        , cms_master_tasks.reviewer_id
                                        , cms_master_tasks.approver_id
                                        , cms_master_tasks.start_date
                                        , IFNULL(cms_master_tasks.expiry_date,'') as expiry_date
                                        , cms_master_tasks.due_days
                                        , cms_master_tasks.reviewer_due_days
                                        , cms_master_tasks.approver_due_days
                                        , cms_master_tasks.priority_id
                                        , RPAD(cms_master_list.descr,10,' ') AS priority_name
                                        , date_format(cms_master_tasks.next_run_time,'" . constant('DISPLAY_DATETIME_FORMAT') . "') as next_run_time
                                        , IFNULL(date_format(cms_master_tasks.last_run_time,'" . constant('DISPLAY_DATETIME_FORMAT') . "'),'YET TO RUN') as last_run_time               
                                        , cms_master_tasks.schedule_desc
                                        , cms_master_tasks.schedule_type
                                        , cms_master_tasks.created_date
                                        , cms_master_tasks.created_by
                                        , cms_master_tasks.roll_over
                                        , cms_master_tasks.freeze_date
                                        , cms_master_tasks.is_active
                                        , IF(cms_master_tasks.is_active = 1,'ACTIVE','IN-ACTIVE') as active_status
                                        , concat('" . constant("UPLOAD_DIR_URL") . "', 'schedule_tasks_doc', '/',cms_master_tasks.task_no, '/') as filepath
                                        , JSON_UNQUOTE(cms_master_tasks.json_field) as json_field
                                        , cms_employees.name as created_by_name
                                        , DATEDIFF(cms_master_tasks.expiry_date, NOW()) AS days_left
                                        "
                                        , "cms_master_tasks 
                                        LEFT JOIN cms_employees
                                            ON (cms_master_tasks.created_by = cms_employees.id)
                                        LEFT JOIN cms_master_list
                                            ON (cms_master_tasks.priority_id = cms_master_list.id)
                                        LEFT JOIN cms_master_list as task_type_list
                                            ON (cms_master_tasks.task_type = task_type_list.id)"
                                        , "cms_master_tasks.task_no = '" . $task_no . "'");

        $assignees      = db_query("cms_master_tasks_assignees.id
                            , cms_master_tasks_assignees.type
                            , cms_master_tasks_assignees.user_id
                            , cms_master_tasks_assignees.status_id
                            , cms_master_tasks_assignees.created_by
                            , cms_master_tasks_assignees.action
                            , cms_master_tasks_assignees.json_field
                            , CASE cms_master_tasks_assignees.type
                            when 'individual' then emp_tbl.name
                            when 'company' then contacts_tbl.name
                            END as name
                            , CASE cms_master_tasks_assignees.type
                            when 'individual' then employer_tbl.employer_name
                            when 'company' then clients_tbl.name
                            END as company
                            , date_format(cms_master_tasks_assignees.deadline_date,'" . constant('UI_DATE_FORMAT') .  "') as deadline_date
                            , (SELECT descr FROM cms_master_list WHERE
                            cms_master_list.id = cms_master_tasks_assignees.status_id
                            ) AS status_name"
                            , "cms_master_tasks_assignees
                            left join cms_employees emp_tbl on emp_tbl.id = cms_master_tasks_assignees.user_id
                            left join cms_master_employer employer_tbl on employer_tbl.id = emp_tbl.employer_id
                            left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_master_tasks_assignees.user_id
                            left join cms_clients clients_tbl on clients_tbl.id = contacts_tbl.client"
                            , "cms_master_tasks_assignees.is_active = 1 and cms_master_tasks_assignees.task_no = '" . $task_no . "'");

        if (count($assignees) > 0) 
        {
            $count = count($assignees);
            for ($i = 0; $i < $count; $i++) {
                $assignee_id = $assignees[$i]["id"];
                $assignees[$i]['attachments'] = get_assignee_attachments($params, $assignee_id);
            }
        }
        $rs['assignees'] = $assignees;
        if (count($rs['details']) < 1 || !isset($rs['details'])) 
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

function get_assignee_attachments($params, $assignee_id)
{
    try
    {
        log_it(__FUNCTION__, $params);
        
        $task_no                = if_property_exist($params, 'task_no');
        require_once constant('MODULES_DIR') . '/attachments.php';
        $params->primary_id     = $task_no;
        $params->secondary_id   = $assignee_id;
        $params->module_id      = 31;
        return json_decode(get_attachment($params))->data->attachment;
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function remove_assignee_for_master_task($params) 
{
    try 
    {
        log_it(__FUNCTION__, $params);
        $assignee_id    = if_property_exist($params, 'assignee_id');
        $emp_id         = if_property_exist($params, 'emp_id');
        // db_execute_sql("DELETE FROM cms_tasks_new_assignees WHERE id = '".$assignee_id."'");

        $data = array(':id' => $assignee_id, ':is_active' => 0);
        $data = add_timestamp_to_array($data, $emp_id, 1);
        db_update($data, 'cms_master_tasks_assignees', 'id');

        return handle_success_response('Success', true);
    }
    catch(Exception $e) 
    {
        handle_exception($e);
    }
}

function add_assignee_for_master_task($params) 
{
    try 
    {
        log_it(__FUNCTION__, $params);
        $id             = if_property_exist($params, 'id');
        $task_no        = if_property_exist($params, 'task_no');
        $type           = if_property_exist($params, 'type');
        $user_id        = if_property_exist($params, 'user_id');
        $action         = if_property_exist($params, 'action');
        $deadline_date  = if_property_exist($params, 'deadline_date');
        $status_id      = if_property_exist($params, 'status_id');
        $emp_id         = if_property_exist($params, 'emp_id');
        
        $deadline_date = convert_to_date($deadline_date);

        $data = array(
            ':id'             => $id
          , ':task_no'        => $task_no
          , ':type'           => $type
          , ':user_id'        => $user_id
          , ':action'         => $action
          , ':deadline_date'  => $deadline_date
          , ':status_id'      => $status_id);

        if($id)
        {
            $data = add_timestamp_to_array($data, $emp_id, 1);
            db_update($data, 'cms_master_tasks_assignees', 'id');
        }
        else
        {
            $id = get_db_UUID();
            $data[':id'] = $id;
            $data = add_timestamp_to_array($data, $emp_id, 0);
            db_add($data, 'cms_master_tasks_assignees');
        }
        
        $rs = db_query_single("cms_master_tasks_assignees.id
                             , cms_master_tasks_assignees.type
                             , cms_master_tasks_assignees.user_id
                             , cms_master_tasks_assignees.status_id
                             , cms_master_tasks_assignees.created_by
                             , cms_master_tasks_assignees.json_field
                             , cms_master_tasks_assignees.action
                             , CASE cms_master_tasks_assignees.type
                                when 'individual' then emp_tbl.name
                                when 'company' then contacts_tbl.name
                                END as name
                            , CASE cms_master_tasks_assignees.type
                                when 'individual' then employer_tbl.employer_name
                                when 'company' then clients_tbl.name
                                END as company
                             , date_format(cms_master_tasks_assignees.deadline_date,'" . constant('UI_DATE_FORMAT') .  "') as deadline_date
                             , (SELECT descr FROM cms_master_list WHERE
                                cms_master_list.id = cms_master_tasks_assignees.status_id
                               ) AS status_name"
                             , "cms_master_tasks_assignees
                                left join cms_employees emp_tbl on emp_tbl.id = cms_master_tasks_assignees.user_id
                                left join cms_master_employer employer_tbl on employer_tbl.id = emp_tbl.employer_id
                                left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_master_tasks_assignees.user_id
                                left join cms_clients clients_tbl on clients_tbl.id = contacts_tbl.client"
                             , "cms_master_tasks_assignees.id = '" . $id . "'");

        echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs ) );exit;
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function save_checklist_for_master_task($params) 
{
    try 
    {
        log_it(__FUNCTION__, $params);
        $assignee_id    = if_property_exist($params, 'assignee_id');
        $checklist      = if_property_exist($params, 'checklist');
        $emp_id         = if_property_exist($params, 'emp_id');
        
        $json_field['checklist'] = $checklist;

        $data = array(
            ':id'             => $assignee_id
          , ':json_field'     => json_encode($json_field));
        $data = add_timestamp_to_array($data, $emp_id, 1);
		
        db_update($data, 'cms_master_tasks_assignees', 'id');

        $rs = db_query_single("cms_master_tasks_assignees.id
                             , cms_master_tasks_assignees.type
                             , cms_master_tasks_assignees.user_id
                             , cms_master_tasks_assignees.status_id
                             , cms_master_tasks_assignees.created_by
                             , cms_master_tasks_assignees.json_field
                             , cms_master_tasks_assignees.action
                             , CASE cms_master_tasks_assignees.type
                                when 'individual' then emp_tbl.name
                                when 'company' then contacts_tbl.name
                                END as name
                            , CASE cms_master_tasks_assignees.type
                                when 'individual' then employer_tbl.employer_name
                                when 'company' then clients_tbl.name
                                END as company
                             , date_format(cms_master_tasks_assignees.deadline_date,'" . constant('UI_DATE_FORMAT') .  "') as deadline_date
                             , (SELECT descr FROM cms_master_list WHERE
                                cms_master_list.id = cms_master_tasks_assignees.status_id
                               ) AS status_name"
                             , "cms_master_tasks_assignees
                                left join cms_employees emp_tbl on emp_tbl.id = cms_master_tasks_assignees.user_id
                                left join cms_master_employer employer_tbl on employer_tbl.id = emp_tbl.employer_id
                                left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_master_tasks_assignees.user_id
                                left join cms_clients clients_tbl on clients_tbl.id = contacts_tbl.client"
                             , "cms_master_tasks_assignees.id = '" . $assignee_id . "'");
		
        echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs ) );exit;
    }
    catch(Exception $e) 
    {
        handle_exception($e);
    }
}

function get_tasks_drop_down_values($params)
{
    try
    {   
        
        $view_all                   = if_property_exist($params, 'view_all',false);
        $emp_id                     = if_property_exist($params, 'emp_id',false);
        $lead_access_view_all       = if_property_exist($params, 'lead_access_view_all',false);
        $lead_access_view           = if_property_exist($params, 'lead_access_view',false);

        $field_id_array             =   array(  'status'          =>  42
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

        //load all clients, vendors if the employee have view_all access
        if($lead_access_view_all == 1)
        {
            $where  =  "cms_clients.is_active = 1";
        }
        else
        {
            $where  =   "cms_clients.is_active = 1 AND FIND_IN_SET(" . $emp_id . ", cms_clients.assign_emp_id)";
        }

        $drop_down_groups['assign_to']['employees'] = db_query
                                                    (
                                                        " cms_employees.id as id
                                                        , cms_employees.name as descr
                                                        "
                                                        , "cms_employees
                                                        LEFT JOIN cms_master_employer tbl_employer on FIND_IN_SET(tbl_employer.id, JSON_UNQUOTE(JSON_EXTRACT(cms_employees.json_field, '$.employer')))"
                                                        , "cms_employees.is_active = 1"
                                                    );

        $drop_down_groups['assign_to']['companies'] = $drop_down_groups['client'] = array();

        if($lead_access_view == 1)
        {   
            $drop_down_groups['assign_to']['companies']  =   db_query
                                                            (
                                                                " cms_clients_contacts.id
                                                                , cms_clients_contacts.name as descr
                                                                "
                                                                , "cms_clients_contacts
                                                                LEFT JOIN cms_clients ON cms_clients.id = cms_clients_contacts.client"
                                                                , $where.' AND cms_clients_contacts.email <> "" GROUP BY cms_clients.id'
                                                            );

        }
        
		echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$drop_down_groups ) );exit;
       
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}

function add_assignee_for_task($params) 
{
    try 
    {
        log_it(__FUNCTION__, $params);
        $id             = if_property_exist($params, 'id');
        $task_no        = if_property_exist($params, 'task_no');
        $type           = if_property_exist($params, 'type');
        $user_id        = if_property_exist($params, 'user_id');
        $action         = if_property_exist($params, 'action');
        $deadline_date  = if_property_exist($params, 'deadline_date');
        $status_id      = if_property_exist($params, 'status_id');
        $emp_id         = if_property_exist($params, 'emp_id');
        
        $deadline_date = convert_to_date($deadline_date);

        $data = array(
            ':id'             => $id
          , ':task_no'        => $task_no
          , ':type'           => $type
          , ':user_id'        => $user_id
          , ':action'         => $action
          , ':deadline_date'  => $deadline_date
          , ':status_id'      => $status_id);

        if($id)
        {
            $data = add_timestamp_to_array($data, $emp_id, 1);
            db_update($data, 'cms_tasks_new_assignees', 'id');
        }
        else
        {
            $id = get_db_UUID();
            $data[':id'] = $id;
            $data = add_timestamp_to_array($data, $emp_id, 0);
            db_add($data, 'cms_tasks_new_assignees');
            send_email_task_notification($params, $id);
        }
        
        $rs = db_query_single("cms_tasks_new_assignees.id
                             , cms_tasks_new_assignees.type
                             , cms_tasks_new_assignees.user_id
                             , cms_tasks_new_assignees.status_id
                             , cms_tasks_new_assignees.created_by
                             , cms_tasks_new_assignees.json_field
                             , cms_tasks_new_assignees.action
                             , CASE cms_tasks_new_assignees.type
                                when 'individual' then emp_tbl.name
                                when 'company' then contacts_tbl.name
                                END as name
                            , CASE cms_tasks_new_assignees.type
                                when 'individual' then employer_tbl.employer_name
                                when 'company' then clients_tbl.name
                                END as company
                             , date_format(cms_tasks_new_assignees.deadline_date,'" . constant('UI_DATE_FORMAT') .  "') as deadline_date
                             , (SELECT descr FROM cms_master_list WHERE
                                cms_master_list.id = cms_tasks_new_assignees.status_id
                               ) AS status_name"
                             , "cms_tasks_new_assignees
                                left join cms_employees emp_tbl on emp_tbl.id = cms_tasks_new_assignees.user_id
                                left join cms_master_employer employer_tbl on employer_tbl.id = emp_tbl.employer_id
                                left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_tasks_new_assignees.user_id
                                left join cms_clients clients_tbl on clients_tbl.id = contacts_tbl.client"
                             , "cms_tasks_new_assignees.id = '" . $id . "'");

        echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs ) );exit;
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function add_assignee_for_task_template($params) 
{
    try 
    {
        log_it(__FUNCTION__, $params);
        $id             = if_property_exist($params, 'id');
        $task_no        = if_property_exist($params, 'task_no');
        $type           = if_property_exist($params, 'type');
        $user_id        = if_property_exist($params, 'user_id');
        $action         = if_property_exist($params, 'action');
        $emp_id         = if_property_exist($params, 'emp_id');
       
		
        $data = array(
            ':id'             => $id
          , ':task_id'        => $task_no
          , ':type'           => $type
          , ':user_id'        => $user_id
          , ':action'         => $action);
			
        if($id)
        {

            $data = add_timestamp_to_array($data, $emp_id, 1);
            db_update($data, 'cms_tasks_template_new_assignees', 'id');
        }
        else
        {

            $id = get_db_UUID();
            $data[':id'] = $id;
			
            $data = add_timestamp_to_array($data, $emp_id, 0);
			
            db_add($data, 'cms_tasks_template_new_assignees');
            //send_email_task_notification($params, $id);
        }
        
        $rs = db_query_single("cms_tasks_template_new_assignees.id
                             , cms_tasks_template_new_assignees.type
                             , cms_tasks_template_new_assignees.user_id
                             , cms_tasks_template_new_assignees.created_by
                             , cms_tasks_template_new_assignees.json_field
                             , cms_tasks_template_new_assignees.action
                             , CASE cms_tasks_template_new_assignees.type
                                when 'individual' then emp_tbl.name
                                when 'company' then contacts_tbl.name
                                END as name
                            , CASE cms_tasks_template_new_assignees.type
                                when 'individual' then employer_tbl.employer_name
                                when 'company' then clients_tbl.name
                                END as company"
                             , "cms_tasks_template_new_assignees
                                left join cms_employees emp_tbl on emp_tbl.id = cms_tasks_template_new_assignees.user_id
                                left join cms_master_employer employer_tbl on employer_tbl.id = emp_tbl.employer_id
                                left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_tasks_template_new_assignees.user_id
                                left join cms_clients clients_tbl on clients_tbl.id = contacts_tbl.client"
                             , "cms_tasks_template_new_assignees.id = '" . $id . "'");

        echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs ) );exit;
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function get_task_detail($params) 
{
    try 
    {
        log_it(__FUNCTION__, $params);
        $task_no = if_property_exist($params, 'task_no', '');
        $rs['details'] = db_query_single("cms_tasks_new.task_no
                                        , cms_tasks_new.task_title
                                        , cms_tasks_new.descr
                                        , (SELECT GROUP_CONCAT(user_id)
                                            FROM cms_tasks_new_assignees
                                            WHERE FIND_IN_SET(cms_tasks_new_assignees.task_no,cms_tasks_new.task_no)
                                            ) AS assigned_to_id
                                        , cms_tasks_new.sbg_id
                                        , cms_tasks_new.sbd_id
                                        , cms_tasks_new.company_id
                                        , cms_tasks_new.task_group_id
                                        , cms_tasks_new.due_date
                                        , cms_tasks_new.priority_id
                                        , cms_tasks_new.dept_id
                                        , cms_tasks_new.task_type
                                        , cms_tasks_new.status_id
                                        , cms_tasks_new.client_id
                                        , cms_tasks_new.client_remarks
                                        , cms_tasks_new.assign_id
                                        , cms_tasks_new.json_field
                                        , cms_tasks_new.reviewer_id
                                        , cms_tasks_new.approver_id
										, cms_tasks_new.created_date
                                        , cms_tasks_new.created_by"
                                        , "cms_tasks_new"
                                        , "cms_tasks_new.task_no = '" . $task_no . "'");

        $assignees      = db_query("cms_tasks_new_assignees.id
                            , cms_tasks_new_assignees.type
                            , cms_tasks_new_assignees.user_id
                            , cms_tasks_new_assignees.status_id
                            , cms_tasks_new_assignees.created_by
                            , cms_tasks_new_assignees.action
                            , cms_tasks_new_assignees.json_field
                            , cms_tasks_new_assignees.doc_no
                            , CASE cms_tasks_new_assignees.type
                            when 'individual' then emp_tbl.name
                            when 'company' then contacts_tbl.name
                            END as name
                            , CASE cms_tasks_new_assignees.type
                            when 'individual' then employer_tbl.employer_name
                            when 'company' then clients_tbl.name
                            END as company
                            , date_format(cms_tasks_new_assignees.deadline_date,'" . constant('UI_DATE_FORMAT') .  "') as deadline_date
                            , (SELECT descr FROM cms_master_list WHERE
                            cms_master_list.id = cms_tasks_new_assignees.status_id
                            ) AS status_name"
                            , "cms_tasks_new_assignees
                            left join cms_employees emp_tbl on emp_tbl.id = cms_tasks_new_assignees.user_id
                            left join cms_master_employer employer_tbl on employer_tbl.id = emp_tbl.employer_id
                            left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_tasks_new_assignees.user_id
                            left join cms_clients clients_tbl on clients_tbl.id = contacts_tbl.client"
                            , "cms_tasks_new_assignees.is_active = 1 and cms_tasks_new_assignees.task_no = '" . $task_no . "'");

        if ( isset($assignees) && count($assignees) > 0) 
        {
            $count = count($assignees);
            for ($i = 0; $i < $count; $i++) {
                $assignee_id = $assignees[$i]["id"];
                $assignees[$i]['attachments'] = get_assignee_attachments($params, $assignee_id);

                //if task has outbound document
                if($assignees[$i]['doc_no']) {
                    $doc_no = $assignees[$i]['doc_no'];
                    // $task_no                = if_property_exist($params, 'task_no');
                    require_once constant('MODULES_DIR') . '/user_documents.php';
                    $params->doc_no     = $doc_no;
                    $assignees[$i]['outbound_documents'] = json_decode(get_document_status($params))->data;
                    // $assignees[$i]['outbound_documents'] = get_outbound_document($params, $doc_no);
                }
            }
        }
        $rs['assignees'] = $assignees;

        if (count((array)$rs) < 1 || !isset($rs['details'])) 
        {
            return handle_fail_response('No record found');
        } 
        else 
        {
			echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs ) );exit;
            //return handle_success_response('Success', $rs);
        }
    }
    catch(Exception $e) 
    {
        handle_exception($e);
    }
}

function get_task_template_detail($params) 
{
    try 
    {
		
        log_it(__FUNCTION__, $params);
        $task_id = if_property_exist($params, 'task_id', '');
		
        $rs['details'] = db_query_single("cms_master_tasks_template.id
                                        , cms_master_tasks_template.task_title
                                        , cms_master_tasks_template.descr
                                        , (SELECT GROUP_CONCAT(user_id)
                                            FROM cms_tasks_template_new_assignees
                                            WHERE FIND_IN_SET(cms_tasks_template_new_assignees.task_id,cms_master_tasks_template.id)
                                            ) AS assigned_to_id
                                        , cms_master_tasks_template.sbg_id
                                        , cms_master_tasks_template.sbd_id
                                        , cms_master_tasks_template.company_id
                                        , cms_master_tasks_template.task_group_id
                                        , cms_master_tasks_template.due_date
                                        , cms_master_tasks_template.priority_id
                                        , cms_master_tasks_template.dept_id
                                        , cms_master_tasks_template.task_type_id
                                        , cms_master_tasks_template.status_id
                                        , cms_master_tasks_template.json_field
                                        , cms_master_tasks_template.reviewer_id
                                        , cms_master_tasks_template.approver_id
										, cms_master_tasks_template.created_date
                                        , cms_master_tasks_template.created_by"
                                        , "cms_master_tasks_template"
                                        , "cms_master_tasks_template.id = '" . $task_id . "'");
		
        $assignees      = db_query("cms_tasks_template_new_assignees.id
                            , cms_tasks_template_new_assignees.type
                            , cms_tasks_template_new_assignees.user_id
                            , cms_tasks_template_new_assignees.status_id
                            , cms_tasks_template_new_assignees.created_by
                            , cms_tasks_template_new_assignees.action
                            , cms_tasks_template_new_assignees.json_field
                            , CASE cms_tasks_template_new_assignees.type
                            when 'individual' then emp_tbl.name
                            when 'company' then contacts_tbl.name
                            END as name
                            , CASE cms_tasks_template_new_assignees.type
                            when 'individual' then employer_tbl.employer_name
                            when 'company' then clients_tbl.name
                            END as company
                            , date_format(cms_tasks_template_new_assignees.deadline_date,'" . constant('UI_DATE_FORMAT') .  "') as deadline_date
                            , (SELECT descr FROM cms_master_list WHERE
                            cms_master_list.id = cms_tasks_template_new_assignees.status_id
                            ) AS status_name"
                            , "cms_tasks_template_new_assignees
                            left join cms_employees emp_tbl on emp_tbl.id = cms_tasks_template_new_assignees.user_id
                            left join cms_master_employer employer_tbl on employer_tbl.id = emp_tbl.employer_id
                            left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_tasks_template_new_assignees.user_id
                            left join cms_clients clients_tbl on clients_tbl.id = contacts_tbl.client"
                            , "cms_tasks_template_new_assignees.is_active = 1 and cms_tasks_template_new_assignees.task_id = '" . $task_id . "'");

        if (count($assignees) > 0) 
        {
            $count = count($assignees);
            for ($i = 0; $i < $count; $i++) {
                $assignee_id = $assignees[$i]["id"];
            }
        }
        $rs['assignees'] = $assignees;

        if (count((array)$rs) < 1 || !isset($rs['details'])) 
        {
            return handle_fail_response('No record found');
        } 
        else 
        {
			echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs ) );exit;
            //return handle_success_response('Success', $rs);
        }
    }
    catch(Exception $e) 
    {
        handle_exception($e);
    }
}

function save_checklist_for_task_template($params) 
{
    try 
    {
        log_it(__FUNCTION__, $params);
        $assignee_id    = if_property_exist($params, 'assignee_id');
        $checklist      = if_property_exist($params, 'checklist');
        $emp_id         = if_property_exist($params, 'emp_id');
		$save_as_temp   = if_property_exist($params, 'save_as_temp');
		if( $save_as_temp )
			$json_field= $checklist;
		else
			$json_field['checklist']= $checklist;
        $data = array(
            ':id'             => $assignee_id
          , ':json_field'     => json_encode($json_field));
        $data = add_timestamp_to_array($data, $emp_id, 1);
        db_update($data, 'cms_tasks_template_new_assignees', 'id');

        $rs = db_query_single("cms_tasks_template_new_assignees.id
                             , cms_tasks_template_new_assignees.type
                             , cms_tasks_template_new_assignees.user_id
                             , cms_tasks_template_new_assignees.status_id
                             , cms_tasks_template_new_assignees.created_by
                             , cms_tasks_template_new_assignees.json_field
                             , cms_tasks_template_new_assignees.action
                             , CASE cms_tasks_template_new_assignees.type
                                when 'individual' then emp_tbl.name
                                when 'company' then contacts_tbl.name
                                END as name
                            , CASE cms_tasks_template_new_assignees.type
                                when 'individual' then employer_tbl.employer_name
                                when 'company' then clients_tbl.name
                                END as company
                             , date_format(cms_tasks_template_new_assignees.deadline_date,'" . constant('UI_DATE_FORMAT') .  "') as deadline_date
                             , (SELECT descr FROM cms_master_list WHERE
                                cms_master_list.id = cms_tasks_template_new_assignees.status_id
                               ) AS status_name"
                             , "cms_tasks_template_new_assignees
                                left join cms_employees emp_tbl on emp_tbl.id = cms_tasks_template_new_assignees.user_id
                                left join cms_master_employer employer_tbl on employer_tbl.id = emp_tbl.employer_id
                                left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_tasks_template_new_assignees.user_id
                                left join cms_clients clients_tbl on clients_tbl.id = contacts_tbl.client"
                             , "cms_tasks_template_new_assignees.id = '" . $assignee_id . "'");

        echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs ) );exit;
    }
    catch(Exception $e) 
    {
        handle_exception($e);
    }
}

function save_checklist_for_task($params) 
{
    try 
    {
        log_it(__FUNCTION__, $params);
        $assignee_id    = if_property_exist($params, 'assignee_id');
        $checklist      = if_property_exist($params, 'checklist');
        $emp_id         = if_property_exist($params, 'emp_id');
        
        $json_field['checklist'] = $checklist;

        $data = array(
            ':id'             => $assignee_id
          , ':json_field'     => json_encode($json_field));
		
        $data = add_timestamp_to_array($data, $emp_id, 1);
        db_update($data, 'cms_tasks_new_assignees', 'id');

        $rs = db_query_single("cms_tasks_new_assignees.id
                             , cms_tasks_new_assignees.type
                             , cms_tasks_new_assignees.user_id
                             , cms_tasks_new_assignees.status_id
                             , cms_tasks_new_assignees.created_by
                             , cms_tasks_new_assignees.json_field
                             , cms_tasks_new_assignees.action
                             , CASE cms_tasks_new_assignees.type
                                when 'individual' then emp_tbl.name
                                when 'company' then contacts_tbl.name
                                END as name
                            , CASE cms_tasks_new_assignees.type
                                when 'individual' then employer_tbl.employer_name
                                when 'company' then clients_tbl.name
                                END as company
                             , date_format(cms_tasks_new_assignees.deadline_date,'" . constant('UI_DATE_FORMAT') .  "') as deadline_date
                             , (SELECT descr FROM cms_master_list WHERE
                                cms_master_list.id = cms_tasks_new_assignees.status_id
                               ) AS status_name"
                             , "cms_tasks_new_assignees
                                left join cms_employees emp_tbl on emp_tbl.id = cms_tasks_new_assignees.user_id
                                left join cms_master_employer employer_tbl on employer_tbl.id = emp_tbl.employer_id
                                left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_tasks_new_assignees.user_id
                                left join cms_clients clients_tbl on clients_tbl.id = contacts_tbl.client"
                             , "cms_tasks_new_assignees.id = '" . $assignee_id . "'");
	
		echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs ) );exit;
        //return handle_success_response('Success', $rs);
    }
    catch(Exception $e) 
    {
        handle_exception($e);
    }
}

function remove_assignee_for_task($params) 
{
    try 
    {
        log_it(__FUNCTION__, $params);
        $assignee_id    = if_property_exist($params, 'assignee_id');
        $emp_id         = if_property_exist($params, 'emp_id');
        // db_execute_sql("DELETE FROM cms_tasks_new_assignees WHERE id = '".$assignee_id."'");

        $data = array(':id' => $assignee_id, ':is_active' => 0);
        $data = add_timestamp_to_array($data, $emp_id, 1);
        db_update($data, 'cms_tasks_new_assignees', 'id');
		echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>true ) );exit;
        //return handle_success_response('Success', true);
    }
    catch(Exception $e) 
    {
        handle_exception($e);
    }
}

function remove_assignee_for_task_template($params) 
{
    try 
    {
        log_it(__FUNCTION__, $params);
        $assignee_id    = if_property_exist($params, 'assignee_id');
        $emp_id         = if_property_exist($params, 'emp_id');
        // db_execute_sql("DELETE FROM cms_tasks_new_assignees WHERE id = '".$assignee_id."'");

        $data = array(':id' => $assignee_id, ':is_active' => 0);
        $data = add_timestamp_to_array($data, $emp_id, 1);
        db_update($data, 'cms_tasks_template_new_assignees', 'id');

        //return handle_success_response('Success', true);
		echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>true ) );exit;
    }
    catch(Exception $e) 
    {
        handle_exception($e);
    }
}

//get task assignee by assignee id
function get_new_task_assignee_by_id($params) {
    try 
    {
        log_it(__FUNCTION__, $params);
        $assignee_id           = if_property_exist($params, 'assignee_id');

        $assignee  = db_query_single("cms_tasks_new_assignees.id
                            , cms_tasks_new_assignees.type
                            , cms_tasks_new_assignees.user_id
                            , cms_tasks_new_assignees.status_id
                            , cms_tasks_new_assignees.created_by
                            , cms_tasks_new_assignees.action
                            , cms_tasks_new_assignees.json_field
                            , CASE cms_tasks_new_assignees.type
                            when 'individual' then emp_tbl.name
                            when 'company' then contacts_tbl.name
                            END as name
                            , CASE cms_tasks_new_assignees.type
                            when 'individual' then employer_tbl.employer_name
                            when 'company' then clients_tbl.name
                            END as company
                            , date_format(cms_tasks_new_assignees.deadline_date,'" . constant('UI_DATE_FORMAT') .  "') as deadline_date
                            , (SELECT descr FROM cms_master_list WHERE
                            cms_master_list.id = cms_tasks_new_assignees.status_id
                            ) AS status_name"
                            , "cms_tasks_new_assignees
                            left join cms_employees emp_tbl on emp_tbl.id = cms_tasks_new_assignees.user_id
                            left join cms_master_employer employer_tbl on employer_tbl.id = emp_tbl.employer_id
                            left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_tasks_new_assignees.user_id
                            left join cms_clients clients_tbl on clients_tbl.id = contacts_tbl.client"
                            , "cms_tasks_new_assignees.is_active = 1 and cms_tasks_new_assignees.id = '" . $assignee_id . "'");

        $r_data = array(
            'assignee' => $assignee
        );

        return handle_success_response('Success', $r_data);
    }
    catch(Exception $e) 
    {
        handle_exception($e);
    }
}

//update task assignee with outbound document
function update_assignee_document($params) {
    try 
    {
        log_it(__FUNCTION__, $params);
        $id             = if_property_exist($params, 'id');
        $doc_no      = if_property_exist($params, 'doc_no');
        $emp_id         = if_property_exist($params, 'emp_id');
        

        $data = array(
            ':id'             => $id
          , ':doc_no'        => $doc_no);

        if($id)
        {
            $data = add_timestamp_to_array($data, $emp_id, 1);
            db_update($data, 'cms_tasks_new_assignees', 'id');
        }
        
        $rs = db_query_single("cms_tasks_new_assignees.id
                             , cms_tasks_new_assignees.type
                             , cms_tasks_new_assignees.user_id
                             , cms_tasks_new_assignees.status_id
                             , cms_tasks_new_assignees.created_by
                             , cms_tasks_new_assignees.json_field
                             , cms_tasks_new_assignees.action
                             , CASE cms_tasks_new_assignees.type
                                when 'individual' then emp_tbl.name
                                when 'company' then contacts_tbl.name
                                END as name
                            , CASE cms_tasks_new_assignees.type
                                when 'individual' then employer_tbl.employer_name
                                when 'company' then clients_tbl.name
                                END as company
                             , date_format(cms_tasks_new_assignees.deadline_date,'" . constant('UI_DATE_FORMAT') .  "') as deadline_date
                             , (SELECT descr FROM cms_master_list WHERE
                                cms_master_list.id = cms_tasks_new_assignees.status_id
                               ) AS status_name"
                             , "cms_tasks_new_assignees
                                left join cms_employees emp_tbl on emp_tbl.id = cms_tasks_new_assignees.user_id
                                left join cms_master_employer employer_tbl on employer_tbl.id = emp_tbl.employer_id
                                left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_tasks_new_assignees.user_id
                                left join cms_clients clients_tbl on clients_tbl.id = contacts_tbl.client"
                             , "cms_tasks_new_assignees.id = '" . $id . "'");

        echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs ) );exit;
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

//add task from client portal
function add_edit_client_tasks_new($params) {
    try {

        log_it(__FUNCTION__, $params);
        $task_no = if_property_exist($params, 'task_no');
        $title = if_property_exist($params, 'title');
        $descr = if_property_exist($params, 'descr');
        // $checklist = if_property_exist($params, 'checklist');
        $task_type = if_property_exist($params, 'task_type');
        $priority = if_property_exist($params, 'priority');
        $status = if_property_exist($params, 'status_id');
        $dept_id = if_property_exist($params, 'dept_id');
        // $due_date = if_property_exist($params, 'due_date');
        $sbg_id = if_property_exist($params, 'sbg_id');
        $sbd_id = if_property_exist($params, 'sbd_id');
        $oc_id = if_property_exist($params, 'oc_id');
        $task_group = if_property_exist($params, 'task_group');
        $emp_id = if_property_exist($params, 'emp_id');
        $emp_name = if_property_exist($params, 'emp_name');
        $client_id = if_property_exist($params, 'client_id');
        $client_remarks = if_property_exist($params, 'client_remarks');

        //$assign_data = if_property_exist($params, 'assign_data');

        $json_field['checklist'] = '';
        $data = array(':task_title' => $title
                    , ':descr' => $descr
                    , ':sbg_id' => $sbg_id
                    , ':sbd_id' => $sbd_id
                    , ':company_id' => $oc_id
                    , ':task_group_id' => $task_group
                    // , ':due_date' => $due_date
                    , ':priority_id' => $priority
                    , ':dept_id' => $dept_id
                    , ':task_type' => $task_type
                    , ':status_id' => $status
                    , ':json_field' => json_encode($json_field)
                    , ':client_id' => $client_id
                    , ':client_remarks' => $client_remarks
                    );

        if (is_data_exist('cms_tasks_new', 'task_no', $task_no)) 
        {
            $data[':task_no'] = $task_no;
            $data = add_timestamp_to_array($data, $emp_id, 1);
            $result = db_update($data, 'cms_tasks_new', 'task_no');
            $params->action = "edit";
            $params->message = "(UPDATED)";
        } 
        else 
        {
            if ($task_no == '') {
                $rs = get_doc_primary_no('task_no', 'cms_tasks_new', false, 4);
                if ($rs == false) {
                    return handle_fail_response('Error generating task number. Please contact admin');
                } else {
                    $task_no = $rs['task_no'];
                }
            }
            $data[':task_no'] = $task_no;
            $data = add_timestamp_to_array($data, $emp_id, 0);
            $id = db_add($data, 'cms_tasks_new');
            $params->task_no = $task_no;
            $params->action = "add";
            $params->message = "(NEW)";
        }

        // if($assign_data)
        // {
        //     foreach($assign_data as $a_data)
        //     {
        //         $deadline_date = convert_to_date($a_data->deadline_date);
        //         $data = array(':task_no'        => $task_no
        //                     , ':type'           => $a_data->type
        //                     , ':user_id'        => $a_data->user_id
        //                     , ':action'         => $a_data->action
        //                     , ':deadline_date'  => $deadline_date
        //                     , ':status_id'      => $a_data->status_id);
                    
        //         $data = add_timestamp_to_array($data, $emp_id, 0);
        //         db_add($data, 'cms_tasks_new_assignees');
        //     }
        // }
		echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$params ) );exit;
       
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

//get client task - client portal
function get_client_task_list($params) {
    try
	{
        log_it(__FUNCTION__, $params);

        // $name	        = if_property_exist($params, 'name');
        // $status_id      = if_property_exist($params, 'status_id');
        // $client_id		= if_property_exist($params, 'client_id');
        // $email	        = if_property_exist($params, 'email');
        $start_index	= if_property_exist($params, 'start_index',	0);
        $limit	        = if_property_exist($params, 'limit',	MAX_NO_OF_RECORDS);
        // $is_admin       = if_property_exist($params, 'is_admin',	0);
        $created_by     = if_property_exist($params, 'contact_id');
        $client_id	        = if_property_exist($params, 'client_id');

        if($client_id === NULL)
        {
            return handle_fail_response('Client ID is mandatory');
        }
        
        $where	=	" 1=1";

        if($client_id != "")
        {
            $where 	.= " AND cms_tasks_new.client_id = $client_id";
        }

        if($created_by != "")
        {
            $where 	.= " AND cms_tasks_new.created_by in(" . $created_by . ") ";
        }

        // $fields = " cms_tasks_new.task_no
        //             , cms_tasks_new.master_task_no
        //             , cms_tasks_new.task_title
        //             , cms_tasks_new.descr
        //             , cms_tasks_new.task_type
        //             , task_type_list.descr as task_type_desc
        //             , cms_tasks_new.dept_id
        //             , cms_tasks_new.reviewer_id
        //             , cms_tasks_new.approver_id
        //             , cms_tasks_new.due_date
        //             , cms_tasks_new.priority_id
        //             , RPAD(cms_master_list.descr,10,' ') AS priority_name
        //             , status_list.descr as status_name
        //             , cms_tasks_new.created_date
        //             , cms_tasks_new.created_by
        //             , cms_tasks_new.status_id
        //             , cms_tasks_new.roll_over
        //             , cms_tasks_new.freeze_date
        //             , (SELECT GROUP_CONCAT(DISTINCT(emp_tbl.name))
        //                 FROM cms_tasks_new_assignees
        //                 LEFT JOIN cms_employees as emp_tbl
        //                 ON (cms_tasks_new_assignees.user_id = emp_tbl.id)
        //                 WHERE cms_tasks_new_assignees.is_active = 1 and FIND_IN_SET(cms_tasks_new_assignees.task_no,cms_tasks_new.task_no)
        //                 ) AS assigned_to_name
        //             , IF(cms_tasks_new.is_active = 1,'ACTIVE','IN-ACTIVE') as is_active
        //             , concat('" . constant("UPLOAD_DIR_URL") . "', 'schedule_tasks_doc', '/',cms_tasks_new.task_no, '/') as filepath
        //             , JSON_UNQUOTE(cms_tasks_new.json_field) as json_field
        //             , IFNULL(cms_employees.name,'SYSTEM') as created_by_name
        //             , IFNULL(DATEDIFF(cms_tasks_new.due_date, NOW()),'0') AS days_left
        //             ,(SELECT COUNT(*) FROM cms_tasks_new_remarks WHERE task_no = cms_tasks_new.task_no) AS reply_count
        //             ,(SELECT JSON_OBJECT('name',cms_employees.name,'created_date',cms_tasks_new_remarks.created_date)
        //                 FROM cms_tasks_new_remarks
        //                 INNER JOIN cms_employees ON cms_tasks_new_remarks.created_by = cms_employees.id
        //                 WHERE cms_tasks_new_remarks.task_no = cms_tasks_new.task_no ORDER BY cms_tasks_new_remarks.created_date DESC LIMIT 1) AS latest_reply
        //             , IFNULL(cms_master_employer.employer_name,'') as company_name
        //             , IFNULL(master_sbg.descr,'') as sbg_name
        //             , IFNULL(master_sbd.descr,'') as sbd_name
        //             , IF(cms_tasks_new.freeze_date > now(), 0, 1) as freeze_it";
        // $table = "  cms_tasks_new
        //             LEFT JOIN cms_tasks_new_assignees
        //                 ON (cms_tasks_new.task_no = cms_tasks_new_assignees.task_no)
        //             LEFT JOIN cms_employees
        //                 ON (cms_tasks_new.created_by = cms_employees.id)
        //             LEFT JOIN cms_master_list
        //                 ON (cms_tasks_new.priority_id = cms_master_list.id)
        //             LEFT JOIN cms_master_list as status_list
        //                 ON (cms_tasks_new.status_id = status_list.id)
        //             LEFT JOIN cms_master_list as task_type_list
        //                 ON (cms_tasks_new.task_type = task_type_list.id)
        //             LEFT JOIN cms_master_tasks 
        //                 ON (cms_tasks_new.master_task_no = cms_master_tasks.task_no)
        //             LEFT JOIN cms_master_employer 
        //                 ON (cms_tasks_new.company_id = cms_master_employer.id)
        //             LEFT JOIN cms_master_list master_sbg 
        //                 ON (cms_tasks_new.sbg_id = master_sbg.id)
        //             LEFT JOIN cms_master_list master_sbd 
        //                 ON (cms_tasks_new.sbd_id = master_sbd.id)
        //         ";

        $rs = db_query_list
        (
            "cms_tasks_new.task_no
            , cms_tasks_new.master_task_no
            , cms_tasks_new.task_title
            , cms_tasks_new.descr
            , cms_tasks_new.task_type
            , task_type_list.descr as task_type_desc
            , cms_tasks_new.dept_id
            , cms_tasks_new.reviewer_id
            , cms_tasks_new.approver_id
            , cms_tasks_new.due_date
            , cms_tasks_new.priority_id
            , RPAD(cms_master_list.descr,10,' ') AS priority_name
            , status_list.descr as status_name
            , cms_tasks_new.created_date
            , cms_tasks_new.created_by
            , cms_tasks_new.status_id
            , cms_tasks_new.roll_over
            , cms_tasks_new.freeze_date
            , cms_tasks_new.assign_id
            , emp.name as assign_to
            ",
            "
            cms_tasks_new
            LEFT JOIN cms_master_list as task_type_list
                ON (cms_tasks_new.task_type = task_type_list.id)
            LEFT JOIN cms_master_list
                ON (cms_tasks_new.priority_id = cms_master_list.id)
            LEFT JOIN cms_master_list as status_list
                ON (cms_tasks_new.status_id = status_list.id)
            LEFT JOIN cms_employees as emp
                ON (cms_tasks_new.assign_id = emp.id)
            ",
            $where, $start_index, $limit);

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

//get tasks created by client
function get_client_tasks_list_new($params) {
    try {
        log_it(__FUNCTION__, $params);
        $task_no = if_property_exist($params, 'task_no', '');
        $title = if_property_exist($params, 'title', '');
        $status = if_property_exist($params, 'status', '');
        $assign_to = if_property_exist($params, 'assign_to', '');
        $dept_id = if_property_exist($params, 'dept_id', '');
        // $group = if_property_exist($params, 'group', '');
        $company = if_property_exist($params, 'company', '');
        // $created_by = if_property_exist($params, 'created_by', '');
        $start_index = if_property_exist($params, 'start_index', 0);
        $limit = if_property_exist($params, 'limit', MAX_NO_OF_RECORDS);
        $view_all = if_property_exist($params, 'view_all', 0);
        $is_admin = if_property_exist($params, 'is_admin', '');
        $emp_id = if_property_exist($params, 'emp_id', '');
        $close_bracket = "";
        
        $where = "1 = 1";
        $where_or = "";
        
        // if ($view_all == 1) {
        //     $where = "1 = 1";
        //     $where_or = "";
        // } else {
        //     $where = "(" . $emp_id . " IN(cms_tasks_new.created_by,cms_tasks_new.reviewer_id,cms_tasks_new.approver_id) ";
        //     $where_or = " OR (cms_tasks_new_assignees.is_active = 1 and FIND_IN_SET(" . $emp_id . ", cms_tasks_new_assignees.user_id)";
        //     $close_bracket = ")";
        // }
        
        if ($title != "") {
            $where.= " AND cms_tasks_new.task_title like '%" . $title . "%'";
            $where_or.= " AND cms_tasks_new.task_title like '%" . $title . "%'";
        }
        // if ($created_by != "") {
        //     $where.= " AND cms_tasks_new.created_by in(" . $created_by . ")";
        //     $where_or.= " AND cms_tasks_new.created_by in(" . $created_by . ")";
        // }
        if ($dept_id != "") {
            $where.= " AND cms_tasks_new.dept_id in(" . $dept_id . ")";
            $where_or.= " AND cms_tasks_new.dept_id in(" . $dept_id . ")";
        }
        if ($status != "") {
            $where.= " AND cms_tasks_new.status_id in(" . $status . ")";
            $where_or.= " AND cms_tasks_new.status_id in(" . $status . ")";
        }
        
        if ($assign_to != "") {
            $where.= " AND cms_tasks_new_assignees.is_active = 1 AND cms_tasks_new_assignees.user_id in(" . $assign_to . ")";
            $where_or.= " AND cms_tasks_new_assignees.is_active = 1 AND cms_tasks_new_assignees.user_id in(" . $assign_to . ")";
        }
		
        // if ($group != "") {
        //     if ($group == 'NOT SCHEDULED') {
        //         $where.= " AND (cms_tasks_new.master_task_no IS NULL OR cms_master_tasks.schedule_type = '')";
        //         $where_or.= " AND (cms_tasks_new.master_task_no IS NULL OR cms_master_tasks.schedule_type = '')";
        //     }
		// 	else if( $group == 'due_today'){
		// 		$where.= " AND (cms_tasks_new.due_date = '".date('Y-m-d')."' and cms_tasks_new.status_id != 252 )";
		// 	}
		// 	else if( $group == 'overdue'){
		// 		$where.= " AND (cms_tasks_new.due_date < '".date('Y-m-d')."' and cms_tasks_new.status_id != 252 )";
		// 	}
		// 	else {
        //         $where.= " AND cms_tasks_new.master_task_no IN (SELECT task_no FROM cms_master_tasks WHERE schedule_type = '$group')";
        //         $where_or.= " AND cms_tasks_new.master_task_no IN (SELECT task_no FROM cms_master_tasks WHERE schedule_type = '$group')";
        //     }
        // }

        if ($company != "") {
            $where.= " AND cms_tasks_new.company_id in($company)";
            $where_or.= " AND cms_tasks_new.company_id in($company)";
        }
        
        $where.= $close_bracket . $where_or . $close_bracket . " AND JSON_EXTRACT(cms_tasks_new.json_field, '$.sent_for_review') IS NULL AND cms_tasks_new.is_active in (1)";
        
        if ($task_no != "") {
            $where = " cms_tasks_new.task_no = '" . $task_no . "'";
        }
        
        $where .= " GROUP BY cms_tasks_new.task_no";
        
        $sql = get_task_sql();
        $field = $sql['fields'];
        $table = $sql['table'];

        $field .= ", cms_tasks_new.assign_id";
        $field .= ", cms_tasks_new.client_id";
        $field .= ", emp_tbl.name AS assigned_manager";
        $field .= ", cms_tasks_new.client_remarks";
        $field .= ", cms_clients.name as client_name";
        $field .= ", cms_clients_contacts.name as client_contact_name";

        $table .= " JOIN cms_clients ON cms_tasks_new.client_id = cms_clients.id";
        $table .= " JOIN cms_clients_contacts ON cms_tasks_new.created_by = cms_clients_contacts.id";
        $table .= " LEFT JOIN cms_employees AS emp_tbl ON cms_tasks_new.assign_id = emp_tbl.id";
        //$sql = db_get_sql($field, $table, $where, $start_index, $limit, "task_no", 'DESC', "SET SESSION group_concat_max_len = 1000000;");
        //$rs = db_execute_multiple_query($sql);
        $rs = db_query_list($field, $table, $where, $start_index, 100000, "cms_tasks_new.task_no", 'DESC');

        if(is_array($rs)) {
            if (count($rs) < 1 || !isset($rs)) {
                return handle_fail_response('No record found');
            } else {
                // echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$rs ) );
                return handle_success_response('Success', $rs);
            }
        }
        
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

//accept task created by client
function accept_client_task($params) {
    try {

        log_it(__FUNCTION__, $params);
        $task_no = if_property_exist($params, 'id');
        $emp_id = if_property_exist($params, 'emp_id');
        $emp_name = if_property_exist($params, 'emp_name');

        if (is_data_exist('cms_tasks_new', 'task_no', $task_no)) 
        {
            $data[':task_no'] = $task_no;
            $data[':assign_id'] = $emp_id;
            $data = add_timestamp_to_array($data, $emp_id, 1);
            $result = db_update($data, 'cms_tasks_new', 'task_no');
            $params->action = "edit";
            $params->message = "(UPDATED)";
        } 
        else 
        {
            return handle_fail_response('Error updating task.');      
        }

		echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$params ) );exit;
       
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}
