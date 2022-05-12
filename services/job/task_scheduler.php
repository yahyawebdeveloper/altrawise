<?php
/**
 * @author 		Jamal
 * @date 		16-July-2018
 * @modify
 * @Note = Please follow the indentation
 *         Please follow the naming convention
 */

require_once(dirname(__FILE__)          . '/../server.php');


task_scheduler();
function task_scheduler()
{
    try 
    {
        log_it(__FUNCTION__, array(), true);

        $rs = db_query("task_no,task_title,descr,sbg_id,sbd_id,company_id,task_group_id,task_type,dept_id,reviewer_id,approver_id,
						due_days,reviewer_due_days,approver_due_days,priority_id,json_field,date_to_add,
						roll_over, freeze_date, created_by,next_run_time,NOW() as present_date
						,(SELECT GROUP_CONCAT(office_email  SEPARATOR ';') FROM cms_employees WHERE FIND_IN_SET(cms_employees.id,cms_master_tasks.assigned_to_id)) as emails",
        				"cms_master_tasks",
        				"next_run_time < NOW() AND is_active = 1");
		
        $task_no = '';
        if(count((array)$rs) < 1 || !isset($rs))
        {
        	log_it(__FUNCTION__, "no record to process", true);
        }
        else
        {
        	$record_count = count((array)$rs);
        	for($i = 0; $i < $record_count; $i++)
        	{
        		$rs_task_no  = get_doc_primary_no('task_no', 'cms_tasks_new');
        		if($rs == false)
        		{
        			log_it(__FUNCTION__, "Error generating task number. Please contact admin", true);
        			return;
        		}
        		else
        		{
        			$task_no = $rs_task_no['task_no'];
        		}
        		
        		$time				= date(" H:i:s",strtotime($rs[$i]['next_run_time']));
        		$arr['date'] 		= $rs[$i]['next_run_time'];
        		$arr['days_to_add']	= $rs[$i]['due_days'];
        		$due_date 			= get_working_dates(json_decode(json_encode($arr))) . $time;
        		
        		$arr['days_to_add']	= $rs[$i]['reviewer_due_days'];
        		$r_due_date 		= get_working_dates(json_decode(json_encode($arr))) . $time;
        		
        		$arr['days_to_add']	= $rs[$i]['approver_due_days'];
        		$a_due_date 		= get_working_dates(json_decode(json_encode($arr))) . $time;
        		
	        	$data = array
	        	(
        			':task_no'			=> $task_no,
	        		':master_task_no'	=> $rs[$i]['task_no'],
	        		':task_title'		=> $rs[$i]['task_title'],
	        		':descr'			=> $rs[$i]['descr'],
        			':sbg_id'			=> $rs[$i]['sbg_id'],
        			':sbd_id'			=> $rs[$i]['sbd_id'],
        			':company_id'		=> $rs[$i]['company_id'],
	        		':task_group_id'	=> $rs[$i]['task_group_id'],
        			':task_type'		=> $rs[$i]['task_type'],
        			':dept_id'			=> $rs[$i]['dept_id'],
	        		//':assigned_to_id'	=> $rs[$i]['assigned_to_id'],
	        		':reviewer_id'		=> $rs[$i]['reviewer_id'],
	        		':approver_id'		=> $rs[$i]['approver_id'],
        			':due_date'			=> $due_date,
        			':reviewer_due_date'=> $r_due_date,
        			':approver_due_date'=> $a_due_date,
	        		':priority_id'		=> $rs[$i]['priority_id'],
        			':roll_over'		=> $rs[$i]['roll_over'],
        			':freeze_date'		=> $rs[$i]['freeze_date'],
	        		':json_field'		=> $rs[$i]['json_field'],
	        		':status_id'		=> 250
	        	);
	        	
	        	$data 					= add_timestamp_to_array($data,$rs[$i]['created_by'],0);
	        	$id                		= db_add($data, 'cms_tasks_new');

				$master_task_no  = $rs[$i]['task_no'];
	        	$assignees = db_query("cms_master_tasks_assignees.*
										, CASE cms_master_tasks_assignees.type
										when 'individual' then emp_tbl.office_email
										when 'company' then contacts_tbl.email
										END as email",
        				"cms_master_tasks_assignees
						left join cms_employees emp_tbl on emp_tbl.id = cms_master_tasks_assignees.user_id
						left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_master_tasks_assignees.user_id",
        				"cms_master_tasks_assignees.task_no = '$master_task_no'");
				
				$record_count_assignees = count((array)$assignees);
				for($j = 0; $j < $record_count_assignees; $j++)
				{
					$data_assignee = array
					(
						':id'				=> get_db_UUID(),
						':task_no'			=> $task_no,
						':type'				=> $assignees[$j]['type'],
						':user_id'			=> $assignees[$j]['user_id'],
						':action'			=> $assignees[$j]['action'],
						':deadline_date'	=> $assignees[$j]['deadline_date'],
						':status_id'		=> $assignees[$j]['status_id'],
						':is_active'		=> $assignees[$j]['is_active'],
						':json_field'		=> $assignees[$j]['json_field'],
						':created_date'		=> $assignees[$j]['created_date'],
						':created_by'		=> $assignees[$j]['created_by']
					);
					
					db_add($data_assignee, 'cms_tasks_new_assignees');
					// if(constant('SEND_TASK_ICS') == true)
	        		// {
					// 	send_task_ics($rs[$i],$due_date,$task_no, $assignees[$j]['email']);
					// }
				}

	        	$result = db_execute_sql("UPDATE cms_master_tasks SET last_run_time = NOW(), next_run_time = DATE_ADD(next_run_time, " . $rs[$i]['date_to_add'] . ") WHERE task_no ='" . $rs[$i]['task_no'] . "'");
	        	
	        	
        	}	
        }

    } 
    catch (Exception $e) 
    {
        handle_exception($e);
    }
}

function send_task_ics($rs,$due_date,$task_no, $email)
{
	try
	{	
		
		log_it(__FUNCTION__, array(), true);
		
		$task           =  $rs['task_title'] . ", Due Date : " . $due_date;
		
		include_once constant('LIB_DIR') . '/ics.php';
		
		$ics = new ICS(array
		(
			'description'   => urldecode($task),
			'dtstart'       => $due_date,
			'dtend'         => $due_date,
			'summary'       => $rs['descr']
		));
		
		$ics_file_contents  = $ics->to_string();
		$ics_name           = date('Y-m-d', strtotime($due_date)) . '_' . $task_no . '.ics';
		
		if(!is_dir(constant('LOG_DIR') . '/ics'))
		{
			mkdir(constant('LOG_DIR') . '/ics' ,0755,TRUE);
		}
		
		$fh = fopen(constant('LOG_DIR') . '/ics/' . $ics_name, 'w');
		if($fh)
		{
			fwrite($fh, $ics_file_contents);
			fclose($fh);
		}
		else
		{
			log_it(__FUNCTION__, "Error creating ics file", true);
		}
		
		$template 	= db_query_single("template_content", "cms_master_template","id=36");
		$replace 	= array('{NAME}', '{TASK_TITLE}','{DESC}','{DUE_DATE}');
		$with 		= array("Sir / Madam", $rs['task_title'], urldecode($rs['descr']), $due_date);
		$body		= str_replace($replace, $with, $template['template_content']);
		
		if(smtpmailer_new
		(
			$email,
			constant('MAIL_USERNAME'),
			constant('MAIL_FROMNAME'),
			"Hi, There, This task has been generated for you",
			$body,
			NULL, constant('LOG_DIR') . '/ics/' . $ics_name
		))
		{
			log_it(__FUNCTION__, "Task ICS Email Success", true);
		}
	}
	catch (Exception $e)
	{
		handle_exception($e);
	}
}

?>