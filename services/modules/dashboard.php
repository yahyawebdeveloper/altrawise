<?php

function populate_dashboard_all_user_detail($params)
{
    try
    {

        log_it(__FUNCTION__, $params);

        $emp_id = if_property_exist($params, 'emp_id', '');

        if (!isset($emp_id) || $emp_id == '') 
        {
            return handle_fail_response('Employee ID is mandatory');
        }

        $rs = db_query
        (
            "name,page,TIME_FORMAT(SEC_TO_TIME(sum(view_duration)),'%H:%i:%s') as duration,(SELECT TIME_FORMAT(SEC_TO_TIME(sum(view_duration)),'%H:%i:%s') FROM cms_employee_usage_log INNER JOIN cms_employees ON cms_employee_usage_log.created_by = cms_employees.id WHERE cms_employee_usage_log.is_active = 1 AND cms_employee_usage_log.created_date BETWEEN NOW() - INTERVAL 90 DAY AND NOW()  AND cms_employee_usage_log.created_by in(" . $emp_id . ")) as totalduration",
            "cms_employee_usage_log INNER JOIN cms_employees ON cms_employee_usage_log.created_by = cms_employees.id",
            "cms_employee_usage_log.is_active = 1 AND cms_employee_usage_log.created_date BETWEEN NOW() - INTERVAL 90 DAY AND NOW()  AND cms_employee_usage_log.created_by in(" . $emp_id . ") GROUP BY page ORDER BY duration DESC"
        );

        if (!isset($rs) || $rs == '') 
        {
            return handle_fail_response('No record found');
        } 
        else 
        {
            return handle_success_response('Success', $rs);
        }
    } 
    catch (Exception $e) 
    {
        handle_exception($e);
    }
}

function get_admin_dashboard($params)
{
    try
    {

        log_it(__FUNCTION__, $params);

        $emp_id = if_property_exist($params, 'emp_id', '');
        
        if (!isset($emp_id) || $emp_id == '') 
        {
            return handle_fail_response('Employee ID is mandatory');
        }

        $result = array();

        $result['app_count']        = db_query_single('count(*) as count'
                                                    , 'cms_appt 
                                                       inner join cms_employees on cms_employees.id = cms_appt.created_by
                                                       LEFT JOIN cms_master_list ON cms_appt.appt_category = cms_master_list.id
                                                       LEFT JOIN cms_master_list appt_status ON cms_appt.status= appt_status.id
                                                    '
                                                    , '(cms_appt.created_by = 16 OR (select group_concat(email) from cms_appt_personal where cms_appt.id = cms_appt_personal.appt_id)
                                                    like "%silan@msphitect.com.my%") AND cms_appt.status in(149) and cms_appt.is_active in (1)');

        $result['doc_count']        = db_query_single('count(*) as count', 'cms_documents', 
                                                     'cms_documents.is_active = 1 
                                                      AND cms_documents.category_id = 7 
                                                      AND cms_documents.approved = 0 
                                                      AND cms_documents.verified = 0 
                                                      AND cms_documents.rejected = 0 
                                                      AND MONTH(cms_documents.doc_date) = MONTH(CURRENT_DATE())
                                                      AND YEAR(cms_documents.doc_date) = YEAR(CURRENT_DATE())');
        $result['faq_count']        = db_query_single('count(*) as count', 'cms_faq', 
                                                     'cms_faq.approved = 0');
        
        $result['asset_count']      = db_query_single('count(*) as count', 'cms_assets', 'is_active=1');

        $result['leave_count']      = db_query_single('SUM(IF((IFNULL(
                                                    (select sum(cms_leave_by_day.leave_no_of_days) 
                                                    from cms_leave_by_day where cms_leave.id = cms_leave_by_day.leave_id 
                                                    and cms_leave_by_day.approved = 1),0)
                                                    + IFNULL((select sum(cms_leave_by_day.leave_no_of_days) 
                                                    from cms_leave_by_day where cms_leave.id = cms_leave_by_day.leave_id 
                                                    and cms_leave_by_day.rejected = 1),0)) = cms_leave.no_of_days, 1, 0) = 0) as count'
                                                    , 'cms_leave'
                                                    , 'cms_leave.is_active = 1');

        $result['topusers']         = db_query_single('TIME_FORMAT(SEC_TO_TIME(sum(view_duration)),"%H:%i") as totalduration', 'cms_employee_usage_log INNER JOIN
                                                        cms_employees ON cms_employee_usage_log.created_by = cms_employees.id', 'cms_employee_usage_log.is_active = 1 AND
                                                        cms_employee_usage_log.created_date BETWEEN NOW() - INTERVAL 90 DAY AND NOW() AND
                                                        cms_employee_usage_log.created_by in(' . $emp_id . ')');
        $result['mosttopusers']     = db_query_single('cms_employees.id,cms_employees.name,TIME_FORMAT(SEC_TO_TIME(sum(view_duration)),"%H:%i") as duration', 'cms_employee_usage_log
                                                        INNER JOIN cms_employees ON cms_employee_usage_log.created_by = cms_employees.id', 'cms_employees.is_active AND cms_employee_usage_log.is_active = 1
                                                        AND cms_employee_usage_log.created_date BETWEEN NOW() - INTERVAL 90 DAY AND NOW()  GROUP BY
                                                        cms_employee_usage_log.created_by ORDER BY duration DESC LIMIT 1');
        $result['allusersdetails']  = db_query('cms_employees.id,username,page,TIME_FORMAT(SEC_TO_TIME(sum(view_duration)),"%H:%i:%s") as duration', 'cms_employee_usage_log INNER JOIN cms_employees ON cms_employee_usage_log.created_by = cms_employees.id',
                                                        'cms_employees.is_active AND cms_employee_usage_log.is_active = 1 AND cms_employee_usage_log.created_date BETWEEN NOW() - INTERVAL 90 DAY AND NOW()
                                                        GROUP BY username ORDER BY duration DESC');
        $result['total_duration']   = db_query_single('TIME_FORMAT(SEC_TO_TIME(sum(view_duration)),"%H:%i:%s") as totalduration', 'cms_employee_usage_log INNER JOIN
                                                        cms_employees ON cms_employee_usage_log.created_by = cms_employees.id', 'cms_employees.is_active AND cms_employee_usage_log.is_active = 1 AND
                                                        cms_employee_usage_log.created_date BETWEEN NOW() - INTERVAL 90 DAY AND NOW()');
        // echo '<pre>';print_r($result);exit;
        return handle_success_response('Success', $result);

    } 
    catch (Exception $e) 
    {
        handle_exception($e);
    }
}

function get_user_dashboard($params)
{
    try
    {

        log_it(__FUNCTION__, $params);

        $emp_id = if_property_exist($params, 'emp_id', '');
        
        if (!isset($emp_id) || $emp_id == '') 
        {
            return handle_fail_response('Employee ID is mandatory');
        }

        $result = array();

        $result['app_count']            = db_query_single('count(*) as count',
                                                        'cms_appt
                                                        inner join cms_appt_personal on cms_appt_personal.appt_id = cms_appt.id
                                                        inner join cms_employees ON cms_appt_personal.email = cms_employees.office_email',
                                                        'cms_appt.is_active in (1) and cms_employees.id = ' . $emp_id);

        $result['faq_count']        = db_query_single('count(*) as count', 'cms_faq', 
                                                     'cms_faq.approved = 0
                                                      AND cms_faq.approved_by = '.$emp_id);
        
        $task_where = "(".$emp_id." IN(cms_tasks_new.created_by,cms_tasks_new.reviewer_id,cms_tasks_new.approver_id) AND cms_tasks_new.status_id in(250,251)) OR (cms_tasks_new_assignees.is_active = 1 and FIND_IN_SET(".$emp_id.", cms_tasks_new_assignees.user_id) AND cms_tasks_new.status_id in(250,251)) AND JSON_EXTRACT(cms_tasks_new.json_field, '$.sent_for_review') IS NULL AND cms_tasks_new.is_active in (1)";
        $result['tasks_count']      = db_query_single('count(DISTINCT(cms_tasks_new.task_no)) as count'
                                                    , 'cms_tasks_new
                                                    LEFT JOIN cms_master_tasks ON cms_tasks_new.master_task_no = cms_master_tasks.task_no
                                                       LEFT JOIN cms_tasks_new_assignees ON cms_tasks_new.task_no = cms_tasks_new_assignees.task_no'
                                                    , $task_where
                                                    );
        
        $where	= "(".$emp_id. " IN (cms_contracts.created_by) OR FIND_IN_SET(" . $emp_id . ", CCE.approvals))";
        $result['contracts_count']      = db_query_single('count(*) as count', 
                                                          'cms_contracts 
                                                          LEFT JOIN
                                                            cms_contracts_employments CCE
                                                                ON CCE.id = (SELECT id FROM cms_contracts_employments WHERE cms_contracts_employments.contract_no = cms_contracts.contract_no order by cms_contracts_employments.created_date desc
                                                                LIMIT 1)', 
                                                          $where.' and status_id in (174,175,176)');
        
        
        $result['communications_count'] = db_query_single('count(*) as count', 'cms_communication', 'status_id in (167) and created_by = ' . $emp_id);
        
        $result['topusers']             = db_query_single('TIME_FORMAT(SEC_TO_TIME(sum(view_duration)),"%H:%i") as totalduration', 'cms_employee_usage_log INNER JOIN
                                                          cms_employees ON cms_employee_usage_log.created_by = cms_employees.id', 'cms_employee_usage_log.is_active = 1 AND
                                                          cms_employee_usage_log.created_date BETWEEN NOW() - INTERVAL 90 DAY AND NOW() AND
                                                          cms_employee_usage_log.created_by in(' . $emp_id . ')');
        
        $result['mosttopusers']         = db_query_single('cms_employees.id,cms_employees.name,TIME_FORMAT(SEC_TO_TIME(sum(view_duration)),"%H:%i") as duration', 'cms_employee_usage_log
                                                          INNER JOIN cms_employees ON cms_employee_usage_log.created_by = cms_employees.id', 'cms_employee_usage_log.is_active = 1
                                                          AND cms_employee_usage_log.created_date BETWEEN NOW() - INTERVAL 90 DAY AND NOW()  GROUP BY
                                                          cms_employee_usage_log.created_by ORDER BY duration DESC LIMIT 1');

        return handle_success_response('Success', $result);

    } 
    catch (Exception $e) 
    {
        handle_exception($e);
    }
}

function get_admin_events($params)
{
    try
    {

        log_it(__FUNCTION__, $params);

        $start              = if_property_exist($params, 'start');
        $end                = if_property_exist($params, 'end');
        $filter_val         = if_property_exist($params, 'filter_val');
        $filter_val         = explode(',', $filter_val);

        $appointment_start  = gmdate("Y-m-d H:i:s", $start);
        $appointment_end    = gmdate("Y-m-d H:i:s", $end);

        $leave_start        = gmdate("Y-m-d", $start);
        $leave_end          = gmdate("Y-m-d", $end);

        //declare empty arrays
        $events = $appointments = $leaves = $holidays = array();

        //check if the filter is selected "appointments"
        if (in_array('1', $filter_val)) 
        {
            $appointments = db_query
            (
                "cms_appt.id,
                 cms_clients.id as client_id,
                 CONCAT(IF(LENGTH(created.name) <= 10, created.name, CONCAT(SUBSTRING(created.name, 1, 10), '..')), ' - ', IF(LENGTH(cms_clients.name) <= 10, cms_clients.name, CONCAT(SUBSTRING(cms_clients.name, 1, 10), '..'))) as title,
                 cms_appt.date_time as start,
                 cms_appt.date_time_to as end",
                // FROM
                "cms_appt INNER JOIN cms_clients ON cms_clients.id = cms_appt.client
                 INNER JOIN cms_employees created ON cms_appt.created_by = created.id",
                // WHERE
                "cms_appt.date_time BETWEEN '" . $appointment_start . "' AND '" . $appointment_end . "' OR
                cms_appt.date_time_to BETWEEN '" . $appointment_start . "' AND '" . $appointment_end . "'"
            );
            // echo '<pre>';print_r($appointments);exit;
        }
        //check if the filter is selected "leaves"
        if (in_array('2', $filter_val)) 
        {
            $leaves = db_query
            (
                "cms_leave.id,
                 CONCAT(cms_employees.name, ' - ', cms_master_list.descr)  as title,
                 cms_leave.start_date as start,
                 cms_leave.end_date as end",
                // FROM
                "cms_leave INNER JOIN cms_employees ON cms_employees.id = cms_leave.emp_id
                INNER JOIN cms_master_list ON cms_leave.type_id = cms_master_list.id",
                // WHERE
                "cms_leave.start_date BETWEEN '" . $leave_start . "' AND '" . $leave_end . "' OR
                cms_leave.end_date BETWEEN '" . $leave_start . "' AND '" . $leave_end . "'"
            );
        }

        //check if the filter is selected "tasks"
        if (in_array('3', $filter_val))
        {
            $tasks = db_query
            (
                "CONCAT(count(*), '  Tasks') as title,
                 cms_tasks_new.due_date as start,
                 cms_tasks_new.due_date as end",
                // FROM
                "cms_tasks_new",
                // WHERE
                "cms_tasks_new.due_date BETWEEN '" . $appointment_start . "' AND '" . $appointment_end ."' GROUP BY cms_tasks_new.due_date"
            );
        }
        //check if the filter is selected "holidays"
        if (in_array('4', $filter_val))
        {
            $holidays   = db_query("cms_holidays.id
								   ,cms_holidays.holiday_desc as title
                                   ,cms_holidays.holiday as start
                                   ,cms_holidays.holiday as end
								   ",
								   "cms_holidays",
								   "cms_holidays.is_active = 1 AND cms_holidays.holiday BETWEEN '" . $leave_start . "' AND '" . $leave_end ."'"
								   );
        }
        foreach ($tasks as $key => $value) 
        {
            $value['type']            = 'task';
            $value['backgroundColor'] = '#85c744';
            array_push($events, $value);
        }

        //loop through the appointments/leaves and construct events array
        foreach ($appointments as $key => $value) 
        {
            $value['type']            = 'appointment';
            $value['allDay']          = false;
            $value['backgroundColor'] = '#4f8edc';
            array_push($events, $value);
        }

        foreach ($leaves as $key => $value) 
        {
            $value['type']            = 'leave';
            $value['backgroundColor'] = '#f1c40f';
            array_push($events, $value);
        }

        foreach ($holidays as $key => $value) 
        {
            $value['type']            = 'holiday';
            $value['backgroundColor'] = '#e73c3c';
            array_push($events, $value);
        }

        if (!isset($events) || $events == '') 
        {
            return handle_fail_response('No record found');
        } 
        else 
        {
            return handle_success_response('Success', $events);
        }
    } 
    catch (Exception $e) 
    {
        handle_exception($e);
    }
}

function get_tasks_for_dashboard($params)
{
    try
    {   
        $due_date    = if_property_exist($params, 'due_date');
        $is_admin    = if_property_exist($params, 'is_admin');
        $emp_id      = if_property_exist($params, 'emp_id');

        $where = '';
        if($is_admin == 0)
        {
            $where = "cms_tasks_new_assignees.is_active = 1 AND cms_tasks_new_assignees.user_id IN ( $emp_id ) AND ";
        }
        $tasks = db_query
        (
            "cms_tasks_new.task_no as task_no,
             cms_tasks_new.task_title as title,
             task_type_list.descr as task_type_desc,
             task_priority_list.descr as task_priority_desc",
            // FROM
            "cms_tasks_new
            LEFT JOIN cms_tasks_new_assignees ON cms_tasks_new.task_no = cms_tasks_new_assignees.task_no
            LEFT JOIN cms_master_list as task_type_list
                        ON (cms_tasks_new.task_type = task_type_list.id)
            LEFT JOIN cms_master_list as task_priority_list
                        ON (cms_tasks_new.priority_id = task_priority_list.id)",
            // WHERE
            $where." DATE(cms_tasks_new.due_date) = '" . $due_date . "' GROUP BY cms_tasks_new.task_no"
        );

        if (!isset($tasks) || $tasks == '') 
        {
            return handle_fail_response('No record found');
        } 
        else 
        {
            return handle_success_response('Success', $tasks);
        }
    } 
    catch (Exception $e) 
    {
        handle_exception($e);
    }
}

function get_admin_event_detail($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

        $id   = if_property_exist($params, 'id');
        $type = if_property_exist($params, 'type');

        if ($type == 'appointment') 
        {
            $rs = db_query_single
            (
                "cms_appt.subject,
                 created.name as created_by_name,
                 DATE_FORMAT(cms_appt.date_time, '%d %M %Y, %h:%i %p') as date_time,
                 DATE_FORMAT(cms_appt.date_time_to, '%d %M %Y, %h:%i %p') as date_time_to,
                 cms_clients.name as client_name,
                 (SELECT GROUP_CONCAT(IFNULL(a.name,cms_appt_personal.email))
                    FROM cms_appt_personal
                    LEFT JOIN cms_employees a ON cms_appt_personal.email IN(a.office_email)
                    WHERE cms_appt_personal.appt_id = cms_appt.id) AS people_name,
                    created.name AS created_by_name
                 ",
                // FROM
                "cms_appt LEFT JOIN cms_clients ON cms_clients.id = cms_appt.client
                 INNER JOIN cms_employees created ON cms_appt.created_by = created.id",
                // WHERE
                "cms_appt.id = " . $id
            );
        } 
        elseif ($type == 'leave')
        {
            $rs = db_query_single
            (
                "DATE_FORMAT(cms_leave.start_date, '%d %M %Y') as start_date,
                 DATE_FORMAT(cms_leave.end_date, '%d %M %Y') as end_date,
                 cms_leave.no_of_days,
                 cms_leave.reason,
                 DATE_FORMAT(cms_leave.created_date, '%d %M %Y') as applied_date,
                 cms_employees.name as employee_name,
                 cms_master_list.descr as leave_type
                 ",
                // FROM
                "cms_leave
                 LEFT JOIN cms_employees ON cms_leave.emp_id = cms_employees.id
                 INNER JOIN cms_master_list ON cms_leave.type_id = cms_master_list.id",
                // WHERE
                "cms_leave.id = " . $id
            );
        }

        if (!isset($rs) || $rs == '') 
        {
            return handle_fail_response('No record found');
        } 
        else 
        {
            return handle_success_response('Success', $rs);
        }
    } 
    catch (Exception $e) 
    {
        handle_exception($e);
    }
}

function get_user_events($params)
{
    try
    {

        log_it(__FUNCTION__, $params);

        $emp_id             = if_property_exist($params, 'emp_id');
        $start              = if_property_exist($params, 'start');
        $end                = if_property_exist($params, 'end');
        $company_id         = if_property_exist($params, 'company_id');
        $filter_val         = if_property_exist($params, 'filter_val');
        $filter_val         = explode(',', $filter_val);

        $appointment_start  = gmdate("Y-m-d H:i:s", $start);
        $appointment_end    = gmdate("Y-m-d H:i:s", $end);

        $leave_start        = gmdate("Y-m-d", $start);
        $leave_end          = gmdate("Y-m-d", $end);

        //declare empty arrays
        $events = $appointments = $leaves = $holidays =  array();
        //check if the filter is selected "appointments"
        if (in_array('1', $filter_val)) 
        {
            $appointments = db_query
            (
                "cms_appt.id,
                 cms_clients.id as client_id,
                 CONCAT(IF(LENGTH(cms_clients.name) <= 10, cms_clients.name, CONCAT(SUBSTRING(cms_clients.name, 1, 10), '..'))) as title,
                 cms_appt.date_time as start,
                 cms_appt.date_time_to as end",
                // FROM
                "cms_appt INNER JOIN cms_clients ON cms_clients.id = cms_appt.client
                 INNER JOIN cms_employees created ON cms_appt.created_by = created.id
                 INNER JOIN cms_appt_personal on cms_appt_personal.appt_id = cms_appt.id
                 INNER JOIN cms_employees attendee ON cms_appt_personal.email = attendee.office_email",
                // WHERE
                "attendee.id = " . $emp_id . " AND (cms_appt.date_time BETWEEN '" . $appointment_start . "' AND '" . $appointment_end . "' OR
                cms_appt.date_time_to BETWEEN '" . $appointment_start . "' AND '" . $appointment_end . "')"
            );
        }
        //check if the filter is selected "leaves"
        if (in_array('2', $filter_val))
        {
            $leaves = db_query
            (
                "cms_leave.id,
                 CONCAT(cms_master_list.descr)  as title,
                 cms_leave.start_date as start,
                 cms_leave.end_date as end",
                // FROM
                "cms_leave INNER JOIN cms_employees ON cms_employees.id = cms_leave.emp_id
                INNER JOIN cms_master_list ON cms_leave.type_id = cms_master_list.id",
                // WHERE
                "cms_leave.emp_id = " . $emp_id . " AND (cms_leave.start_date BETWEEN '" . $leave_start . "' AND '" . $leave_end . "' OR
                cms_leave.end_date BETWEEN '" . $leave_start . "' AND '" . $leave_end . "')"
            );
        }

        //check if the filter is selected "tasks"
        if (in_array('3', $filter_val))
        {
            cosnole.log( $tasks , "hheheheh");
            $tasks = db_query
            (
                "CONCAT(count(*), '  Tasks') as title,
                 cms_tasks_new.due_date as start,
                 cms_tasks_new.due_date as end",
                // FROM
                "cms_tasks_new
                LEFT JOIN cms_tasks_new_assignees ON cms_tasks_new.task_no = cms_tasks_new_assignees.task_no",
                // WHERE
                "cms_tasks_new_assignees.is_active = 1 AND cms_tasks_new_assignees.user_id IN (" . $emp_id . ") AND cms_tasks_new.due_date BETWEEN '" . $appointment_start . "' AND '" . $appointment_end ."' GROUP BY cms_tasks_new.due_date"
            );
        }

        //check if the filter is selected "holidays"
        if (in_array('4', $filter_val))
        {
            $holidays   = db_query("cms_holidays.id
								   ,cms_holidays.holiday_desc as title
                                   ,cms_holidays.holiday as start
                                   ,cms_holidays.holiday as end
								   ",
								   "cms_holidays",
								   "cms_holidays.is_active = 1 and cms_holidays.company_id = ".$company_id." AND cms_holidays.holiday BETWEEN '" . $leave_start . "' AND '" . $leave_end ."'"
								   );
        }
        
        foreach ($tasks as $key => $value) 
        {
            $value['type']            = 'task';
            $value['backgroundColor'] = '#85c744';
            array_push($events, $value);
        }

        //loop through the appointments/leaves and construct events array
        foreach ($appointments as $key => $value)
        {
            $value['type']            = 'appointment';
            $value['allDay']          = false;
            $value['backgroundColor'] = '#4f8edc';
            array_push($events, $value);
        }

        foreach ($leaves as $key => $value) 
        {
            $value['type']            = 'leave';
            $value['backgroundColor'] = '#f1c40f';
            array_push($events, $value);
        }

        foreach ($holidays as $key => $value) 
        {
            $value['type']            = 'holiday';
            $value['backgroundColor'] = '#e73c3c';
            array_push($events, $value);
        }

        if (!isset($events) || $events == '') 
        {
            return handle_fail_response('No record found');
        } 
        else 
        {
            return handle_success_response('Success', $events);
        }
    } 
    catch (Exception $e) 
    {
        handle_exception($e);
    }
}

function get_user_event_detail($params)
{
    try
    {

        log_it(__FUNCTION__, $params);

        $id   = if_property_exist($params, 'id');
        $type = if_property_exist($params, 'type');

        if ($type == 'appointment') 
        {
            $rs = db_query_single
            (
                "cms_appt.subject,
                 created.name as created_by_name,
                 DATE_FORMAT(cms_appt.date_time, '%d %M %Y, %h:%i %p') as date_time,
                 DATE_FORMAT(cms_appt.date_time_to, '%d %M %Y, %h:%i %p') as date_time_to,
                 cms_clients.name as client_name,
                 (SELECT GROUP_CONCAT(IFNULL(a.name,cms_appt_personal.email))
                    FROM cms_appt_personal
                    LEFT JOIN cms_employees a ON cms_appt_personal.email IN(a.office_email)
                    WHERE cms_appt_personal.appt_id = cms_appt.id) AS people_name,
                    created.name AS created_by_name
                 ",
                // FROM
                "cms_appt LEFT JOIN cms_clients ON cms_clients.id = cms_appt.client
                 INNER JOIN cms_employees created ON cms_appt.created_by = created.id",
                // WHERE
                "cms_appt.id = " . $id
            );
        }
        elseif ($type == 'leave') 
        {
            $rs = db_query_single
            (
                "DATE_FORMAT(cms_leave.start_date, '%d %M %Y') as start_date,
                 DATE_FORMAT(cms_leave.end_date, '%d %M %Y') as end_date,
                 cms_leave.no_of_days,
                 cms_leave.reason,
                 DATE_FORMAT(cms_leave.created_date, '%d %M %Y') as applied_date,
                 cms_employees.name as employee_name,
                 cms_master_list.descr as leave_type
                 ",
                // FROM
                "cms_leave
                 LEFT JOIN cms_employees ON cms_leave.emp_id = cms_employees.id
                 INNER JOIN cms_master_list ON cms_leave.type_id = cms_master_list.id",
                // WHERE
                "cms_leave.id = " . $id
            );
        }

        if (!isset($rs) || $rs == '') 
        {
            return handle_fail_response('No record found');
        } 
        else 
        {
            return handle_success_response('Success', $rs);
        }
    } 
    catch (Exception $e) 
    {
        handle_exception($e);
    }
}
