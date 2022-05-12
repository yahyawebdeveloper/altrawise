<?php
require_once(dirname(__FILE__) . '/../server.php');

document_notifications();
asset_notifications();
outbound_document_notifications();
task_notifications();
function document_notifications()
{
	try
	{	
		require_once constant('MODULES_DIR') . '/document_archiving.php';

		$template_query		= db_query_single('template_content','cms_master_template',"id = 44");
		
		$template   		=   $template_query['template_content'];
		
		$sql                = get_document_sql();

		$sql['fields']     .= ", concat('" . constant("UPLOAD_DIR_URL") . "', 'doc_archiving', '/',doc_no, '/') as filepath";
        $field              = $sql['fields'];
        $table              = $sql['table'];

        $where 				= 'notify = 1 and status_id = 205 and DATE(notify_by) = CURDATE()';

        $documents 			= db_query($field, $table, $where);
        
		log_it(__FUNCTION__, $documents, true);

		for($i = 0; $i < count($documents); $i++)
		{	
			$attachment_link = '';

			$attachment 	= json_decode($documents[$i]['attachment']);
			$notify_emails 	= json_decode($documents[$i]['notify_email']);
			
			for($j = 0; $j < count($attachment); $j++)
			{
				$attachment_link .= '<a href="'.$documents[$i]['filepath'].$attachment[$j]. '" target="_blank">'.$attachment[$j].'</a><br>';
			}

			$replace 	    = array('{DOC_NO}'
								  , '{CLIENT_NAME}'
								  , '{FROM_DATE}'
								  , '{TO_DATE}'
								  , '{TYPE}'
								  , '{REFERENCE}'
								  , '{ATTACHMENTS}'
								  , '{MAIL_SIGNATURE}'
								  , '{APPLICATION_TITLE}'
								);
			$with 			= array($documents[$i]['doc_no']
								  , $documents[$i]['client_name']
								  , $documents[$i]['from_date']
								  , $documents[$i]['to_date']
								  , $documents[$i]['doc_type']
								  , $documents[$i]['notes']
								  , $attachment_link
								  , constant('MAIL_SIGNATURE')
								  , constant('APPLICATION_TITLE')
								);
			$body			= str_replace($replace, $with, $template);
			
			for($k = 0; $k < count($notify_emails); $k++)
			{	
				smtpmailer
				(
					$notify_emails[$k], 
					constant('MAIL_USERNAME'), 
					constant('MAIL_FROMNAME'),  
					"Document Archiving Notification",
					$body,NULL,NULL,NULL,-1
				);
			}
		}
				
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function asset_notifications()
{
	try
	{	
		$template_query		= db_query_single('template_content','cms_master_template',"id = 45");
		
		$template   		=   $template_query['template_content'];
		
		$where 				= "cms_assets.expiry_date IS NOT NULL AND (cms_assets.expiry_date = ( CURDATE() + INTERVAL 1 DAY ) 
			OR cms_assets.expiry_date = ( CURDATE() + INTERVAL 7 DAY )
			OR cms_assets.expiry_date = ( CURDATE() + INTERVAL 15 DAY ))";

        $assets 			= db_query( "cms_assets.id as asset_no
							        	, (select descr from cms_master_list where cms_master_list.id = cms_assets.type_id) as asset_type
							            , (select descr from cms_master_list where cms_master_list.id = cms_assets.owner_id) as owner_name
							            , IFNULL(cms_employees.name,'-') as assigned_to
							            , (select descr from cms_master_list where cms_master_list.id = cms_assets.client_id) as client_name
										, cms_assets.brand_name
										, cms_assets.serial_no
										, (select descr from cms_master_list where cms_master_list.id = cms_assets.expiry_type_id) as expiry_type
							            , cms_assets.expiry_date
							            "
        							  , "cms_assets
					        			LEFT JOIN cms_assets_employees
					                    ON (cms_assets_employees.asset_id = cms_assets.id AND cms_assets_employees.is_active = 1)
					                    LEFT JOIN cms_employees
					                    ON (cms_employees.id = cms_assets_employees.assigned_to_id)
        									", $where);
        
        log_it(__FUNCTION__, $assets, true);

		for($i = 0; $i < count($assets); $i++)
		{	

			$current_date = new DateTime(date('Y-m-d'));
			$expiry_date  = new DateTime($assets[$i]['expiry_date']);
			$days         = $expiry_date->diff($current_date)->format("%a");


			$employees	   = db_query("cms_employees.office_email
									 , cms_employees.name"
									 ,"cms_employees"
									 ,"cms_employees.access_level = 142"
									);
			for($j = 0; $j < count($employees); $j++)
			{
				$replace 	    = array('{ASSET_NO}'
									  , '{NAME}'
									  , '{DAYS}'
									  , '{ASSET_TYPE}'
									  , '{OWNER_NAME}'
									  , '{ASSIGNED_TO}'
									  , '{CLIENT_NAME}'
									  , '{BRAND_NAME}'
									  , '{SERIAL_NO}'
									  , '{EXPIRY_TYPE}'
									  , '{EXPIRY_DATE}'
									  , '{MAIL_SIGNATURE}'
									  , '{APPLICATION_TITLE}'
									);
				$with 			= array($assets[$i]['asset_no']
									  , $employees[$j]['name']
									  , $days
									  , $assets[$i]['asset_type']
									  , $assets[$i]['owner_name']
									  , $assets[$i]['assigned_to']
									  , $assets[$i]['client_name']
									  , $assets[$i]['brand_name']
									  , $assets[$i]['serial_no']
									  , $assets[$i]['expiry_type']
									  , $assets[$i]['expiry_date']
									  , constant('MAIL_SIGNATURE')
									  , constant('APPLICATION_TITLE')
									);
				$body			= str_replace($replace, $with, $template);
				
				smtpmailer
				(
					$employees[$j]['office_email'], 
					constant('MAIL_USERNAME'), 
					constant('MAIL_FROMNAME'),  
					"Asset Expiry Notification",
					$body,NULL,NULL,NULL,-1
				);
			}
		}
				
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function outbound_document_notifications()
{
	try
	{	
		$documents = db_query("
						doc_no
						, secret_key		
						, date_format(doc_date,'" . constant('UI_DATE_FORMAT') .  "') as doc_date	
						, title
						, employer_id
						, email_content
						, concat('" . constant("UPLOAD_DIR_URL") . "', 'document', '/',doc_no, '/') as filepath
						, remarks
						, ctg_id
						, amount
						, is_active
						, date_format(created_date,'" . constant('UI_DATE_FORMAT') .  "') as created_date
						, created_by
						, (select name from cms_employees emp where emp.id = cms_user_documents.created_by) as created_by_name			
					",
			"cms_user_documents",
			"is_to_verify = 1 and DATE(due_date) = CURDATE()");
		
		foreach($documents as $document)
		{	
			$doc_no          = $document['doc_no'];
			$template        = urldecode($document['email_content']);
			
			$approvals = db_query("
							cms_user_documents_approvals.id
							, cms_user_documents_approvals.is_verified
							, CASE cms_user_documents_approvals.type
							when 'individual' then emp_tbl.office_email
							when 'company' then contacts_tbl.email
						END as email			
						",
				"cms_user_documents_approvals
				left join cms_employees emp_tbl on emp_tbl.id = cms_user_documents_approvals.user_id
				left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_user_documents_approvals.user_id",
				"cms_user_documents_approvals.doc_no = '". $doc_no ."'");

			
			foreach($approvals as $approval)
			{   
				//send email based on the sequence
				if($approval['is_verified'] == 0)
				{
					$doc_link       = constant('ROOT_URL').'/user/document.php?key='.$document['secret_key'].'&id='.$approval['id'];
					$mail_subject   = 'Document Verification';
					$replace 		= array('{SENDER_NAME}'
										, '{DOC_NO}'
										, '{TITLE}'
										, '{REMARKS}'
										, '{DOC_LINK}'
										, '{MAIL_SUBJECT}'
										, '{MAIL_SIGNATURE}'
										, '{APP_TITLE}');
					$with 			= array($document['created_by_name']
										, $document['doc_no']
										, $document['title']
										, $document['remarks']
										, $doc_link
										, $mail_subject
										, constant('MAIL_SIGNATURE')
										, constant('APPLICATION_TITLE'));
					$body			= str_replace($replace, $with, $template);
					
					smtpmailer_new
					(
						$approval['email'],
						constant('MAIL_USERNAME'),
						constant('MAIL_FROMNAME'),
						$mail_subject,
						$body
					);
					break;
				}
			}
		}
				
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function task_notifications()
    {
        try
        {
            $tasks      = db_query("cms_tasks_new.task_no
                                , cms_tasks_new.task_title
                                , (select name from cms_employees emp where emp.id = cms_tasks_new.created_by) as creator_name
                                , cms_tasks_new.task_title
                                , cms_tasks_new_assignees.action
                                , date_format(cms_tasks_new_assignees.deadline_date,'" . constant('UI_DATE_FORMAT') .  "') as due_date
                                , CASE cms_tasks_new_assignees.type
                                when 'individual' then emp_tbl.name
                                when 'company' then contacts_tbl.name
                                END as assignee_name
                                , CASE cms_tasks_new_assignees.type
                                when 'individual' then emp_tbl.office_email
                                when 'company' then contacts_tbl.email
                                END as assignee_email"
                                , "cms_tasks_new
                                left join cms_tasks_new_assignees on cms_tasks_new_assignees.task_no = cms_tasks_new.task_no
                                left join cms_employees emp_tbl on emp_tbl.id = cms_tasks_new_assignees.user_id
                                left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_tasks_new_assignees.user_id"
                                , "cms_tasks_new.is_active = 1 and 
                                    cms_tasks_new_assignees.is_active = 1 and 
                                    cms_tasks_new_assignees.status_id in (250,251) and
                                    cms_tasks_new_assignees.deadline_date = ( CURDATE() + INTERVAL ".constant('TASK_REMINDER_DAY')." DAY )");

            for($i = 0; $i < count($tasks); $i++)
            {
                $template           =   db_query_single('template_content','cms_master_template',"template_name = 'Task Reminder'");
                $template_content   =   $template['template_content'];

                $task = $tasks[$i];
                $task_link       = constant('ROOT_URL').'/modules/task/task.php?task_no='.$task['task_no'];
                
                $mail_subject   = 'Reminder for the task';
                $replace 		= array('{MAIL_SUBJECT}'
                                    , '{ASSIGNEE_NAME}'
                                    , '{CREATOR_NAME}'
                                    , '{DUE_DATE}'
                                    , '{TASK_NO}'
                                    , '{TITLE}'
                                    , '{ACTION}'
                                    , '{TASK_LINK}'
                                    , '{MAIL_SIGNATURE}'
                                    , '{APP_TITLE}');
                $with 			= array($mail_subject
                                    , $task['assignee_name']
                                    , $task['creator_name']
                                    , $task['due_date']
                                    , $task['task_no']
                                    , $task['task_title']
                                    , $task['action']
                                    , $task_link
                                    , constant('MAIL_SIGNATURE')
                                    , constant('APPLICATION_TITLE'));
                $body			= str_replace($replace, $with, $template_content);
                smtpmailer_new
                (
                    $task['assignee_email'],
                    constant('MAIL_USERNAME'),
                    constant('MAIL_FROMNAME'),
                    $mail_subject,
                    $body
                );
            }
            
        }
        catch(Exception $e)
        {
            handle_exception($e);
        }
    }

?>

